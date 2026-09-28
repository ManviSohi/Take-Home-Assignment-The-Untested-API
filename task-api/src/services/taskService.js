const { v4: uuidv4 } = require('uuid');

let tasks = [];

const getAll = () => [...tasks];

const findById = (id) => tasks.find((task) => task.id === id);

const getByStatus = (status) =>
  tasks.filter((task) => task.status === status);

const getPaginated = (page = 1, limit = 10) => {
  const offset = (Number(page) - 1) * Number(limit);
  return tasks.slice(offset, offset + Number(limit));
};

const getStats = () => {
  const now = new Date();

  const counts = {
    pending: 0,
    'in-progress': 0,
    completed: 0,
  };

  let overdue = 0;

  tasks.forEach((task) => {
    if (counts[task.status] !== undefined) counts[task.status]++;

    if (
      task.dueDate &&
      task.status !== 'completed' &&
      new Date(task.dueDate) < now
    ) {
      overdue++;
    }
  });

  return { ...counts, overdue };
};

const create = ({
  title,
  description = '',
  status = 'pending',
  priority = 'medium',
  dueDate = null,
}) => {
  const task = {
    id: uuidv4(),
    title,
    description,
    status,
    priority,
    dueDate,
    completedAt: null,
    createdAt: new Date().toISOString(),
    assignedTo: null,
  };

  tasks.push(task);
  return task;
};

const update = (id, fields) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) return null;

  const {
    id: ignoredId,
    createdAt: ignoredCreatedAt,
    completedAt: ignoredCompletedAt,
    ...allowedFields
  } = fields;

  const updatedTask = {
    ...tasks[index],
    ...allowedFields,
  };

  tasks[index] = updatedTask;
  return updatedTask;
};

const remove = (id) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
};

const completeTask = (id) => {
  const task = findById(id);

  if (!task) return null;

  if (task.status === 'completed') {
    return { error: 'Task is already completed.' };
  }

  const updatedTask = {
    ...task,
    status: 'completed',
    completedAt: new Date().toISOString(),
  };

  const index = tasks.findIndex((t) => t.id === id);
  tasks[index] = updatedTask;

  return updatedTask;
};

const assignTask = (id, user) => {
  const task = findById(id);

  if (!task) return null;

  const updatedTask = {
    ...task,
    assignedTo: user,
  };

  const index = tasks.findIndex((t) => t.id === id);
  tasks[index] = updatedTask;

  return updatedTask;
};

const _reset = () => {
  tasks = [];
};

module.exports = {
  getAll,
  findById,
  getByStatus,
  getPaginated,
  getStats,
  create,
  update,
  remove,
  completeTask,
  assignTask,
  _reset,
};