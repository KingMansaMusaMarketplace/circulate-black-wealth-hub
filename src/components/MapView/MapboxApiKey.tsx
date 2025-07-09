import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Key } from 'lucide-react';

interface MapboxApiKeyProps {
  onApiKeySet: (key: string) => void;
}

const MapboxApiKey: React.FC<MapboxApiKeyProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => {
    // Check if API key is already saved in localStorage
    const saved = localStorage.getItem('mapbox_api_key');
    if (saved) {
      setSavedKey(saved);
      onApiKeySet(saved);
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('mapbox_api_key', apiKey.trim());
      setSavedKey(apiKey.trim());
      onApiKeySet(apiKey.trim());
      setApiKey('');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('mapbox_api_key');
    setSavedKey('');
    setApiKey('');
  };

  if (savedKey) {
    return (
      <Alert className="mb-4">
        <Key className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Mapbox API key is configured</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClear}
          >
            Clear Key
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-4 bg-blue-50">
      <div className="flex items-center gap-2 mb-3">
        <Key className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-blue-900">Mapbox API Key Required</h3>
      </div>
      
      <p className="text-sm text-blue-800 mb-4">
        To use the interactive map, you need a Mapbox public token. 
        <a 
          href="https://account.mapbox.com/access-tokens/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline ml-1"
        >
          Get your free token here
          <ExternalLink className="h-3 w-3" />
        </a>
      </p>

      <div className="space-y-3">
        <div>
          <Label htmlFor="mapbox-key">Mapbox Public Token</Label>
          <Input
            id="mapbox-key"
            type="text"
            placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiaWF..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="w-full"
        >
          Save API Key
        </Button>
      </div>
      
      <p className="text-xs text-gray-600 mt-2">
        Your API key will be stored locally in your browser for this session.
      </p>
    </div>
  );
};

export default MapboxApiKey;