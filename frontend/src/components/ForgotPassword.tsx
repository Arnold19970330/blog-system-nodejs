import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '../services/authApi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setResetUrl('');
    setLoading(true);

    try {
      const response = await forgotPasswordRequest({ email });
      setSuccessMessage(response.data?.message || 'A visszaállító link elkészült.');
      setResetUrl(response.data?.data?.resetUrl || '');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Nem sikerült visszaállító linket kérni.');
      } else {
        setError('Nem sikerült visszaállító linket kérni.');
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
        <h1 className="text-3xl font-bold text-white mb-2">Elfelejtett jelszó</h1>
        <p className="text-gray-400 mb-6">Add meg az email címed, és kapsz egy visszaállító linket.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
              E-mail cím
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="your.email@example.com"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}
          {resetUrl && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-xs text-emerald-200 mb-2">Fejlesztői link (email helyett):</p>
              <a href={resetUrl} className="text-sm break-all text-blue-300 underline">
                {resetUrl}
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {loading ? 'Küldés...' : 'Visszaállító link kérése'}
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

export default ForgotPassword;
