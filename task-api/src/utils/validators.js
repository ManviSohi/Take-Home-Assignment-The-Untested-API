const VALID_STATUSES = ["pending", "in-progress", "completed"];
const VALID_PRIORITIES = ["low", "medium", "high"];

// Validation for creating a task
const validateCreateTask = (body) => {
  if (!body.title || body.title.trim() === "") {
    return "Title is required.";
  }

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return "Invalid status.";
  }

  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    return "Invalid priority.";
  }

  if (body.dueDate && isNaN(Date.parse(body.dueDate))) {
    return "Invalid due date.";
  }

  return null;
};

// Validation for updating a task
const validateUpdateTask = (body) => {
  if (body.title !== undefined && body.title.trim() === "") {
    return "Title cannot be empty.";
  }

  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    return "Invalid status.";
  }

  if (
    body.priority !== undefined &&
    !VALID_PRIORITIES.includes(body.priority)
  ) {
    return "Invalid priority.";
  }

  if (
    body.dueDate !== undefined &&
    body.dueDate !== null &&
    isNaN(Date.parse(body.dueDate))
  ) {
    return "Invalid due date.";
  }

  return null;
};

// Validation for assigning a task
const validateAssignTask = (body) => {
  if (!body.assignedTo || body.assignedTo.trim() === "") {
    return "assignedTo is required.";
  }

  return null;
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateAssignTask,
};