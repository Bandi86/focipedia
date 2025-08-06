import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto, CommentListResponseDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(authorId: string, createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    // Verify that the post exists
    const post = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // If this is a reply, verify that the parent comment exists
    if (createCommentDto.parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }

      // Ensure the parent comment belongs to the same post
      if (parentComment.postId !== createCommentDto.postId) {
        throw new ForbiddenException('Parent comment must belong to the same post');
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        authorId,
        postId: createCommentDto.postId,
        parentId: createCommentDto.parentId,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return this.mapToCommentResponseDto(comment);
  }

  async findAllComments(
    page: number = 1,
    limit: number = 20,
    postId?: string,
    authorId?: string,
    parentId?: string,
  ): Promise<CommentListResponseDto> {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (postId) where.postId = postId;
    if (authorId) where.authorId = authorId;
    if (parentId !== undefined) {
      if (parentId === null) {
        where.parentId = null; // Top-level comments only
      } else {
        where.parentId = parentId; // Replies to specific comment
      }
    }

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
      }),
      this.prisma.comment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      comments: comments.map(comment => this.mapToCommentResponseDto(comment)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findCommentById(id: string): Promise<CommentResponseDto> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.mapToCommentResponseDto(comment);
  }

  async updateComment(id: string, userId: string, updateCommentDto: UpdateCommentDto): Promise<CommentResponseDto> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return this.mapToCommentResponseDto(updatedComment);
  }

  async deleteComment(id: string, userId: string): Promise<{ message: string }> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Delete the comment and all its replies (cascade)
    await this.prisma.comment.delete({
      where: { id },
    });

    return { message: 'Comment deleted successfully' };
  }

  async findCommentsByPost(postId: string, page: number = 1, limit: number = 20): Promise<CommentListResponseDto> {
    return this.findAllComments(page, limit, postId);
  }

  async findCommentsByAuthor(authorId: string, page: number = 1, limit: number = 20): Promise<CommentListResponseDto> {
    return this.findAllComments(page, limit, undefined, authorId);
  }

  async findRepliesByComment(commentId: string, page: number = 1, limit: number = 20): Promise<CommentListResponseDto> {
    return this.findAllComments(page, limit, undefined, undefined, commentId);
  }

  private mapToCommentResponseDto(comment: any): CommentResponseDto {
    return {
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      authorUsername: comment.author.profile?.username || 'Unknown',
      authorDisplayName: comment.author.profile?.displayName || 'Unknown',
      postId: comment.postId,
      parentId: comment.parentId,
      replyCount: comment._count.replies,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
} 