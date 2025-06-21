import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../middleware/validators';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Register a new user
router.post('/register', validateRegister, register);

// Login user
router.post('/login', validateLogin, login);

// Get current user (requires authentication)
router.get('/me', authenticate, getCurrentUser);

export default router;
