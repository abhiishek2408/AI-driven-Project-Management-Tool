import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Typography, Container, Grid, Button, Snackbar, Alert, 
  Box, Stack, Paper, Divider, useTheme, Chip, IconButton, Modal, TextField, FormControl, InputLabel, Select, MenuItem, OutlinedInput
} from '@mui/material';
import { 
  AutoAwesome as AIIcon, 
  AssignmentInd as AssignIcon, 
  Dashboard as DashIcon,
  AutoGraph as InsightIcon
} from '@mui/icons-material';
import KanbanBoard from '../components/KanbanBoard';
import AISuggestionsPanel from '../components/AISuggestionsPanel';
import ProjectSelector from '../components/ProjectSelector';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = process.env.REACT_APP_API_URL || 'https://ai-driven-project-management-tool.onrender.com';

function Dashboard() {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const [selectedProject, setSelectedProject] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignTaskModalOpen, setAssignTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '', status: 'To-Do' });
  const [users, setUsers] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);


  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      setNotification({ open: true, message: 'Project deleted!', severity: 'success' });
      setSelectedProject('');
    } catch (err) {
      setNotification({ open: true, message: 'Error deleting project!', severity: 'error' });
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Use /myprojects for ProjectManager
        const res = await axios.get(`${API_URL}/api/projects/myprojects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProjects(res.data);
      } catch (err) {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProject) {
        setTasks([]);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/tasks/project/${selectedProject}`);
        setTasks(res.data);
      } catch (err) {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/developers`);
        setUsers(res.data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const fetchAISuggestions = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/ai/suggest`);
      setSuggestions(res.data.suggestions);
      triggerNotification('AI suggestions received!', 'success');
    } catch (err) {
      triggerNotification('Failed to fetch AI suggestions', 'error');
    }
  };

  const triggerNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
    if (window.Notification && Notification.permission === 'granted') {
      new Notification(message);
    } else if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') new Notification(message);
      });
    }
  };

  const handleTaskAssign = () => triggerNotification('New task assigned!', 'info');
  const handleTaskComplete = () => triggerNotification('Congratulations! Task completed!', 'success');

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newTask, project: selectedProject };
      const res = await axios.post(
        `${API_URL}/api/tasks`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setTasks(prev => [...prev, res.data]);
      setNotification({ open: true, message: 'Task assigned!', severity: 'success' });
      setNewTask({ title: '', description: '', assignee: '', status: 'To-Do' });
      setAssignTaskModalOpen(false);
    } catch (err) {
      setNotification({ open: true, message: 'Error assigning task!', severity: 'error' });
    }
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setEditTaskModalOpen(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/tasks/${editTask._id}`, editTask);
      setTasks(prev => prev.map(t => t._id === editTask._id ? res.data : t));
      setNotification({ open: true, message: 'Task updated!', severity: 'success' });
      setEditTask(null);
      setEditTaskModalOpen(false);
    } catch (err) {
      setNotification({ open: true, message: 'Error updating task!', severity: 'error' });
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      setNotification({ open: true, message: 'Task deleted!', severity: 'success' });
    } catch (err) {
      setNotification({ open: true, message: 'Error deleting task!', severity: 'error' });
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
      {/* Dashboard Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 4, mb: 4 }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={3}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <DashIcon color="primary" />
                <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1 }}>
                  Management Console
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight="800">Project Overview</Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <ProjectSelector
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
              />
            </Paper>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Main Workspace (Left) */}
          <Grid item xs={12} lg={8.5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', minHeight: '60vh' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="700">Kanban Board</Typography>
                <Stack direction="row" spacing={1}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<AssignIcon />} 
                    onClick={() => setAssignTaskModalOpen(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Assign Task
                  </Button>
                </Stack>
              </Stack>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mt: 2 }}>
                <KanbanBoard tasks={tasks} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
              </Box>
            </Paper>
          </Grid>

          {/* AI Insights Panel (Right) */}
          <Grid item xs={12} lg={3.5}>
            <Stack spacing={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <AIIcon sx={{ color: '#818cf8' }} />
                    <Typography variant="subtitle1" fontWeight="700">AI Assistant</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                    Analyze project bottlenecks and get automated task optimization suggestions.
                  </Typography>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={fetchAISuggestions}
                    sx={{ 
                      bgcolor: '#6366f1', 
                      '&:hover': { bgcolor: '#4f46e5' },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Generate Insights
                  </Button>
                </Box>
                {/* Decorative background element */}
                <InsightIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 120, opacity: 0.1 }} />
              </Paper>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Suggestions Output
                </Typography>
                <AISuggestionsPanel suggestions={suggestions} />
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Assign Task Modal */}
      <Modal open={assignTaskModalOpen} onClose={() => setAssignTaskModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 400 }, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Assign Task</Typography>
            <IconButton onClick={() => setAssignTaskModalOpen(false)} size="small"><CloseIcon /></IconButton>
          </Box>
          <form onSubmit={handleAddTask}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={newTask.assignee}
                  onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                  input={<OutlinedInput label="Assignee" />}
                >
                  {(() => {
                    const projectObj = projects.find(p => p._id === selectedProject);
                    if (!projectObj || !projectObj.developers) return null;
                    const devIds = projectObj.developers.map(dev => typeof dev === 'object' ? dev._id : dev);
                    return users.filter(user => devIds.includes(user._id)).map(user => (
                      <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                    ));
                  })()}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newTask.status}
                  onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                  input={<OutlinedInput label="Status" />}
                >
                  <MenuItem value="To-Do">To-Do</MenuItem>
                  <MenuItem value="In-Progress">In-Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">Assign Task</Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      {/* Edit Task Modal */}
      <Modal open={editTaskModalOpen} onClose={() => { setEditTaskModalOpen(false); setEditTask(null); }}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 400 }, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Edit Task</Typography>
            <IconButton onClick={() => { setEditTaskModalOpen(false); setEditTask(null); }} size="small"><CloseIcon /></IconButton>
          </Box>
          {editTask && (
            <form onSubmit={handleUpdateTask}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editTask.title}
                  onChange={e => setEditTask({ ...editTask, title: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={editTask.description}
                  onChange={e => setEditTask({ ...editTask, description: e.target.value })}
                />
                <FormControl fullWidth>
                  <InputLabel>Assignee</InputLabel>
                  <Select
                    value={editTask.assignee}
                    onChange={e => setEditTask({ ...editTask, assignee: e.target.value })}
                    input={<OutlinedInput label="Assignee" />}
                  >
                    {users.map(user => (
                      <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editTask.status}
                    onChange={e => setEditTask({ ...editTask, status: e.target.value })}
                    input={<OutlinedInput label="Status" />}
                  >
                    <MenuItem value="To-Do">To-Do</MenuItem>
                    <MenuItem value="In-Progress">In-Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">Update Task</Button>
              </Stack>
            </form>
          )}
        </Box>
      </Modal>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: 2, boxShadow: 3 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;