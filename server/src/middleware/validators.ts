import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validate registration input
export const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('firstName').not().isEmpty().withMessage('First name is required'),
  body('lastName').not().isEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['admin', 'staff', 'client']).withMessage('Invalid role'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validate login input
export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').not().isEmpty().withMessage('Password is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validate studio creation/update input
export const validateStudio = [
  body('name').not().isEmpty().withMessage('Studio name is required'),
  body('description').optional(),
  body('capacity').optional().isNumeric().withMessage('Capacity must be a number'),
  body('hourlyRate').isNumeric().withMessage('Hourly rate must be a number'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validate booking creation/update input
export const validateBooking = [
  body('studioId').not().isEmpty().withMessage('Studio ID is required'),
  body('startDatetime').isISO8601().withMessage('Start datetime must be a valid date'),
  body('endDatetime').isISO8601().withMessage('End datetime must be a valid date'),
  body('equipment').optional().isArray().withMessage('Equipment must be an array'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
