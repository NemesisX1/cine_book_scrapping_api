import express from 'express';
import { param, query } from 'express-validator';
import { ExpressValidatorMiddleware } from '../middlewares/generic-express-validator.middlewares';
import MoviesController from '../controllers/movies/movies.controller';

const router = express.Router();
const theatersController = new MoviesController();


router.get(
    '',

    query('lang').default('fr').isIn(['fr', 'en']),

    ExpressValidatorMiddleware,

    async function (req, res, _next) {

        /*
           #swagger.tags = ['Movies']

           #swagger.parameters['lang'] = {
               in: 'query',
           
               description: 'The response language',
               schema: {
                   '@enum': ['fr', 'en']
               }
           }

           #swagger.summary = 'Fetch all the available movies'
           #swagger.description = 'Fetch all the available movies'

           #swagger.responses[200] = {
               description: 'OK',
               schema: {
                   title: "The creator",
                   url: "https://example.com",
                   img: "https://example.com",
                   slug: "the-creator"
               }
           }

           #swagger.responses[400] = {
               description: 'Bad request',
               schema: {
                   message: 'Bad request',
                   errors: 'any'
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

        const response = await theatersController.getMovies(req.query.lang as string, res);

        return response;

    }

)


router.get(
    '/:theater',

    param('theaterSlug').isString(),
    query('lang').default('fr').isIn(['fr', 'en']),

    ExpressValidatorMiddleware,

    async function (req, res, _next) {

        /*
            #swagger.tags = ['Movies']

            #swagger.summary = 'Fetch all the available movies at a given theater'
            #swagger.description = 'Fetch all the available movies at a given theater'
            
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
                    $ref: '#/definitions/TheaterMovieBrief'
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
            theaterSlug: req.params.theaterSlug,
            lang: req.query.lang as string,
        };

        const response = await theatersController.getMoviesByTheater(params, res);

        return response;
    }
);


router.get(
    '/infos/:slug',

    param('slug').isString(),
    query('lang').default('fr').isIn(['fr', 'en']),

    ExpressValidatorMiddleware,

    async function (req, res, _next) {

        /*
           #swagger.tags = ['Movies']

           #swagger.summary = 'Fetch movie informations for a given movie slug'
           #swagger.description = 'Fetch movie informations for a given movie slug'
           
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
                   $ref: '#/definitions/TheaterMovie'
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
                   message: 'this slug was not found',
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
            slug: req.params.slug,
            lang: req.query.lang as string,
        };

        const response = await theatersController.getMovieInfoBySlug(params, res);

        return response;
    }
);


router.get(
    '/diffusion-infos/:slug',

    param('slug').isString(),
    query('theaterSlug').optional(),
    query('lang').default('fr').isIn(['fr', 'en']),

    ExpressValidatorMiddleware,

    async function (req, res, _next) {

        /*
          #swagger.tags = ['Movies']

          #swagger.summary = 'Fetch movie diffusion informations for a given movie slug'
          #swagger.description = 'Fetch movie diffusion informations for a given movie slug'
          
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
                  $ref: '#/definitions/TheaterMovieDiffusionInfo'
              }
          }

          #swagger.responses[400] = {
              description: 'Bad request. It also give the same answers when he didn\'t find the given theater',
              schema: {
                  message: 'Bad request',
                  errors: 'any'
              }
          }
          
          #swagger.responses[404] = {
              description: 'Not found',
              schema: {
                  message: 'This slug or theater was not found',
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
            theater: req.query.theaterSlug as string,
            slug: req.params.slug,
            lang: req.query.lang as string,
        };

        const response = await theatersController.getMovieDiffusionInfos(params, res);

        return response;
    }
);


export default router;
