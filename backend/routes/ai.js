import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Task from '../models/Task.js';
import User from '../models/User.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/suggest', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignee');
    const users = await User.find();
    const projects = await (await import('../models/Project.js')).default.find().populate('developers manager');
    const userHistory = users.map(user => {
      const userTasks = tasks.filter(t => t.assignee && t.assignee._id.toString() === user._id.toString());
      const completed = userTasks.filter(t => t.status === 'Done').length;
      const inProgress = userTasks.filter(t => t.status === 'In-Progress').length;
      const toDo = userTasks.filter(t => t.status === 'To-Do').length;
      return {
        name: user.name,
        role: user.role,
        completed,
        inProgress,
        toDo,
        total: userTasks.length
      };
    });
    const prompt = `You are an expert project manager AI.
Here is the list of all current tasks (with assignees, deadlines, priorities, and status):
${JSON.stringify(tasks)}

Here are the team members and their task history:
${JSON.stringify(userHistory)}

Here are the projects and their assigned developers and managers:
${JSON.stringify(projects)}

Based on the above, suggest the best task assignments, deadlines, and priorities for the team. Consider workload balance, past performance, and current assignments. Respond only with clear, actionable suggestions in English. Do not explain your reasoning, just give the assignments, deadlines, and priorities in a readable list.`;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text().trim();
    res.json({ suggestions });
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    let status = 500;
    let message = 'Failed to generate suggestions';
    if (error.status === 429 || (error.message && error.message.includes('Resource has been exhausted'))) {
      status = 429;
      message = 'API Rate Limit Exceeded. Please wait a moment before trying again.';
    }
    res.status(status).json({ error: message, details: error.message });
  }
});

export default router;
