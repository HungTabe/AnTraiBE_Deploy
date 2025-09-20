import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

export const validateAuth = {
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('firstName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('phone')
      .optional()
      .isLength({ min: 8, max: 12 })
      .withMessage('Please provide a valid Vietnamese phone number'),
    
    body('farmName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Farm name must be between 2 and 100 characters'),
    
    body('farmAddress')
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Farm address must be between 10 and 200 characters'),
    
    body('farmCity')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Farm city must be between 2 and 50 characters'),
    
    body('farmProvince')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Farm province must be between 2 and 50 characters'),
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
};

export const validatePoultry = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Poultry name must be between 2 and 100 characters'),
    
    body('type')
      .isIn(['CHICKEN', 'DUCK', 'GOOSE', 'TURKEY', 'QUAIL', 'OTHER'])
      .withMessage('Invalid poultry type'),
    
    body('gender')
      .isIn(['MALE', 'FEMALE', 'UNKNOWN'])
      .withMessage('Invalid gender'),
    
    body('age')
      .isInt({ min: 0, max: 1000 })
      .withMessage('Age must be between 0 and 1000 weeks'),
    
    body('weight')
      .optional()
      .isFloat({ min: 0.1, max: 50 })
      .withMessage('Weight must be between 0.1 and 50 kg'),
    
    body('healthStatus')
      .optional()
      .isIn(['HEALTHY', 'SICK', 'RECOVERING', 'QUARANTINE', 'DECEASED'])
      .withMessage('Invalid health status'),
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Poultry name must be between 2 and 100 characters'),
    
    body('age')
      .optional()
      .isInt({ min: 0, max: 1000 })
      .withMessage('Age must be between 0 and 1000 weeks'),
    
    body('weight')
      .optional()
      .isFloat({ min: 0.1, max: 50 })
      .withMessage('Weight must be between 0.1 and 50 kg'),
    
    body('healthStatus')
      .optional()
      .isIn(['HEALTHY', 'SICK', 'RECOVERING', 'QUARANTINE', 'DECEASED'])
      .withMessage('Invalid health status'),
  ],
};

export const validateCareRecord = {
  create: [
    body('type')
      .isIn(['FEEDING', 'MEDICATION', 'VACCINATION', 'HEALTH_CHECK', 'CLEANING', 'TEMPERATURE_CHECK', 'OTHER'])
      .withMessage('Invalid care type'),
    
    body('description')
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage('Description must be between 5 and 500 characters'),
    
    body('poultryId')
      .isInt({ min: 1 })
      .withMessage('Valid poultry ID is required'),
    
    body('cost')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Cost must be a positive number'),
  ],
};

// Validation middleware
export const validate = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? (error as any).value : undefined,
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errorMessages,
      },
      timestamp: new Date().toISOString(),
    });
  }
  
  next();
};
