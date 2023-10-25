import express from 'express';
import TheatersController from '../controllers/theaters/theaters.controller';
import { param, query } from 'express-validator';
import { ExpressValidatorMiddleware } from '../middlewares/generic-express-validator.middlewares';

const router = express.Router();

const theatersController = new TheatersController();

router.get(
  '/names',

  async function (_req, res, _next) {

    /*
      #swagger.tags = ['Theaters']

      #swagger.summary = 'Fetch all the available theaters name'

      #swagger.description = 'Return an array of strings with the theaters name'

      #swagger.responses[200] = { 
        description: 'Ok' ,
        schema: [
          {
            $ref: '#/definitions/TheaterName'
          }
        ]
      }

      #swagger.responses[400] = { 
        description: 'Bad Request' ,
        schema: {
          message: 'Bad Request',
          errors: 'any'
        }
        
      }
    
    */



    const response = await theatersController.getTheatersNames(res);

    return response;
  }
);


router.get(
  '/infos/:theater',

  param('theater').isString(),
  query('lang').default('fr').isIn(['fr', 'en']),

  ExpressValidatorMiddleware,

  async function (req, res, _next) {

    /* 
     #swagger.tags = ['Theaters']

     #swagger.summary = 'Fetch informations about a specified theater giving his name'

     #swagger.description = 'Fetch informations about a specified theater giving his name'
    
     #swagger.parameters['lang'] = {
            in: 'query',
            
            description: 'The response language',
            schema: {
                '@enum': ['fr', 'en']
            }
      }

      #swagger.responses[200] = {
        description: 'OK',
        schema: {
          $ref: '#/definitions/TheaterInfos'
        }
     }

      #swagger.responses[400] = {
        description: 'Bad request',
        schema: {
          message: 'Bad request',
          errors: 'any'
        }
     }

     #swagger.responses[404] = {
        description: 'Not found',
        schema: {
          message: 'Theater not found',
          errors: []
        }
     }

     #swagger.responses[422] = {
        description: 'Your body was bad formatted',
        schema: {
          message: 'Your body was bad formatted',
          errors: [
            {
            type: 'field',
            value: 'zk',
            msg: 'Invalid value',
            path: 'lang',
            location: 'query'
            }
          ]
        }
     }

  */

    const params = {
      theaterName: req.params.theater,
      lang: req.query.lang as string,
    };

    const response = await theatersController.getTheaterInfos(params, res);

    return response;
  }
);


export default router;
