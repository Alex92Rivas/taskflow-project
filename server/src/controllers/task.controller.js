const taskService = require("../services/task.service");

const validPriorities = ["high", "medium", "low"];

const getTasks = (req, res) => {
  const tasks = taskService.getAllTasks();
  res.status(200).json(tasks);
};

const createTask = (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Debes enviar un body en formato JSON.",
    });
  }

  const {
    title,
    category = "Acción",
    priority = "medium",
    label = "Interesante",
    completed = false,
    poster = "",
    backdrop = "",
  } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return res.status(400).json({
      error: "El título es obligatorio y debe tener al menos 2 caracteres.",
    });
  }

  if (typeof category !== "string" || !category.trim()) {
    return res.status(400).json({
      error: "La categoría es obligatoria.",
    });
  }

  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      error: "La prioridad debe ser high, medium o low.",
    });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      error: "El campo completed debe ser booleano.",
    });
  }

  if (typeof poster !== "string" || typeof backdrop !== "string") {
    return res.status(400).json({
      error: "poster y backdrop deben ser texto.",
    });
  }

  const newTask = taskService.createTask({
    title,
    category,
    priority,
    label,
    completed,
    poster,
    backdrop,
  });

  res.status(201).json(newTask);
};

const deleteTask = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "El id debe ser un número válido.",
      });
    }

    taskService.deleteTask(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateTask = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "El id debe ser un número válido.",
      });
    }

    if (!req.body) {
      return res.status(400).json({
        error: "Debes enviar un body en formato JSON.",
      });
    }

    const {
      title,
      category,
      priority,
      label,
      completed,
      poster,
      backdrop,
    } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 2) {
        return res.status(400).json({
          error: "Si envías title, debe ser un texto de al menos 2 caracteres.",
        });
      }
    }

    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
          error: "Si envías category, debe ser texto.",
        });
      }
    }

    if (priority !== undefined && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error: "Si envías priority, debe ser high, medium o low.",
      });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({
        error: "Si envías completed, debe ser booleano.",
      });
    }

    if (poster !== undefined && typeof poster !== "string") {
      return res.status(400).json({
        error: "Si envías poster, debe ser texto.",
      });
    }

    if (backdrop !== undefined && typeof backdrop !== "string") {
      return res.status(400).json({
        error: "Si envías backdrop, debe ser texto.",
      });
    }

    const updatedTask = taskService.updateTask(id, {
      title,
      category,
      priority,
      label,
      completed,
      poster,
      backdrop,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
};