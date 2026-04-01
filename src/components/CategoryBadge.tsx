import type { Category } from '../types';
import { categoryLabel } from '../types';

interface Props {
  category: Category;
  className?: string;
}

export default function CategoryBadge({ category, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border badge-${category} ${className}`}
    >
      {categoryLabel(category)}
    </span>
  );
}
