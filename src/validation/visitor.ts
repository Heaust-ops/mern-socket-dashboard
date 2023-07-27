import { body } from 'express-validator';

export const visitorValidatior = [
    body('ipAddress').notEmpty().withMessage('IP Address is required.'),
    body('browser').notEmpty().withMessage('Browser is required.'),
    body('location')
        .optional()
        .isString()
        .withMessage('Location must be a string.'),
    body('referrer')
        .optional()
        .isString()
        .withMessage('Referrer must be a string.'),
];
