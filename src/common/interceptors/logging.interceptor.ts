import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const now = Date.now();
        const method = req.method;
        const url = req.url;

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();

                const statusCode = response.statusCode;
                const delay = Date.now() - now;
                this.logger.info(req, `${method} ${url} ${statusCode} ${delay}ms`);
            }),
            catchError((err) => {
                this.logger.globalError(req, err);
                return throwError(() => err);
            }),
        );
    }
}
