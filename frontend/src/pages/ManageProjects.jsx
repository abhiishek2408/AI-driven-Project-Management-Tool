import React, { useEffect, useState } from 'react';
import {
  Typography, Modal, Box, Button, IconButton, TextField,
  FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Stack, Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', developers: [], manager: '' });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });


  useEffect(() => {
    fetchProjects();
    fetchManagers();
    fetchDevelopers();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/projects`, { headers: { Authorization: `Bearer ${token}` } });
      setProjects(res.data);
    } catch (err) {
      setProjects([]);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users?role=ProjectManager`);
      setManagers(res.data);
    } catch (err) {
      setManagers([]);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/developers`);
      setDevelopers(res.data);
    } catch (err) {
      setDevelopers([]);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditId(project._id);
      setForm({
        name: project.name,
        description: project.description,
        developers: (project.developers || []).map(d => typeof d === 'object' ? d._id : d),
        manager: typeof project.manager === 'object' ? project.manager._id : project.manager || ''
      });
    } else {
      setEditId(null);
      setForm({ name: '', description: '', developers: [], manager: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditId(null);
    setForm({ name: '', description: '', developers: [], manager: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.manager) {
      setNotification({ open: true, message: 'Project name and manager are required!', severity: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (editId) {
        await axios.put(`${API_URL}/api/projects/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setNotification({ open: true, message: 'Project updated!', severity: 'success' });
      } else {
        await axios.post(`${API_URL}/api/projects`, form, { headers: { Authorization: `Bearer ${token}` } });
        setNotification({ open: true, message: 'Project created!', severity: 'success' });
      }
      fetchProjects();
      handleCloseModal();
    } catch (err) {
      setNotification({ open: true, message: 'Error saving project!', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setNotification({ open: true, message: 'Project deleted!', severity: 'success' });
      fetchProjects();
    } catch (err) {
      setNotification({ open: true, message: 'Error deleting project!', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="800">Project Management</Typography>
            <Typography variant="body2" color="text.secondary">Manage all projects and assignments</Typography>
          </Box>
        </Stack>
        <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
          Add Project
        </Button>
      </Stack>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>All Projects</Typography>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
          <Box component="thead">
            <Box component="tr" sx={{ bgcolor: 'grey.100' }}>
              <Box component="th" sx={{ p: 1, border: '1px solid #eee' }}>Name</Box>
              <Box component="th" sx={{ p: 1, border: '1px solid #eee' }}>Description</Box>
              <Box component="th" sx={{ p: 1, border: '1px solid #eee' }}>Manager</Box>
              <Box component="th" sx={{ p: 1, border: '1px solid #eee' }}>Actions</Box>
            </Box>
          </Box>
          <Box component="tbody">
            {projects.map((proj) => (
              <Box component="tr" key={proj._id}>
                <Box component="td" sx={{ p: 1, border: '1px solid #eee' }}>{proj.name}</Box>
                <Box component="td" sx={{ p: 1, border: '1px solid #eee' }}>{proj.description}</Box>
                <Box component="td" sx={{ p: 1, border: '1px solid #eee' }}>{managers.find(u => u._id === proj.manager)?.name || proj.manager}</Box>
                <Box component="td" sx={{ p: 1, border: '1px solid #eee' }}>
                  <Button size="small" onClick={() => handleOpenModal(proj)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(proj._id)}>Delete</Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 450 }, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 3, outline: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" fontWeight="600">{editId ? 'Edit Project' : 'Create Project'}</Typography>
            <IconButton onClick={handleCloseModal} size="small"><CloseIcon /></IconButton>
          </Box>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Project Name"
                name="name"
                variant="outlined"
                value={form.name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                variant="outlined"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
              <FormControl fullWidth>
                <InputLabel>Assign Developers</InputLabel>
                <Select
                  multiple
                  name="developers"
                  value={form.developers}
                  onChange={e => setForm(f => ({ ...f, developers: e.target.value }))}
                  input={<OutlinedInput label="Assign Developers" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const dev = developers.find(d => d._id === value);
                        return <Chip key={value} label={dev ? dev.name : value} size="small" />;
                      })}
                    </Box>
                  )}
                >
                  {developers.map(dev => (
                    <MenuItem key={dev._id} value={dev._id}>{dev.name} ({dev.email})</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Manager</InputLabel>
                <Select
                  name="manager"
                  value={form.manager}
                  onChange={handleChange}
                  input={<OutlinedInput label="Manager" />}
                >
                  {managers.map(user => (
                    <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
                {editId ? 'Update Project' : 'Create Project'}
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
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

export default ManageProjects;
