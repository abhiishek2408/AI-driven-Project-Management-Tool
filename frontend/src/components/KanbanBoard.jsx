
import React from 'react';
import { Grid, Paper, Typography, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { title: 'To-Do', key: 'To-Do' },
  { title: 'In-Progress', key: 'In-Progress' },
  { title: 'Done', key: 'Done' },
];

function KanbanBoard({ tasks = [], onEditTask, onDeleteTask }) {
  return (
    <Grid container spacing={2}>
      {columns.map((col) => (
        <Grid item xs={12} md={4} key={col.key}>
          <Paper elevation={3} sx={{ p: 2, minHeight: 300 }}>
            <Typography variant="h6" align="center">{col.title}</Typography>
            {tasks.filter(t => t.status === col.key).map(task => (
              <Paper key={task._id} sx={{ m: 1, p: 1, position: 'relative' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <div>
                    <Typography variant="subtitle1">{task.title}</Typography>
                    <Typography variant="body2">Assignee: {task.assignee?.name || 'Unassigned'}</Typography>
                    <Typography variant="body2">Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}</Typography>
                    <Typography variant="body2">Priority: {task.priority}</Typography>
                  </div>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="primary" onClick={() => onEditTask && onEditTask(task)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => onDeleteTask && onDeleteTask(task._id)}><DeleteIcon /></IconButton>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default KanbanBoard;
