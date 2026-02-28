import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface KaylaDispatchProps {
  pickup?: string;
  dropoff?: string;
  riderName?: string;
  favoriteDrivers?: Array<{ name: string; vehicle: string; rating: number; distance_min: number }>;
  autoFetch?: boolean;
}

const KaylaDispatch: React.FC<KaylaDispatchProps> = ({
  pickup,
  dropoff,
  riderName,
  favoriteDrivers = [],
  autoFetch = false,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const hasAutoFetched = useRef(false);

  const fetchDispatch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-dispatch', {
        body: {
          rider_name: riderName || 'there',
          pickup: pickup || 'your location',
          dropoff: dropoff || 'your destination',
          favorite_drivers: favoriteDrivers,
        },
      });

      if (error) throw error;
      if (data?.message) setMessage(data.message);
    } catch (err) {
      console.error('Kayla dispatch error:', err);
      setMessage("Hey! I'm getting your ride ready. Your driver will be with you shortly — no surge, no stress. 💛");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && pickup && dropoff && !hasAutoFetched.current) {
      hasAutoFetched.current = true;
      fetchDispatch();
    }
  }, [autoFetch, pickup, dropoff]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="bg-gradient-to-r from-mansagold/10 to-amber-500/5 border-mansagold/20 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-mansagold to-amber-600 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-mansagold font-bold text-sm">Kayla</span>
                  <span className="text-white/30 text-[10px]">AI Concierge</span>
                  {loading && <Sparkles className="h-3 w-3 text-mansagold animate-pulse" />}
                </div>

                {loading ? (
                  <div className="space-y-1.5">
                    <div className="h-3 bg-white/5 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
                  </div>
                ) : message ? (
                  <p className="text-white/80 text-sm leading-relaxed">{message}</p>
                ) : (
                  <div>
                    <p className="text-white/50 text-xs mb-2">
                      Tap below for a personalized ride update from Kayla
                    </p>
                    <Button
                      size="sm"
                      className="bg-mansagold/20 border border-mansagold/30 text-mansagold hover:bg-mansagold/30 text-xs"
                      onClick={fetchDispatch}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Get Update
                    </Button>
                  </div>
                )}

                {message && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/30 hover:text-white/60 h-6 px-2 text-[10px]"
                      onClick={fetchDispatch}
                    >
                      <RefreshCw className="h-2.5 w-2.5 mr-1" />
                      Refresh
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default KaylaDispatch;
