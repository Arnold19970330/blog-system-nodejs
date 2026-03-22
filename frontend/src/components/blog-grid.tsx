import { useEffect, useState } from 'react';
import { getPostsRequest } from '../services/postApi';
import { BlogCard } from './blog-card';

type ApiPost = {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  author?: { name?: string } | string;
  categories?: Array<{ name?: string }>;
};

export function BlogGrid() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Mind');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await getPostsRequest();
        const data = response.data?.data?.posts || [];
        setPosts(data);
      } catch {
        setError('Nem sikerult betolteni a bejegyzeseket.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const getCategoryColor = (categoryName: string) => {
    const key = categoryName.toLowerCase();
    if (key.includes('tech')) return 'from-purple-500 to-blue-500';
    if (key.includes('utaz')) return 'from-emerald-500 to-teal-500';
    if (key.includes('elet')) return 'from-pink-500 to-rose-500';
    if (key.includes('gasztro')) return 'from-orange-500 to-amber-500';
    if (key.includes('kultur')) return 'from-indigo-500 to-violet-500';
    if (key.includes('sport')) return 'from-cyan-500 to-blue-500';
    return 'from-purple-500 to-blue-500';
  };

  const formatDate = (isoDate: string) => {
    try {
      return new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(isoDate));
    } catch {
      return isoDate;
    }
  };

  const categories = Array.from(
    new Set(
      posts.map((post) => post.categories?.[0]?.name || 'Altalanos')
    )
  );
  const filterOptions = ['Mind', ...categories];
  const filteredPosts =
    selectedCategory === 'Mind'
      ? posts
      : posts.filter((post) => (post.categories?.[0]?.name || 'Altalanos') === selectedCategory);

  return (
    <section id="posts" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-6">Legujabb bejegyzesek</h2>

        <div className="flex flex-wrap gap-3 mb-8">
          {filterOptions.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-transparent text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-300">Betoltes...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-300">
            Nincs megjelenitheto bejegyzes ebben a kategoriaban.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post._id}
                image={post.image}
                category={post.categories?.[0]?.name || 'Altalanos'}
                title={post.title}
                excerpt={post.content}
                author={typeof post.author === 'string' ? post.author : post.author?.name || 'Ismeretlen'}
                date={formatDate(post.createdAt)}
                categoryColor={getCategoryColor(post.categories?.[0]?.name || '')}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
