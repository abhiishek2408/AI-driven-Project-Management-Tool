import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

function AllDevelopers({ users = [] }) {
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6">All Developers</Typography>
      <List>
        {users.map(user => (
          <ListItem key={user._id}>
            <ListItemText
              primary={user.name + (user.role ? ` (${user.role})` : '')}
              secondary={`Tasks: ${user.tasks?.length || 0}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default AllDevelopers;
