import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/config/prisma.service';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let testUserId: string;
  let testPostId: string;

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
  });

  afterAll(async () => {
    // Cleanup test data
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

  describe('/api/posts (POST)', () => {
    it('should create a new post', async () => {
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post content',
        isPublished: true,
      };

      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPostDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createPostDto.title);
      expect(response.body.content).toBe(createPostDto.content);
      expect(response.body.authorId).toBe(testUserId);
      expect(response.body.isPublished).toBe(createPostDto.isPublished);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      testPostId = response.body.id;
    });

    it('should create a post with default isPublished value', async () => {
      const createPostDto = {
        title: 'Test Post Default',
        content: 'This is a test post with default published status',
      };

      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPostDto)
        .expect(201);

      expect(response.body.isPublished).toBe(true);
    });

    it('should reject post creation without authentication', async () => {
      const createPostDto = {
        title: 'Unauthorized Post',
        content: 'This should fail',
      };

      await request(app.getHttpServer())
        .post('/api/posts')
        .send(createPostDto)
        .expect(401);
    });

    it('should validate required fields', async () => {
      const invalidPostDto = {
        title: '', // Empty title
        content: 'Valid content',
      };

      await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPostDto)
        .expect(400);
    });
  });

  describe('/api/posts (GET)', () => {
    it('should get all posts with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/posts')
        .expect(200);

      expect(response.body).toHaveProperty('posts');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.posts)).toBe(true);
    });

    it('should get posts with custom pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/posts?page=1&limit=5')
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(5);
    });

    it('should filter posts by author', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts?authorId=${testUserId}`)
        .expect(200);

      expect(response.body.posts.every((post: any) => post.authorId === testUserId)).toBe(true);
    });

    it('should filter posts by published status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/posts?isPublished=true')
        .expect(200);

      expect(response.body.posts.every((post: any) => post.isPublished === true)).toBe(true);
    });
  });

  describe('/api/posts/:id (GET)', () => {
    it('should get a specific post by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts/${testPostId}`)
        .expect(200);

      expect(response.body.id).toBe(testPostId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('authorId');
      expect(response.body).toHaveProperty('commentCount');
    });

    it('should return 404 for non-existent post', async () => {
      await request(app.getHttpServer())
        .get('/api/posts/non-existent-id')
        .expect(404);
    });
  });

  describe('/api/posts/:id (PUT)', () => {
    it('should update a post successfully', async () => {
      const updatePostDto = {
        title: 'Updated Test Post',
        content: 'This is the updated content',
        isPublished: false,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatePostDto)
        .expect(200);

      expect(response.body.title).toBe(updatePostDto.title);
      expect(response.body.content).toBe(updatePostDto.content);
      expect(response.body.isPublished).toBe(updatePostDto.isPublished);
    });

    it('should reject update without authentication', async () => {
      const updatePostDto = {
        title: 'Unauthorized Update',
      };

      await request(app.getHttpServer())
        .put(`/api/posts/${testPostId}`)
        .send(updatePostDto)
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

      const updatePostDto = {
        title: 'Unauthorized Update',
      };

      await request(app.getHttpServer())
        .put(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send(updatePostDto)
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

  describe('/api/posts/:id (DELETE)', () => {
    it('should delete a post successfully', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Post deleted successfully');
    });

    it('should reject delete without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/api/posts/${testPostId}`)
        .expect(401);
    });

    it('should return 404 for non-existent post', async () => {
      await request(app.getHttpServer())
        .delete('/api/posts/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/api/posts/author/:authorId (GET)', () => {
    it('should get posts by author ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts/author/${testUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty('posts');
      expect(response.body).toHaveProperty('total');
      expect(response.body.posts.every((post: any) => post.authorId === testUserId)).toBe(true);
    });
  });
}); 