import React from 'react';
import { 
  Box, Typography, Paper, Divider, Grid, Stack, 
  Button, Card, CardContent, Avatar, useTheme 
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  RocketLaunch as LaunchIcon,
  PeopleAlt as UsersIcon,
  Insights as AnalyticsIcon,
  CheckCircle as SuccessIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function AdminDashboardHome() {
  const theme = useTheme();
  const navigate = useNavigate();

  const quickActions = [
    { title: 'Manage Projects', icon: <LaunchIcon />, path: '/admin/projects', color: theme.palette.primary.main },
    { title: 'System Users', icon: <UsersIcon />, path: '/admin/users', color: '#6366f1' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1200, margin: '0 auto' }}>
      
 
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <AdminIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ color: '#1e293b', letterSpacing: '-1px' }}>
            Console
          </Typography>
          <Typography variant="body1" color="text.secondary">
            System-wide oversight and administrative control.
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 4 }} />

  
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 5, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Welcome back, Administrator
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mb: 0 }}>
            Everything is looking good. You have 3 pending project approvals and 2 new user registrations today. 
            Use the quick links below to take immediate action.
          </Typography>
        </Box>
        <ShieldIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 180, opacity: 0.05 }} />
      </Paper>

      <Grid container spacing={3}>
        {/* Quick Actions Grid */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            Direct Access
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action) => (
              <Grid item xs={12} sm={4} key={action.title}>
                <Card 
                  onClick={() => navigate(action.path)}
                  sx={{ 
                    cursor: 'pointer', 
                    borderRadius: 3, 
                    border: '1px solid #e2e8f0', 
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 20px rgba(0,0,0,0.05)' }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ color: action.color, mb: 1 }}>{action.icon}</Box>
                    <Typography variant="subtitle2" fontWeight={700}>{action.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

 
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Service Health
          </Typography>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }} elevation={0}>
            <Stack spacing={2.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" fontWeight={600}>Database</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <SuccessIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="caption" color="success.main" fontWeight={700}>ONLINE</Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" fontWeight={600}>API Server</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <SuccessIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="caption" color="success.main" fontWeight={700}>ONLINE</Typography>
                </Stack>
              </Stack>
              <Divider />
              <Typography variant="caption" color="text.secondary">
                Last checked: {new Date().toLocaleTimeString()}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboardHome;