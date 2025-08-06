import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreatePostDto, UpdatePostDto, PostResponseDto, PostListResponseDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(authorId: string, createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        isPublished: createPostDto.isPublished ?? true,
        authorId,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return this.mapToPostResponseDto(post);
  }

  async findAllPosts(
    page: number = 1,
    limit: number = 10,
    authorId?: string,
    isPublished?: boolean,
  ): Promise<PostListResponseDto> {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (authorId) where.authorId = authorId;
    if (isPublished !== undefined) where.isPublished = isPublished;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts: posts.map(post => this.mapToPostResponseDto(post)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findPostById(id: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.mapToPostResponseDto(post);
  }

  async updatePost(id: string, userId: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return this.mapToPostResponseDto(updatedPost);
  }

  async deletePost(id: string, userId: string): Promise<{ message: string }> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Post deleted successfully' };
  }

  async findPostsByAuthor(authorId: string, page: number = 1, limit: number = 10): Promise<PostListResponseDto> {
    return this.findAllPosts(page, limit, authorId);
  }

  private mapToPostResponseDto(post: any): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorUsername: post.author.profile?.username || 'Unknown',
      authorDisplayName: post.author.profile?.displayName || 'Unknown',
      isPublished: post.isPublished,
      commentCount: post._count.comments,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
} 