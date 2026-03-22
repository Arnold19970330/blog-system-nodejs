import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
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

export const registerRequest = (payload: RegisterPayload) => {
  return api.post('/auth/signup', payload);
};

export const loginRequest = (payload: LoginPayload) => {
  return api.post('/auth/login', payload);
};

export { api };
