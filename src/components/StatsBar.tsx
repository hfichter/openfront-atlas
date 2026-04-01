interface Props {
  landPct: number;
  waterPct: number;
  showLabel?: boolean;
}

export default function StatsBar({ landPct, waterPct, showLabel = true }: Props) {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: '#34d399' }}>Land {landPct.toFixed(1)}%</span>
          <span style={{ color: '#38bdf8' }}>Water {waterPct.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${landPct}%`,
            background: 'linear-gradient(90deg, #34d399, #6ee7b7)',
          }}
        />
      </div>
    </div>
  );
}
