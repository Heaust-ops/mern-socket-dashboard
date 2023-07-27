import { Router } from 'express';
import { reviewController } from '../../controllers';
import validate from '../../middlewares/validationMiddleware';
import { reviewValidator } from '../../validation/review';

// REVIEW ROUTES
const _router: Router = Router({ mergeParams: true });

// CREATE A NEW REVIEW
_router.route('/').post(validate(reviewValidator), reviewController.create);

// GET ALL REVIEWS
_router.route('/').get(reviewController.getAll);

// GET A SINGLE REVIEW BY ID
_router.route('/:reviewId').get(reviewController.get);

// UPDATE REVIEW DATA BY ID
_router.route('/:reviewId').put(validate(reviewValidator), reviewController.update);

// DELETE REVIEW DATA BY ID
_router.route('/:reviewId').delete(reviewController.remove);

// EXPORT
export const router = _router;
