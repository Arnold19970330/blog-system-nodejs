import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostsRequest } from '../services/postApi';
import { BlogCard } from './blog-card';
import { getCurrentUserId } from '../utils/auth';
import { LoadingState } from './ui/loading-state';
import { Search } from 'lucide-react';

type ApiPost = {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  author?: { _id?: string; name?: string } | string;
  categories?: Array<{ name?: string }>;
};

export function BlogGrid() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Mind');
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const currentUserId = getCurrentUserId();
  const [ownFilteredPosts, setOwnFilteredPosts] = useState<ApiPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await getPostsRequest();
        const data = response.data?.data?.posts || [];
        setPosts(data);
      } catch {
        setError('Nem sikerült betölteni a bejegyzéseket.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const ownFilteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setOwnFilteredPosts(ownFilteredPosts);
  }, [searchQuery, posts]);
    

  const getCategoryColor = (categoryName: string) => {
    const key = categoryName.toLowerCase();
    if (key.includes('tech')) return 'from-purple-500 to-blue-500';
    if (key.includes('utaz')) return 'from-emerald-500 to-teal-500';
    if (key.includes('élet') || key.includes('elet')) return 'from-pink-500 to-rose-500';
    if (key.includes('gasztro')) return 'from-orange-500 to-amber-500';
    if (key.includes('kultur') || key.includes('kultúr')) return 'from-indigo-500 to-violet-500';
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

  const getAuthorId = (post: ApiPost) => (typeof post.author === 'string' ? post.author : post.author?._id);
  const sourcePosts = showOnlyMine && currentUserId
    ? posts.filter((post) => getAuthorId(post) === currentUserId)
    : posts;

  const categories = Array.from(
    new Set(
      sourcePosts.map((post) => post.categories?.[0]?.name || 'Általános')
    )
  );
  const filterOptions = ['Mind', ...categories];
  const filteredPosts =
    selectedCategory === 'Mind'
      ? searchQuery ? ownFilteredPosts : sourcePosts
      : sourcePosts.filter((post) => (post.categories?.[0]?.name || 'Általános') === selectedCategory);

  return (
    <section id="posts" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-6">Legújabb bejegyzések</h2>

        <div className="mb-4 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
          <button
            type="button"
            role="switch"
            aria-checked={showOnlyMine}
            onClick={() => {
              if (!currentUserId) return;
              setShowOnlyMine((prev) => !prev);
              setSelectedCategory('Mind');
            }}
            disabled={!currentUserId}
            className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
              showOnlyMine ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-white/15'
            } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                showOnlyMine ? '-translate-x-5' : '-translate-x-0.5'
              }`}
            />
          </button>
          <p className="text-sm text-gray-200">
            Saját posztok
            {!currentUserId && <span className="text-gray-400"> (bejelentkezés szükséges)</span>}
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-3 mb-8">
         <div className="flex flex-wrap gap-3">
         {filterOptions.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchQuery('');
                }}
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
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Keresés..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="button" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white hover:bg-white/10 transition-colors" onClick={() => setSearchQuery('')} onKeyDown={(e) => e.key === 'Enter' && setSearchQuery('')} disabled={!searchQuery} aria-label="Keresés" onChange={(e) => setSearchQuery(e.target.value)}>
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingState label="Bejegyzések betöltése..." />
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">{error}</div>
        ) : filteredPosts.length === 0 && !searchQuery ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-300">
            Nincs megjeleníthető bejegyzés ebben a kategóriában.
          </div>
          ) : filteredPosts.length === 0 && searchQuery ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-300">
            Nem találtam egyet sem a keresésnek megfelelően.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post._id}
                image={post.image}
                category={post.categories?.[0]?.name || 'Általános'}
                title={post.title}
                excerpt={post.content}
                author={typeof post.author === 'string' ? post.author : post.author?.name || 'Ismeretlen'}
                date={formatDate(post.createdAt)}
                categoryColor={getCategoryColor(post.categories?.[0]?.name || '')}
                onOpen={() => navigate(`/posts/${post._id}`)}
                canEdit={typeof post.author !== 'string' && Boolean(currentUserId) && post.author?._id === currentUserId}
                onEdit={() => navigate(`/posts/${post._id}/edit`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
