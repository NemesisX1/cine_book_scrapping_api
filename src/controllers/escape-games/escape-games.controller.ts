import { Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getLogger } from "log4js";
import BaseController from "../abstracts/base.controller";
import ScrappingService from "../../services/scapping/scrapping.servive";

export default class EscapeGamesController implements BaseController {

    private logger = getLogger('EscapeGamesController');
    private scrappingService = new ScrappingService();


    public async getAvailableTheatersEscapeGame(res: Response): Promise<Response> {
       
        try {
       
            const data = await this.scrappingService.availableTheatersEscapeGame();
          
            if (data.length == 0) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: `No escape games was found`,
                    errors: []
                });
            }
          
            return res.status(StatusCodes.OK).json(data);

        } catch (error) {
            
            console.log(error);
            
            const e = error as Error;

            this.logger.warn('getAvailableTheatersEscapeGame');
            this.logger.warn(e.message);

            return res.status(StatusCodes.BAD_REQUEST).json({
                message: ReasonPhrases.BAD_REQUEST,
                errors: e.message,
            })
        }
    }
}