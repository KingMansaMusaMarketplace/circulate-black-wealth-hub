
export interface BusinessLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
  distanceValue?: number;
  distance?: string;
}

export interface MapContainerProps {
  userLocation: { lat: number; lng: number } | null;
  nearbyBusinesses: BusinessLocation[];
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}
