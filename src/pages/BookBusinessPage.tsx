import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { BookingForm } from '@/components/booking/BookingForm';
import { Helmet } from 'react-helmet-async';
import Loading from '@/components/ui/loading';

export default function BookBusinessPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  const { data: business, isLoading: businessLoading } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!businessId,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['business-services', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_services')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!businessId,
  });

  if (businessLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <Loading text="Loading booking details..." />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="text-center py-12 relative z-10 flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-4 text-white">Business Not Found</h2>
          <Button 
            onClick={() => navigate('/directory')}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 font-semibold"
          >
            Explore Businesses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book {business.business_name} | Mansa Musa Marketplace</title>
        <meta name="description" content={`Book an appointment with ${business.business_name}. ${business.description || ''}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(`/business/${businessId}`)}
              className="mb-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-white/10 text-white hover:text-yellow-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Business
            </Button>

            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Book Appointment
              </h1>
              <p className="text-xl text-blue-200">{business.business_name}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-yellow-400" />
                      Select Service & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {services.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-blue-200">
                          This business has no bookable services at the moment.
                        </p>
                      </div>
                    ) : (
                      <BookingForm businessId={businessId!} businessName={business.business_name} services={services} />
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-lg font-bold text-white">Business Info</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {business.logo_url && (
                      <img
                        src={business.logo_url}
                        alt={business.business_name}
                        className="w-full h-32 object-cover rounded-lg border border-white/20"
                      />
                    )}
                    
                    <div>
                      <p className="text-sm font-medium mb-1 text-yellow-400">Location</p>
                      <p className="text-sm text-blue-200">
                        {business.address}<br />
                        {business.city}, {business.state} {business.zip_code}
                      </p>
                    </div>

                    {business.phone && (
                      <div>
                        <p className="text-sm font-medium mb-1 text-yellow-400">Phone</p>
                        <p className="text-sm text-blue-200">{business.phone}</p>
                      </div>
                    )}

                    {business.email && (
                      <div>
                        <p className="text-sm font-medium mb-1 text-yellow-400">Email</p>
                        <p className="text-sm text-blue-200">{business.email}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {services.length > 0 && (
                  <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
                    <CardHeader className="border-b border-white/10">
                      <CardTitle className="text-lg font-bold text-white">Available Services</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {services.map((service: any) => (
                          <div key={service.id} className="p-3 bg-slate-800/50 backdrop-blur rounded-lg border border-white/10">
                            <div className="font-medium mb-1 text-white">{service.name}</div>
                            {service.description && (
                              <p className="text-sm text-blue-200/70 mb-2">
                                {service.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-blue-200/70">
                                <Clock className="w-3 h-3" />
                                {service.duration_minutes} min
                              </div>
                              <div className="flex items-center gap-1 font-semibold text-yellow-400">
                                <DollarSign className="w-3 h-3" />
                                {service.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
