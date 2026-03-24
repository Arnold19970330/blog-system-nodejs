import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Navbar } from './navbar';
import { getPostByIdRequest } from '../services/postApi';
import { getCurrentUserId } from '../utils/auth';
import { LoadingState } from './ui/loading-state';

type ApiPost = {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  author?: { _id?: string; name?: string } | string;
  categories?: Array<{ _id?: string; name?: string }>;
};

const PostDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<ApiPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setError('Hiányzó poszt azonosító.');
        setLoading(false);
        return;
      }

      try {
        const response = await getPostByIdRequest(id);
        const loadedPost = response.data?.data?.post;

        if (!loadedPost) {
          setError('A poszt nem található.');
          return;
        }

        setPost(loadedPost);
      } catch {
        setError('Nem sikerült betölteni a poszt részleteit.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const formatDate = (isoDate: string) => {
    try {
      return new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(isoDate));
    } catch {
      return isoDate;
    }
  };

  const isOwnPost =
    Boolean(currentUserId) &&
    Boolean(post) &&
    typeof post?.author !== 'string' &&
    post?.author?._id === currentUserId;

  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      <Navbar />
      <section className="pt-28 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Vissza a főoldalra
          </button>

          {loading ? (
            <LoadingState label="Poszt betöltése..." />
          ) : error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">{error}</div>
          ) : !post ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-300">Nincs ilyen poszt.</div>
          ) : (
            <article className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl">
              {post.image && (
                <div className="w-full h-72 sm:h-[26rem] bg-[#1a1d32]">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                    {post.categories?.[0]?.name || 'Általános'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="text-sm text-gray-400">
                    Szerző:{' '}
                    {typeof post.author === 'string' ? post.author : post.author?.name || 'Ismeretlen'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">{post.title}</h1>

                <div
                  className="text-gray-200 leading-8 space-y-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-blue-300 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-purple-400/70 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-black/30 [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
                />

                {isOwnPost && (
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() => navigate(`/posts/${post._id}/edit`)}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Saját poszt szerkesztése
                    </button>
                  </div>
                )}
              </div>
            </article>
          )}
        </div>
      </section>
    </main>
  );
};

export default PostDetails;
