import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Users, TrendingUp } from 'lucide-react';
import { useMultiLocation } from '@/hooks/use-multi-location';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationsTabProps {
  businessId: string;
  isParent: boolean;
}

export const LocationsTab: React.FC<LocationsTabProps> = ({ businessId, isParent }) => {
  const { locations, analytics, loading, createLocation, convertToParent } = useMultiLocation(businessId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    location_name: '',
    city: '',
    state: '',
    address: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLocation(formData);
    setIsDialogOpen(false);
    setFormData({
      business_name: '',
      location_name: '',
      city: '',
      state: '',
      address: '',
      email: '',
      phone: '',
    });
  };

  if (!isParent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Multi-Location Management</CardTitle>
          <CardDescription>
            Convert your business to a parent location to manage multiple locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={convertToParent}>
            Convert to Parent Business
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <MapPin className="h-8 w-8 text-primary" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{analytics.total_locations}</p>
                  <p className="text-sm text-muted-foreground">Locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-primary" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{analytics.total_customers}</p>
                  <p className="text-sm text-muted-foreground">Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="text-right">
                  <p className="text-2xl font-bold">${analytics.total_revenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{analytics.total_transactions}</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </div>
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location_name">Location Name</Label>
                    <Input
                      id="location_name"
                      value={formData.location_name}
                      onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                      placeholder="e.g., Downtown Branch"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Create Location</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading locations...</p>
            ) : locations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No locations yet. Add your first location to get started.</p>
            ) : (
              locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">{location.location_name || location.business_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {location.city}, {location.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {location.is_verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
