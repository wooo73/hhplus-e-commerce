import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

interface IResponseError {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
    method: string;
}

const globalResponseError: (
    statusCode: number,
    message: string,
    request: Request,
) => IResponseError = (statusCode: number, message: string, request: Request): IResponseError => {
    return {
        statusCode: statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
    };
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let message = (exception as any)?.message;
        let status: number =
            (exception as any)?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

        const ec = exception;
        if (ec instanceof HttpException) {
            status = (exception as HttpException).getStatus();
            message = (exception as any).getResponse()?.message
                ? (exception as any)?.getResponse().message
                : (exception as any).getResponse();
        }

        if (ec instanceof PrismaClientKnownRequestError) {
            status = HttpStatus.BAD_GATEWAY;
            message = ec.message;
        }

        response.status(status).json(globalResponseError(status, message, request));
    }
}
