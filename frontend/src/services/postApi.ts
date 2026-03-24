import { api } from './authApi';

type CreatePostPayload = {
  title: string;
  content: string;
  image?: string;
  categories: string[];
};

type UpdatePostPayload = {
  title?: string;
  content?: string;
  image?: string;
  categories?: string[];
};

export const createPostRequest = (payload: CreatePostPayload) => {
  return api.post('/posts', payload);
};

export const getPostsRequest = (authorId?: string) => {
  if (authorId) {
    return api.get('/posts', { params: { author: authorId } });
  }

  return api.get('/posts');
};

export const getPostByIdRequest = (postId: string) => {
  return api.get(`/posts/${postId}`);
};

export const updatePostRequest = (postId: string, payload: UpdatePostPayload) => {
  return api.patch(`/posts/${postId}`, payload);
};
