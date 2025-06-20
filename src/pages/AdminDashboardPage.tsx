
import React from 'react';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Administrative tools and system management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Welcome to the admin dashboard, {user?.user_metadata?.name || 'Admin'}!</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
