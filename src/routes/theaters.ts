import express from 'express';
import TheatersController from '../controllers/theaters/theaters.controller';
import { param, query } from 'express-validator';
import { ExpressValidatorMiddleware } from '../middlewares/generic-express-validator.middlewares';

const router = express.Router();

const theatersController = new TheatersController();

router.get(
  '/names', 
  
  async function (_req, res, _next) {
   
  // #swagger.tags = ['Theaters']

    const response = await theatersController.getTheatersNames(res);

    return response;
});


router.get(
  '/movies/:theater',

  param('theater').isString(),
  query('lang').default('fr').isIn(['fr', 'en']),

  ExpressValidatorMiddleware,

  async function (req, res, _next) {
   
  // #swagger.tags = ['Theaters']

    const params = {
      theaterName: req.params.theater,
      lang: req.query.lang as string,
    };

    console.log(params);
    
    const response = await theatersController.getMovies(params, res);

    return response;
});


router.get(
  '/movie-infos/:slug',

  param('slug').isString(),
  query('lang').default('fr').isIn(['fr', 'en']),

  ExpressValidatorMiddleware,

  async function (req, res, _next) {
   
  // #swagger.tags = ['Theaters']

    const params = {
      slug: req.params.slug,
      lang: req.query.lang as string,
    };

    const response = await theatersController.getMovieInfoBySlug(params, res);

    return response;
});


router.get(
  '/movie-diffusion-infos/:slug',

  param('slug').isString(),
  query('lang').default('fr').isIn(['fr', 'en']),

  ExpressValidatorMiddleware,

  async function (req, res, _next) {
   
  // #swagger.tags = ['Theaters']

    const params = {
      slug: req.params.slug,
      lang: req.query.lang as string,
    };

    const response = await theatersController.getMovieDiffusionInfos(params, res);

    return response;
});


export default router;
