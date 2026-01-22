
import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import nodemailer from 'nodemailer';
import { protect } from '../middleware/auth.js';
import { requireAdmin, requireProjectManagerOrAdmin } from '../middleware/role.js';

const router = express.Router();


router.post('/', protect, requireProjectManagerOrAdmin, async (req, res) => {
  try {
    const { project: projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    if (req.user.role === 'ProjectManager' && String(project.manager) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Access denied: Not manager of this project' });
    }
    
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignee) {
      filter.assignee = req.query.assignee;
    }
    const tasks = await Task.find(filter).populate('assignee project');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const prevTask = await Task.findById(req.params.id);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    
    if (req.body.assignee && req.body.assignee !== String(prevTask.assignee)) {
      const user = await User.findById(req.body.assignee);
      if (user && user.email) {
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'नया टास्क असाइन हुआ',
          text: `आपको नया टास्क असाइन किया गया है: ${task.title}\nDeadline: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}\nPriority: ${task.priority}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Email error:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      }
    }

    
    if (task.deadline) {
      const now = new Date();
      const deadline = new Date(task.deadline);
      const diffHours = (deadline - now) / (1000 * 60 * 60);
      if (diffHours > 0 && diffHours <= 24 && task.assignee) {
        const user = await User.findById(task.assignee);
        if (user && user.email) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'टास्क डेडलाइन अलर्ट',
            text: `आपके टास्क की डेडलाइन 24 घंटे के अंदर है: ${task.title}\nDeadline: ${deadline.toLocaleDateString()}\nPriority: ${task.priority}`,
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Deadline alert email error:', error);
            } else {
              console.log('Deadline alert email sent:', info.response);
            }
          });
        }
      }
    }

    
    if (task.status === 'Done' && task.assignee) {
      const user = await User.findById(task.assignee);
      if (user && user.email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'टास्क पूरा हुआ',
          text: `बधाई हो! आपने टास्क पूरा कर लिया है: ${task.title}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Complete task email error:', error);
          } else {
            console.log('Complete task email sent:', info.response);
          }
        });
      }
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/project/:projectId', async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignee project');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;