import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req?.method;
    const url = req?.originalUrl || req?.url;

    return next.handle().pipe(
      tap(() => {
        const elapsedMs = Date.now() - now;
        console.log(`[${method}] ${url} ${elapsedMs}ms`);
      }),
    );
  }
}
