import type { Nation } from '../types';

interface Props {
  nations: Nation[];
  base: string;
}

export default function NationsGrid({ nations, base }: Props) {
  if (!nations || nations.length === 0) return null;

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
      {nations.map((nation, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-2.5 py-2 rounded-lg border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <span
            className="nation-flag-wrap"
            style={{ width: 24, height: 16, flexShrink: 0, display: 'inline-block', borderRadius: 3, overflow: 'hidden', background: 'rgba(126,145,173,0.15)', border: '1px solid rgba(126,145,173,0.12)' }}
          >
            {nation.flag && (
              <img
                src={`${base}flags/${nation.flag}.svg`}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </span>
          <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }} title={nation.name}>
            {nation.name}
          </span>
        </div>
      ))}
    </div>
  );
}
