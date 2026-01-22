import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Modal, Box, Button, IconButton, TextField, 
  Card, CardContent, Grid, Chip, OutlinedInput, InputLabel, 
  MenuItem, FormControl, Select, Snackbar, Alert, Divider, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';

// Modal styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  outline: 'none',
};

function CreateProject() {
    const [newProject, setNewProject] = useState({ name: '', description: '', developers: [] });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  // const [editProject, setEditProject] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          fetch(`${API_URL}/api/users/developers`),
          fetch(`${API_URL}/api/projects/myprojects`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);
        setUsers(await usersRes.json());
        const projectsData = await projectsRes.json();
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, [API_URL]);

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchTasks = async () => {
      const res = await fetch(`${API_URL}/api/tasks`);
      const allTasks = await res.json();
      setProjectTasks(allTasks.filter(task => 
        (task.project && (task.project._id || task.project) === selectedProjectId)
      ));
    };
    fetchTasks();
  }, [selectedProjectId, API_URL]);





  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
    
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="primary">Projects</Typography>
       
      </Stack>

      {/* Project Modal */}


      {/* Projects Grid */}
      <Grid container spacing={3}>
        {Array.isArray(projects) && projects.map(project => (
          <Grid item xs={12} sm={6} lg={4} key={project._id}>
            <Card 
              elevation={selectedProjectId === project._id ? 8 : 1}
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: '0.3s',
                border: selectedProjectId === project._id ? '2px solid' : '2px solid transparent',
                borderColor: selectedProjectId === project._id ? 'primary.main' : 'transparent',
                '&:hover': { boxShadow: 4 }
              }}
              // onClick removed: project selection now only via modal dropdown
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" gutterBottom fontWeight="600">{project.name}</Typography>
                

                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '3em', overflow: 'hidden' }}>
                  {project.description}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PeopleIcon fontSize="small" color="action" />
                    <Typography variant="subtitle2">Team Members:</Typography>
                  </Stack>
                  <Button
                    variant="text"
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedProjectId(project._id);
                      setTaskModalOpen(true);
                    }}
                  >
                    View All Tasks
                  </Button>
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(project.developers || []).map(dev => (
                    <Chip key={dev._id || dev} label={dev.name || dev} size="small" variant="outlined" />
                  ))}
                </Box>
                {/* Task Modal for this project */}
                {selectedProjectId === project._id && (
                  <Modal open={taskModalOpen} onClose={() => { setTaskModalOpen(false); setSelectedProjectId(null); }}>
                    <Box sx={{ ...modalStyle, width: { xs: '95%', sm: 500 }, maxHeight: '90vh', overflowY: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AssignmentIcon fontSize="small" color="primary" />
                          <Typography variant="h6" color="primary">Tasks ({projectTasks.length})</Typography>
                        </Stack>
                        <Box>
                          <IconButton onClick={() => { setTaskModalOpen(false); setSelectedProjectId(null); }} size="small"><CloseIcon /></IconButton>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={1}>
                        {projectTasks.length > 0 ? projectTasks.map(task => (
                          <Box key={task._id} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200', position: 'relative' }}>
                            <Typography variant="body2" fontWeight="500">Title: {task.title}</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">Status: {task.status}</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">Assignee: {task.assignee?.name || task.assignee}</Typography>
                          </Box>
                        )) : (
                          <Typography variant="caption" color="text.secondary italic">No tasks found</Typography>
                        )}
                      </Stack>
                    </Box>
                  </Modal>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Feedback Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CreateProject;