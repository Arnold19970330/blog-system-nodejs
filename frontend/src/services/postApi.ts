import { api } from './authApi';

type CreatePostPayload = {
  title: string;
  content: string;
  image?: string;
  author: string;
  categories: string[];
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
