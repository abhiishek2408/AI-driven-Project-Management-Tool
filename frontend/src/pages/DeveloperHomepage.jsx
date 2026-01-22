import React, { useContext } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Avatar, 
  Stack, Paper, Divider, LinearProgress, Chip, Tooltip
} from '@mui/material';
import { 
  Code as CodeIcon, AssignmentTurnedIn as DoneIcon, 
  Timeline as TimelineIcon, Speed as SpeedIcon,
  Storage as StorageIcon, Security as SecurityIcon,
  AutoGraph as GraphIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

function DeveloperHomepage() {
  const { user } = useContext(AuthContext);

  const stats = [
    { label: 'System Uptime', value: '99.9%', icon: <SpeedIcon color="success" />, color: '#e8f5e9' },
    { label: 'Active Tasks', value: '12', icon: <TimelineIcon color="primary" />, color: '#e3f2fd' },
    { label: 'Pull Requests', value: '8', icon: <CodeIcon color="secondary" />, color: '#f3e5f5' },
    { label: 'Deployment Status', value: 'Stable', icon: <SecurityIcon color="info" />, color: '#e0f7fa' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.5px' }} gutterBottom>
          Engineering Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name || 'Developer'}. System diagnostics and project cycles are currently nominal.
        </Typography>
      </Box>

      {/* Hero Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar variant="rounded" sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', display: 'block' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h6" fontWeight="800">{stat.value}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Left Column: Progress & Tech Stack */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 4, mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GraphIcon fontSize="small" color="primary" /> Project Completion Velocity
            </Typography>
            <Box sx={{ mt: 3 }}>
              {['Frontend Refactor', 'Backend API v2', 'Database Migration'].map((project, i) => (
                <Box key={project} sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" fontWeight="500">{project}</Typography>
                    <Typography variant="caption" color="text.secondary">{[85, 40, 65][i]}%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={[85, 40, 65][i]} 
                    sx={{ height: 8, borderRadius: 5, bgcolor: 'grey.100' }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <Typography variant="subtitle1" fontWeight="700" gutterBottom>
              Primary Tech Stack
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
              {['React 18', 'Node.js', 'TypeScript', 'PostgreSQL', 'MUI', 'Docker', 'AWS'].map((tech) => (
                <Chip 
                  key={tech} 
                  label={tech} 
                  variant="outlined" 
                  size="small" 
                  sx={{ borderRadius: 1, fontWeight: 500, px: 1 }} 
                />
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Live Logs / Activity */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 0, border: '1px solid', borderColor: 'divider', borderRadius: 4, overflow: 'hidden', bgcolor: '#0f172a' }}>
            <Box sx={{ p: 2, bgcolor: '#1e293b', borderBottom: '1px solid #334155' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontWeight: 'bold' }}>
                TERMINAL ACTIVITY LOG
              </Typography>
            </Box>
            <Box sx={{ p: 3, fontFamily: 'monospace', fontSize: '13px' }}>
              {[
                { time: '23:50:11', msg: 'Deployment to production successful', color: '#4ade80' },
                { time: '23:48:05', msg: 'Git push received from "dev-main"', color: '#94a3b8' },
                { time: '22:15:30', msg: 'Database backup completed', color: '#60a5fa' },
                { time: '21:04:12', msg: 'New contributor added: @sarah_dev', color: '#c084fc' },
                { time: '18:30:00', msg: 'Weekly sprint report generated', color: '#94a3b8' },
              ].map((log, i) => (
                <Box key={i} sx={{ mb: 1.5, display: 'flex', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: '#475569' }}>[{log.time}]</Typography>
                  <Typography variant="caption" sx={{ color: log.color }}>$ {log.msg}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DeveloperHomepage;