import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPasswordRequest } from '../services/authApi';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!token) {
      setError('Hiányzó visszaállító token.');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPasswordRequest(token, { password });
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      setSuccessMessage('Jelszó sikeresen módosítva, átirányítás...');
      setTimeout(() => navigate('/home'), 900);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Nem sikerült a jelszó visszaállítása.');
      } else {
        setError('Nem sikerült a jelszó visszaállítása.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a1a] relative overflow-hidden px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-20" />

      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Új jelszó beállítása</h1>
        <p className="text-gray-400 mb-6">Adj meg egy új jelszót a fiókodhoz.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
              Új jelszó
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Minimum 6 karakter"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {loading ? 'Mentés...' : 'Jelszó módosítása'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-purple-300 hover:text-purple-200">
            Vissza a bejelentkezéshez
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
