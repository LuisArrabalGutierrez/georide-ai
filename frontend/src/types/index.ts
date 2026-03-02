export type RideStatus = 'IDLE' | 'PROCESSING' | 'CONFIRMED';
export type CarType = 'Economy' | 'Premium' | 'Van XL';
export type SearchType = 'pickup' | 'dropoff' | null;
export type AppScreenStatus = 'IDLE' | 'ANALYZING' | 'REVIEW' | 'PROCESSING' | 'CONFIRMED';
export type AppMode = 'ai' | 'manual';

export interface LocationData {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface PlaceResult {
  display_name: string;
  lat: string;
  lon: string;
}

export interface Ride {
    id: string;
    created_at: string;
    status: string;
    car_type: string;
  }

  