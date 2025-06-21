import React, { useState } from 'react';
import { Box, IconButton, Badge, Menu, MenuItem, Avatar, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const TopNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/auth/login');
  };
  
  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };
  
  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}` : '';
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Notifications */}
      <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
        <Badge badgeContent={4} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      {/* Profile */}
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleProfileMenuOpen}
        sx={{ ml: 1 }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
          {userInitials}
        </Avatar>
      </IconButton>
      
      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="body2">New booking request from Alex Johnson</Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="body2">Your booking for Studio A is confirmed</Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="body2">Payment received for booking #1234</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="body2" color="primary">View all notifications</Typography>
        </MenuItem>
      </Menu>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1">{`${user.firstName} ${user.lastName}`}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            <Typography variant="body2" color="primary" sx={{ textTransform: 'capitalize' }}>
              {user.role}
            </Typography>
          </Box>
        )}
        <Divider />
        <MenuItem onClick={handleProfileClick}>
          Profile Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopNav;
