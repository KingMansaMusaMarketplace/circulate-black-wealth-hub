import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, Store, BookOpen, Users, Trophy, QrCode, Calendar,
  Building2, TrendingUp, TestTube, HelpCircle, Info, Mail,
  ShieldCheck, Settings, Handshake, FileText,
  LogIn, UserPlus, MapPin
} from 'lucide-react';

const AllPagesDirectory = () => {
  const pages = [
    { path: '/', name: 'Home', icon: Home, category: 'Main' },
    { path: '/directory', name: 'Business Directory', icon: Store, category: 'Main' },
    { path: '/how-it-works', name: 'How It Works', icon: BookOpen, category: 'Main' },
    { path: '/about', name: 'About Us', icon: Info, category: 'Main' },
    { path: '/community', name: 'Community Hub', icon: Users, category: 'Main' },
    
    { path: '/login', name: 'Login', icon: LogIn, category: 'Auth' },
    { path: '/signup', name: 'Customer Signup', icon: UserPlus, category: 'Auth' },
    { path: '/business-signup', name: 'Business Signup', icon: Building2, category: 'Auth' },
    { path: '/password-reset-request', name: 'Password Reset', icon: ShieldCheck, category: 'Auth' },
    
    { path: '/dashboard', name: 'Dashboard', icon: Settings, category: 'User' },
    { path: '/profile', name: 'Profile Settings', icon: Settings, category: 'User' },
    { path: '/loyalty', name: 'Loyalty Program', icon: Trophy, category: 'User' },
    { path: '/customer-bookings', name: 'My Bookings', icon: Calendar, category: 'User' },
    
    { path: '/business-dashboard', name: 'Business Dashboard', icon: Building2, category: 'Business' },
    { path: '/business-profile', name: 'Business Profile', icon: Building2, category: 'Business' },
    { path: '/business-form', name: 'Register Business', icon: Building2, category: 'Business' },
    { path: '/qr-generator', name: 'QR Code Generator', icon: QrCode, category: 'Business' },
    { path: '/business-bookings', name: 'Bookings Management', icon: Calendar, category: 'Business' },
    
    { path: '/sponsorship', name: 'Corporate Sponsorship', icon: Handshake, category: 'Corporate' },
    { path: '/community-impact', name: 'Community Impact', icon: TrendingUp, category: 'Analytics' },
    { path: '/economic-impact', name: 'Economic Impact', icon: TrendingUp, category: 'Analytics' },
    
    { path: '/qr-scanner', name: 'QR Scanner', icon: QrCode, category: 'Tools' },
    { path: '/qr-scanner-v2', name: 'QR Scanner V2', icon: QrCode, category: 'Tools' },
    
    { path: '/help', name: 'Help Center', icon: HelpCircle, category: 'Support' },
    { path: '/faq', name: 'FAQ', icon: HelpCircle, category: 'Support' },
    { path: '/contact', name: 'Contact Us', icon: Mail, category: 'Support' },
    
    { path: '/admin', name: 'Admin Panel', icon: ShieldCheck, category: 'Admin' },
    { path: '/admin-dashboard', name: 'Admin Dashboard', icon: ShieldCheck, category: 'Admin' },
    { path: '/admin-verification', name: 'Business Verification', icon: ShieldCheck, category: 'Admin' },
    
    { path: '/system-test', name: 'System Test', icon: TestTube, category: 'Testing' },
    { path: '/mobile-test', name: 'Mobile Test', icon: TestTube, category: 'Testing' },
    { path: '/comprehensive-test', name: 'Comprehensive Test', icon: TestTube, category: 'Testing' },
    { path: '/full-system-test', name: 'Full System Test', icon: TestTube, category: 'Testing' },
    { path: '/capacitor-test', name: 'Capacitor Test', icon: TestTube, category: 'Testing' },
    
    { path: '/privacy-policy', name: 'Privacy Policy', icon: FileText, category: 'Legal' },
    { path: '/terms-of-service', name: 'Terms of Service', icon: FileText, category: 'Legal' },
    { path: '/cookie-policy', name: 'Cookie Policy', icon: FileText, category: 'Legal' },
  ];

  const categories = Array.from(new Set(pages.map(p => p.category)));

  return (
    <>
      <Helmet>
        <title>All Pages | Mansa Musa Marketplace</title>
        <meta name="description" content="Complete directory of all pages in Mansa Musa Marketplace" />
      </Helmet>

      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">All Pages Directory</h1>
            <p className="text-muted-foreground">Complete list of all available pages</p>
          </div>

          {categories.map(category => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages
                  .filter(p => p.category === category)
                  .map(page => {
                    const Icon = page.icon;
                    return (
                      <Link key={page.path} to={page.path}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{page.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="font-mono text-xs">{page.path}</CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllPagesDirectory;