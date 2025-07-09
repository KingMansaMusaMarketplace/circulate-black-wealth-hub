import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MapboxApiKeyProps {
  onApiKeySet: (key: string) => void;
}

const MapboxApiKey: React.FC<MapboxApiKeyProps> = ({ onApiKeySet }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasKey, setHasKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          setError('Failed to load map configuration');
          return;
        }

        if (data?.token) {
          setHasKey(true);
          onApiKeySet(data.token);
        } else {
          setError('Mapbox token not available');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load map configuration');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapboxToken();
  }, [onApiKeySet]);

  if (isLoading) {
    return (
      <Alert className="mb-4">
        <Key className="h-4 w-4" />
        <AlertDescription>
          Loading map configuration...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <Key className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (hasKey) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <Key className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Mapbox is configured and ready to use
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4">
      <Key className="h-4 w-4" />
      <AlertDescription>
        Map configuration not available
      </AlertDescription>
    </Alert>
  );
};

export default MapboxApiKey;