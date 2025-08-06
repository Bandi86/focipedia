import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/config/prisma.service';

describe('CommentController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let testUserId: string;
  let testPostId: string;
  let testCommentId: string;
  let testReplyId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);

    // Create a test user and get auth token
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPass123',
      username: `testuser-${Date.now()}`,
      displayName: 'Test User',
    };

    // Register user
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    // Login to get token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    authToken = loginResponse.body.accessToken;

    // Get user ID from the token or profile
    const profileResponse = await request(app.getHttpServer())
      .get('/api/profiles/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    testUserId = profileResponse.body.userId;

    // Create a test post
    const createPostDto = {
      title: 'Test Post for Comments',
      content: 'This is a test post for comment testing',
      isPublished: true,
    };

    const postResponse = await request(app.getHttpServer())
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createPostDto)
      .expect(201);

    testPostId = postResponse.body.id;
  });

  afterAll(async () => {
    // Cleanup test data
    if (testReplyId) {
      await prismaService.comment.deleteMany({
        where: { id: testReplyId },
      });
    }

    if (testCommentId) {
      await prismaService.comment.deleteMany({
        where: { id: testCommentId },
      });
    }

    if (testPostId) {
      await prismaService.post.deleteMany({
        where: { id: testPostId },
      });
    }

    if (testUserId) {
      await prismaService.user.deleteMany({
        where: { id: testUserId },
      });
    }

    await app.close();
  });

  describe('/api/comments (POST)', () => {
    it('should create a new comment', async () => {
      const createCommentDto = {
        content: 'This is a test comment',
        postId: testPostId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createCommentDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe(createCommentDto.content);
      expect(response.body.postId).toBe(testPostId);
      expect(response.body.authorId).toBe(testUserId);
      expect(response.body.parentId).toBeNull();
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      testCommentId = response.body.id;
    });

    it('should create a reply comment', async () => {
      const createReplyDto = {
        content: 'This is a reply to the comment',
        postId: testPostId,
        parentId: testCommentId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createReplyDto)
        .expect(201);

      expect(response.body.content).toBe(createReplyDto.content);
      expect(response.body.postId).toBe(testPostId);
      expect(response.body.parentId).toBe(testCommentId);
      expect(response.body.authorId).toBe(testUserId);

      testReplyId = response.body.id;
    });

    it('should reject comment creation without authentication', async () => {
      const createCommentDto = {
        content: 'Unauthorized comment',
        postId: testPostId,
      };

      await request(app.getHttpServer())
        .post('/api/comments')
        .send(createCommentDto)
        .expect(401);
    });

    it('should reject comment creation for non-existent post', async () => {
      const createCommentDto = {
        content: 'Comment for non-existent post',
        postId: 'non-existent-post-id',
      };

      await request(app.getHttpServer())
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createCommentDto)
        .expect(404);
    });

    it('should reject reply creation for non-existent parent comment', async () => {
      const createReplyDto = {
        content: 'Reply to non-existent comment',
        postId: testPostId,
        parentId: 'non-existent-comment-id',
      };

      await request(app.getHttpServer())
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createReplyDto)
        .expect(404);
    });

    it('should validate required fields', async () => {
      const invalidCommentDto = {
        content: '', // Empty content
        postId: testPostId,
      };

      await request(app.getHttpServer())
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCommentDto)
        .expect(400);
    });
  });

  describe('/api/comments (GET)', () => {
    it('should get all comments with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/comments')
        .expect(200);

      expect(response.body).toHaveProperty('comments');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.comments)).toBe(true);
    });

    it('should get comments with custom pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/comments?page=1&limit=10')
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
    });

    it('should filter comments by post', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/comments?postId=${testPostId}`)
        .expect(200);

      expect(response.body.comments.every((comment: any) => comment.postId === testPostId)).toBe(true);
    });

    it('should filter comments by author', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/comments?authorId=${testUserId}`)
        .expect(200);

      expect(response.body.comments.every((comment: any) => comment.authorId === testUserId)).toBe(true);
    });
  });

  describe('/api/comments/:id (GET)', () => {
    it('should get a specific comment by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/comments/${testCommentId}`)
        .expect(200);

      expect(response.body.id).toBe(testCommentId);
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('authorId');
      expect(response.body).toHaveProperty('postId');
      expect(response.body).toHaveProperty('replyCount');
    });

    it('should return 404 for non-existent comment', async () => {
      await request(app.getHttpServer())
        .get('/api/comments/non-existent-id')
        .expect(404);
    });
  });

  describe('/api/comments/:id (PUT)', () => {
    it('should update a comment successfully', async () => {
      const updateCommentDto = {
        content: 'Updated comment content',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateCommentDto)
        .expect(200);

      expect(response.body.content).toBe(updateCommentDto.content);
    });

    it('should reject update without authentication', async () => {
      const updateCommentDto = {
        content: 'Unauthorized update',
      };

      await request(app.getHttpServer())
        .put(`/api/comments/${testCommentId}`)
        .send(updateCommentDto)
        .expect(401);
    });

    it('should reject update by non-author', async () => {
      // Create another user
      const anotherUser = {
        email: `another-${Date.now()}@example.com`,
        password: 'TestPass123',
        username: `anotheruser-${Date.now()}`,
        displayName: 'Another User',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(anotherUser)
        .expect(201);

      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: anotherUser.email,
          password: anotherUser.password,
        })
        .expect(200);

      const anotherUserToken = loginResponse.body.accessToken;

      const updateCommentDto = {
        content: 'Unauthorized update',
      };

      await request(app.getHttpServer())
        .put(`/api/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send(updateCommentDto)
        .expect(403);

      // Cleanup another user
      const profileResponse = await request(app.getHttpServer())
        .get('/api/profiles/me')
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .expect(200);

      await prismaService.user.delete({
        where: { id: profileResponse.body.userId },
      });
    });
  });

  describe('/api/comments/:id (DELETE)', () => {
    it('should delete a comment successfully', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Comment deleted successfully');
    });

    it('should reject delete without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/api/comments/${testCommentId}`)
        .expect(401);
    });

    it('should return 404 for non-existent comment', async () => {
      await request(app.getHttpServer())
        .delete('/api/comments/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/api/comments/post/:postId (GET)', () => {
    it('should get comments by post ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/comments/post/${testPostId}`)
        .expect(200);

      expect(response.body).toHaveProperty('comments');
      expect(response.body).toHaveProperty('total');
      expect(response.body.comments.every((comment: any) => comment.postId === testPostId)).toBe(true);
    });
  });

  describe('/api/comments/author/:authorId (GET)', () => {
    it('should get comments by author ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/comments/author/${testUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty('comments');
      expect(response.body).toHaveProperty('total');
      expect(response.body.comments.every((comment: any) => comment.authorId === testUserId)).toBe(true);
    });
  });

  describe('/api/comments/replies/:commentId (GET)', () => {
    it('should get replies to a specific comment', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/comments/replies/${testCommentId}`)
        .expect(200);

      expect(response.body).toHaveProperty('comments');
      expect(response.body).toHaveProperty('total');
      expect(response.body.comments.every((comment: any) => comment.parentId === testCommentId)).toBe(true);
    });
  });
}); 