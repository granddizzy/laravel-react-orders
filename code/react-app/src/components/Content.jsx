import React from 'react';
import { Box, Typography } from '@mui/material';

function Content() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">Добро пожаловать!</Typography>
      <Typography variant="body1">
        Здесь вы можете управлять заказами, контрагентами и многим другим.
      </Typography>
    </Box>
  );
}

export default Content;
