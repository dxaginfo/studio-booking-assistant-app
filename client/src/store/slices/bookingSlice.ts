import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from '../../services/bookingService';
import { setMessage } from './uiSlice';

export interface Booking {
  id: string;
  studioId: string;
  clientId: string;
  staffId?: string;
  startDatetime: string;
  endDatetime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  studio?: any;
  client?: any;
  staff?: any;
  bookingEquipment?: any[];
}

interface BookingState {
  bookings: Booking[];
  recentBookings: Booking[];
  booking: Booking | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  recentBookings: [],
  booking: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (filters: any = {}, { dispatch, rejectWithValue }) => {
    try {
      const data = await bookingService.getBookings(filters);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const fetchRecentBookings = createAsyncThunk(
  'bookings/fetchRecent',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await bookingService.getRecentBookings();
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch recent bookings';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchById',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const data = await bookingService.getBookingById(id);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch booking details';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData: any, { dispatch, rejectWithValue }) => {
    try {
      const data = await bookingService.createBooking(bookingData);
      dispatch(setMessage({ type: 'success', text: 'Booking created successfully' }));
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create booking';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status, staffId, notes }: { id: string; status: string; staffId?: string; notes?: string }, { dispatch, rejectWithValue }) => {
    try {
      const data = await bookingService.updateBookingStatus(id, { status, staffId, notes });
      dispatch(setMessage({ type: 'success', text: `Booking status updated to ${status}` }));
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update booking status';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchBookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchRecentBookings
      .addCase(fetchRecentBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.recentBookings = action.payload;
      })
      .addCase(fetchRecentBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchBookingById
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createBooking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = [...state.bookings, action.payload];
        state.recentBookings = [action.payload, ...state.recentBookings.slice(0, 3)];
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateBookingStatus
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
        
        // Update in bookings list
        state.bookings = state.bookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        );
        
        // Update in recent bookings list
        state.recentBookings = state.recentBookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        );
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default bookingSlice.reducer;
