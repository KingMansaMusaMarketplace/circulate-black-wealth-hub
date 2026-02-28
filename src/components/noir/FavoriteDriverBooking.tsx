import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, HeartOff, Car, Calendar, Clock, MapPin } from 'lucide-react';
import { useNoireFavoriteDrivers, FavoriteDriver } from '@/hooks/useNoireFavoriteDrivers';

interface Props {
  onScheduleWithDriver?: (driverId: string, driverName: string) => void;
}

const FavoriteDriverBooking: React.FC<Props> = ({ onScheduleWithDriver }) => {
  const { favorites, loading } = useNoireFavoriteDrivers();

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-mansagold fill-mansagold" />
            Favorite Drivers
          </CardTitle>
          <Badge variant="outline" className="border-mansagold/30 text-mansagold text-xs">
            {favorites.length} saved
          </Badge>
        </div>
        <p className="text-white/50 text-xs">Book your preferred driver directly — like a private chauffeur</p>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-10 w-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm">No favorite drivers yet</p>
            <p className="text-white/30 text-xs mt-1">After a great ride, tap ♥ to save your driver</p>
          </div>
        ) : (
          favorites.map((fav, i) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-mansagold/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mansagold to-amber-600 flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                  {fav.driver?.display_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold text-sm truncate">
                      {fav.nickname || fav.driver?.display_name || 'Driver'}
                    </h4>
                    {fav.driver?.is_online && (
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-mansagold text-mansagold" />
                      {fav.driver?.average_rating?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      {fav.driver?.vehicle_make} {fav.driver?.vehicle_model}
                    </span>
                    <span>{fav.rides_together} rides together</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-mansagold hover:bg-amber-500 text-black font-semibold rounded-lg text-xs gap-1"
                  onClick={() => onScheduleWithDriver?.(fav.driver_id, fav.driver?.display_name || 'Driver')}
                >
                  <Calendar className="h-3 w-3" />
                  Book
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteDriverBooking;
