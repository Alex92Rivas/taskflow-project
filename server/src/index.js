const express = require('express');
const cors = require('cors');
const { port } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Servidor TaskFlow funcionando correctamente' });
});

app.use('/api/v1/tasks', taskRoutes);

app.use((err, req, res, next) => {
  console.error('ERROR GLOBAL:', err);

  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});