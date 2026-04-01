import { useState, useCallback, useEffect } from 'react';
import { t } from '../i18n';
import type { Lang } from '../i18n';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import type { MapEntry, GeoType } from '../types';
import { frequencyLabel } from '../types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface MapPin {
  slug: string;
  map: MapEntry;
}

interface Props {
  pins: MapPin[];        // regional maps (geo_type = "regional")
  continents: MapPin[];  // continental maps (geo_type = "continent")
  routeBase: string;
  assetBase: string;
  lang: Lang;
}

// Rough continent bounding boxes for highlight — keyed by map slug
const CONTINENT_BOUNDS: Record<string, { label: string; cx: number; cy: number }> = {
  northamerica: { label: 'North America', cx: -100, cy: 45 },
  southamerica: { label: 'South America', cx: -60, cy: -15 },
  europe:       { label: 'Europe', cx: 15, cy: 50 },
  europeclassic:{ label: 'Europe (Classic)', cx: 15, cy: 50 },
  asia:         { label: 'Asia', cx: 95, cy: 40 },
  africa:       { label: 'Africa', cx: 20, cy: 0 },
  oceania:      { label: 'Oceania', cx: 135, cy: -25 },
};

const categoryColor: Record<string, string> = {
  continental: '#77e0ff',
  regional: '#34d399',
};

export default function WorldMap({ pins, continents, routeBase, assetBase, lang }: Props) {
  const [tooltip, setTooltip] = useState<{
    slug: string;
    map: MapEntry;
    x: number;
    y: number;
  } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const updateTheme = () => {
      setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = useCallback((slug: string, map: MapEntry, e: React.MouseEvent) => {
    const rect = (e.currentTarget as SVGElement).closest('.rsm-svg')?.getBoundingClientRect() ??
                 (e.currentTarget as SVGElement).getBoundingClientRect();
    setTooltip({ slug, map, x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleClick = useCallback((slug: string) => {
    window.location.href = `${routeBase}map/${slug}/`;
  }, [routeBase]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border" style={{ background: 'var(--map-ocean)', borderColor: 'var(--border)' }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 160 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup center={[0, 20]} zoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: 'var(--map-land)', stroke: 'var(--map-stroke)', strokeWidth: 0.3, outline: 'none' },
                    hover:   { fill: 'var(--map-land-hover)', stroke: 'var(--map-stroke-hover)', strokeWidth: 0.4, outline: 'none' },
                    pressed: { fill: 'var(--map-land-hover)', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Continental markers (larger, labeled) */}
          {continents.map(({ slug, map }) => {
            if (map.geo_lat == null || map.geo_lng == null) return null;
            return (
              <Marker
                key={slug}
                coordinates={[map.geo_lng, map.geo_lat]}
                onMouseEnter={(e) => handleMouseEnter(slug, map, e as unknown as React.MouseEvent)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(slug)}
                style={{ cursor: 'pointer' }}
              >
                <circle r={8} fill="rgba(119,224,255,0.15)" stroke="#77e0ff" strokeWidth={1.5} />
                <circle r={3} fill="#77e0ff" />
                <text
                  textAnchor="middle"
                  y={-14}
                  style={{ fill: '#77e0ff', fontSize: 8, fontFamily: 'Space Grotesk, Inter, sans-serif', fontWeight: 600, pointerEvents: 'none' }}
                >
                  {map.translated_name || map.display_name}
                </text>
              </Marker>
            );
          })}

          {/* Regional pins */}
          {pins.map(({ slug, map }) => {
            if (map.geo_lat == null || map.geo_lng == null) return null;
            return (
              <Marker
                key={slug}
                coordinates={[map.geo_lng, map.geo_lat]}
                onMouseEnter={(e) => handleMouseEnter(slug, map, e as unknown as React.MouseEvent)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(slug)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  r={4}
                  fill="#34d399"
                  fillOpacity={0.85}
                  stroke="rgba(52,211,153,0.4)"
                  strokeWidth={3}
                  className="pin-pulse"
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none rounded-xl border p-3 shadow-2xl"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 10,
            background: 'var(--map-tooltip-bg)',
            borderColor: 'var(--map-tooltip-border)',
            backdropFilter: 'blur(16px)',
            minWidth: 200,
            maxWidth: 240,
            transform: tooltip.x > window.innerWidth - 260 ? 'translateX(-115%)' : 'none',
          }}
        >
          <img
            src={`${assetBase}${theme === 'dark' ? 'thumbnails-dark' : 'thumbnails'}/${tooltip.slug}.webp`}
            alt={tooltip.map.display_name}
            className="w-full rounded-lg mb-2 object-cover"
            style={{ aspectRatio: '16/9' }}
          />
          <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
            {lang === 'fr'
              ? (t(lang, `map.${tooltip.slug}` as any) || tooltip.map.translated_name || tooltip.map.display_name)
              : (tooltip.map.translated_name || tooltip.map.display_name)}
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{tooltip.map.width}×{tooltip.map.height}</span>
            <span>{tooltip.map.nation_count} {t(lang, 'wmap.nations_count' as any)}</span>
            <span>{tooltip.map.land_pct.toFixed(0)}% {t(lang, 'wmap.land_pct' as any)}</span>
            <span>~{tooltip.map.estimated_max_players} {t(lang, 'wmap.players_count' as any)}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#77e0ff', background: 'rgba(119,224,255,0.15)' }} />
          <span>{t(lang, 'wmap.continental')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#34d399' }} />
          <span>{t(lang, 'wmap.regional')}</span>
        </div>
      </div>
    </div>
  );
}
