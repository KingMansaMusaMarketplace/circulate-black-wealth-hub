
export interface BusinessLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
  distanceValue?: number;
  distance?: string;
}

export interface LocationProviderProps {
  businesses: BusinessLocation[];
  setUserLocation: (location: {lat: number; lng: number}) => void;
  setNearbyBusinesses: (businesses: BusinessLocation[]) => void;
  isVisible: boolean;
  userLocation: { lat: number; lng: number } | null;
  children: (props: {
    loading: boolean;
    error: string | null;
    getUserLocation: (forceRefresh?: boolean) => Promise<any>;
  }) => React.ReactNode;
}

export interface MapContainerProps {
  userLocation: { lat: number; lng: number } | null;
  nearbyBusinesses: BusinessLocation[];
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export interface DistanceRangesProps {
  nearbyBusinesses: BusinessLocation[];
}

export interface BusinessListProps {
  nearbyBusinesses: BusinessLocation[];
  onSelectBusiness?: (id: number) => void;
}
