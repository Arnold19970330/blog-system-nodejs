import { api } from './authApi';

export type Category = {
  _id: string;
  name: string;
  description?: string;
};

export const getCategoriesRequest = () => {
  return api.get('/categories');
};

export const createCategoryRequest = (payload: { name: string; description?: string }) => {
  return api.post('/categories', payload);
};
