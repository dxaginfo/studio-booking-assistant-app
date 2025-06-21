import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppSelector } from '../../hooks/redux';

const SidebarNav: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <>
      <ListItemButton component={RouterLink} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      
      <ListItemButton component={RouterLink} to="/bookings">
        <ListItemIcon>
          <EventIcon />
        </ListItemIcon>
        <ListItemText primary="Bookings" />
      </ListItemButton>
      
      {/* Only show studios management to admins and staff */}
      {user && (user.role === 'admin' || user.role === 'staff') && (
        <ListItemButton component={RouterLink} to="/studios">
          <ListItemIcon>
            <HomeWorkIcon />
          </ListItemIcon>
          <ListItemText primary="Studios" />
        </ListItemButton>
      )}
      
      {/* Only show users management to admins */}
      {user && user.role === 'admin' && (
        <ListItemButton component={RouterLink} to="/users">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
      )}
      
      <Divider sx={{ my: 1 }} />
      
      <ListItemButton component={RouterLink} to="/profile">
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </>
  );
};

export default SidebarNav;
