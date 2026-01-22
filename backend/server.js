import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import usersRouter from './routes/users.js';
import projectsRouter from './routes/projects.js';
import aiRouter from './routes/ai.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);

app.use('/api/projects', projectsRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/', (req, res) => {
  res.send('AI-driven Project Management Tool Backend Running');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_project_management';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`MongoDB connected: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
