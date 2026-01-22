import express from 'express';
import Project from '../models/Project.js';
import { protect, requireProjectManager } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();


router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', protect, async (req, res) => {
  try {
    
    if (req.user.role === 'Admin') {
      const projects = await Project.find().populate('developers');
      return res.json(projects);
    }
    
    if (req.user.role === 'ProjectManager') {
      const projects = await Project.find({ manager: req.user._id }).populate('developers');
      return res.json(projects);
    }
    
    const projects = await Project.find({ developers: req.user._id }).populate('developers');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/myprojects', protect, requireProjectManager, async (req, res) => {
  try {
    const projects = await Project.find({ manager: req.user._id }).populate('developers');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;