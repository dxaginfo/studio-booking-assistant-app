import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 400,
}));

const AuthLayout: React.FC = () => {
  return (
    <AuthContainer maxWidth="sm">
      <AuthPaper elevation={3}>
        <Typography component="h1" variant="h4" color="primary" gutterBottom>
          Studio Booking Assistant
        </Typography>
        <Outlet />
      </AuthPaper>
      <Box mt={5}>
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          <Link color="inherit" href="https://studiobookingassistant.com/">
            Studio Booking Assistant
          </Link>{' '}
          {new Date().getFullYear()}
        </Typography>
      </Box>
    </AuthContainer>
  );
};

export default AuthLayout;
