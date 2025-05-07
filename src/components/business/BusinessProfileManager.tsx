
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, FileText, Image, Settings } from 'lucide-react';
import BusinessForm from './BusinessForm';
import BusinessImageUpload from './BusinessImageUpload';
import { fetchBusinessProfile, BusinessProfile } from '@/lib/api/business-api';
import { toast } from 'sonner';

const BusinessProfileManager = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const businessProfile = await fetchBusinessProfile(user.id);
        setProfile(businessProfile);
      } catch (error) {
        console.error('Error loading business profile:', error);
        toast.error('Failed to load business profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleProfileUpdate = (updates: BusinessProfile) => {
    setProfile(prev => prev ? { ...prev, ...updates } : updates);
  };

  const handleImageUpdate = (updates: { logo_url?: string, banner_url?: string }) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue mr-2" />
        <p>Loading business profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText size={16} />
            Business Details
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image size={16} />
            Images
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Business Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Business Information</h2>
              <BusinessForm key={profile?.id || 'new'} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {profile?.id ? (
                <BusinessImageUpload 
                  businessId={profile.id}
                  ownerId={profile.owner_id}
                  logoUrl={profile.logo_url}
                  bannerUrl={profile.banner_url}
                  onUpdate={handleImageUpdate}
                />
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                  <p>Please save your business details first before uploading images.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Loyalty Program Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Points Per Visit</h4>
                        <p className="text-sm text-gray-500">Standard points awarded per visit</p>
                      </div>
                      <input 
                        type="number" 
                        className="w-24 px-3 py-1 border rounded"
                        defaultValue={10}
                        min={1}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Points Per Review</h4>
                        <p className="text-sm text-gray-500">Points awarded for customer reviews</p>
                      </div>
                      <input 
                        type="number" 
                        className="w-24 px-3 py-1 border rounded"
                        defaultValue={15} 
                        min={0}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Points Per Dollar Spent</h4>
                        <p className="text-sm text-gray-500">Additional points based on purchase amount</p>
                      </div>
                      <input 
                        type="number" 
                        className="w-24 px-3 py-1 border rounded"
                        defaultValue={1} 
                        min={0}
                        step={0.1}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Discount Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Standard Discount</h4>
                        <p className="text-sm text-gray-500">Default discount for app users</p>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="number" 
                          className="w-24 px-3 py-1 border rounded-r-none rounded-l"
                          defaultValue={10} 
                          min={0}
                          max={100}
                        />
                        <span className="bg-gray-100 px-3 py-1 border border-l-0 rounded-r">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="bg-mansablue hover:bg-mansablue-dark text-white px-4 py-2 rounded">
                    Save Settings
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessProfileManager;
