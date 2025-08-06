// Base types for the Focipedia application
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Common entity types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Post types
export interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  isPublished: boolean;
  commentCount: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  isPublished?: boolean;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  isPublished?: boolean;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Comment types
export interface Comment extends BaseEntity {
  content: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  postId: string;
  parentId?: string;
  replyCount: number;
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Add more type definitions as needed