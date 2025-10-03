import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useMultiLocation } from '@/hooks/use-multi-location';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationsManagerProps {
  businessId: string;
}

export const LocationsManager: React.FC<LocationsManagerProps> = ({ businessId }) => {
  const { locations, analytics, loading, createLocation } = useMultiLocation(businessId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({
    business_name: '',
    location_name: '',
    city: '',
    state: '',
    address: '',
  });

  const handleAddLocation = async () => {
    await createLocation(newLocation);
    setIsAddDialogOpen(false);
    setNewLocation({
      business_name: '',
      location_name: '',
      city: '',
      state: '',
      address: '',
    });
  };

  if (loading) {
    return <div>Loading locations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_locations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {analytics.total_revenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {analytics.total_customers}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {analytics.total_qr_scans}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Locations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Locations</CardTitle>
              <CardDescription>Manage all your business locations</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new business location
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      value={newLocation.business_name}
                      onChange={(e) => setNewLocation({ ...newLocation, business_name: e.target.value })}
                      placeholder="e.g., Mansa Cafe Downtown"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location_name">Location Name</Label>
                    <Input
                      id="location_name"
                      value={newLocation.location_name}
                      onChange={(e) => setNewLocation({ ...newLocation, location_name: e.target.value })}
                      placeholder="e.g., Downtown Branch"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newLocation.city}
                        onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newLocation.state}
                        onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                        placeholder="NY"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddLocation} className="w-full">
                    Add Location
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locations.map((location) => (
              <Card key={location.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <h3 className="font-semibold">{location.business_name}</h3>
                        <p className="text-sm text-muted-foreground">{location.location_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {location.city}, {location.state}
                        </p>
                      </div>
                    </div>
                    {location.is_verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {locations.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No locations added yet. Click "Add Location" to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationsManager;
