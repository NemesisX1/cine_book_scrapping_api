import express from 'express';
import { ExpressValidatorMiddleware } from '../middlewares/generic-express-validator.middlewares';
import EscapeGamesController from '../controllers/escape-games/escape-games.controller';
import { query } from 'express-validator';

const router = express.Router();
const escapeController = new EscapeGamesController();


router.get(
  '/',

  query('lang').default('fr').isIn(['fr', 'en']),

  ExpressValidatorMiddleware,

  async function (req, res, _next): Promise<any> {

    /* 
     #swagger.tags = ['Escape Games']
  
     #swagger.summary = 'Fetch informations current escape games'
  
     #swagger.parameters['lang'] = {
            in: 'query',
            
            description: 'The response language',
            schema: {
                '@enum': ['fr', 'en']
            }
      }
  
      #swagger.responses[200] = {
        description: 'OK',
        schema: [
          {
            $ref: '#/definitions/TheaterEscapeGame'
          }
        ]
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
        description: 'Your body or query was bad formatted',
        schema: {
          message: 'Your body or query was bad formatted',
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

    const response = await escapeController.getAvailableTheatersEscapeGame(res);

    return response;
  }
);

export default router;
