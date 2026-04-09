import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BookingForm } from '@/components/booking/BookingForm';
import { Helmet } from 'react-helmet-async';
import Loading from '@/components/ui/loading';

export default function BookBusinessPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  const { data: business, isLoading: businessLoading } = useQuery({
    queryKey: ['business-booking', businessId],
    queryFn: async () => {
      // Try public safe view first
      const { data, error } = await supabase
        .from('businesses_public_safe')
        .select('*')
        .eq('id', businessId)
        .maybeSingle();
      if (error) {
        // Fallback to businesses table with safe fields
        const { data: fb } = await supabase
          .from('businesses')
          .select('id,business_name,name,description,category,address,city,state,zip_code,website,logo_url,is_verified,phone,email')
          .eq('id', businessId)
          .maybeSingle();
        return fb;
      }
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
      <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] flex items-center justify-center">
        <Loading text="Loading booking details..." />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-white">Business Not Found</h2>
        <Button
          onClick={() => navigate('/directory')}
          className="bg-gradient-to-r from-mansagold to-yellow-600 text-slate-900 font-semibold"
        >
          Explore Businesses
        </Button>
      </div>
    );
  }

  const bizName = business.business_name || business.name || 'Business';
  const displayImage = business.logo_url || (business.website
    ? `https://image.thum.io/get/width/600/crop/400/${business.website}`
    : null);

  return (
    <>
      <Helmet>
        <title>Book {bizName} | 1325.AI</title>
        <meta name="description" content={`Book an appointment with ${bizName}. ${business.description || ''}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-mansagold/5 rounded-full blur-[120px]" />

        {/* Hero Header */}
        <div className="relative z-10 border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto pt-6 pb-8">
              <button
                onClick={() => navigate(`/business/${businessId}`)}
                className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Business
              </button>

              <div className="flex items-start gap-6">
                <div className="hidden sm:block flex-shrink-0">
                  {displayImage ? (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-mansagold/30 shadow-lg shadow-mansagold/10">
                      <img src={displayImage} alt={bizName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-mansagold/20 to-mansagold/5 border-2 border-mansagold/30 flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-mansagold" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                      {bizName}
                    </h1>
                    {business.is_verified && (
                      <Shield className="w-5 h-5 text-mansagold flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-mansagold font-medium text-lg mb-2">Book an Appointment</p>
                  {business.city && (
                    <div className="flex items-center gap-1.5 text-sm text-white/50">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{business.city}, {business.state}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: Booking Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-mansagold/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-mansagold" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Select Service & Time</h2>
                      <p className="text-sm text-white/40">Choose a service and pick your preferred time slot</p>
                    </div>
                  </div>
                  <div className="p-6">
                    {services.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-white/20" />
                        </div>
                        <p className="text-white/60 font-medium mb-1">No Services Available</p>
                        <p className="text-sm text-white/30">
                          This business hasn't added bookable services yet.
                        </p>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/business/${businessId}`)}
                          className="mt-4 text-mansagold hover:text-mansagold/80 hover:bg-mansagold/5"
                        >
                          View Business Profile
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    ) : (
                      <BookingForm businessId={businessId!} businessName={bizName} services={services} />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Business Info Card */}
                <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06]">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Business Details</h3>
                  </div>
                  <div className="p-6 space-y-5">
                    {displayImage && (
                      <div className="rounded-xl overflow-hidden border border-white/[0.08] aspect-video">
                        <img src={displayImage} alt={bizName} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {business.description && (
                      <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
                        {business.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      {business.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-mansagold mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-white/60">
                            <p>{business.address}</p>
                            <p>{business.city}, {business.state} {business.zip_code}</p>
                          </div>
                        </div>
                      )}

                      {business.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-mansagold flex-shrink-0" />
                          <a href={`tel:${business.phone}`} className="text-sm text-white/60 hover:text-white transition-colors">
                            {business.phone}
                          </a>
                        </div>
                      )}

                      {business.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-mansagold flex-shrink-0" />
                          <a href={`mailto:${business.email}`} className="text-sm text-white/60 hover:text-white transition-colors">
                            {business.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Available Services Quick View */}
                {services.length > 0 && (
                  <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.06]">
                      <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Services & Pricing</h3>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                      {services.map((service: any) => (
                        <div key={service.id} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <span className="font-medium text-sm text-white">{service.name}</span>
                            <span className="text-mansagold font-semibold text-sm whitespace-nowrap">
                              ${service.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            {service.duration_minutes} min
                          </div>
                          {service.description && (
                            <p className="text-xs text-white/30 mt-1 line-clamp-2">
                              {service.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust badge */}
                <div className="rounded-2xl bg-gradient-to-br from-mansagold/5 to-transparent border border-mansagold/10 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-mansagold" />
                    <span className="text-sm font-medium text-white/80">Secure Booking</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Your information is encrypted and secure. You'll receive a confirmation after booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
