import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb={4}>
      <Typography variant="h4" color={colors.grey[100]} gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" color={colors.grey[500]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;