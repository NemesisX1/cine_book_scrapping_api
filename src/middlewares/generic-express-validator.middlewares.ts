import {NextFunction, Request, Response} from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export function ExpressValidatorMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      
        console.log({
            'message': 'Your body or query was bad formatted',
            ...errors,
        });
        
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(
            {   'message': 'Your body or query was bad formatted',
                'errors': ({...errors} as any).errors,
            },
        );
    }
    
    next();
}