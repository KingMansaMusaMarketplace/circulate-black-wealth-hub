import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Home, Store, BookOpen, Users, Trophy, QrCode, Calendar,
  Building2, TrendingUp, TestTube, HelpCircle, Info, Mail,
  ShieldCheck, Settings, Handshake, FileText,
  LogIn, UserPlus, MapPin, Search, ChevronDown, ChevronRight,
  Wallet, Megaphone, GraduationCap, Target, BarChart3, 
  Shield, CreditCard, Bot, Sparkles, Globe, FileCode, 
  Ticket, Share2, Star, Clock, Database, Briefcase,
  MessagesSquare, Award, Zap, Heart, PieChart
} from 'lucide-react';

const AllPagesDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Main', 'User', 'Business']));

  const pages = [
    // Main Pages
    { path: '/', name: 'Home', icon: Home, category: 'Main', description: 'Main landing page' },
    { path: '/about', name: 'About Us', icon: Info, category: 'Main', description: 'Learn about our mission' },
    { path: '/blog', name: 'Blog', icon: BookOpen, category: 'Main', description: 'News and articles' },
    { path: '/directory', name: 'Business Directory', icon: Store, category: 'Main', description: 'Find Black-owned businesses' },
    { path: '/community', name: 'Community Hub', icon: Users, category: 'Main', description: 'Community resources' },
    { path: '/how-it-works', name: 'How It Works', icon: BookOpen, category: 'Main', description: 'Platform guide' },
    { path: '/features', name: 'Features', icon: Sparkles, category: 'Main', description: 'Platform features' },
    { path: '/testimonials', name: 'Testimonials', icon: Star, category: 'Main', description: 'Success stories' },
    { path: '/faq', name: 'FAQ', icon: HelpCircle, category: 'Main', description: 'Frequently asked questions' },
    
    // Authentication
    { path: '/auth', name: 'Auth', icon: LogIn, category: 'Auth', description: 'Authentication page' },
    { path: '/login', name: 'Login', icon: LogIn, category: 'Auth', description: 'Sign in to your account' },
    { path: '/signup', name: 'Sign Up', icon: UserPlus, category: 'Auth', description: 'Create new account' },
    { path: '/business-signup', name: 'Business Signup', icon: Building2, category: 'Auth', description: 'Register your business' },
    { path: '/reset-password', name: 'Password Reset', icon: ShieldCheck, category: 'Auth', description: 'Reset your password' },
    { path: '/new-password', name: 'New Password', icon: ShieldCheck, category: 'Auth', description: 'Set new password' },
    
    // User Dashboard
    { path: '/dashboard', name: 'Dashboard', icon: Settings, category: 'User', description: 'User dashboard' },
    { path: '/user-dashboard', name: 'User Dashboard', icon: Settings, category: 'User', description: 'User overview' },
    { path: '/profile', name: 'Profile', icon: Settings, category: 'User', description: 'Profile settings' },
    { path: '/settings', name: 'Settings', icon: Settings, category: 'User', description: 'Account settings' },
    { path: '/loyalty', name: 'Loyalty Program', icon: Trophy, category: 'User', description: 'Earn and redeem points' },
    { path: '/loyalty-history', name: 'Loyalty History', icon: Clock, category: 'User', description: 'Points history' },
    { path: '/rewards', name: 'Rewards', icon: Award, category: 'User', description: 'Available rewards' },
    { path: '/wallet', name: 'Wallet', icon: Wallet, category: 'User', description: 'Digital wallet' },
    { path: '/customer/bookings', name: 'My Bookings', icon: Calendar, category: 'User', description: 'Your appointments' },
    { path: '/referral', name: 'Referrals', icon: Share2, category: 'User', description: 'Refer friends' },
    { path: '/referral-dashboard', name: 'Referral Dashboard', icon: Share2, category: 'User', description: 'Track referrals' },
    { path: '/karma-dashboard', name: 'Karma Dashboard', icon: Heart, category: 'User', description: 'Community karma' },
    { path: '/recommendations', name: 'Recommendations', icon: Target, category: 'User', description: 'Personalized suggestions' },
    { path: '/leaderboard', name: 'Leaderboard', icon: Trophy, category: 'User', description: 'Top supporters' },
    { path: '/my-tickets', name: 'My Tickets', icon: Ticket, category: 'User', description: 'Support tickets' },
    
    // Business
    { path: '/business-dashboard', name: 'Business Dashboard', icon: Building2, category: 'Business', description: 'Business overview' },
    { path: '/business-analytics', name: 'Business Analytics', icon: BarChart3, category: 'Business', description: 'Performance metrics' },
    { path: '/business-finances', name: 'Business Finances', icon: CreditCard, category: 'Business', description: 'Financial management' },
    { path: '/business-form', name: 'Register Business', icon: Building2, category: 'Business', description: 'Add new business' },
    { path: '/business-profile', name: 'Business Profile', icon: Building2, category: 'Business', description: 'Manage profile' },
    { path: '/business/bookings', name: 'Business Bookings', icon: Calendar, category: 'Business', description: 'Manage appointments' },
    { path: '/business/how-it-works', name: 'Business Guide', icon: BookOpen, category: 'Business', description: 'How to use platform' },
    { path: '/business/b2b-dashboard', name: 'B2B Dashboard', icon: Handshake, category: 'Business', description: 'B2B connections' },
    { path: '/b2b-marketplace', name: 'B2B Marketplace', icon: Globe, category: 'Business', description: 'Business marketplace' },
    { path: '/customers', name: 'Customers', icon: Users, category: 'Business', description: 'Customer management' },
    { path: '/qr-code-management', name: 'QR Management', icon: QrCode, category: 'Business', description: 'Manage QR codes' },
    { path: '/claim-business', name: 'Claim Business', icon: ShieldCheck, category: 'Business', description: 'Claim your listing' },
    
    // Sales & Ambassadors
    { path: '/sales-agent', name: 'Sales Agent', icon: Megaphone, category: 'Sales', description: 'Agent portal' },
    { path: '/sales-agent-dashboard', name: 'Agent Dashboard', icon: BarChart3, category: 'Sales', description: 'Agent overview' },
    { path: '/sales-agent-signup', name: 'Agent Signup', icon: UserPlus, category: 'Sales', description: 'Become an agent' },
    { path: '/become-a-sales-agent', name: 'Become Agent', icon: Megaphone, category: 'Sales', description: 'Agent guide' },
    { path: '/ambassador-resources', name: 'Ambassador Resources', icon: Award, category: 'Sales', description: 'Ambassador materials' },
    { path: '/mansa-ambassadors', name: 'Mansa Ambassadors', icon: Award, category: 'Sales', description: 'Ambassador program' },
    { path: '/sales-agent-code-of-conduct', name: 'Code of Conduct', icon: FileText, category: 'Sales', description: 'Agent guidelines' },
    
    // Corporate & Sponsors
    { path: '/corporate-sponsorship', name: 'Corporate Sponsorship', icon: Handshake, category: 'Corporate', description: 'Sponsorship info' },
    { path: '/corporate-sponsorship-pricing', name: 'Sponsorship Pricing', icon: CreditCard, category: 'Corporate', description: 'Pricing tiers' },
    { path: '/sponsor-dashboard', name: 'Sponsor Dashboard', icon: BarChart3, category: 'Corporate', description: 'Sponsor overview' },
    { path: '/sponsor-success', name: 'Sponsor Success', icon: Trophy, category: 'Corporate', description: 'Success stories' },
    { path: '/coalition', name: 'Coalition', icon: Users, category: 'Corporate', description: 'Join the coalition' },
    { path: '/partnership-framework', name: 'Partnerships', icon: Handshake, category: 'Corporate', description: 'Partnership info' },
    { path: '/investor', name: 'Investor Info', icon: TrendingUp, category: 'Corporate', description: 'Investment opportunities' },
    
    // Analytics & Impact
    { path: '/impact', name: 'Impact Dashboard', icon: TrendingUp, category: 'Analytics', description: 'Economic impact' },
    { path: '/community-impact', name: 'Community Impact', icon: Heart, category: 'Analytics', description: 'Community metrics' },
    { path: '/economic-impact', name: 'Economic Impact', icon: PieChart, category: 'Analytics', description: 'Economic data' },
    { path: '/share-impact', name: 'Share Impact', icon: Share2, category: 'Analytics', description: 'Share your impact' },
    
    // Tools & Features
    { path: '/scanner', name: 'QR Scanner', icon: QrCode, category: 'Tools', description: 'Scan QR codes' },
    { path: '/qr-code-generator', name: 'QR Generator', icon: QrCode, category: 'Tools', description: 'Create QR codes' },
    { path: '/ai-assistant', name: 'AI Assistant', icon: Bot, category: 'Tools', description: 'AI help' },
    { path: '/susu-circles', name: 'Susu Circles', icon: Users, category: 'Tools', description: 'Savings groups' },
    { path: '/group-challenges', name: 'Group Challenges', icon: Target, category: 'Tools', description: 'Team challenges' },
    { path: '/workflow-builder', name: 'Workflow Builder', icon: Zap, category: 'Tools', description: 'Automation tools' },
    
    // Education & Resources
    { path: '/education', name: 'Education', icon: GraduationCap, category: 'Resources', description: 'Learning resources' },
    { path: '/learning-hub', name: 'Learning Hub', icon: BookOpen, category: 'Resources', description: 'Courses & guides' },
    { path: '/user-guide', name: 'User Guide', icon: FileText, category: 'Resources', description: 'Platform guide' },
    { path: '/knowledge-base', name: 'Knowledge Base', icon: Database, category: 'Resources', description: 'Help articles' },
    { path: '/case-studies', name: 'Case Studies', icon: Briefcase, category: 'Resources', description: 'Success stories' },
    { path: '/feature-guide', name: 'Feature Guide', icon: Sparkles, category: 'Resources', description: 'Feature details' },
    { path: '/loyalty-program-guide', name: 'Loyalty Guide', icon: Trophy, category: 'Resources', description: 'Loyalty program info' },
    { path: '/media-kit', name: 'Media Kit', icon: FileCode, category: 'Resources', description: 'Press materials' },
    { path: '/pitch-deck', name: 'Pitch Deck', icon: FileText, category: 'Resources', description: 'Presentation deck' },
    
    // Support
    { path: '/contact', name: 'Contact Us', icon: Mail, category: 'Support', description: 'Get in touch' },
    { path: '/help', name: 'Help Center', icon: HelpCircle, category: 'Support', description: 'Help & support' },
    { path: '/help-center', name: 'Help Center', icon: HelpCircle, category: 'Support', description: 'Support articles' },
    { path: '/support', name: 'Support', icon: MessagesSquare, category: 'Support', description: 'Customer support' },
    { path: '/submit-ticket', name: 'Submit Ticket', icon: Ticket, category: 'Support', description: 'Create support ticket' },
    { path: '/team-contact', name: 'Team Contact', icon: Users, category: 'Support', description: 'Contact team' },
    
    // Admin
    { path: '/admin', name: 'Admin Panel', icon: Shield, category: 'Admin', description: 'Admin dashboard' },
    { path: '/admin-dashboard', name: 'Admin Dashboard', icon: BarChart3, category: 'Admin', description: 'Admin overview' },
    { path: '/admin/verification', name: 'Verification', icon: ShieldCheck, category: 'Admin', description: 'Verify businesses' },
    { path: '/admin/commissions', name: 'Commissions', icon: CreditCard, category: 'Admin', description: 'Manage commissions' },
    { path: '/admin/sponsors', name: 'Sponsors', icon: Handshake, category: 'Admin', description: 'Manage sponsors' },
    { path: '/admin/sponsor-crm', name: 'Sponsor CRM', icon: Users, category: 'Admin', description: 'Sponsor management' },
    { path: '/admin/business-import', name: 'Business Import', icon: Database, category: 'Admin', description: 'Import businesses' },
    { path: '/admin/email-list', name: 'Email List', icon: Mail, category: 'Admin', description: 'Email management' },
    { path: '/admin/emails', name: 'Email Analytics', icon: BarChart3, category: 'Admin', description: 'Email metrics' },
    { path: '/admin/fraud-detection', name: 'Fraud Detection', icon: Shield, category: 'Admin', description: 'Security alerts' },
    { path: '/admin/marketing-analytics', name: 'Marketing Analytics', icon: TrendingUp, category: 'Admin', description: 'Marketing metrics' },
    { path: '/admin/marketing-materials', name: 'Marketing Materials', icon: FileText, category: 'Admin', description: 'Marketing assets' },
    { path: '/admin/sentiment-analysis', name: 'Sentiment Analysis', icon: MessagesSquare, category: 'Admin', description: 'User feedback' },
    
    // Developers
    { path: '/developers', name: 'Developers', icon: FileCode, category: 'Developers', description: 'API documentation' },
    { path: '/developers/dashboard', name: 'Dev Dashboard', icon: BarChart3, category: 'Developers', description: 'Developer portal' },
    { path: '/partner-portal', name: 'Partner Portal', icon: Handshake, category: 'Developers', description: 'Partner API access' },
    
    // Legal
    { path: '/privacy', name: 'Privacy Policy', icon: FileText, category: 'Legal', description: 'Privacy information' },
    { path: '/terms', name: 'Terms of Service', icon: FileText, category: 'Legal', description: 'Terms and conditions' },
    { path: '/cookies', name: 'Cookie Policy', icon: FileText, category: 'Legal', description: 'Cookie usage' },
    { path: '/accessibility', name: 'Accessibility', icon: ShieldCheck, category: 'Legal', description: 'Accessibility info' },
    
    // Testing (Development)
    { path: '/apple-compliance-test', name: 'Apple Compliance', icon: ShieldCheck, category: 'Testing', description: 'App Store test' },
    { path: '/system-test', name: 'System Test', icon: TestTube, category: 'Testing', description: 'System check' },
    { path: '/full-system-test', name: 'Full System Test', icon: TestTube, category: 'Testing', description: 'Complete test' },
    { path: '/comprehensive-test', name: 'Comprehensive Test', icon: TestTube, category: 'Testing', description: 'All features test' },
    { path: '/testing-hub', name: 'Testing Hub', icon: TestTube, category: 'Testing', description: 'Test dashboard' },
  ];

  const categories = [
    'Main', 'Auth', 'User', 'Business', 'Sales', 'Corporate', 
    'Analytics', 'Tools', 'Resources', 'Support', 'Admin', 
    'Developers', 'Legal', 'Testing'
  ];

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;
    const query = searchQuery.toLowerCase();
    return pages.filter(
      page => 
        page.name.toLowerCase().includes(query) || 
        page.path.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query) ||
        page.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(cat => 
      filteredPages.some(page => page.category === cat)
    );
  }, [searchQuery, filteredPages]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const expandAll = () => setExpandedCategories(new Set(categories));
  const collapseAll = () => setExpandedCategories(new Set());

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setExpandedCategories(prev => new Set([...prev, category]));
    }
  };

  return (
    <>
      <Helmet>
        <title>All Pages Directory | 1325.AI Platform</title>
        <meta name="description" content="Complete directory of all pages in the platform" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="mb-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-mansagold/20 to-amber-500/20 backdrop-blur-xl border border-mansagold/30 mb-2">
              <MapPin className="w-8 h-8 text-mansagold" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
              All Pages Directory
            </h1>
            <p className="text-lg text-blue-100/90">Quick navigation to all platform pages</p>
          </div>

          {/* Search & Controls */}
          <div className="mb-6 max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search pages by name, path, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg bg-slate-800/60 border-white/10 text-white placeholder:text-slate-400 focus:border-mansagold/50"
              />
            </div>
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={expandAll}
                className="bg-slate-800/60 border-white/10 text-white hover:bg-mansagold/20 hover:border-mansagold/50"
              >
                Expand All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={collapseAll}
                className="bg-slate-800/60 border-white/10 text-white hover:bg-mansagold/20 hover:border-mansagold/50"
              >
                Collapse All
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-4">
                <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-mansagold">Quick Jump</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-auto max-h-[60vh]">
                      <nav className="space-y-1">
                        {filteredCategories.map(category => {
                          const count = filteredPages.filter(p => p.category === category).length;
                          return (
                            <button
                              key={category}
                              onClick={() => scrollToCategory(category)}
                              className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-blue-100/80 hover:text-white hover:bg-mansagold/20 rounded-lg transition-colors"
                            >
                              <span>{category}</span>
                              <span className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-full">
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </nav>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <ScrollArea className="h-auto">
                <div className="space-y-4">
                  {filteredCategories.map(category => {
                    const categoryPages = filteredPages.filter(p => p.category === category);
                    const isExpanded = expandedCategories.has(category);
                    
                    return (
                      <Collapsible
                        key={category}
                        id={`category-${category}`}
                        open={isExpanded}
                        onOpenChange={() => toggleCategory(category)}
                      >
                        <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 overflow-hidden">
                          <CollapsibleTrigger asChild>
                            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="h-1 w-8 bg-gradient-to-r from-mansagold to-amber-500 rounded-full" />
                                <h2 className="text-xl font-bold text-white">{category}</h2>
                                <span className="text-sm text-slate-400">({categoryPages.length} pages)</span>
                              </div>
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-mansagold" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-slate-400" />
                              )}
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {categoryPages.map(page => {
                                  const Icon = page.icon;
                                  return (
                                    <Link key={page.path} to={page.path}>
                                      <div className="group flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-mansagold/40 hover:bg-slate-800/50 transition-all duration-200">
                                        <div className="flex-shrink-0 bg-mansagold/15 w-12 h-12 rounded-xl flex items-center justify-center border border-mansagold/20 group-hover:border-mansagold/40 transition-colors">
                                          <Icon className="h-6 w-6 text-mansagold" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h3 className="text-base font-semibold text-white truncate group-hover:text-mansagold transition-colors">
                                            {page.name}
                                          </h3>
                                          <p className="text-xs text-slate-400 truncate">{page.description}</p>
                                          <code className="text-xs font-mono text-blue-300/60 block truncate mt-1">
                                            {page.path}
                                          </code>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-mansagold transition-colors flex-shrink-0" />
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    );
                  })}
                </div>

                {filteredPages.length === 0 && (
                  <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 p-12 text-center">
                    <Search className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No pages found</h3>
                    <p className="text-slate-400">Try a different search term</p>
                  </Card>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPagesDirectory;
