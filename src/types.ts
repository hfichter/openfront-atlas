export interface Nation {
  name: string;
  flag: string;
  x: number;
  y: number;
}

export type Category = 'continental' | 'regional' | 'fantasy' | 'arcade' | 'tournament';
export type GeoType = 'global' | 'continent' | 'regional';

export interface MapEntry {
  enum_key: string;
  display_name: string;
  translated_name: string;
  // Prefer translated_name for display; display_name may be CamelCase or lowercase

  category: Category;
  width: number;
  height: number;
  land_tiles: number;
  land_pct: number;
  water_pct: number;
  estimated_max_players: number;
  playlist_frequency: number;
  nation_count: number;
  nations: Nation[];
  thumbnail: string;
  geo_lat?: number;
  geo_lng?: number;
  geo_type?: GeoType;
  legacy?: boolean;
  legacy_removed_sync?: string;
  legacy_note?: string;
  legacy_replaced_by?: string;
}

export type MapsData = Record<string, MapEntry>;

export function frequencyLabel(freq: number): string {
  if (freq >= 8) return 'Very Common';
  if (freq >= 5) return 'Common';
  if (freq >= 3) return 'Regular';
  if (freq >= 1) return 'Rare';
  return 'Private / Custom only';
}

export function categoryLabel(cat: Category): string {
  const labels: Record<Category, string> = {
    continental: 'Continental',
    regional: 'Regional',
    fantasy: 'Fantasy',
    arcade: 'Arcade',
    tournament: 'Tournament',
  };
  return labels[cat];
}
