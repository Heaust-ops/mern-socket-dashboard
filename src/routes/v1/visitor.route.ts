import { Router } from 'express';
import { visitorController } from '../../controllers';
import validate from '../../middlewares/validationMiddleware';
import { visitorValidatior } from '../../validation/visitor';

// VISITOR ROUTES
const _router: Router = Router({ mergeParams: true });

// CREATE A NEW VISITOR
_router.route('/').post(validate(visitorValidatior), visitorController.create);

// GET ALL VISITORS
_router.route('/').get(visitorController.getAll);

// GET A SINGLE VISITOR BY ID
_router.route('/:visitorId').get(visitorController.get);

// UPDATE VISITOR DATA BY ID
_router
    .route('/:visitorId')
    .put(validate(visitorValidatior), visitorController.update);

// DELETE VISITOR DATA BY ID
_router.route('/:visitorId').delete(visitorController.remove);

// GET VISITORS FOR THE LAST HOUR
_router.route('/hourly').get(visitorController.getHourly);

// GET VISITORS FOR THE LAST DAY
_router.route('/daily').get(visitorController.getDaily);

// GET VISITORS FOR THE LAST WEEK
_router.route('/weekly').get(visitorController.getWeekly);

// GET VISITORS FOR THE LAST MONTH
_router.route('/monthly').get(visitorController.getMonthly);

// EXPORT
export const router = _router;
