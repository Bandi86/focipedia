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

import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto, CommentListResponseDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post or parent comment not found',
  })
  async createComment(
    @CurrentUser() user: any,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentService.createComment(user.id, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Comments per page' })
  @ApiQuery({ name: 'postId', required: false, type: String, description: 'Filter by post ID' })
  @ApiQuery({ name: 'authorId', required: false, type: String, description: 'Filter by author ID' })
  @ApiQuery({ name: 'parentId', required: false, type: String, description: 'Filter by parent comment ID (null for top-level)' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: CommentListResponseDto,
  })
  async getAllComments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('postId') postId?: string,
    @Query('authorId') authorId?: string,
    @Query('parentId') parentId?: string,
  ): Promise<CommentListResponseDto> {
    return this.commentService.findAllComments(page, limit, postId, authorId, parentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  async getCommentById(@Param('id') id: string): Promise<CommentResponseDto> {
    return this.commentService.findCommentById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only update your own comments',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  async updateComment(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentService.updateComment(id, user.id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only delete your own comments',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  async deleteComment(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    return this.commentService.deleteComment(id, user.id);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments by post ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Comments per page' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: CommentListResponseDto,
  })
  async getCommentsByPost(
    @Param('postId') postId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<CommentListResponseDto> {
    return this.commentService.findCommentsByPost(postId, page, limit);
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get comments by author ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Comments per page' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: CommentListResponseDto,
  })
  async getCommentsByAuthor(
    @Param('authorId') authorId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<CommentListResponseDto> {
    return this.commentService.findCommentsByAuthor(authorId, page, limit);
  }

  @Get('replies/:commentId')
  @ApiOperation({ summary: 'Get replies to a specific comment' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Replies per page' })
  @ApiResponse({
    status: 200,
    description: 'Replies retrieved successfully',
    type: CommentListResponseDto,
  })
  async getRepliesByComment(
    @Param('commentId') commentId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<CommentListResponseDto> {
    return this.commentService.findRepliesByComment(commentId, page, limit);
  }
} 