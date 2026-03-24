import { useState } from 'react';
import axios from 'axios';
import { loginRequest, registerRequest } from '../services/authApi';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallback;
  }

  return fallback;
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearError = () => setError('');

  const register = async (input: RegisterInput) => {
    setLoading(true);
    setError('');

    try {
      const response = await registerRequest({
        username: input.name,
        email: input.email,
        password: input.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const registeredName = response.data?.data?.user?.name || input.name;
        localStorage.setItem('username', registeredName || 'Felhasználó');
      }

      return response.data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Valami hiba történt a regisztráció során.');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (input: LoginInput) => {
    setLoading(true);
    setError('');

    try {
      const response = await loginRequest(input);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const backendName = response.data?.data?.user?.name;
        const fallbackName = input.email.split('@')[0] || 'Felhasználó';
        localStorage.setItem('username', backendName || fallbackName);
      }

      return response.data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Hibás e-mail vagy jelszó.');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    clearError,
    register,
    login
  };
};
