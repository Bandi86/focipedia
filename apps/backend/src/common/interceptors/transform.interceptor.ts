import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '../dto/base.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, BaseResponseDto>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponseDto> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: 'Operation completed successfully',
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
} 