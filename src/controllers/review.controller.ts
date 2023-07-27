import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne, jsonAll } from '../utils/general';
import Review, { IReviewModel } from '../models/review';

// CREATE A NEW REVIEW
const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content, rating } = req.body;

        // Create a new review using the Review model
        const newReview = new Review({
            title,
            content,
            rating,
        });

        // Save the review to the database
        const savedReview = await newReview.save();

        return jsonOne<IReviewModel>(res, 201, savedReview);
    } catch (error) {
        next(error);
    }
};

// GET A SINGLE REVIEW BY ID
const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = req.params.reviewId;

        // Find the review by ID using the Review model
        const review = await Review.findById(reviewId);

        if (!review) {
            throw new HttpError({
                title: 'not_found',
                detail: 'Review not found.',
                code: 404,
            });
        }

        return jsonOne<IReviewModel>(res, 200, review);
    } catch (error) {
        next(error);
    }
};

// GET ALL REVIEWS
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find all reviews using the Review model
        const reviews = await Review.find();

        return jsonAll<IReviewModel>(res, 200, reviews);
    } catch (error) {
        next(error);
    }
};

// UPDATE A REVIEW BY ID
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = req.params.reviewId;
        const { title, content, rating } = req.body;

        // Find the review by ID using the Review model
        let review = await Review.findById(reviewId);

        if (!review) {
            throw new HttpError({
                title: 'not_found',
                detail: 'Review not found.',
                code: 404,
            });
        }

        // Update the review with the new data
        review.title = title;
        review.content = content;
        review.rating = rating;

        // Save the updated review to the database
        const updatedReview = await review.save();

        return jsonOne<IReviewModel>(res, 200, updatedReview);
    } catch (error) {
        next(error);
    }
};

// DELETE A REVIEW BY ID
const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = req.params.reviewId;

        // Find the review by ID using the Review model
        const review = await Review.findById(reviewId);

        if (!review) {
            throw new HttpError({
                title: 'not_found',
                detail: 'Review not found.',
                code: 404,
            });
        }

        // Delete the review from the database
        await review.remove();

        return jsonOne<string>(res, 200, 'Review deleted successfully.');
    } catch (error) {
        next(error);
    }
};

// EXPORT
export default {
    create,
    get,
    getAll,
    update,
    remove,
};
