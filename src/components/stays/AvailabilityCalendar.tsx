import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, addMonths, subMonths } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AvailabilityCalendarProps {
  propertyId: string;
  baseNightlyRate: number;
  onUpdate?: () => void;
}

interface DateInfo {
  date: Date;
  isBlocked: boolean;
  customPrice?: number;
  bookingId?: string;
  priceReason?: string;
}

interface AvailabilityRecord {
  id: string;
  date: string;
  is_available: boolean;
  custom_price: number | null;
}

interface PriceOverrideRecord {
  id: string;
  date: string;
  price_per_night: number;
  reason: string | null;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  propertyId,
  baseNightlyRate,
  onUpdate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Map<string, DateInfo>>(new Map());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'block' | 'price'>('block');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [priceReason, setPriceReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(true);

  useEffect(() => {
    fetchAvailability();
  }, [propertyId, currentMonth]);

  const fetchAvailability = async () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(addMonths(currentMonth, 1));

    try {
      const [availabilityRes, priceRes] = await Promise.all([
        supabase
          .from('property_availability')
          .select('*')
          .eq('property_id', propertyId)
          .gte('date', format(start, 'yyyy-MM-dd'))
          .lte('date', format(end, 'yyyy-MM-dd')),
        supabase
          .from('property_price_overrides')
          .select('*')
          .eq('property_id', propertyId)
          .gte('date', format(start, 'yyyy-MM-dd'))
          .lte('date', format(end, 'yyyy-MM-dd')),
      ]);

      const availMap = new Map<string, DateInfo>();
      
      // Process availability records
      if (availabilityRes.data) {
        (availabilityRes.data as AvailabilityRecord[]).forEach(record => {
          const dateKey = record.date;
          availMap.set(dateKey, {
            date: new Date(record.date),
            isBlocked: !record.is_available,
            customPrice: record.custom_price || undefined,
          });
        });
      }

      // Process price overrides
      if (priceRes.data) {
        (priceRes.data as PriceOverrideRecord[]).forEach(record => {
          const dateKey = record.date;
          const existing = availMap.get(dateKey);
          availMap.set(dateKey, {
            date: existing?.date || new Date(record.date),
            isBlocked: existing?.isBlocked || false,
            customPrice: record.price_per_night,
            priceReason: record.reason || undefined,
          });
        });
      }

      setAvailability(availMap);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, new Date()) && !isToday(date)) return;

