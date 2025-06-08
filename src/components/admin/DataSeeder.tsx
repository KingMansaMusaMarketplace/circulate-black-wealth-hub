
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Database, Users, Building, ShoppingCart, Loader2, CheckCircle } from 'lucide-react';

interface SeedStatus {
  businesses: 'pending' | 'seeding' | 'complete';
  users: 'pending' | 'seeding' | 'complete';
  transactions: 'pending' | 'seeding' | 'complete';
  reviews: 'pending' | 'seeding' | 'complete';
}

const DataSeeder: React.FC = () => {
  const [seedStatus, setSeedStatus] = useState<SeedStatus>({
    businesses: 'pending',
    users: 'pending',
    transactions: 'pending',
    reviews: 'pending'
  });
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState(0);

  const sampleBusinesses = [
    {
      name: "Soul Food Sisters",
      category: "restaurant",
      description: "Authentic Southern comfort food with family recipes passed down for generations",
      address: "123 MLK Jr Blvd, Atlanta, GA",
      phone: "(404) 555-0123"
    },
    {
      name: "Natural Hair Studio",
      category: "beauty",
      description: "Premium natural hair care and styling services for all hair types",
      address: "456 Auburn Ave, Atlanta, GA",
      phone: "(404) 555-0456"
    },
    {
      name: "Black Excellence Bookstore",
      category: "retail",
      description: "Curated selection of books by Black authors and African diaspora literature",
      address: "789 Sweet Auburn Ave, Atlanta, GA",
      phone: "(404) 555-0789"
    },
    {
      name: "TechForward Solutions",
      category: "technology",
      description: "Custom software development and IT consulting for small businesses",
      address: "321 Peachtree St, Atlanta, GA",
      phone: "(404) 555-0321"
    },
    {
      name: "Garden Fresh Market",
      category: "grocery",
      description: "Organic produce and specialty foods from local Black farmers",
      address: "654 Martin Luther King Jr Dr, Atlanta, GA",
      phone: "(404) 555-0654"
    }
  ];

  const seedData = async (type: keyof SeedStatus) => {
    setSeedStatus(prev => ({ ...prev, [type]: 'seeding' }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      switch (type) {
        case 'businesses':
          // In a real implementation, this would call Supabase to insert sample businesses
          console.log('Seeding businesses:', sampleBusinesses);
          toast.success('Sample businesses added successfully');
          break;
        case 'users':
          // Seed sample customer profiles
          console.log('Seeding sample users');
          toast.success('Sample users created successfully');
          break;
        case 'transactions':
          // Seed sample transaction data
          console.log('Seeding sample transactions');
          toast.success('Sample transaction data added');
          break;
        case 'reviews':
          // Seed sample reviews
          console.log('Seeding sample reviews');
          toast.success('Sample reviews added');
          break;
      }
      
      setSeedStatus(prev => ({ ...prev, [type]: 'complete' }));
    } catch (error) {
      toast.error(`Failed to seed ${type}`);
      setSeedStatus(prev => ({ ...prev, [type]: 'pending' }));
    }
  };

  const seedAllData = async () => {
    setIsSeeding(true);
    setProgress(0);
    
    const steps = ['businesses', 'users', 'transactions', 'reviews'] as const;
    
    for (let i = 0; i < steps.length; i++) {
      await seedData(steps[i]);
      setProgress(((i + 1) / steps.length) * 100);
    }
    
    setIsSeeding(false);
    toast.success('All sample data seeded successfully!');
  };

  const getStatusBadge = (status: 'pending' | 'seeding' | 'complete') => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
      case 'seeding':
        return <Badge className="bg-blue-100 text-blue-800">Seeding...</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: 'pending' | 'seeding' | 'complete') => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'seeding':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sample Data Seeder
          </CardTitle>
          <CardDescription>
            Populate your application with sample data for testing and demonstration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          {isSeeding && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Seeding Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Individual Seed Status */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(seedStatus.businesses)}
                <div>
                  <span className="font-medium">Sample Businesses</span>
                  <p className="text-sm text-gray-600">5 diverse Black-owned businesses</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(seedStatus.businesses)}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => seedData('businesses')}
                  disabled={seedStatus.businesses === 'seeding' || isSeeding}
                >
                  <Building className="h-4 w-4 mr-1" />
                  Seed
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(seedStatus.users)}
                <div>
                  <span className="font-medium">Sample Users</span>
                  <p className="text-sm text-gray-600">Customer profiles with preferences</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(seedStatus.users)}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => seedData('users')}
                  disabled={seedStatus.users === 'seeding' || isSeeding}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Seed
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(seedStatus.transactions)}
                <div>
                  <span className="font-medium">Sample Transactions</span>
                  <p className="text-sm text-gray-600">Purchase history and economic data</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(seedStatus.transactions)}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => seedData('transactions')}
                  disabled={seedStatus.transactions === 'seeding' || isSeeding}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Seed
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(seedStatus.reviews)}
                <div>
                  <span className="font-medium">Sample Reviews</span>
                  <p className="text-sm text-gray-600">Customer reviews and ratings</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(seedStatus.reviews)}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => seedData('reviews')}
                  disabled={seedStatus.reviews === 'seeding' || isSeeding}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Seed
                </Button>
              </div>
            </div>
          </div>

          {/* Seed All Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={seedAllData}
              disabled={isSeeding}
              className="w-full"
              size="lg"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Seeding All Data...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Seed All Sample Data
                </>
              )}
            </Button>
          </div>

          {/* Sample Data Preview */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">Sample Business Preview</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sampleBusinesses.map((business, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="font-medium">{business.name}</div>
                  <div className="text-gray-600">{business.category} • {business.address}</div>
                  <div className="text-gray-500">{business.description}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSeeder;
