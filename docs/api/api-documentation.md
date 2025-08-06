# Focipedia API Documentation

## Overview

The Focipedia API provides comprehensive endpoints for managing posts and comments in the football community platform. All endpoints are prefixed with `/api` and require authentication for write operations.

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Posts API

### Get All Posts

**GET** `/api/posts`

Retrieve all posts with optional filtering and pagination.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Posts per page (default: 10, max: 50)
- `authorId` (string): Filter by author ID
- `isPublished` (boolean): Filter by published status

**Response:**

```json
{
  "posts": [
    {
      "id": "post-123",
      "title": "Amazing Match Analysis",
      "content": "Today's match was incredible...",
      "authorId": "user-456",
      "authorUsername": "footballfan",
      "authorDisplayName": "Football Fan",
      "isPublished": true,
      "commentCount": 5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### Get Single Post

**GET** `/api/posts/:id`

Retrieve a specific post by ID.

**Response:**

```json
{
  "id": "post-123",
  "title": "Amazing Match Analysis",
  "content": "Today's match was incredible...",
  "authorId": "user-456",
  "authorUsername": "footballfan",
  "authorDisplayName": "Football Fan",
  "isPublished": true,
  "commentCount": 5,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Create Post

**POST** `/api/posts`

Create a new post. Requires authentication.

**Request Body:**

```json
{
  "title": "My New Post",
  "content": "This is the content of my post...",
  "isPublished": true
}
```

**Response:**

```json
{
  "id": "post-789",
  "title": "My New Post",
  "content": "This is the content of my post...",
  "authorId": "user-456",
  "authorUsername": "footballfan",
  "authorDisplayName": "Football Fan",
  "isPublished": true,
  "commentCount": 0,
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

### Update Post

**PUT** `/api/posts/:id`

Update an existing post. Only the author can update their posts.

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "isPublished": false
}
```

### Delete Post

**DELETE** `/api/posts/:id`

Delete a post. Only the author can delete their posts.

**Response:** 204 No Content

## Comments API

### Get All Comments

**GET** `/api/comments`

Retrieve all comments with optional filtering and pagination.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Comments per page (default: 20, max: 100)
- `postId` (string): Filter by post ID
- `authorId` (string): Filter by author ID
- `parentId` (string): Filter by parent comment ID (use 'null' for top-level comments)

### Get Comments by Post

**GET** `/api/comments/post/:postId`

Retrieve all comments for a specific post.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Comments per page (default: 20)

### Get Replies by Comment

**GET** `/api/comments/replies/:commentId`

Retrieve all replies to a specific comment.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Comments per page (default: 20)

### Create Comment

**POST** `/api/comments`

Create a new comment. Requires authentication.

**Request Body:**

```json
{
  "content": "Great analysis!",
  "postId": "post-123",
  "parentId": "comment-456" // Optional, for replies
}
```

**Response:**

```json
{
  "id": "comment-789",
  "content": "Great analysis!",
  "authorId": "user-456",
  "authorUsername": "footballfan",
  "authorDisplayName": "Football Fan",
  "postId": "post-123",
  "parentId": "comment-456",
  "replyCount": 0,
  "createdAt": "2024-01-15T11:30:00Z",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

### Update Comment

**PUT** `/api/comments/:id`

Update an existing comment. Only the author can update their comments.

**Request Body:**

```json
{
  "content": "Updated comment content"
}
```

### Delete Comment

**DELETE** `/api/comments/:id`

Delete a comment. Only the author can delete their comments.

**Response:** 204 No Content

## Error Responses

### Validation Errors (400)

```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "content must be longer than 1 character"
  ],
  "error": "Bad Request"
}
```

### Authentication Errors (401)

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Authorization Errors (403)

```json
{
  "statusCode": 403,
  "message": "You can only edit your own posts",
  "error": "Forbidden"
}
```

### Not Found Errors (404)

```json
{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

## Data Models

### Post Model

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  isPublished: boolean;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Comment Model

```typescript
interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  postId: string;
  parentId?: string;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}
```

## Frontend Integration

The frontend provides a complete user interface for all post and comment operations:

### Posts Page (`/posts`)

- Create new posts
- Edit existing posts (author only)
- Delete posts (author only)
- Search and filter posts
- Pagination with "Load More"

### Post Detail Page (`/posts/[id]`)

- View full post content
- Add comments
- Reply to comments (nested replies)
- Edit/delete comments (author only)
- View comment threads

### Features

- Real-time search
- Status filtering (published/draft)
- Nested comment replies (up to 3 levels)
- Responsive design
- Loading states and error handling
- Toast notifications for user feedback

## Testing

### Backend Tests

- Unit tests for PostService and CommentService
- E2E tests for API endpoints
- Authentication and authorization tests
- Validation and error handling tests

### Frontend Tests

- Component tests for PostCard, PostForm, CommentItem, CommentForm
- Integration tests for post and comment workflows
- User interaction tests

## Development

### Running Tests

```bash
# Backend tests
cd apps/backend && pnpm test

# Frontend tests
cd apps/frontend && pnpm test

# E2E tests
cd apps/backend && pnpm test:e2e
```

### API Documentation

When the backend is running, visit: http://localhost:3001/docs for interactive Swagger documentation.
