import React from 'react';
import {Box, Typography} from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        mt: 'auto', // Толкает футер вниз
      }}
    >
      <Typography variant="body2">© 2024 Все права защищены</Typography>
    </Box>
  );
}

export default Footer;
