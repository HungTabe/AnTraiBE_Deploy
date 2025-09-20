"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateCareRecord = exports.validatePoultry = exports.validateAuth = void 0;
const express_validator_1 = require("express-validator");
exports.validateAuth = {
    register: [
        (0, express_validator_1.body)('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        (0, express_validator_1.body)('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        (0, express_validator_1.body)('firstName')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters'),
        (0, express_validator_1.body)('lastName')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters'),
        (0, express_validator_1.body)('phone')
            .optional()
            .isLength({ min: 8, max: 12 })
            .withMessage('Please provide a valid Vietnamese phone number'),
        (0, express_validator_1.body)('farmName')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Farm name must be between 2 and 100 characters'),
        (0, express_validator_1.body)('farmAddress')
            .trim()
            .isLength({ min: 10, max: 200 })
            .withMessage('Farm address must be between 10 and 200 characters'),
        (0, express_validator_1.body)('farmCity')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Farm city must be between 2 and 50 characters'),
        (0, express_validator_1.body)('farmProvince')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Farm province must be between 2 and 50 characters'),
    ],
    login: [
        (0, express_validator_1.body)('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        (0, express_validator_1.body)('password')
            .notEmpty()
            .withMessage('Password is required'),
    ],
};
exports.validatePoultry = {
    create: [
        (0, express_validator_1.body)('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Poultry name must be between 2 and 100 characters'),
        (0, express_validator_1.body)('type')
            .isIn(['CHICKEN', 'DUCK', 'GOOSE', 'TURKEY', 'QUAIL', 'OTHER'])
            .withMessage('Invalid poultry type'),
        (0, express_validator_1.body)('gender')
            .isIn(['MALE', 'FEMALE', 'UNKNOWN'])
            .withMessage('Invalid gender'),
        (0, express_validator_1.body)('age')
            .isInt({ min: 0, max: 1000 })
            .withMessage('Age must be between 0 and 1000 weeks'),
        (0, express_validator_1.body)('weight')
            .optional()
            .isFloat({ min: 0.1, max: 50 })
            .withMessage('Weight must be between 0.1 and 50 kg'),
        (0, express_validator_1.body)('healthStatus')
            .optional()
            .isIn(['HEALTHY', 'SICK', 'RECOVERING', 'QUARANTINE', 'DECEASED'])
            .withMessage('Invalid health status'),
    ],
    update: [
        (0, express_validator_1.body)('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Poultry name must be between 2 and 100 characters'),
        (0, express_validator_1.body)('age')
            .optional()
            .isInt({ min: 0, max: 1000 })
            .withMessage('Age must be between 0 and 1000 weeks'),
        (0, express_validator_1.body)('weight')
            .optional()
            .isFloat({ min: 0.1, max: 50 })
            .withMessage('Weight must be between 0.1 and 50 kg'),
        (0, express_validator_1.body)('healthStatus')
            .optional()
            .isIn(['HEALTHY', 'SICK', 'RECOVERING', 'QUARANTINE', 'DECEASED'])
            .withMessage('Invalid health status'),
    ],
};
exports.validateCareRecord = {
    create: [
        (0, express_validator_1.body)('type')
            .isIn(['FEEDING', 'MEDICATION', 'VACCINATION', 'HEALTH_CHECK', 'CLEANING', 'TEMPERATURE_CHECK', 'OTHER'])
            .withMessage('Invalid care type'),
        (0, express_validator_1.body)('description')
            .trim()
            .isLength({ min: 5, max: 500 })
            .withMessage('Description must be between 5 and 500 characters'),
        (0, express_validator_1.body)('poultryId')
            .isInt({ min: 1 })
            .withMessage('Valid poultry ID is required'),
        (0, express_validator_1.body)('cost')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Cost must be a positive number'),
    ],
};
// Validation middleware
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: error.type === 'field' ? error.value : undefined,
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
exports.validate = validate;
//# sourceMappingURL=validation.js.map