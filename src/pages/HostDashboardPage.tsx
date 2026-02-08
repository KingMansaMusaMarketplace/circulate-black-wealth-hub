import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { vacationRentalService } from '@/lib/services/vacation-rental-service';
import { VacationProperty, VacationBooking } from '@/types/vacation-rental';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format, isAfter, isBefore, isToday } from 'date-fns';
import {
  Home,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Star,
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight,
  Building2,
} from 'lucide-react';

const HostDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<VacationProperty[]>([]);
  const [bookings, setBookings] = useState<VacationBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHostData();
    }
  }, [user]);

  const loadHostData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [propertiesData, bookingsData] = await Promise.all([
        vacationRentalService.fetchHostProperties(user.id),
        vacationRentalService.fetchHostBookings(user.id),
      ]);
      setProperties(propertiesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading host data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      await vacationRentalService.updateProperty(propertyId, { is_active: !currentStatus });
      setProperties(prev => 
        prev.map(p => p.id === propertyId ? { ...p, is_active: !currentStatus } : p)
      );
      toast.success(currentStatus ? 'Property deactivated' : 'Property activated');
    } catch (error) {
      console.error('Error toggling property:', error);
      toast.error('Failed to update property status');
    }
  };

  // Calculate stats
  const totalProperties = properties.length;
  const activeProperties = properties.filter(p => p.is_active).length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const upcomingBookings = bookings.filter(b => 
    b.status === 'confirmed' && isAfter(new Date(b.check_in_date), new Date())
  );
  const currentGuests = bookings.filter(b => 
    b.status === 'confirmed' && 
    isBefore(new Date(b.check_in_date), new Date()) &&
    isAfter(new Date(b.check_out_date), new Date())
  );

  const totalEarnings = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.host_payout || 0), 0);

  const pendingPayouts = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.host_payout || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-mansablue">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Host Dashboard" icon={<Building2 className="w-6 h-6" />}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Mansa Stays Host Dashboard" icon={<Building2 className="w-6 h-6" />}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Properties</CardDescription>
              <CardTitle className="text-3xl text-white flex items-center gap-2">
                <Home className="w-6 h-6 text-mansagold" />
                {activeProperties}/{totalProperties}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Active listings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Bookings</CardDescription>
              <CardTitle className="text-3xl text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-mansablue" />
                {confirmedBookings}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">{upcomingBookings.length} upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Total Earnings</CardDescription>
              <CardTitle className="text-3xl text-white flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-500" />
                ${totalEarnings.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">${pendingPayouts.toLocaleString()} pending</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Current Guests</CardDescription>
              <CardTitle className="text-3xl text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-500" />
                {currentGuests.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Staying now</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Property Button */}
        <div className="flex justify-end">
          <Button 
            onClick={() => navigate('/stays/list-property')}
            className="bg-mansagold hover:bg-mansagold/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Property
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="bookings">Reservations</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="mt-6">
            {properties.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Home className="w-12 h-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No properties yet</h3>
                  <p className="text-slate-400 mb-4 text-center">
                    Start earning by listing your first vacation rental
                  </p>
                  <Button 
                    onClick={() => navigate('/stays/list-property')}
                    className="bg-mansagold hover:bg-mansagold/90 text-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    List Your Property
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                    <div className="relative">
                      {property.photos && property.photos.length > 0 ? (
                        <img 
                          src={property.photos[0]} 
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-slate-700 flex items-center justify-center">
                          <Home className="w-12 h-12 text-slate-500" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className={property.is_active ? 'bg-green-500' : 'bg-slate-500'}>
                          {property.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">{property.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {property.city}, {property.state}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-white">
                          <span className="text-xl font-bold">${property.base_nightly_rate}</span>
                          <span className="text-slate-400 text-sm">/night</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Star className="w-4 h-4 fill-mansagold text-mansagold" />
                          <span>{property.average_rating > 0 ? property.average_rating.toFixed(1) : 'New'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/stays/${property.id}`)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/stays/edit/${property.id}`)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => togglePropertyStatus(property.id, property.is_active)}
                        >
                          {property.is_active ? (
                            <ToggleRight className="w-5 h-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-500" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="mt-6">
            {bookings.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No bookings yet</h3>
                  <p className="text-slate-400 text-center">
                    Once guests book your properties, they'll appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                            {booking.property?.photos?.[0] ? (
                              <img 
                                src={booking.property.photos[0]} 
                                alt={booking.property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home className="w-6 h-6 text-slate-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {booking.property?.title || 'Property'}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {format(new Date(booking.check_in_date), 'MMM d')} - {format(new Date(booking.check_out_date), 'MMM d, yyyy')}
                            </p>
                            <p className="text-sm text-slate-400">
                              {booking.num_nights} nights • {booking.num_guests} guests
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-2">
                          {getStatusBadge(booking.status)}
                          <p className="text-white font-semibold">
                            ${booking.host_payout?.toLocaleString() || '0'} payout
                          </p>
                          <p className="text-xs text-slate-400">
                            Guest: {booking.guest_name || booking.guest_email}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Earnings Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Total Earned</span>
                    <span className="text-2xl font-bold text-white">
                      ${totalEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Pending Payouts</span>
                    <span className="text-xl font-semibold text-mansagold">
                      ${pendingPayouts.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400">Completed Bookings</span>
                    <span className="text-xl font-semibold text-white">
                      {bookings.filter(b => b.status === 'completed').length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-mansagold" />
                    Platform Fees
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    7.5% commission on all bookings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-slate-300 text-sm">
                      Mansa Stays charges a 7.5% platform fee on each booking. This fee helps 
                      support the Black-owned business ecosystem and circulates wealth within 
                      our community.
                    </p>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400">Total Fees Paid</span>
                    <span className="text-lg font-semibold text-white">
                      ${bookings
                        .filter(b => b.status === 'confirmed' || b.status === 'completed')
                        .reduce((sum, b) => sum + (b.platform_fee || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HostDashboardPage;
