import { getLogger } from "log4js";
import BaseController from "../abstracts/base.controller";
import { Response } from "express";
import ScrappingService from "../../services/scapping/scrapping.servive";
import {  ReasonPhrases, StatusCodes } from "http-status-codes";

export default class TheatersController implements BaseController {
   
    private logger = getLogger('TheatersController');
    private scrappingService = new ScrappingService();

    /**
     * getTheatersNames
     */
    public async  getTheatersNames(res: Response) : Promise<Response> {
        
        try {
            
            const theaters = this.scrappingService.theatersNames();
            
            return res.status(StatusCodes.OK).json(theaters);

        } catch (error) {
           
            const e = error as Error;

            this.logger.warn('getTheatersNames');
            this.logger.warn(e.message);

            return res.status(StatusCodes.BAD_REQUEST).json({
                message: ReasonPhrases.BAD_REQUEST,
                errors: e.message,
            })
        }
    }

      /**
     * getTheaterInfos
     */
      public async  getTheaterInfos(params: {theaterName: string, lang: string}, res: Response) : Promise<Response> {
        
        try {
            
            const theaterInfos = await this.scrappingService.theaterInfos(params.theaterName, params.lang);
            
            if (!theaterInfos.name) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: `${params.theaterName} was not found`,
                    errors : []
                });   
            }

            return res.status(StatusCodes.OK).json(theaterInfos);

        } catch (error) {
           
            const e = error as Error;

            this.logger.warn('getTheaterInfos');
            this.logger.warn(e.message);

            return res.status(StatusCodes.BAD_REQUEST).json({
                message: ReasonPhrases.BAD_REQUEST,
                errors: e.message,
            })
        }
    }

}