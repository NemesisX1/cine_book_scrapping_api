"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const theaters_controller_1 = __importDefault(require("../controllers/theaters/theaters.controller"));
const express_validator_1 = require("express-validator");
const generic_express_validator_middlewares_1 = require("../middlewares/generic-express-validator.middlewares");
const router = express_1.default.Router();
const theatersController = new theaters_controller_1.default();
router.get('/names', async function (_req, res, _next) {
    // #swagger.tags = ['Theaters']
    const response = await theatersController.getTheatersNames(res);
    return response;
});
router.get('/movies/:theater', (0, express_validator_1.param)('theater').isString(), (0, express_validator_1.query)('lang').default('fr').isIn(['fr', 'en']), generic_express_validator_middlewares_1.ExpressValidatorMiddleware, async function (req, res, _next) {
    // #swagger.tags = ['Theaters']
    const params = {
        theaterName: req.params.theater,
        lang: req.query.lang,
    };
    console.log(params);
    const response = await theatersController.getMovies(params, res);
    return response;
});
router.get('/movie-infos/:slug', (0, express_validator_1.param)('slug').isString(), (0, express_validator_1.query)('lang').default('fr').isIn(['fr', 'en']), generic_express_validator_middlewares_1.ExpressValidatorMiddleware, async function (req, res, _next) {
    // #swagger.tags = ['Theaters']
    const params = {
        slug: req.params.slug,
        lang: req.query.lang,
    };
    const response = await theatersController.getMovieInfoBySlug(params, res);
    return response;
});
router.get('/movie-diffusion-infos/:slug', (0, express_validator_1.param)('slug').isString(), (0, express_validator_1.query)('lang').default('fr').isIn(['fr', 'en']), generic_express_validator_middlewares_1.ExpressValidatorMiddleware, async function (req, res, _next) {
    // #swagger.tags = ['Theaters']
    const params = {
        slug: req.params.slug,
        lang: req.query.lang,
    };
    const response = await theatersController.getMovieDiffusionInfos(params, res);
    return response;
});
exports.default = router;
