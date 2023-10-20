import express from 'express';
import { param, query } from 'express-validator';
import { ExpressValidatorMiddleware } from '../middlewares/generic-express-validator.middlewares';
import MoviesController from '../controllers/movies/movies.controller';

const router = express.Router();

const theatersController = new MoviesController();



router.get(
  '/:theater',

  param('theater').isString(),
  query('lang').default('fr').isIn(['fr', 'en']),

  ExpressValidatorMiddleware,

  async function (req, res, _next) {

    // #swagger.tags = ['Movies']

    const params = {
      theaterName: req.params.theater,
      lang: req.query.lang as string,
    };

    const response = await theatersController.getMovies(params, res);

    return response;
  });


router.get(
  '/infos/:slug',

  param('slug').isString(),
  query('lang').default('fr').isIn(['fr', 'en']),

  ExpressValidatorMiddleware,

  async function (req, res, _next) {

    // #swagger.tags = ['Movies']

    const params = {
      slug: req.params.slug,
      lang: req.query.lang as string,
    };

    const response = await theatersController.getMovieInfoBySlug(params, res);

    return response;
  });


router.get(
  '/diffusion-infos/:slug',

  param('slug').isString(),
  query('lang').default('fr').isIn(['fr', 'en']),

  ExpressValidatorMiddleware,

  async function (req, res, _next) {

    // #swagger.tags = ['Movies']

    const params = {
      slug: req.params.slug,
      lang: req.query.lang as string,
    };

    const response = await theatersController.getMovieDiffusionInfos(params, res);

    return response;
  });


export default router;
