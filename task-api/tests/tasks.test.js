const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

beforeEach(() => {
  taskService._reset();
});

describe("Tasks API", () => {
  test("POST /tasks - creates a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({
        title: "Write Jest Tests",
        priority: "high",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Write Jest Tests");
    expect(res.body.priority).toBe("high");
    expect(res.body.status).toBe("pending");
    expect(res.body).toHaveProperty("createdAt");
  });

  test("POST /tasks - missing title returns 400", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({
        priority: "high",
      });

    expect(res.statusCode).toBe(400);
  });

  test("GET /tasks - returns all tasks", async () => {
    await request(app).post("/tasks").send({ title: "Task 1" });
    await request(app).post("/tasks").send({ title: "Task 2" });

    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); 
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("title");
  });

  test("PATCH /tasks/:id/complete - marks task completed", async () => {
    const task = await request(app)
      .post("/tasks")
      .send({ title: "Finish Assignment" });

    const res = await request(app)
      .patch(`/tasks/${task.body.id}/complete`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("completed");
    expect(res.body.completedAt).not.toBeNull();
  });

  test("DELETE /tasks/:id - deletes task", async () => {
    const task = await request(app)
      .post("/tasks")
      .send({ title: "Delete Me" });

    const res = await request(app)
      .delete(`/tasks/${task.body.id}`);

    expect(res.statusCode).toBe(204);
  });
});
test("GET /tasks?status=pending returns only pending tasks", async () => {
  await request(app)
    .post("/tasks")
    .send({ title: "Pending Task" });

  const completedTask = await request(app)
    .post("/tasks")
    .send({ title: "Completed Task" });

  await request(app).patch(`/tasks/${completedTask.body.id}/complete`);

  const res = await request(app).get("/tasks?status=pending");

  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].status).toBe("pending");
});
test("GET /tasks?page=1&limit=2 returns first two tasks", async () => {
  for (let i = 1; i <= 5; i++) {
    await request(app)
      .post("/tasks")
      .send({ title: `Task ${i}` });
  }

  const res = await request(app).get("/tasks?page=1&limit=2");

  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(2);
  expect(res.body[0].title).toBe("Task 1");
  expect(res.body[1].title).toBe("Task 2");
});
test("GET /tasks?status=banana should return 400", async () => {
  const res = await request(app).get("/tasks?status=banana");

  expect(res.statusCode).toBe(400);
});

test("GET /tasks?page=1&limit=2 returns first two tasks", async () => {
  for (let i = 1; i <= 5; i++) {
    await request(app)
      .post("/tasks")
      .send({ title: `Task ${i}` });
  }

  const res = await request(app).get("/tasks?page=1&limit=2");

  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(2);
  expect(res.body[0].title).toBe("Task 1");
  expect(res.body[1].title).toBe("Task 2");
});

test("PATCH /tasks/:id/complete returns 400 if task is already completed", async () => {
  const task = await request(app)
    .post("/tasks")
    .send({ title: "Complete Me" });

  // First completion
  await request(app).patch(`/tasks/${task.body.id}/complete`);

  // Second completion
  const res = await request(app).patch(`/tasks/${task.body.id}/complete`);

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe("Task is already completed.");
});

test("PUT /tasks/:id updates an existing task", async () => {
  const task = await request(app)
    .post("/tasks")
    .send({ title: "Old Task", priority: "low" });

  const res = await request(app)
    .put(`/tasks/${task.body.id}`)
    .send({
      title: "New Task",
      priority: "high",
      status: "in-progress",
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.title).toBe("New Task");
  expect(res.body.priority).toBe("high");
  expect(res.body.status).toBe("in-progress");
});

test("PUT /tasks/:id returns 404 for unknown task", async () => {
  const res = await request(app)
    .put("/tasks/invalid-id")
    .send({
      title: "Updated Task",
    });

  expect(res.statusCode).toBe(404);
});
test("PUT /tasks/:id rejects invalid status", async () => {
  const task = await request(app)
    .post("/tasks")
    .send({ title: "Task" });

  const res = await request(app)
    .put(`/tasks/${task.body.id}`)
    .send({
      status: "banana",
    });

  expect(res.statusCode).toBe(400);
});