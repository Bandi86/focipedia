import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment content', minLength: 1, maxLength: 2000 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;

  @ApiProperty({ description: 'Post ID' })
  @IsString()
  @IsNotEmpty()
  postId!: string;

  @ApiProperty({ description: 'Parent comment ID for replies', required: false })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateCommentDto {
  @ApiProperty({ description: 'Comment content', minLength: 1, maxLength: 2000 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;
}

export class CommentResponseDto {
  @ApiProperty({ description: 'Comment ID' })
  id!: string;

  @ApiProperty({ description: 'Comment content' })
  content!: string;

  @ApiProperty({ description: 'Author ID' })
  authorId!: string;

  @ApiProperty({ description: 'Author username' })
  authorUsername!: string;

  @ApiProperty({ description: 'Author display name' })
  authorDisplayName!: string;

  @ApiProperty({ description: 'Post ID' })
  postId!: string;

  @ApiProperty({ description: 'Parent comment ID', required: false })
  parentId?: string;

  @ApiProperty({ description: 'Number of replies' })
  replyCount!: number;

  @ApiProperty({ description: 'Comment creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class CommentListResponseDto {
  @ApiProperty({ description: 'List of comments', type: [CommentResponseDto] })
  comments!: CommentResponseDto[];

  @ApiProperty({ description: 'Total number of comments' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Number of comments per page' })
  limit!: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages!: number;
} 