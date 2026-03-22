
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(false);
  const { loading, error, clearError, login, register } = useAuth();

  const handleRegisterSubmit = async (data: { name: string; email: string; password: string }) => {
    try {
      await register(data);
    } catch {
      return;
    }
  };

  const handleLoginSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data);
      navigate('/home');
    } catch {
      return;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a1a] relative overflow-hidden">
      {/* Háttér elmosódott foltok (Mesh Gradient hatás) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>

      {/* Glassmorphism kártya */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isLoginView ? 'Üdv újra' : 'Fiók létrehozása'}
          </h1>
          <p className="text-gray-400">
            {isLoginView ? 'Jelentkezz be a folytatáshoz.' : 'Regisztrálj, és oszd meg a történeteidet.'}
          </p>
        </div>
        
        {isLoginView ? (
          <LoginForm loading={loading} error={error} onSubmit={handleLoginSubmit} />
        ) : (
          <RegisterForm loading={loading} error={error} onSubmit={handleRegisterSubmit} />
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            {isLoginView ? 'Még nincs fiókod? ' : 'Van már fiókod? '}
            <button
              type="button"
              onClick={() => {
                setIsLoginView(!isLoginView);
                clearError();
              }}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {isLoginView ? 'Regisztráció' : 'Bejelentkezés'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;