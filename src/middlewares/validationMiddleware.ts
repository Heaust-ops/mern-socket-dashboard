import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(
            validations.map((validation: ValidationChain) => validation.run(req))
        );
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const response = errors.array().map((error) => {
            return {
                title: error.param,
                detail: error.msg,
                code: 422,
            };
        });
        res.status(422).json({ errors: response });
    };
};

export default validate;
