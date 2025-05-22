
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface DirectoryRealTimeUpdatesProps {
  onUpdate: () => void;
}

const DirectoryRealTimeUpdates: React.FC<DirectoryRealTimeUpdatesProps> = ({ onUpdate }) => {
  const { toast } = useToast();
  
  // Set up real-time updates for business ratings
  useEffect(() => {
    // Subscribe to changes in the businesses table
    const channel = supabase
      .channel('business-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'businesses' },
        (payload) => {
          console.log('Business updated:', payload);
          // Refresh the businesses list to get the latest data
          onUpdate();
          // Show toast notification
          toast({
            title: "Directory updated",
            description: "Business information has been updated",
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate, toast]);
  
  return null; // This component doesn't render anything
};

export default DirectoryRealTimeUpdates;
