let tasks = [];
let currentId = 1;

const getAllTasks = () => {
  return [...tasks];
};

const createTask = ({
  title,
  category = "Acción",
  priority = "medium",
  label = "Interesante",
  completed = false,
  poster = "",
  backdrop = "",
}) => {
  const newTask = {
    id: currentId++,
    title: title.trim(),
    category,
    priority,
    label,
    completed,
    poster,
    backdrop,
  };

  tasks.push(newTask);
  return newTask;
};

const deleteTask = (id) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    throw new Error("NOT_FOUND");
  }

  tasks.splice(taskIndex, 1);
};

const updateTask = (id, data) => {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    throw new Error("NOT_FOUND");
  }

  if (data.title !== undefined) task.title = data.title.trim();
  if (data.category !== undefined) task.category = data.category;
  if (data.priority !== undefined) task.priority = data.priority;
  if (data.label !== undefined) task.label = data.label;
  if (data.completed !== undefined) task.completed = data.completed;
  if (data.poster !== undefined) task.poster = data.poster;
  if (data.backdrop !== undefined) task.backdrop = data.backdrop;

  return task;
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,
  updateTask,
};