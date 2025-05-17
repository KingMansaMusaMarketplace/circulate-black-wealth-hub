
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
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  setNearbyBusinesses: React.Dispatch<React.SetStateAction<BusinessLocation[]>>;
  isVisible: boolean;
  children: (props: {
    loading: boolean;
    error: string | null;
    getUserLocation: () => void;
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
