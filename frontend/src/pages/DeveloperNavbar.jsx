import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box,
  Drawer, List, ListItem, ListItemText, Divider, Container,
  Avatar, Tooltip, Stack, ListItemIcon, Chip
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Assignment as ProjectIcon,
  Home as HomeIcon,
  TaskAlt as TaskIcon,
  AccountCircle as ProfileIcon,
  Code as CodeIcon
} from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

function DeveloperNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navLinks = [
    { title: "Dashboard", path: "/developer", icon: <HomeIcon fontSize="small" /> },
    { title: "My Tasks", path: "/developer/my-tasks", icon: <TaskIcon fontSize="small" /> },
  ];

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            
            {/* Logo & Role Badge Section */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: { xs: 1, md: 0 }, mr: 6 }}>
              <ProjectIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              
              <Stack spacing={0}>
                <Typography 
                  variant="h6" 
                  fontWeight={800} 
                  sx={{ 
                    letterSpacing: '-0.5px', 
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap'
                  }}
                >
                  AI-driven Project Management
                </Typography>
                <Box>
                  <Chip 
                    label="Developer" 
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
              </Stack>
            </Stack>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, flexGrow: 1 }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Button
                    key={link.title}
                    component={Link}
                    to={link.path}
                    disableRipple 
                    sx={{ 
                      px: 0,
                      minWidth: 'auto',
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 700 : 500,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      '&:hover': { 
                        bgcolor: 'transparent', 
                        color: 'primary.main',
                        transition: 'color 0.2s ease-in-out'
                      }
                    }}
                  >
                    {link.title}
                  </Button>
                );
              })}
            </Box>

            {/* User Profile & Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {user && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ display: { xs: 'none', lg: 'flex' } }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Engineering</Typography>
                    </Box>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.85rem' }}>
                      {user.name ? user.name[0].toUpperCase() : "D"}
                    </Avatar>
                  </Stack>

                  <Button 
                    variant="text" 
                    color="inherit" 
                    size="small"
                    startIcon={<LogoutIcon fontSize="small" />} 
                    onClick={handleLogout}
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'transparent', color: 'error.main' } 
                    }}
                  >
                    Logout
                  </Button>
                </Stack>
              )}

      
              <IconButton 
                onClick={handleDrawerToggle} 
                sx={{ display: { md: 'none' }, ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>


    </>
  );
}

export default DeveloperNavbar;