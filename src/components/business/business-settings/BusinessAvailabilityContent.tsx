import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Clock, Calendar } from 'lucide-react';
import { BusinessProfile } from '@/hooks/use-business-profile';

interface TimeSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface BusinessAvailabilityContentProps {
  profile: BusinessProfile | null;
}

const DAYS = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

const BusinessAvailabilityContent: React.FC<BusinessAvailabilityContentProps> = ({ profile }) => {
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.id) {
      loadAvailability();
    }
  }, [profile?.id]);

  const loadAvailability = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('business_availability')
        .select('*')
        .eq('business_id', profile.id)
        .order('day_of_week');

      if (error) throw error;

      // Initialize with existing data or default values
      const availabilityMap = new Map(
        (data || []).map(item => [item.day_of_week, item])
      );

      const fullWeek = DAYS.map(day => {
        const existing = availabilityMap.get(day.id);
        return existing || {
          day_of_week: day.id,
          start_time: '09:00',
          end_time: '17:00',
          is_available: false,
        };
      });

      setAvailability(fullWeek);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast({
        title: "Error",
        description: "Failed to load availability",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (dayIndex: number, field: keyof TimeSlot, value: any) => {
    setAvailability(prev =>
      prev.map((slot, idx) =>
        idx === dayIndex ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSave = async () => {
    if (!profile?.id) return;

    setSaving(true);
    try {
      // Delete existing availability
      const { error: deleteError } = await supabase
        .from('business_availability')
        .delete()
        .eq('business_id', profile.id);

      if (deleteError) throw deleteError;

      // Insert new availability (only for days marked as available)
      const availableDays = availability
        .filter(slot => slot.is_available)
        .map(slot => ({
          business_id: profile.id,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: slot.is_available,
        }));

      if (availableDays.length > 0) {
        const { error: insertError } = await supabase
          .from('business_availability')
          .insert(availableDays);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Availability updated successfully"
      });
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error",
        description: "Failed to save availability",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!profile?.id) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <p>Please save your business details first before setting availability.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>Business Hours</CardTitle>
        </div>
        <CardDescription>
          Set your availability for customer bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading availability...
          </div>
        ) : (
          <div className="space-y-4">
            {availability.map((slot, index) => (
              <div
                key={slot.day_of_week}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-2 min-w-[120px]">
                  <Switch
                    checked={slot.is_available}
                    onCheckedChange={(checked) =>
                      updateDay(index, 'is_available', checked)
                    }
                  />
                  <Label className="font-medium">
                    {DAYS[slot.day_of_week].name}
                  </Label>
                </div>

                {slot.is_available && (
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="time"
                        value={slot.start_time}
                        onChange={(e) =>
                          updateDay(index, 'start_time', e.target.value)
                        }
                        className="px-3 py-2 border rounded-md"
                      />
                    </div>
                    <span className="text-muted-foreground">to</span>
                    <div>
                      <input
                        type="time"
                        value={slot.end_time}
                        onChange={(e) =>
                          updateDay(index, 'end_time', e.target.value)
                        }
                        className="px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                )}

                {!slot.is_available && (
                  <span className="text-sm text-muted-foreground">
                    Closed
                  </span>
                )}
              </div>
            ))}

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Availability'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessAvailabilityContent;
