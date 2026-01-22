import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Box, Typography, Paper, MenuItem, Select, FormControl, 
  CircularProgress, Snackbar, Alert, Stack, 
  Avatar, InputLabel, Chip
} from "@mui/material";
import { 
  Assignment as TaskIcon, 
  Event as CalendarIcon, 
  Flag as PriorityIcon,
  Update as UpdateIcon,
  Folder as ProjectIcon
} from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "";
const statusOptions = ["To-Do", "In-Progress", "Done"];

function MyTask() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get(`${API_URL}/api/tasks?assignee=${user._id}`)
      .then(res => {
        // Keeping your filter logic exactly as provided
        setTasks(res.data.filter(t => t.assignee && t.assignee._id === user._id));
      })
      .catch(() => setSnackbar({ open: true, message: "Failed to fetch tasks", severity: "error" }))
      .finally(() => setLoading(false));
  }, [user]);

  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await axios.put(`${API_URL}/api/tasks/${task._id}`, { ...task, status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
      setSnackbar({ open: true, message: "Status updated", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to update status", severity: "error" });
    }
  };

  // Helper for priority colors
  const getPriorityColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}><TaskIcon /></Avatar>
        <Box>
          <Typography variant="h4" fontWeight="800">My Tasks</Typography>
          <Typography variant="body2" color="text.secondary">Manage and track your assigned development tickets</Typography>
        </Box>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
      ) : (
        <Stack spacing={3}>
          {tasks.length === 0 ? (
            <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px dashed grey.400' }}>
              <Typography color="text.secondary">No tasks assigned to you yet.</Typography>
            </Paper>
          ) : (
            tasks.map(task => (
              <Paper 
                key={task._id} 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  transition: '0.2s',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderColor: 'primary.light' }
                }}
              >
                <Stack direction="row" spacing={3} alignItems="flex-start" justifyContent="space-between" flexWrap="wrap">
                  <Box sx={{ flex: 1, minWidth: 220 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <ProjectIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" fontWeight="700" color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        {task.project?.name || task.project || 'Unassigned Project'}
                      </Typography>
                    </Stack>
                    
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                      {task.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {task.description}
                    </Typography>

                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                      <Chip 
                        size="small" 
                        icon={<PriorityIcon />} 
                        label={`Priority: ${task.priority}`} 
                        color={getPriorityColor(task.priority)} 
                        variant="outlined" 
                      />
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <Box sx={{ minWidth: 160 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={task.status}
                        onChange={e => handleStatusChange(task, e.target.value)}
                        sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                      >
                        {statusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      )}

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Simple Grid helper since MUI Grid requires it
const Grid = ({ children, container, item, xs, md, spacing, alignItems }) => (
  <Box 
    sx={{ 
      display: container ? 'flex' : 'block', 
      flexWrap: 'wrap', 
      width: item ? 'auto' : '100%',
      flexBasis: item ? { xs: `${(xs/12)*100}%`, md: `${(md/12)*100}%` } : 'auto',
      maxWidth: item ? { xs: `${(xs/12)*100}%`, md: `${(md/12)*100}%` } : 'none',
      gap: spacing ? `${spacing * 8}px` : 0,
      alignItems: alignItems || 'stretch'
    }}
  >
    {children}
  </Box>
);

export default MyTask;