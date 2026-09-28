const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

beforeEach(() => {
  taskService._reset();
});

describe("GET /tasks/stats", () => {
  test("returns counts by status", async () => {
    await request(app).post("/tasks").send({ title: "Task 1" });

    const task = await request(app)
      .post("/tasks")
      .send({ title: "Task 2" });

    await request(app).patch(`/tasks/${task.body.id}/complete`);

    const res = await request(app).get("/tasks/stats");

    expect(res.statusCode).toBe(200);
    expect(res.body.pending).toBe(1);
    expect(res.body.completed).toBe(1);
    expect(res.body.overdue).toBe(0);
  });

  test("counts overdue tasks correctly", async () => {
    await request(app)
      .post("/tasks")
      .send({
        title: "Overdue Task",
        dueDate: "2025-01-01T00:00:00.000Z",
      });

    const res = await request(app).get("/tasks/stats");

    expect(res.statusCode).toBe(200);
    expect(res.body.overdue).toBe(1);
  });
});