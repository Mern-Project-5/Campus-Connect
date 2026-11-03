import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api', apiRouter);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎓 CampusConnect MERN Stack API Server',
    stack: 'MongoDB + Express + React + Node.js',
    documentation: '/api/health',
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 [CampusConnect MERN] Express server listening on port ${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