    setSelectedDates(prev => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const exists = prev.some(d => format(d, 'yyyy-MM-dd') === dateStr);
      if (exists) {
        return prev.filter(d => format(d, 'yyyy-MM-dd') !== dateStr);
      }
      return [...prev, date];
    });
  };

  const openBlockDialog = () => {
    if (selectedDates.length === 0) {
      toast.error('Please select dates first');
      return;
    }
    setDialogMode('block');
    setDialogOpen(true);
  };

  const openPriceDialog = () => {
    if (selectedDates.length === 0) {
      toast.error('Please select dates first');
      return;
    }
    setDialogMode('price');
    setCustomPrice(String(baseNightlyRate));
    setDialogOpen(true);
  };

  const handleBlockDates = async () => {
    try {
      const records = selectedDates.map(date => ({
        property_id: propertyId,
        date: format(date, 'yyyy-MM-dd'),
        is_available: !isBlocking,
      }));

      const { error } = await supabase
        .from('property_availability')
        .upsert(records, { onConflict: 'property_id,date' });

      if (error) throw error;

      toast.success(isBlocking ? 'Dates blocked' : 'Dates unblocked');
      setSelectedDates([]);
      setDialogOpen(false);
      fetchAvailability();
      onUpdate?.();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleSetPrices = async () => {
    if (!customPrice) {
      toast.error('Please enter a price');
      return;
    }

    try {
      const records = selectedDates.map(date => ({
        property_id: propertyId,
        date: format(date, 'yyyy-MM-dd'),
        price_per_night: parseFloat(customPrice),
        reason: priceReason || null,
      }));

      const { error } = await supabase
        .from('property_price_overrides')
        .upsert(records, { onConflict: 'property_id,date' });

      if (error) throw error;

      toast.success('Custom prices set');
      setSelectedDates([]);
      setDialogOpen(false);
      setCustomPrice('');
      setPriceReason('');
      fetchAvailability();
      onUpdate?.();
    } catch (error) {
      console.error('Error setting prices:', error);
      toast.error('Failed to set prices');
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getStartPadding = () => {
    const firstDay = startOfMonth(currentMonth);
    return firstDay.getDay();
  };

  const renderDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const info = availability.get(dateStr);
    const isSelected = selectedDates.some(d => format(d, 'yyyy-MM-dd') === dateStr);
    const isPast = isBefore(date, new Date()) && !isToday(date);
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return (
      <button
        key={dateStr}
        onClick={() => handleDateClick(date)}
        disabled={isPast || !isCurrentMonth}
        className={cn(
          'relative p-2 h-16 border border-slate-700 rounded-lg transition-all text-left',
          isPast && 'opacity-40 cursor-not-allowed',
          !isCurrentMonth && 'opacity-20',
          isSelected && 'ring-2 ring-mansagold',
          info?.isBlocked && 'bg-red-900/30',
          info?.customPrice && !info?.isBlocked && 'bg-amber-900/30',
          !info?.isBlocked && !info?.customPrice && 'bg-slate-800/50 hover:bg-slate-700/50',
          isToday(date) && 'border-mansablue'
        )}
      >
        <span className={cn(
          'text-sm font-medium',
          isToday(date) ? 'text-mansablue' : 'text-white'
        )}>
          {format(date, 'd')}
        </span>
        
        {info?.isBlocked && (
          <Lock className="absolute bottom-1 right-1 w-3 h-3 text-red-400" />
        )}
        
        {info?.customPrice && !info?.isBlocked && (
          <span className="absolute bottom-1 left-1 text-xs text-mansagold font-semibold">
            ${info.customPrice}
          </span>
        )}
      </button>
    );
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-mansagold" />
              Availability Calendar
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage your property's availability and pricing
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white font-medium min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-800/50 border border-slate-700 rounded" />
            <span className="text-slate-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-900/30 border border-slate-700 rounded" />
            <span className="text-slate-400">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-900/30 border border-slate-700 rounded" />
            <span className="text-slate-400">Custom Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-mansagold rounded" />
            <span className="text-slate-400">Selected</span>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding for first week */}
          {Array.from({ length: getStartPadding() }).map((_, i) => (
            <div key={`pad-${i}`} className="h-16" />
          ))}
          
          {/* Days */}
          {getDaysInMonth().map(date => renderDay(date))}
        </div>

        {/* Action buttons */}
        {selectedDates.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700">
            <Badge variant="secondary">
              {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected
            </Badge>
            <Button size="sm" variant="outline" onClick={openBlockDialog}>
              <Lock className="w-4 h-4 mr-1" />
              Block/Unblock
            </Button>
            <Button size="sm" variant="outline" onClick={openPriceDialog}>
              <DollarSign className="w-4 h-4 mr-1" />
              Set Price
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setSelectedDates([])}
            >
              Clear
            </Button>
          </div>
        )}
      </CardContent>

      {/* Block Dialog */}
      <Dialog open={dialogOpen && dialogMode === 'block'} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Block or Unblock Dates</DialogTitle>
            <DialogDescription className="text-slate-400">
              Manage availability for {selectedDates.length} selected date{selectedDates.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isBlocking ? (
                  <Lock className="w-5 h-5 text-red-400" />
                ) : (
                  <Unlock className="w-5 h-5 text-green-400" />
                )}
                <Label className="text-white">
                  {isBlocking ? 'Block dates (unavailable)' : 'Unblock dates (available)'}
                </Label>
              </div>
              <Switch
                checked={isBlocking}
                onCheckedChange={setIsBlocking}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBlockDates} className="bg-mansagold text-black hover:bg-mansagold/90">
              {isBlocking ? 'Block Dates' : 'Unblock Dates'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price Dialog */}
      <Dialog open={dialogOpen && dialogMode === 'price'} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Set Custom Pricing</DialogTitle>
            <DialogDescription className="text-slate-400">
              Set custom nightly rate for {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white">Price per Night</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="pl-8 bg-slate-900 border-slate-700 text-white"
                  placeholder={String(baseNightlyRate)}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Base rate: ${baseNightlyRate}/night
              </p>
            </div>
            <div>
              <Label className="text-white">Reason (optional)</Label>
              <Input
                value={priceReason}
                onChange={(e) => setPriceReason(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white mt-1"
                placeholder="e.g., Holiday weekend, Special event"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetPrices} className="bg-mansagold text-black hover:bg-mansagold/90">
              Set Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AvailabilityCalendar;
