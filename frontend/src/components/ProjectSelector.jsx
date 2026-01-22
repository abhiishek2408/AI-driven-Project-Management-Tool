import React from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

function ProjectSelector({ projects, selectedProject, setSelectedProject }) {
  return (
    <FormControl fullWidth sx={{ mb: 2, minWidth: 250 }}>
      <InputLabel id="project-select-label">Select Project</InputLabel>
      <Select
        labelId="project-select-label"
        value={selectedProject}
        label="Select Project"
        onChange={e => setSelectedProject(e.target.value)}
        sx={{ minWidth: 250 }}
      >
        <MenuItem value="">All Projects</MenuItem>
        {projects.map(project => (
          <MenuItem key={project._id} value={project._id}>
            {project.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ProjectSelector;
