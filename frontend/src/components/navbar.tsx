import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, PenSquare, X } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-white font-semibold text-xl">Blog</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-gray-300 hover:text-white transition-colors">
              Főoldal
            </Link>
            <Link to="/home#posts" className="text-gray-300 hover:text-white transition-colors">
              Posztok
            </Link>
            {isLoggedIn && (
              <Link
                to="/posts/new"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-colors"
              >
                <PenSquare className="w-4 h-4 mr-2" />
                Új poszt
              </Link>
            )}
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                Kijelentkezés
              </Button>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Bejelentkezés
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <Link to="/home" className="text-gray-300 hover:text-white transition-colors">
                Főoldal
              </Link>
              <Link to="/home#posts" className="text-gray-300 hover:text-white transition-colors">
                Posztok
              </Link>
              {isLoggedIn && (
                <Link
                  to="/posts/new"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-colors w-full"
                >
                  <PenSquare className="w-4 h-4 mr-2" />
                  Új poszt
                </Link>
              )}
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 w-full"
                  onClick={handleLogout}
                >
                  Kijelentkezés
                </Button>
              ) : (
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors w-full"
                >
                  Bejelentkezés
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
