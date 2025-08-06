import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaService } from '../../config/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    profile: {
      username: 'testuser',
      displayName: 'Test User',
    },
  };

  const mockPost = {
    id: 'post-1',
    title: 'Test Post',
    content: 'Test content',
    authorId: 'user-1',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: mockUser,
    _count: {
      comments: 5,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
        isPublished: true,
      };

      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.createPost('user-1', createPostDto);

      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          isPublished: createPostDto.isPublished,
          authorId: 'user-1',
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

      expect(result).toEqual({
        id: mockPost.id,
        title: mockPost.title,
        content: mockPost.content,
        authorId: mockPost.authorId,
        authorUsername: mockUser.profile.username,
        authorDisplayName: mockUser.profile.displayName,
        isPublished: mockPost.isPublished,
        commentCount: mockPost._count.comments,
        createdAt: mockPost.createdAt,
        updatedAt: mockPost.updatedAt,
      });
    });

    it('should create a post with default isPublished value', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
      };

      const mockPostWithDefault = { ...mockPost, isPublished: true };
      mockPrismaService.post.create.mockResolvedValue(mockPostWithDefault);

      await service.createPost('user-1', createPostDto);

      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          isPublished: true,
          authorId: 'user-1',
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
    });
  });

  describe('findAllPosts', () => {
    it('should return paginated posts', async () => {
      const mockPosts = [mockPost];
      const mockTotal = 1;

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(mockTotal);

      const result = await service.findAllPosts(1, 10);

      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
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
      });

      expect(result).toEqual({
        posts: [{
          id: mockPost.id,
          title: mockPost.title,
          content: mockPost.content,
          authorId: mockPost.authorId,
          authorUsername: mockUser.profile.username,
          authorDisplayName: mockUser.profile.displayName,
          isPublished: mockPost.isPublished,
          commentCount: mockPost._count.comments,
          createdAt: mockPost.createdAt,
          updatedAt: mockPost.updatedAt,
        }],
        total: mockTotal,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter posts by authorId', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(0);

      await service.findAllPosts(1, 10, 'user-1');

      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: { authorId: 'user-1' },
        skip: 0,
        take: 10,
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
      });
    });

    it('should filter posts by isPublished', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(0);

      await service.findAllPosts(1, 10, undefined, true);

      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: { isPublished: true },
        skip: 0,
        take: 10,
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
      });
    });
  });

  describe('findPostById', () => {
    it('should return a post by id', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      const result = await service.findPostById('post-1');

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 'post-1' },
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

      expect(result).toEqual({
        id: mockPost.id,
        title: mockPost.title,
        content: mockPost.content,
        authorId: mockPost.authorId,
        authorUsername: mockUser.profile.username,
        authorDisplayName: mockUser.profile.displayName,
        isPublished: mockPost.isPublished,
        commentCount: mockPost._count.comments,
        createdAt: mockPost.createdAt,
        updatedAt: mockPost.updatedAt,
      });
    });

    it('should throw NotFoundException when post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.findPostById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        content: 'Updated content',
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue({
        ...mockPost,
        ...updatePostDto,
      });

      const result = await service.updatePost('post-1', 'user-1', updatePostDto);

      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
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

      expect(result.title).toBe(updatePostDto.title);
      expect(result.content).toBe(updatePostDto.content);
    });

    it('should throw NotFoundException when post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(
        service.updatePost('non-existent', 'user-1', { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not the author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      await expect(
        service.updatePost('post-1', 'different-user', { title: 'Updated' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await service.deletePost('post-1', 'user-1');

      expect(prismaService.post.delete).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      });

      expect(result).toEqual({ message: 'Post deleted successfully' });
    });

    it('should throw NotFoundException when post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(
        service.deletePost('non-existent', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not the author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      await expect(
        service.deletePost('post-1', 'different-user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findPostsByAuthor', () => {
    it('should call findAllPosts with authorId', async () => {
      const spy = jest.spyOn(service, 'findAllPosts').mockResolvedValue({
        posts: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      await service.findPostsByAuthor('user-1', 1, 10);

      expect(spy).toHaveBeenCalledWith(1, 10, 'user-1');
    });
  });
}); 