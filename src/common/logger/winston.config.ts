import winston from 'winston';
import 'winston-daily-rotate-file';

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, ip, level, message, trace, context }) => {
                if (level.includes('debug')) {
                    return `[Level]: ${level} [Context]: ${context || ''} [Message]: ${message}`;
                }

                return `[Timestamp]: ${timestamp} [Ip]: ${ip} [Level]: ${level} [Message]: ${message}${trace ? `\n[Trace]: ${trace}` : ''}`;
            }),
        ),
    }),

    new winston.transports.DailyRotateFile({
        filename: 'logs/info/application-%DATE%.log',
        level: 'info',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.DailyRotateFile({
        filename: 'logs/errors/application-%DATE%.log',
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
];

export const logger = winston.createLogger({
    level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    format: winston.format.json(),
    transports,
});
