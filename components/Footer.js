import React from 'react';
import { Typography, Link, Box } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
      <Typography variant="body2" align="center">
        {'© '}
        <Link color="inherit" href="https://example.com/">
          Young
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  );
}