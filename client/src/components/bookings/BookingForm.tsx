import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createBooking } from '../../store/slices/bookingSlice';
import { fetchStudios } from '../../store/slices/studioSlice';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
  Paper,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemIcon,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

interface BookingFormProps {
  initialStudioId?: string;
  onSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ initialStudioId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { studios, loading: studiosLoading } = useAppSelector((state) => state.studios);
  const { loading: bookingLoading } = useAppSelector((state) => state.bookings);
  
  // Calculate minimum date (now + 1 hour, rounded to nearest half hour)
  const now = new Date();
  const minDate = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour
  minDate.setMinutes(Math.ceil(minDate.getMinutes() / 30) * 30); // Round to nearest half hour
  
  // Initial values
  const initialValues = {
    studioId: initialStudioId || '',
    startDatetime: minDate,
    endDatetime: new Date(minDate.getTime() + 2 * 60 * 60 * 1000), // Default 2 hours
    notes: '',
    equipment: [],
  };
  
  // Validation schema
  const validationSchema = Yup.object({
    studioId: Yup.string().required('Studio is required'),
    startDatetime: Yup.date().min(minDate, 'Start time must be at least 1 hour from now').required('Start time is required'),
    endDatetime: Yup.date().min(
      Yup.ref('startDatetime'),
      'End time must be after start time'
    ).required('End time is required'),
    notes: Yup.string(),
  });
  
  useEffect(() => {
    dispatch(fetchStudios());
  }, [dispatch]);
  
  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    try {
      await dispatch(createBooking(values)).unwrap();
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/bookings');
      }
    } catch (error: any) {
      if (error.message) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'Failed to create booking. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Book a Studio</Typography>
            </Grid>
            
            {errors.submit && (
              <Grid item xs={12}>
                <Alert severity="error">{errors.submit}</Alert>
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={touched.studioId && Boolean(errors.studioId)}>
                <InputLabel>Studio</InputLabel>
                <Select
                  name="studioId"
                  value={values.studioId}
                  onChange={(e) => {
                    handleChange(e);
                    // Reset equipment when studio changes
                    setFieldValue('equipment', []);
                  }}
                  onBlur={handleBlur}
                  label="Studio"
                  disabled={studiosLoading || Boolean(initialStudioId)}
                >
                  {studiosLoading ? (
                    <MenuItem disabled>Loading studios...</MenuItem>
                  ) : (
                    studios
                      .filter(studio => studio.isActive)
                      .map((studio) => (
                        <MenuItem key={studio.id} value={studio.id}>
                          {studio.name} (${studio.hourlyRate}/hr)
                        </MenuItem>
                      ))
                  )}
                </Select>
                {touched.studioId && errors.studioId && (
                  <FormHelperText>{errors.studioId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Start Time"
                  value={values.startDatetime}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFieldValue('startDatetime', newValue);
                      // Update end time to be 2 hours after start time
                      setFieldValue('endDatetime', new Date(newValue.getTime() + 2 * 60 * 60 * 1000));
                    }
                  }}
                  minDateTime={minDate}
                  ampm
                  format="MM/dd/yyyy h:mm a"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: touched.startDatetime && Boolean(errors.startDatetime),
                      helperText: touched.startDatetime && errors.startDatetime,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="End Time"
                  value={values.endDatetime}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFieldValue('endDatetime', newValue);
                    }
                  }}
                  minDateTime={values.startDatetime}
                  ampm
                  format="MM/dd/yyyy h:mm a"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: touched.endDatetime && Boolean(errors.endDatetime),
                      helperText: touched.endDatetime && errors.endDatetime,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Notes"
                multiline
                rows={4}
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.notes && Boolean(errors.notes)}
                helperText={touched.notes && errors.notes}
              />
            </Grid>
            
            {values.studioId && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Additional Equipment
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <FieldArray name="equipment">
                    {({ push, remove }) => {
                      const selectedStudio = studios.find(s => s.id === values.studioId);
                      const availableEquipment = selectedStudio?.equipment || [];
                      
                      if (availableEquipment.length === 0) {
                        return <Typography>No additional equipment available for this studio.</Typography>;
                      }
                      
                      return (
                        <List>
                          {availableEquipment.map((equip: any) => {
                            const isSelected = values.equipment.some(
                              (e: any) => e.equipmentId === equip.id
                            );
                            
                            return (
                              <ListItem key={equip.id} divider>
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        push({ equipmentId: equip.id, quantity: 1 });
                                      } else {
                                        const idx = values.equipment.findIndex(
                                          (e: any) => e.equipmentId === equip.id
                                        );
                                        if (idx !== -1) {
                                          remove(idx);
                                        }
                                      }
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={equip.name}
                                  secondary={`$${equip.hourlyRate}/hour - ${equip.description || 'No description'}`}
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      );
                    }}
                  </FieldArray>
                </Paper>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || bookingLoading}
                >
                  {isSubmitting || bookingLoading ? 'Submitting...' : 'Book Now'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default BookingForm;
