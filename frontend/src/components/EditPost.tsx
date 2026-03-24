import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from './navbar';
import { getPostByIdRequest, updatePostRequest } from '../services/postApi';
import { getCategoriesRequest, type Category } from '../services/categoryApi';
import { getCurrentUserId } from '../utils/auth';
import { compressImageToDataUrl } from '../utils/image';
import { LoadingState } from './ui/loading-state';
import { isRichTextEmpty } from '../utils/html';
import { RichTextEditor } from './ui/rich-text-editor';

const EditPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError('Hiányzó poszt azonosító.');
        setInitialLoading(false);
        return;
      }

      try {
        const [categoriesResponse, postResponse] = await Promise.all([
          getCategoriesRequest(),
          getPostByIdRequest(id)
        ]);

        const categoryList = categoriesResponse.data?.data?.categories || [];
        setCategories(categoryList);

        const post = postResponse.data?.data?.post;
        if (!post) {
          setError('A poszt nem található.');
          return;
        }

        const authorId = typeof post.author === 'string' ? post.author : post.author?._id;
        const currentUserId = getCurrentUserId();
        if (!currentUserId || !authorId || currentUserId !== authorId) {
          setError('Csak a saját posztodat szerkesztheted.');
          return;
        }

        setTitle(post.title || '');
        setContent(post.content || '');
        setImage(post.image || '');
        setSelectedCategoryId(post.categories?.[0]?._id || categoryList?.[0]?._id || '');
      } catch {
        setError('Nem sikerült betölteni a poszt adatait.');
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageToDataUrl(file);
      setImage(compressed);
    } catch {
      setError('Nem sikerült feldolgozni a képet.');
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isRichTextEmpty(content)) {
      setError('A leírás nem lehet üres.');
      return;
    }
    setLoading(true);
    try {
      await updatePostRequest(id ?? '', {
        title,
        content,
        image,
        categories: [selectedCategoryId]
      });
      navigate('/home');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Ehhez a poszthoz nincs szerkesztési jogosultságod.');
      } else {
        setError('Nem sikerült menteni a módosításokat.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      <Navbar />
      <section className="pt-28 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Bejegyzés szerkesztése</h1>
            <p className="text-gray-400">Itt frissítheted a saját posztodat.</p>
          </div>

          <div className="w-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            {initialLoading ? (
              <LoadingState label="Szerkesztő betöltése..." compact />
            ) : (
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
                    {categories.map((category) => (
                      <option key={category._id} value={category._id} className="text-black">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                    Kép (opcionális)
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Leírás</label>
                  <RichTextEditor value={content} onChange={setContent} />
                  <p className="mt-2 text-xs text-gray-400">
                    Rich text szerkesztő: félkövér, dőlt, listák, linkek.
                  </p>
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
                    disabled={loading || initialLoading}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold transition-all disabled:opacity-60"
                  >
                    {loading ? 'Mentés...' : 'Módosítások mentése'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default EditPost;
