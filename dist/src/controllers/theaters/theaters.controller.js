"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
const scrapping_servive_1 = __importDefault(require("../../services/scapping/scrapping.servive"));
const http_status_codes_1 = require("http-status-codes");
class TheatersController {
    constructor() {
        this.logger = (0, log4js_1.getLogger)('TheatersController');
        this.scrappingService = new scrapping_servive_1.default();
    }
    /**
     * getTheatersNames
     */
    async getTheatersNames(res) {
        try {
            const theaters = this.scrappingService.theatersNames();
            return res.status(http_status_codes_1.StatusCodes.OK).json(theaters);
        }
        catch (error) {
            const e = error;
            this.logger.warn('getTheatersNames');
            this.logger.warn(e.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errors: e.message,
            });
        }
    }
    /**
     * getMovies
     */
    async getMovies(params, res) {
        try {
            const movies = await this.scrappingService.movies(params.theaterName, params.lang);
            return res.status(http_status_codes_1.StatusCodes.OK).json(movies);
        }
        catch (error) {
            const e = error;
            this.logger.warn('getMovies');
            this.logger.warn(e.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errors: e.message,
            });
        }
    }
    /**
   * getMovieInfoBySlug
   */
    async getMovieInfoBySlug(params, res) {
        try {
            const infos = await this.scrappingService.movieInfoBySlug(params.slug, params.lang);
            return res.status(http_status_codes_1.StatusCodes.OK).json(infos);
        }
        catch (error) {
            const e = error;
            this.logger.warn('getMovieInfoBySlug');
            this.logger.warn(e.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errors: e.message,
            });
        }
    }
    /**
   * getMovieInfoBySlug
   */
    async getMovieDiffusionInfos(params, res) {
        try {
            const infos = await this.scrappingService.movieDiffusionInfos(params.slug, params.lang);
            return res.status(http_status_codes_1.StatusCodes.OK).json(infos);
        }
        catch (error) {
            const e = error;
            this.logger.warn('getMovieDiffusionInfos');
            this.logger.warn(e.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errors: e.message,
            });
        }
    }
}
exports.default = TheatersController;
