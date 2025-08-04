import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({ description: 'Success status' })
  success!: boolean;

  @ApiProperty({ description: 'Response message' })
  message!: string;

  @ApiProperty({ description: 'Response data' })
  data?: any;

  @ApiProperty({ description: 'Error details if any' })
  error?: string;
}

export class PaginationDto {
  @ApiProperty({ description: 'Page number', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit!: number;

  @ApiProperty({ description: 'Total items', example: 100 })
  total!: number;

  @ApiProperty({ description: 'Total pages', example: 10 })
  totalPages!: number;
}

export class PaginatedResponseDto<T> extends BaseResponseDto {
  @ApiProperty({ description: 'Pagination information' })
  pagination!: PaginationDto;

  @ApiProperty({ description: 'Array of items' })
  declare data: T[];
} 