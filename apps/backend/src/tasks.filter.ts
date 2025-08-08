import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class TasksFilter<T> implements ExceptionFilter {
  catch(_exception: T, _host: ArgumentsHost) {}
}
