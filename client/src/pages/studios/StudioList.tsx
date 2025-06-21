import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchStudios } from '../../store/slices/studioSlice';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';

import StudioForm from '../../components/studios/StudioForm';

const StudioList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { studios, loading } = useAppSelector((state) => state.studios);
  const { user } = useAppSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(fetchStudios());
  }, [dispatch]);
  
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleFilterSelect = (filter: string) => {
    setActiveFilter(filter);
    handleFilterClose();
  };
  
  const handleClearFilter = () => {
    setActiveFilter(null);
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleStudioClick = (id: string) => {
    navigate(`/studios/${id}`);
  };
  
  const handleAddStudio = () => {
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  
  // Filter studios based on search term and active filter
  const filteredStudios = studios.filter((studio) => {
    const matchesSearch = studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (studio.description && studio.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === 'active') {
      return matchesSearch && studio.isActive;
    } else if (activeFilter === 'inactive') {
      return matchesSearch && !studio.isActive;
    }
    
    return matchesSearch;
  });
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Studios
        </Typography>
        {user && (user.role === 'admin' || user.role === 'staff') && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddStudio}
          >
            Add Studio
          </Button>
        )}
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search studios..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
        
        <IconButton onClick={handleFilterClick}>
          <FilterListIcon />
        </IconButton>
        
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem onClick={() => handleFilterSelect('active')}>Active Only</MenuItem>
          <MenuItem onClick={() => handleFilterSelect('inactive')}>Inactive Only</MenuItem>
          <MenuItem onClick={handleClearFilter}>Clear Filters</MenuItem>
        </Menu>
      </Box>
      
      {activeFilter && (
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={`Filter: ${activeFilter === 'active' ? 'Active Only' : 'Inactive Only'}`}
            onDelete={handleClearFilter}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
      
      {loading ? (
        <Typography>Loading studios...</Typography>
      ) : filteredStudios.length > 0 ? (
        <Grid container spacing={3}>
          {filteredStudios.map((studio) => (
            <Grid item xs={12} sm={6} md={4} key={studio.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://source.unsplash.com/random?recording,studio,music&sig=${studio.id}`}
                  alt={studio.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {studio.name}
                    </Typography>
                    {studio.isActive ? (
                      <Chip label="Active" color="success" size="small" />
                    ) : (
                      <Chip label="Inactive" color="error" size="small" />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {studio.description ? `${studio.description.substring(0, 100)}${studio.description.length > 100 ? '...' : ''}` : 'No description available.'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>${studio.hourlyRate}/hour</strong>
                  </Typography>
                  {studio.capacity && (
                    <Typography variant="body2">
                      Capacity: {studio.capacity} people
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleStudioClick(studio.id)}>View Details</Button>
                  {user && user.role === 'client' && studio.isActive && (
                    <Button size="small" color="primary" onClick={() => navigate('/bookings/create', { state: { studioId: studio.id } })}>Book Now</Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No studios found.</Typography>
      )}
      
      {/* Add Studio Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Studio</DialogTitle>
        <DialogContent>
          <StudioForm onCancel={handleDialogClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudioList;
