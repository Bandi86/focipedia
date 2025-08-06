import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, PostResponseDto, PostListResponseDto } from './dto/post.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  async createPost(
    @CurrentUser() user: any,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.createPost(user.id, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Posts per page' })
  @ApiQuery({ name: 'authorId', required: false, type: String, description: 'Filter by author ID' })
  @ApiQuery({ name: 'isPublished', required: false, type: Boolean, description: 'Filter by published status' })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    type: PostListResponseDto,
  })
  async getAllPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('authorId') authorId?: string,
    @Query('isPublished') isPublished?: string,
  ): Promise<PostListResponseDto> {
    const isPublishedBool = isPublished ? isPublished === 'true' : undefined;
    return this.postService.findAllPosts(page, limit, authorId, isPublishedBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async getPostById(@Param('id') id: string): Promise<PostResponseDto> {
    return this.postService.findPostById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only update your own posts',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async updatePost(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.updatePost(id, user.id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only delete your own posts',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async deletePost(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    return this.postService.deletePost(id, user.id);
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get posts by author ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Posts per page' })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    type: PostListResponseDto,
  })
  async getPostsByAuthor(
    @Param('authorId') authorId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PostListResponseDto> {
    return this.postService.findPostsByAuthor(authorId, page, limit);
  }
} 