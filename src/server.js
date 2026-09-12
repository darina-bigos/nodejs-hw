import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino-http';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  })
);

// Маршрути (Routes)
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// 404 Middleware — Обробка неіснуючих маршрутів
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// 500 Middleware — Централізована обробка помилок
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
