import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Stack,
  Tooltip,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as ProjectIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Shield as AdminIcon,
  Logout as LogoutIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const drawerWidth = 280;

function AdminSidebar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
      { text: 'Overview', icon: <DashboardIcon />, path: '/admin/dashboard' },
      { text: 'Manage Projects', icon: <ProjectIcon />, path: '/admin/projects' },
    { text: 'Manage Users', icon: <PeopleIcon />, path: '/admin/users' },

  ];



  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: '#ffffff'
        },
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main', 
            width: 40, 
            height: 40,
            boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)' 
          }}
        >
          <AdminIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="800" sx={{ lineHeight: 1.2 }}>
            AI-driven Project Management
          </Typography>
           <Box>
                  <Chip 
                    label="Admin" 
                    size="small" 
                    icon={<CodeIcon sx={{ fontSize: '12px !important' }} />}
                    sx={{ 
                      height: 18, 
                      fontSize: '0.6rem', 
                      fontWeight: 900, 
                      textTransform: 'uppercase',
                      bgcolor: '#f1f5f9',
                      color: '#475569',
                      borderRadius: '4px',
                      border: 'none',
                      mt: 0.5,
                      '& .MuiChip-icon': { color: 'inherit' }
                    }} 
                  />
                </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, mx: 2 }} />

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, px: 2 }}>
        <Typography 
          variant="caption" 
          sx={{ px: 2, pb: 1, display: 'block', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase' }}
        >
          Main Menu
        </Typography>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive ? 'primary.light' : 'transparent',
                    '&:hover': { bgcolor: isActive ? 'primary.light' : 'action.hover' },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 500 }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

       
       
      </Box>

      {/* Sidebar Footer / User Profile */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
              {user?.name ? user.name[0].toUpperCase() : '?'}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight="700" noWrap>
                {user?.name || 'Unknown User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {user?.email || 'No email'}
              </Typography>
              {user?.role && (
                <Typography variant="caption" color="primary" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                  {user.role}
                </Typography>
              )}
            </Box>
            <Tooltip title="Logout">
              <IconButton
                size="small"
                sx={{ ml: 'auto' }}
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/');
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      </Box>
    </Drawer>
  );
}



export default AdminSidebar;
