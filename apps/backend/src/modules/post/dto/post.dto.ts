import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Post title', minLength: 1, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ description: 'Post content', minLength: 1, maxLength: 10000 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  content!: string;

  @ApiProperty({ description: 'Whether the post is published', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdatePostDto {
  @ApiProperty({ description: 'Post title', minLength: 1, maxLength: 200, required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ApiProperty({ description: 'Post content', minLength: 1, maxLength: 10000, required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  content?: string;

  @ApiProperty({ description: 'Whether the post is published', required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class PostResponseDto {
  @ApiProperty({ description: 'Post ID' })
  id!: string;

  @ApiProperty({ description: 'Post title' })
  title!: string;

  @ApiProperty({ description: 'Post content' })
  content!: string;

  @ApiProperty({ description: 'Author ID' })
  authorId!: string;

  @ApiProperty({ description: 'Author username' })
  authorUsername!: string;

  @ApiProperty({ description: 'Author display name' })
  authorDisplayName!: string;

  @ApiProperty({ description: 'Whether the post is published' })
  isPublished!: boolean;

  @ApiProperty({ description: 'Number of comments' })
  commentCount!: number;

  @ApiProperty({ description: 'Post creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class PostListResponseDto {
  @ApiProperty({ description: 'List of posts', type: [PostResponseDto] })
  posts!: PostResponseDto[];

  @ApiProperty({ description: 'Total number of posts' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Number of posts per page' })
  limit!: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages!: number;
} 