import createError from 'http-errors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger-output.json';
import express, { RequestHandler, ErrorRequestHandler  } from 'express';
import statusMonitor from "express-status-monitor";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from "cors";
import helmet from 'helmet';
import indexRouter from './routes/index';
import theatersRouter from './routes/theaters';
import moviesRouter from './routes/movies';
import escapeGamesRouter from './routes/escape-games';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routerSetup();
    this.errorHandler();
  }

  private config() {

    this.app.use(statusMonitor(
      {
        title: 'Ciné Book API Monitor',
        path: '/monitor',
        chartVisibility: {
          cpu: false,
          mem: false,
          load: false,
          heap: false,
          responseTime: true,
          rps: true,
          statusCodes: true
        },
      }
    ));
   
    // sentry configuration for api performance monitoring
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
          // enable HTTP calls tracing
          new Sentry.Integrations.Http({ tracing: true }),
          // enable Express.js middleware tracing
          new Sentry.Integrations.Express(this),
          new ProfilingIntegration(),
          ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0,
        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
      });
    }


    // view engine setup
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');

    
    this.app.use(logger('dev'));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));

 
  }

  private routerSetup() {

    this.app.use('/', indexRouter);
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    this.app.use('/movies', moviesRouter);
    this.app.use('/theaters', theatersRouter);
    this.app.use('/escape-games', escapeGamesRouter);
    
  }

  private errorHandler() {
    // catch 404 and forward to error handler
    const requestHandler: RequestHandler = function (_req, _res, next) {
      next(createError(404));
    };
    this.app.use(requestHandler);

    // error handler
    const errorRequestHandler: ErrorRequestHandler = function (
      err,
      req,
      res,
      _next
    ) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    };
    this.app.use(errorRequestHandler);
  }
}

export default new App().app;

