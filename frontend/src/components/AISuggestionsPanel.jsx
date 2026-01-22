
import React from 'react';
import { Paper, Typography } from '@mui/material';

function stripAsterisks(text) {
  if (!text) return '';
  return text
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, ''))
    .join('\n');
}

function AISuggestionsPanel({ suggestions }) {
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6">Gemini AI Suggestions</Typography>
      <Typography sx={{ whiteSpace: 'pre-line', mt: 1 }}>
        {stripAsterisks(suggestions) || 'Gemini AI suggestions will appear here.'}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
        Powered by Google Gemini
      </Typography>
    </Paper>
  );
}

export default AISuggestionsPanel;
