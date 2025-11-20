import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { BookingForm } from '@/components/booking/BookingForm';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
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
      <ResponsiveLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading text="Loading booking details..." />
        </div>
      </ResponsiveLayout>
    );
  }

  if (!business) {
    return (
      <ResponsiveLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Business Not Found</h2>
          <Button onClick={() => navigate('/businesses')}>
            Browse Businesses
          </Button>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book {business.business_name} | Mansa Musa Marketplace</title>
        <meta name="description" content={`Book an appointment with ${business.business_name}. ${business.description || ''}`} />
      </Helmet>

      <ResponsiveLayout>
        {/* Background decorations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Button
            variant="ghost"
            onClick={() => navigate(`/business/${businessId}`)}
            className="mb-4 backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Business
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Book Appointment</h1>
            <p className="text-xl text-white/90">{business.business_name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl">
                <div className="p-6 border-b border-white/20">
                  <h2 className="text-2xl font-bold text-white">Select Service & Time</h2>
                </div>
                <div className="p-6">
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-white/90">
                        This business has no bookable services at the moment.
                      </p>
                    </div>
                  ) : (
                    <BookingForm businessId={businessId!} businessName={business.business_name} />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl">
                <div className="p-6 border-b border-white/20">
                  <h3 className="text-lg font-bold text-white">Business Info</h3>
                </div>
                <div className="p-6 space-y-4">
                  {business.logo_url && (
                    <img
                      src={business.logo_url}
                      alt={business.business_name}
                      className="w-full h-32 object-cover rounded-lg border border-white/20"
                    />
                  )}
                  
                  <div>
                    <p className="text-sm font-medium mb-1 text-blue-300">Location</p>
                    <p className="text-sm text-white/90">
                      {business.address}<br />
                      {business.city}, {business.state} {business.zip_code}
                    </p>
                  </div>

                  {business.phone && (
                    <div>
                      <p className="text-sm font-medium mb-1 text-blue-300">Phone</p>
                      <p className="text-sm text-white/90">{business.phone}</p>
                    </div>
                  )}

                  {business.email && (
                    <div>
                      <p className="text-sm font-medium mb-1 text-blue-300">Email</p>
                      <p className="text-sm text-white/90">{business.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {services.length > 0 && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl">
                  <div className="p-6 border-b border-white/20">
                    <h3 className="text-lg font-bold text-white">Available Services</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {services.map((service: any) => (
                        <div key={service.id} className="p-3 backdrop-blur-xl bg-white/10 rounded-lg border border-white/20">
                          <div className="font-medium mb-1 text-white">{service.name}</div>
                          {service.description && (
                            <p className="text-sm text-white/70 mb-2">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-white/70">
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    </>
  );
}
