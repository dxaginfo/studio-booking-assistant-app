// API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Token key in localStorage
export const TOKEN_KEY = 'token';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;

// Booking status options
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CLIENT: 'client',
};

// Payment status options
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};
