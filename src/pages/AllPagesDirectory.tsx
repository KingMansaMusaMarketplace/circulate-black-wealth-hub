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
    { path: '/about', name: 'About Us', icon: Info, category: 'Main' },
    { path: '/blog', name: 'Blog', icon: BookOpen, category: 'Main' },
    { path: '/directory', name: 'Business Directory', icon: Store, category: 'Main' },
    { path: '/community', name: 'Community Hub', icon: Users, category: 'Main' },
    { path: '/', name: 'Home', icon: Home, category: 'Main' },
    { path: '/how-it-works', name: 'How It Works', icon: BookOpen, category: 'Main' },
    
    { path: '/business-signup', name: 'Business Signup', icon: Building2, category: 'Auth' },
    { path: '/signup', name: 'Customer Signup', icon: UserPlus, category: 'Auth' },
    { path: '/login', name: 'Login', icon: LogIn, category: 'Auth' },
    { path: '/reset-password', name: 'Password Reset', icon: ShieldCheck, category: 'Auth' },
    
    { path: '/dashboard', name: 'Dashboard', icon: Settings, category: 'User' },
    { path: '/loyalty', name: 'Loyalty Program', icon: Trophy, category: 'User' },
    { path: '/customer/bookings', name: 'My Bookings', icon: Calendar, category: 'User' },
    { path: '/profile', name: 'Profile Settings', icon: Settings, category: 'User' },
    
    { path: '/business-dashboard', name: 'Business Dashboard', icon: Building2, category: 'Business' },
    { path: '/business/how-it-works', name: 'Business How It Works', icon: BookOpen, category: 'Business' },
    { path: '/business-form', name: 'Register Business', icon: Building2, category: 'Business' },
    
    { path: '/corporate-sponsorship', name: 'Corporate Sponsorship', icon: Handshake, category: 'Corporate' },
    
    { path: '/community-impact', name: 'Community Impact', icon: TrendingUp, category: 'Analytics' },
    { path: '/impact', name: 'Impact Dashboard', icon: TrendingUp, category: 'Analytics' },
    
    { path: '/scanner', name: 'QR Scanner', icon: QrCode, category: 'Tools' },
    
    { path: '/contact', name: 'Contact Us', icon: Mail, category: 'Support' },
    { path: '/help', name: 'Help Center', icon: HelpCircle, category: 'Support' },
    { path: '/support', name: 'Support', icon: HelpCircle, category: 'Support' },
    
    { path: '/apple-compliance-test', name: 'Apple App Store Compliance', icon: ShieldCheck, category: 'Testing' },
    { path: '/capacitor-test', name: 'Capacitor Test', icon: TestTube, category: 'Testing' },
    { path: '/comprehensive-test', name: 'Comprehensive Test', icon: TestTube, category: 'Testing' },
    { path: '/full-system-test', name: 'Full System Test', icon: TestTube, category: 'Testing' },
    { path: '/system-test', name: 'System Test', icon: TestTube, category: 'Testing' },
    
    { path: '/cookies', name: 'Cookie Policy', icon: FileText, category: 'Legal' },
    { path: '/privacy', name: 'Privacy Policy', icon: FileText, category: 'Legal' },
    { path: '/terms', name: 'Terms of Service', icon: FileText, category: 'Legal' },
  ];

  const categories = Array.from(new Set(pages.map(p => p.category)));

  return (
    <>
      <Helmet>
        <title>All Pages | Mansa Musa Marketplace</title>
        <meta name="description" content="Complete directory of all pages in Mansa Musa Marketplace" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden py-12">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-mansagold/20 to-amber-500/20 backdrop-blur-xl border border-mansagold/30 mb-4 animate-float">
              <MapPin className="w-10 h-10 text-mansagold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">All Pages Directory</h1>
            <p className="text-xl text-blue-100/90">Complete list of all available pages</p>
          </div>

          {categories.map(category => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-mansagold to-amber-500 rounded-full" />
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages
                  .filter(p => p.category === category)
                  .map(page => {
                    const Icon = page.icon;
                    return (
                      <Link key={page.path} to={page.path}>
                        <Card className="h-full bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-mansagold/20 cursor-pointer">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="bg-mansagold/20 w-10 h-10 rounded-lg flex items-center justify-center border border-mansagold/30">
                                <Icon className="h-5 w-5 text-mansagold" />
                              </div>
                              <CardTitle className="text-lg text-white">{page.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="font-mono text-xs text-blue-200/70">{page.path}</CardDescription>
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