import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from './navbar';
import { createPostRequest } from '../services/postApi';
import { getCurrentUserId } from '../utils/auth';
import { createCategoryRequest, getCategoriesRequest, type Category } from '../services/categoryApi';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategoriesRequest();
        const list = response.data?.data?.categories || [];
        setCategories(list);
        if (list.length > 0) {
          setSelectedCategoryId(list[0]._id);
        }
      } catch {
        setError('Nem sikerült betölteni a kategóriákat.');
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const authorId = getCurrentUserId();
    if (!authorId) {
      setError('A poszt létrehozásához be kell jelentkezned.');
      return;
    }
    if (!selectedCategoryId) {
      setError('Válassz egy kategóriát a poszthoz.');
      return;
    }

    setLoading(true);

    try {
      await createPostRequest({
        title,
        content,
        image,
        author: authorId,
        categories: [selectedCategoryId]
      });
      navigate('/home');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 413) {
          setError('A feltöltött kép túl nagy. Válassz kisebb képet.');
          return;
        }
      }
      setError('Nem sikerült létrehozni a posztot. Próbáld újra.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    setError('');
    const normalizedName = newCategoryName.trim();
    if (!normalizedName) return;

    try {
      const response = await createCategoryRequest({ name: normalizedName });
      const created = response.data?.data?.category;
      if (created) {
        setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
        setSelectedCategoryId(created._id);
        setNewCategoryName('');
      }
    } catch {
      setError('Nem sikerült új kategóriát létrehozni (lehet, hogy már létezik).');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      <Navbar />
      <section className="pt-28 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Új bejegyzés létrehozása</h1>
            <p className="text-gray-400">Írd meg a következő blogbejegyzésedet.</p>
          </div>

          <div className="w-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Cím
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add meg a bejegyzés címét"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Kategória
                </label>
                <select
                  id="category"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">Nincs kategória. Hozz létre egyet lentebb.</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category._id} value={category._id} className="text-black">
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="new-category" className="block text-sm font-medium text-gray-300 mb-2">
                  Új kategória (opcionális)
                </label>
                <div className="flex gap-2">
                  <input
                    id="new-category"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Például: Technológia"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-4 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
                  >
                    Hozzáad
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                  Kép feltöltése (opcionális)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600 file:px-3 file:py-2 file:text-white hover:file:bg-purple-500"
                />
                {image && (
                  <img
                    src={image}
                    alt="Előnézet"
                    className="mt-3 h-36 w-full object-cover rounded-xl border border-white/10"
                  />
                )}
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Tartalom
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Írd ide a bejegyzés tartalmát..."
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-y"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="px-4 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold transition-all disabled:opacity-60"
                >
                  {loading ? 'Mentés...' : 'Bejegyzés létrehozása'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CreatePost;
