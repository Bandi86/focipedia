import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PrismaService } from '../../config/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

describe('CommentService', () => {
  let service: CommentService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    post: {
      findUnique: jest.fn(),
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
  };

  const mockComment = {
    id: 'comment-1',
    content: 'Test comment',
    authorId: 'user-1',
    postId: 'post-1',
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: mockUser,
    _count: {
      replies: 2,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        postId: 'post-1',
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.comment.create.mockResolvedValue(mockComment);

      const result = await service.createComment('user-1', createCommentDto);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: createCommentDto.postId },
      });

      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: createCommentDto.content,
          authorId: 'user-1',
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

      expect(result).toEqual({
        id: mockComment.id,
        content: mockComment.content,
        authorId: mockComment.authorId,
        authorUsername: mockUser.profile.username,
        authorDisplayName: mockUser.profile.displayName,
        postId: mockComment.postId,
        parentId: mockComment.parentId,
        replyCount: mockComment._count.replies,
        createdAt: mockComment.createdAt,
        updatedAt: mockComment.updatedAt,
      });
    });

    it('should create a reply comment successfully', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test reply',
        postId: 'post-1',
        parentId: 'comment-1',
      };

      const mockParentComment = {
        id: 'comment-1',
        postId: 'post-1',
      };

      const mockReplyComment = {
        ...mockComment,
        id: 'comment-2',
        content: 'Test reply',
        parentId: 'comment-1',
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.comment.findUnique.mockResolvedValue(mockParentComment);
      mockPrismaService.comment.create.mockResolvedValue(mockReplyComment);

      const result = await service.createComment('user-1', createCommentDto);

      expect(prismaService.comment.findUnique).toHaveBeenCalledWith({
        where: { id: createCommentDto.parentId },
      });

      expect(result.parentId).toBe('comment-1');
    });

    it('should throw NotFoundException when post not found', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        postId: 'non-existent',
      };

      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(
        service.createComment('user-1', createCommentDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when parent comment not found', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test reply',
        postId: 'post-1',
        parentId: 'non-existent',
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.createComment('user-1', createCommentDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when parent comment belongs to different post', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test reply',
        postId: 'post-1',
        parentId: 'comment-1',
      };

      const mockParentComment = {
        id: 'comment-1',
        postId: 'different-post',
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.comment.findUnique.mockResolvedValue(mockParentComment);

      await expect(
        service.createComment('user-1', createCommentDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllComments', () => {
    it('should return paginated comments', async () => {
      const mockComments = [mockComment];
      const mockTotal = 1;

      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);
      mockPrismaService.comment.count.mockResolvedValue(mockTotal);

      const result = await service.findAllComments(1, 20);

      expect(prismaService.comment.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 20,
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
      });

      expect(result).toEqual({
        comments: [{
          id: mockComment.id,
          content: mockComment.content,
          authorId: mockComment.authorId,
          authorUsername: mockUser.profile.username,
          authorDisplayName: mockUser.profile.displayName,
          postId: mockComment.postId,
          parentId: mockComment.parentId,
          replyCount: mockComment._count.replies,
          createdAt: mockComment.createdAt,
          updatedAt: mockComment.updatedAt,
        }],
        total: mockTotal,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should filter comments by postId', async () => {
      mockPrismaService.comment.findMany.mockResolvedValue([]);
      mockPrismaService.comment.count.mockResolvedValue(0);

      await service.findAllComments(1, 20, 'post-1');

      expect(prismaService.comment.findMany).toHaveBeenCalledWith({
        where: { postId: 'post-1' },
        skip: 0,
        take: 20,
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
      });
    });

    it('should filter comments by authorId', async () => {
      mockPrismaService.comment.findMany.mockResolvedValue([]);
      mockPrismaService.comment.count.mockResolvedValue(0);

      await service.findAllComments(1, 20, undefined, 'user-1');

      expect(prismaService.comment.findMany).toHaveBeenCalledWith({
        where: { authorId: 'user-1' },
        skip: 0,
        take: 20,
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
      });
    });

    it('should filter top-level comments when parentId is null', async () => {
      mockPrismaService.comment.findMany.mockResolvedValue([]);
      mockPrismaService.comment.count.mockResolvedValue(0);

      await service.findAllComments(1, 20, undefined, undefined, 'null');

      expect(prismaService.comment.findMany).toHaveBeenCalledWith({
        where: { parentId: 'null' },
        skip: 0,
        take: 20,
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
      });
    });

    it('should filter replies when parentId is specified', async () => {
      mockPrismaService.comment.findMany.mockResolvedValue([]);
      mockPrismaService.comment.count.mockResolvedValue(0);

      await service.findAllComments(1, 20, undefined, undefined, 'comment-1');

      expect(prismaService.comment.findMany).toHaveBeenCalledWith({
        where: { parentId: 'comment-1' },
        skip: 0,
        take: 20,
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
      });
    });
  });

  describe('findCommentById', () => {
    it('should return a comment by id', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

      const result = await service.findCommentById('comment-1');

      expect(prismaService.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
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

      expect(result).toEqual({
        id: mockComment.id,
        content: mockComment.content,
        authorId: mockComment.authorId,
        authorUsername: mockUser.profile.username,
        authorDisplayName: mockUser.profile.displayName,
        postId: mockComment.postId,
        parentId: mockComment.parentId,
        replyCount: mockComment._count.replies,
        createdAt: mockComment.createdAt,
        updatedAt: mockComment.updatedAt,
      });
    });

    it('should throw NotFoundException when comment not found', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(service.findCommentById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateComment', () => {
    it('should update a comment successfully', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated comment',
      };

      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
      mockPrismaService.comment.update.mockResolvedValue({
        ...mockComment,
        ...updateCommentDto,
      });

      const result = await service.updateComment('comment-1', 'user-1', updateCommentDto);

      expect(prismaService.comment.update).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
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

      expect(result.content).toBe(updateCommentDto.content);
    });

    it('should throw NotFoundException when comment not found', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.updateComment('non-existent', 'user-1', { content: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not the author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

      await expect(
        service.updateComment('comment-1', 'different-user', { content: 'Updated' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment successfully', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
      mockPrismaService.comment.delete.mockResolvedValue(mockComment);

      const result = await service.deleteComment('comment-1', 'user-1');

      expect(prismaService.comment.delete).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
      });

      expect(result).toEqual({ message: 'Comment deleted successfully' });
    });

    it('should throw NotFoundException when comment not found', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteComment('non-existent', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not the author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

      await expect(
        service.deleteComment('comment-1', 'different-user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findCommentsByPost', () => {
    it('should call findAllComments with postId', async () => {
      const spy = jest.spyOn(service, 'findAllComments').mockResolvedValue({
        comments: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });

      await service.findCommentsByPost('post-1', 1, 20);

      expect(spy).toHaveBeenCalledWith(1, 20, 'post-1');
    });
  });

  describe('findCommentsByAuthor', () => {
    it('should call findAllComments with authorId', async () => {
      const spy = jest.spyOn(service, 'findAllComments').mockResolvedValue({
        comments: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });

      await service.findCommentsByAuthor('user-1', 1, 20);

      expect(spy).toHaveBeenCalledWith(1, 20, undefined, 'user-1');
    });
  });

  describe('findRepliesByComment', () => {
    it('should call findAllComments with commentId as parentId', async () => {
      const spy = jest.spyOn(service, 'findAllComments').mockResolvedValue({
        comments: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });

      await service.findRepliesByComment('comment-1', 1, 20);

      expect(spy).toHaveBeenCalledWith(1, 20, undefined, undefined, 'comment-1');
    });
  });
}); 