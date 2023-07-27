import { body } from 'express-validator';

export const reviewValidator = [
  body('title')
    .notEmpty().withMessage('Title is required.')
    .isString().withMessage('Title must be a string.')
    .isLength({ max: 500 }).withMessage('Title must not exceed 500 characters.'),
  body('content')
    .notEmpty().withMessage('Content is required.')
    .isString().withMessage('Content must be a string.')
    .isLength({ max: 20000 }).withMessage('Content must not exceed 20000 characters.'),
  body('rating')
    .notEmpty().withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
];