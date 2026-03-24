import { Card, CardContent } from './ui/card';
import { Calendar, ImageIcon, Pencil, User } from 'lucide-react';

interface BlogCardProps {
  image?: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  categoryColor?: string;
  onOpen?: () => void;
  canEdit?: boolean;
  onEdit?: () => void;
}

export function BlogCard({
  image,
  category,
  title,
  excerpt,
  author,
  date,
  categoryColor = 'from-purple-500 to-blue-500',
  onOpen,
  canEdit = false,
  onEdit
}: BlogCardProps) {
  return (
    <Card
      onClick={onOpen}
      className="bg-[#16182b]/90 border border-[#2a2d45] hover:border-purple-500/50 transition-all duration-300 overflow-hidden group cursor-pointer shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
    >
      <div className="relative h-48 bg-gradient-to-b from-[#2a2d45] to-[#1a1d32] flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16182b] to-transparent opacity-70" />
        {canEdit && onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="absolute cursor-pointer top-4 right-4 inline-flex items-center justify-center rounded-full border border-white/30 bg-black/35 p-2 text-white hover:bg-black/55 transition-colors z-10"
            aria-label="Poszt szerkesztése"
            title="Szerkesztés"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        <span
          className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r ${categoryColor}`}
        >
          {category}
        </span>
      </div>

      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed">{excerpt}</p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
