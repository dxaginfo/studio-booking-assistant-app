import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchRecentBookings } from '../store/slices/bookingSlice';
import { fetchStudios } from '../store/slices/studioSlice';
import { Grid, Paper, Typography, Box, Button, Card, CardContent, CardActions, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import BookingCalendar from '../components/bookings/BookingCalendar';
import StudioList from '../components/studios/StudioList';
import BookingStatusChart from '../components/dashboard/BookingStatusChart';
import RecentActivityList from '../components/dashboard/RecentActivityList';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { recentBookings, loading: bookingsLoading } = useAppSelector((state) => state.bookings);
  const { studios, loading: studiosLoading } = useAppSelector((state) => state.studios);

  useEffect(() => {
    dispatch(fetchRecentBookings());
    dispatch(fetchStudios());
  }, [dispatch]);

  const handleCreateBooking = () => {
    navigate('/bookings/create');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        {user?.role === 'client' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateBooking}
          >
            Book a Studio
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Calendar Overview */}
        <Grid item xs={12} md={8}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Upcoming Bookings
            </Typography>
            <BookingCalendar />
          </Item>
        </Grid>

        {/* Stats and Quick Actions */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2} direction="column">
            {/* Bookings Stats */}
            <Grid item>
              <Item>
                <Typography variant="h6" gutterBottom>
                  Booking Statistics
                </Typography>
                <BookingStatusChart />
              </Item>
            </Grid>
            
            {/* Quick Access to Studios */}
            <Grid item>
              <Item>
                <Typography variant="h6" gutterBottom>
                  Available Studios
                </Typography>
                <StudioList compact />
              </Item>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            {bookingsLoading ? (
              <Typography>Loading recent bookings...</Typography>
            ) : recentBookings.length > 0 ? (
              <Grid container spacing={2}>
                {recentBookings.slice(0, 4).map((booking) => (
                  <Grid item xs={12} sm={6} md={3} key={booking.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" noWrap>
                          {booking.studio?.name}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          {new Date(booking.startDatetime).toLocaleDateString()} at{' '}
                          {new Date(booking.startDatetime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                        <Chip
                          label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          color={getStatusColor(booking.status) as any}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate(`/bookings/${booking.id}`)}>View Details</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No recent bookings found.</Typography>
            )}
          </Item>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <RecentActivityList />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
