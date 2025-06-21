import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchBookings } from '../../store/slices/bookingSlice';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookingStatusBadge from '../../components/bookings/BookingStatusBadge';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const BookingList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { bookings, loading } = useAppSelector((state) => state.bookings);
  const { user } = useAppSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleCreateBooking = () => {
    navigate('/bookings/create');
  };
  
  const handleBookingClick = (id: string) => {
    navigate(`/bookings/${id}`);
  };
  
  // Filter bookings based on search term and status filter
  const filteredBookings = bookings.filter((booking) => {
    const studioName = booking.studio?.name.toLowerCase() || '';
    const clientName = `${booking.client?.firstName} ${booking.client?.lastName}`.toLowerCase();
    const staffName = booking.staff ? `${booking.staff.firstName} ${booking.staff.lastName}`.toLowerCase() : '';
    
    const matchesSearch = studioName.includes(searchTerm.toLowerCase()) ||
                        clientName.includes(searchTerm.toLowerCase()) ||
                        staffName.includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    
    // For tabs: 0 = All, 1 = Upcoming, 2 = Past, 3 = My Bookings
    if (tabValue === 1) {
      // Upcoming: status is pending or confirmed and start date is in the future
      return matchesSearch && matchesStatus && 
             ['pending', 'confirmed'].includes(booking.status) && 
             new Date(booking.startDatetime) > new Date();
    } else if (tabValue === 2) {
      // Past: end date is in the past
      return matchesSearch && matchesStatus && 
             new Date(booking.endDatetime) < new Date();
    } else if (tabValue === 3) {
      // My Bookings: user is client or staff of booking
      return matchesSearch && matchesStatus && 
             (booking.clientId === user?.id || booking.staffId === user?.id);
    }
    
    // All bookings
    return matchesSearch && matchesStatus;
  });
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Bookings
        </Typography>
        {user?.role === 'client' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateBooking}
          >
            New Booking
          </Button>
        )}
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking tabs">
          <Tab label="All Bookings" />
          <Tab label="Upcoming" />
          <Tab label="Past" />
          <Tab label="My Bookings" />
        </Tabs>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search bookings..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        {renderBookingTable(filteredBookings, loading, handleBookingClick)}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderBookingTable(filteredBookings, loading, handleBookingClick)}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderBookingTable(filteredBookings, loading, handleBookingClick)}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderBookingTable(filteredBookings, loading, handleBookingClick)}
      </TabPanel>
    </Box>
  );
};

const renderBookingTable = (bookings: any[], loading: boolean, handleClick: (id: string) => void) => {
  if (loading) {
    return <Typography>Loading bookings...</Typography>;
  }
  
  if (bookings.length === 0) {
    return <Typography>No bookings found.</Typography>;
  }
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Studio</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Staff</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => {
            const startDate = new Date(booking.startDatetime);
            const endDate = new Date(booking.endDatetime);
            const formattedDate = startDate.toLocaleDateString();
            const formattedStartTime = startDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const formattedEndTime = endDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            
            return (
              <TableRow key={booking.id} hover onClick={() => handleClick(booking.id)} sx={{ cursor: 'pointer' }}>
                <TableCell>{booking.studio?.name}</TableCell>
                <TableCell>
                  {formattedDate}
                  <br />
                  {formattedStartTime} - {formattedEndTime}
                </TableCell>
                <TableCell>
                  {booking.client?.firstName} {booking.client?.lastName}
                </TableCell>
                <TableCell>
                  {booking.staff ? `${booking.staff.firstName} ${booking.staff.lastName}` : '-'}
                </TableCell>
                <TableCell>
                  <BookingStatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={(e) => {
                    e.stopPropagation();
                    handleClick(booking.id);
                  }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingList;
