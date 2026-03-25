const express = require("express");
const cors = require("cors");
require("./config/env");
const taskRoutes = require("./routes/task.routes");

const app = express();

const loggerAcademico = (req, res, next) => {
  const inicio = Date.now();

  res.on("finish", () => {
    const duracion = Date.now() - inicio;
    console.log(
      `[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion}ms)`
    );
  });

  next();
};

app.use(cors());
app.use(express.json());
app.use(loggerAcademico);

app.get("/", (req, res) => {
  res.json({ message: "Servidor TaskFlow funcionando correctamente" });
});

app.use("/api/v1/tasks", taskRoutes);

app.use((err, req, res, next) => {
  if (err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  console.error("ERROR GLOBAL:", err);
  return res.status(500).json({ error: "Error interno del servidor." });
});

module.exports = app;