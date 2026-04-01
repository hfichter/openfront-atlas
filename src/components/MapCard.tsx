import type { MapEntry, Category } from '../types';
import { frequencyLabel } from '../types';

interface Props {
  slug: string;
  map: MapEntry;
  base: string;
}

const categoryColor: Record<Category, string> = {
  continental: '#77e0ff',
  regional: '#34d399',
  fantasy: '#a78bfa',
  arcade: '#fbbf24',
  tournament: '#f87171',
};

export default function MapCard({ slug, map, base }: Props) {
  const color = categoryColor[map.category];

  return (
    <a
      href={`${base}map/${slug}/`}
      className="group block rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'var(--surface-elevated)',
        borderColor: 'var(--border)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}44`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}15`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: map.width / map.height > 1.5 ? '16/9' : '4/3' }}>
        <img
          src={`${base}thumbnails/${slug}.webp`}
          alt={map.display_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,9,19,0.7) 0%, transparent 60%)' }} />
        {/* Category badge */}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium border"
          style={{ color, borderColor: `${color}44`, background: `${color}11` }}
        >
          {map.category.charAt(0).toUpperCase() + map.category.slice(1)}
        </span>
      </div>

      {/* Card body */}
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-2 truncate" style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
          {map.translated_name || map.display_name}
        </h3>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{map.nation_count} nations</span>
          <span>~{map.estimated_max_players} players</span>
          <span style={{ color: map.playlist_frequency >= 5 ? '#34d399' : map.playlist_frequency >= 3 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
            {frequencyLabel(map.playlist_frequency)}
          </span>
        </div>
        {/* Stats bar */}
        <div className="mt-2.5">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(126,145,173,0.15)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${map.land_pct}%`, background: 'linear-gradient(90deg, #34d399, #6ee7b7)' }}
            />
          </div>
        </div>
      </div>
    </a>
  );
}
