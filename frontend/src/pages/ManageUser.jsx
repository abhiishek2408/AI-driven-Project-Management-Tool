import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import CreateProject from './ManageProjects';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as AddIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Lock as LockIcon,
  Close as CloseIcon,
  ManageAccounts as AdminIcon
} from '@mui/icons-material';

// Modal Style
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

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Developer');
  const [editId, setEditId] = useState(null);
  // Modal State
  const [open, setOpen] = useState(false);

  const API_URL = 'http://localhost:5000/api/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('Developer');
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { name, email, password, role });
      } else {
        await axios.post(`${API_URL}/signup`, { name, email, password, role });
      }
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      alert("Error processing request");
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword('');
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, margin: '0 auto', p: { xs: 2, md: 4 } }}>
      
      {/* Page Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AdminIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="800">User Management</Typography>
            <Typography variant="body2" color="text.secondary">Manage all users and their roles</Typography>
          </Box>
        </Stack>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenModal}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          Add New User
        </Button>
      </Stack>

      {/* <Box sx={{ mb: 6 }}>
        <CreateProject />
      </Box> */}

      <Divider sx={{ mb: 4 }} />

      {/* Managers Table Section */}
      <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>Users List</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? users.map(user => (
              <TableRow key={user._id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                <TableCell color="text.secondary">{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Edit User">
                      <IconButton onClick={() => handleEdit(user)} size="small" sx={{ color: 'primary.main', bgcolor: 'primary.light', '&:hover': { bgcolor: '#e3f2fd' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton onClick={() => handleDelete(user._id)} size="small" sx={{ color: 'error.main', bgcolor: '#ffebee', '&:hover': { bgcolor: '#ffcdd2' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No users found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- ADD/EDIT MODAL --- */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="700">
                {editId ? 'Edit Manager Details' : 'Add New Project Manager'}
              </Typography>
              <IconButton onClick={handleCloseModal} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><BadgeIcon color="action" /></InputAdornment>),
                  }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>),
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder={editId ? "Leave empty to keep current" : "Enter secure password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required={!editId}
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><LockIcon color="action" /></InputAdornment>),
                  }}
                />
                <FormControl fullWidth required sx={{ mt: 1 }}>
                  <InputLabel>User Role</InputLabel>
                  <Select
                    value={role}
                    label="User Role"
                    onChange={e => setRole(e.target.value)}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="ProjectManager">Project Manager</MenuItem>
                    <MenuItem value="Developer">Developer</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    sx={{ borderRadius: 2, fontWeight: 'bold', py: 1.5 }}
                  >
                    {editId ? 'Save Changes' : 'Create Account'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Fade>
      </Modal>

    </Box>
  );
}

export default ManageUser;