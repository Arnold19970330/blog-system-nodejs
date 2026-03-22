import React from 'react';
import { Navbar } from './navbar';
import { Hero } from './hero';
import { BlogGrid } from './blog-grid';

const Home: React.FC = () => {
  const username = localStorage.getItem('username') || 'Felhasznalo';

  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      <Navbar />
      <Hero />
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 shadow-xl">
            <h1 className="text-2xl font-bold text-white mb-1">Fő oldal</h1>
            <p className="text-gray-300">Üdvözlünk, {username}!</p>
          </div>
        </div>
      </section>
      <BlogGrid />
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2024 Blog. Minden jog fenntartva.</p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
