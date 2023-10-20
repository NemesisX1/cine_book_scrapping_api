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
  '/infos/:theater',

  param('theater').isString(),
  query('lang').default('fr').isIn(['fr', 'en']),

  ExpressValidatorMiddleware,

  async function (req, res, _next) {

    // #swagger.tags = ['Theaters']

    const params = {
      theaterName: req.params.theater,
      lang: req.query.lang as string,
    };

    const response = await theatersController.getTheaterInfos(params, res);

    return response;
  });


export default router;
