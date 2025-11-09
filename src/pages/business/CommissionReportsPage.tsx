import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BusinessCommissionReport } from '@/components/business/BusinessCommissionReport';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';

const CommissionReportsPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      if (!businessId) {
        navigate('/');
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: 'Authentication Required',
            description: 'Please sign in to view commission reports',
            variant: 'destructive'
          });
          navigate('/auth');
          return;
        }

        // Check if user owns this business
        const { data: business, error } = await supabase
          .from('businesses')
          .select('id, business_name, owner_id, location_manager_id')
          .eq('id', businessId)
          .single();

        if (error || !business) {
          toast({
            title: 'Error',
            description: 'Business not found',
            variant: 'destructive'
          });
          navigate('/');
          return;
        }

        if (business.owner_id !== user.id && business.location_manager_id !== user.id) {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to view this business\'s commission reports',
            variant: 'destructive'
          });
          navigate('/');
          return;
        }

        setBusinessName(business.business_name);
        setHasAccess(true);
      } catch (error) {
        console.error('Error checking access:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [businessId, navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Commission Reports - {businessName}</title>
        <meta name="description" content="View commission breakdown and transaction history for your business" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <BusinessCommissionReport businessId={businessId!} />
      </div>
    </>
  );
};

export default CommissionReportsPage;
