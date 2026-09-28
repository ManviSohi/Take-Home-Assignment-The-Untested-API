const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

beforeEach(() => {
  taskService._reset();
});

describe("PATCH /tasks/:id/assign", () => {
  test("assigns a task to a user", async () => {
    const task = await request(app)
      .post("/tasks")
      .send({ title: "Assignment Feature" });

    const res = await request(app)
      .patch(`/tasks/${task.body.id}/assign`)
      .send({
        assignedTo: "manvi.sohi",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.assignedTo).toBe("manvi.sohi");
  });

  test("returns 404 if task does not exist", async () => {
    const res = await request(app)
      .patch("/tasks/random-id/assign")
      .send({
        assignedTo: "manvi.sohi",
      });

    expect(res.statusCode).toBe(404);
  });

  test("returns 400 when assignedTo is missing", async () => {
    const task = await request(app)
      .post("/tasks")
      .send({ title: "Assignment Feature" });

    const res = await request(app)
      .patch(`/tasks/${task.body.id}/assign`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test("returns 400 when assignedTo is empty", async () => {
    const task = await request(app)
      .post("/tasks")
      .send({ title: "Assignment Feature" });

    const res = await request(app)
      .patch(`/tasks/${task.body.id}/assign`)
      .send({
        assignedTo: "",
      });

    expect(res.statusCode).toBe(400);
  });
});