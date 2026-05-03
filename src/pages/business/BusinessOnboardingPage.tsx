import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, MapPin, FileText, Image, ArrowRight, 
  CheckCircle, PartyPopper, Eye, Sparkles, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfileBuilder } from '@/components/business/BusinessProfileBuilder';
import { toast } from 'sonner';

const BusinessOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);

  // Get business name
  const businessName = business?.name || user?.user_metadata?.business_name || 'Your Business';

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching business:', error);
        }
        
        if (data && data.length > 0) {
          setBusiness(data[0]);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusiness();
  }, [user]);

  const handleGoLive = () => {
    setShowBuilder(true);
  };

  const handleSkip = () => {
    navigate('/business-dashboard');
  };

  const handleComplete = async () => {
    toast.success('Your listing is now live! 🎉');
    // Fire-and-forget Kayla first-touch enrichment so the dashboard
    // greets the new owner with personalized insights (idempotent on business_id).
    if (business?.id) {
      supabase.functions
        .invoke('kayla-first-touch', { body: { businessId: business.id } })
        .catch((err) => console.warn('[kayla-first-touch] background invoke failed:', err));
    }
    navigate('/business-dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mansagold mx-auto mb-4"></div>
          <p className="text-white/60">Loading your business...</p>
        </div>
      </div>
    );
  }

  if (showBuilder && business) {
    return (
      <>
        <Helmet>
          <title>Complete Your Listing | 1325.AI</title>
        </Helmet>
        <div className="min-h-screen bg-black py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setShowBuilder(false)}
                className="mb-4 text-white/70 hover:text-mansagold hover:bg-white/5"
              >
                ← Back
              </Button>
              <h1 className="text-2xl font-bold text-white">Complete Your Listing</h1>
              <p className="text-white/60">Fill in the details to go live</p>
            </div>
            
            <BusinessProfileBuilder
              business={business}
              onUpdate={() => {
                // Refresh business data
                supabase
                  .from('businesses')
                  .select('*')
                  .eq('id', business.id)
                  .single()
                  .then(({ data }) => {
                    if (data) {
                      setBusiness(data);
                      if (data.listing_status === 'live') {
                        handleComplete();
                      }
                    }
                  });
              }}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Welcome to 1325.AI | Get Started</title>
      </Helmet>

      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Decorative orbs — match True Black theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 right-10 w-72 h-72 bg-mansagold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-12 max-w-2xl">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-mansagold to-amber-500 mb-6 shadow-lg shadow-mansagold/30">
              <PartyPopper className="w-10 h-10 text-mansablue-dark" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Welcome, {businessName}! 🎉
            </h1>
            <p className="text-lg text-white/70">
              Your business is almost ready to be discovered by customers on 1325.AI.
            </p>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-2 border-dashed border-mansagold/40 bg-mansablue/30 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-2 text-mansagold mb-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium tracking-wider">PREVIEW</span>
                </div>
                <CardTitle className="text-xl text-white">{businessName}</CardTitle>
                <CardDescription className="text-white/60">
                  {business?.category || 'Category not set'} • {business?.city || 'Location not set'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-white/40">
                    <Image className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Add photos to stand out</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm italic">
                  {business?.description || 'Add a description to tell customers about your business...'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Steps to Go Live */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-mansagold" />
              Complete these steps to go live
            </h2>

            <div className="space-y-3">
              {[
                { icon: FileText, label: 'Add category & description', done: !!business?.category && !!business?.description },
                { icon: MapPin, label: 'Confirm your location', done: !!business?.address && !!business?.city },
                { icon: Image, label: 'Upload logo (optional)', done: !!business?.logo_url },
              ].map((step, index) => (
                <Card
                  key={step.label}
                  className={`transition-colors backdrop-blur-xl ${
                    step.done
                      ? 'bg-emerald-500/10 border-emerald-400/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <CardContent className="py-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.done ? 'bg-emerald-500/20' : 'bg-white/10'
                    }`}>
                      {step.done ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <step.icon className="w-5 h-5 text-white/50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.done ? 'text-emerald-300' : 'text-white/80'}`}>
                        {step.label}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${
                      step.done ? 'text-emerald-400' : 'text-white/40'
                    }`}>
                      {step.done ? 'Done' : `Step ${index + 1}`}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-mansagold/15 to-mansablue/30 border border-mansagold/20 rounded-2xl p-6 mb-8 backdrop-blur-xl"
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-mansagold" />
              Why go live today?
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                Get discovered by customers actively looking for community businesses
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                Build loyalty with our QR rewards program
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                Kayla will run a personalized first-look the moment you go live
              </li>
            </ul>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Button
              onClick={handleGoLive}
              className="w-full bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold-dark hover:to-amber-600 text-mansablue-dark font-semibold py-6 text-lg shadow-lg shadow-mansagold/20"
            >
              Complete My Listing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-white/60 hover:text-white hover:bg-white/5"
            >
              I'll do this later
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BusinessOnboardingPage;
