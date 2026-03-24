import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type ForgotPasswordPayload = {
  email: string;
};

type ResetPasswordPayload = {
  password: string;
};

export const registerRequest = (payload: RegisterPayload) => {
  return api.post('/auth/signup', payload);
};

export const loginRequest = (payload: LoginPayload) => {
  return api.post('/auth/login', payload);
};

export const forgotPasswordRequest = (payload: ForgotPasswordPayload) => {
  return api.post('/auth/forgot-password', payload);
};

export const resetPasswordRequest = (token: string, payload: ResetPasswordPayload) => {
  return api.post(`/auth/reset-password/${token}`, payload);
};

export { api };
