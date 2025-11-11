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
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(`/business/${businessId}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Business
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
            <p className="text-xl text-muted-foreground">{business.business_name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Service & Time</CardTitle>
                </CardHeader>
                <CardContent>
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        This business has no bookable services at the moment.
                      </p>
                    </div>
                  ) : (
                    <BookingForm businessId={businessId!} businessName={business.business_name} />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.logo_url && (
                    <img
                      src={business.logo_url}
                      alt={business.business_name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {business.address}<br />
                      {business.city}, {business.state} {business.zip_code}
                    </p>
                  </div>

                  {business.phone && (
                    <div>
                      <p className="text-sm font-medium mb-1">Phone</p>
                      <p className="text-sm text-muted-foreground">{business.phone}</p>
                    </div>
                  )}

                  {business.email && (
                    <div>
                      <p className="text-sm font-medium mb-1">Email</p>
                      <p className="text-sm text-muted-foreground">{business.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {services.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {services.map((service: any) => (
                        <div key={service.id} className="p-3 bg-muted rounded-lg">
                          <div className="font-medium mb-1">{service.name}</div>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {service.duration_minutes} min
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-primary">
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
      </ResponsiveLayout>
    </>
  );
}
