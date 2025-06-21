import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { checkAuth } from './store/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import StudioList from './pages/studios/StudioList';
import StudioDetail from './pages/studios/StudioDetail';
import BookingList from './pages/bookings/BookingList';
import BookingDetail from './pages/bookings/BookingDetail';
import CreateBooking from './pages/bookings/CreateBooking';
import UserProfile from './pages/users/UserProfile';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector(state => state.auth);
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  
  return <>{children}</>;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Forest green
    },
    secondary: {
      main: '#9c27b0', // Purple
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
  },
});

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        
        {/* Main app routes - protected */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Studios */}
          <Route path="studios" element={<StudioList />} />
          <Route path="studios/:id" element={<StudioDetail />} />
          
          {/* Bookings */}
          <Route path="bookings" element={<BookingList />} />
          <Route path="bookings/create" element={<CreateBooking />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          
          {/* User Profile */}
          <Route path="profile" element={<UserProfile />} />
        </Route>
        
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
