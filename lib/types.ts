export type T_LongLat = {
  long: number;
  lat: number;
};

export type T_MapPoint = {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
  toLabel?: string;
} & T_LongLat;
