import path from 'path';
import log4js from 'log4js';
import { configure } from 'log4js';
export { getLogger } from 'log4js';

export function bootstrapLogger() {
  const date = new Date();
  const strDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'file', filename: path.join(__dirname, '..', 'logs', `${strDate}.log`) }
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'debug' }
    }
  });

  const logger = log4js.getLogger();
  logger.level = 'debug';
}
