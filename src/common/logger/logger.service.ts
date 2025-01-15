import { Injectable } from '@nestjs/common';
import { logger } from './winston.config';
import { Request } from 'express';

@Injectable()
export class LoggerService {
    info(req: Request, message: string) {
        const ip = req.ip;
        logger.info(message, { ip });
    }

    error(req: Request, err: any) {
        const ip = req.ip;
        const message = `${err.message} { Request: params: ${JSON.stringify(req?.params)} query: ${JSON.stringify(req?.query)} body: ${JSON.stringify(req?.body)} }`;
        const trace = err.stack;

        logger.error(message, { ip, trace });
    }

    warn(message: string, context?: string) {
        logger.warn(message, { context });
    }

    debug(message: string | object, context?: string) {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        logger.debug(message, { context });
    }
}
