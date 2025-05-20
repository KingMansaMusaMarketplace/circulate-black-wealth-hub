
export interface BusinessLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  distance?: string;
  distanceValue?: number;
}

export interface MapContainerProps {
  userLocation: { lat: number; lng: number } | null;
  nearbyBusinesses: BusinessLocation[];
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export interface BusinessListProps {
  nearbyBusinesses: BusinessLocation[];
  onSelectBusiness?: (id: number) => void;
}

export interface DistanceRangesProps {
  nearbyBusinesses: BusinessLocation[];
}
