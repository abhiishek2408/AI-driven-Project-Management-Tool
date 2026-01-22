import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box,
  Drawer, List, ListItem, ListItemText, Divider, Container,
  Avatar, Tooltip, Stack, Chip, ListItemIcon
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HomeIcon from "@mui/icons-material/Home";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "http://localhost:3000/";
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { title: "Home", path: "/project-manager", icon: <HomeIcon /> },
    { title: "MyProjects", path: "/project-manager/my-projects", icon: <FolderSpecialIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 260 }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
          <AccountTreeIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Typography variant="subtitle1" fontWeight={800} color="primary">
          AI-PM Manager
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 2 }}>
        {navLinks.map((item) => (
          <ListItem 
            key={item.title} 
            component={Link} 
            to={item.path} 
            onClick={handleDrawerToggle}
            sx={{ 
              borderRadius: 2, 
              mb: 1,
              color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
              bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
              textDecoration: 'none'
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItem>
        ))}
        {!user && (
          <ListItem component={Link} to="/" sx={{ borderRadius: 2, color: 'inherit', textDecoration: 'none' }}>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
      {user && (
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );

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
            {/* Logo Section */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: { xs: 1, md: 0 }, mr: 6 }}>
              <AccountTreeIcon sx={{ color: 'primary.main', fontSize: 32, display: { xs: 'none', md: 'flex' } }} />
              
              <Stack spacing={0}>
                <Typography 
                  variant="h6" 
                  fontWeight={800} 
                  sx={{ 
                    letterSpacing: '-0.5px', 
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    color: 'inherit',
                    textDecoration: 'none'
                  }}
                  component={Link}
                  to="/"
                >
                  AI-driven Project Management
                </Typography>
                <Box>
                  <Chip 
                    label="Project Manager" 
                    size="small" 
                    icon={<SupervisorAccountIcon sx={{ fontSize: '12px !important' }} />}
                    sx={{ 
                      height: 18, 
                      fontSize: '0.6rem', 
                      fontWeight: 900, 
                      textTransform: 'uppercase',
                      bgcolor: '#eff6ff', // Light blue
                      color: '#1d4ed8', // Deep blue
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
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, flexGrow: 1 }}>
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
                      }
                    }}
                  >
                    {link.title}
                  </Button>
                );
              })}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {user ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ display: { xs: 'none', lg: 'flex' } }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Management</Typography>
                    </Box>
                    <Tooltip title="View Profile">
                      <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                        {user.name ? user.name[0].toUpperCase() : "M"}
                      </Avatar>
                    </Tooltip>
                  </Stack>

                  <IconButton 
                    color="error" 
                    onClick={handleLogout}
                    sx={{ 
                      bgcolor: '#fff1f2', 
                      '&:hover': { bgcolor: '#ffe4e6' },
                      display: { xs: 'none', md: 'flex' } 
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ) : (
                <Button variant="contained" component={Link} to="/" sx={{ borderRadius: 2 }}>
                  Login
                </Button>
              )}

              {/* Mobile Menu Icon */}
              <IconButton 
                onClick={handleDrawerToggle} 
                sx={{ display: { md: 'none' }, border: '1px solid', borderColor: 'divider' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280, borderRadius: '20px 0 0 20px' },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;