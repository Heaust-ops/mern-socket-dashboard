import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne, jsonAll } from '../utils/general';
import Visitor, { IVisitorModel } from '../models/visitors';

// CREATE A NEW VISITOR
const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ipAddress, browser, location, referrer } = req.body;

        // Create a new visitor using the Visitor model
        const newVisitor = new Visitor({
            ipAddress,
            browser,
            location,
            referrer,
        });

        // Save the visitor data to the database
        const savedVisitor = await newVisitor.save();

        return jsonOne<IVisitorModel>(res, 201, savedVisitor);
    } catch (error) {
        next(error);
    }
};

// GET A SINGLE VISITOR BY ID
const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitorId = req.params.visitorId;

        // Find the visitor data by ID using the Visitor model
        const visitor = await Visitor.findById(visitorId);

        if (!visitor) {
            throw new HttpError({
                title: 'not_found',
                detail: 'Visitor data not found.',
                code: 404,
            });
        }

        return jsonOne<IVisitorModel>(res, 200, visitor);
    } catch (error) {
        next(error);
    }
};

// GET ALL VISITORS
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find all visitors data using the Visitor model
        const visitors = await Visitor.find();

        return jsonAll<IVisitorModel>(res, 200, visitors);
    } catch (error) {
        next(error);
    }
};

// UPDATE VISITOR DATA BY ID
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitorId = req.params.visitorId;
        const { ipAddress, browser, location, referrer } = req.body;

        // Find the visitor data by ID using the Visitor model
        let visitor = await Visitor.findById(visitorId);

        if (!visitor) {
            throw new HttpError({
                title: 'not_found',
                detail: 'Visitor data not found.',
                code: 404,
            });
        }

        // Update the visitor data with the new data
        visitor.ipAddress = ipAddress;
        visitor.browser = browser;
        visitor.location = location;
        visitor.referrer = referrer;

        // Save the updated visitor data to the database
        const updatedVisitor = await visitor.save();

        return jsonOne<IVisitorModel>(res, 200, updatedVisitor);
    } catch (error) {
        next(error);
    }
};

// DELETE VISITOR DATA BY ID
const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitorId = req.params.visitorId;

        // Find the visitor data by ID using the Visitor model
        const visitor = await Visitor.findById(visitorId);

        if (!visitor) {
            throw new HttpError({
                title: 'not_found',
                detail: 'Visitor data not found.',
                code: 404,
            });
        }

        // Delete the visitor data from the database
        await visitor.remove();

        return jsonOne<string>(res, 200, 'Visitor data deleted successfully.');
    } catch (error) {
        next(error);
    }
};

// Function to get visitors based on a time frame
const getVisitorsByTimeFrame = async (
    _: Request,
    res: Response,
    next: NextFunction,
    timeFrameInMilliseconds: number
) => {
    try {
        const end = new Date();
        const start = new Date(end.getTime() - timeFrameInMilliseconds);

        const visitors = await Visitor.find({
            timestamp: {
                $gte: start,
                $lt: end,
            },
        });

        return jsonAll<IVisitorModel>(res, 200, visitors);
    } catch (error) {
        next(error);
    }
};

// GET VISITORS FOR THE LAST HOUR
const getHourly = async (req: Request, res: Response, next: NextFunction) => {
    return await getVisitorsByTimeFrame(req, res, next, 3600000);
};

// GET VISITORS FOR THE LAST DAY
const getDaily = async (req: Request, res: Response, next: NextFunction) => {
    return await getVisitorsByTimeFrame(req, res, next, 86400000);
};

// GET VISITORS FOR THE LAST WEEK
const getWeekly = async (req: Request, res: Response, next: NextFunction) => {
    return await getVisitorsByTimeFrame(req, res, next, 604800000);
};

// GET VISITORS FOR THE LAST MONTH
const getMonthly = async (req: Request, res: Response, next: NextFunction) => {
    return await getVisitorsByTimeFrame(req, res, next, 2592000000);
};

// EXPORT
export default {
    create,
    get,
    getAll,
    update,
    remove,
    getHourly,
    getDaily,
    getWeekly,
    getMonthly,
};
