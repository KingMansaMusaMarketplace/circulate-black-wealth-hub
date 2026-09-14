import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import RequireAdmin from '@/components/auth/RequireAdmin';
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
  return (
    <RequireAdmin>
      <AllPagesContent />
    </RequireAdmin>
  );
};

const AllPagesContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Main', 'User', 'Business']));

  const pages = [
    // Main Pages
    { path: '/', name: 'Home', icon: Home, category: 'Main', description: 'Main landing page' },
    { path: '/about', name: 'About Us', icon: Info, category: 'Main', description: 'Learn about our mission' },
    { path: '/blog', name: 'Blog', icon: BookOpen, category: 'Main', description: 'News and articles' },
    { path: '/directory', name: 'Business Directory', icon: Store, category: 'Main', description: 'Find verified community businesses' },
    { path: '/community', name: 'Community Hub', icon: Users, category: 'Main', description: 'Community resources' },
    { path: '/how-it-works', name: 'How It Works', icon: BookOpen, category: 'Main', description: 'Platform guide' },
    { path: '/features', name: 'Features', icon: Sparkles, category: 'Main', description: 'Platform features' },
    { path: '/faq', name: 'FAQ', icon: HelpCircle, category: 'Main', description: 'Frequently asked questions' },
    
    // Authentication
    { path: '/auth', name: 'Auth', icon: LogIn, category: 'Auth', description: 'Authentication page' },
    { path: '/login', name: 'Login', icon: LogIn, category: 'Auth', description: 'Sign in to your account' },
    { path: '/signup', name: 'Sign Up', icon: UserPlus, category: 'Auth', description: 'Create new account' },
    { path: '/business-signup', name: 'Business Signup', icon: Building2, category: 'Auth', description: 'Register your business' },
    { path: '/reset-password', name: 'Password Reset', icon: ShieldCheck, category: 'Auth', description: 'Reset your password' },
    { path: '/password-reset', name: 'New Password', icon: ShieldCheck, category: 'Auth', description: 'Set new password' },
    
    // User Dashboard
    { path: '/dashboard', name: 'Dashboard', icon: Settings, category: 'User', description: 'User dashboard' },
    { path: '/user-dashboard', name: 'User Dashboard', icon: Settings, category: 'User', description: 'User overview' },
    { path: '/profile', name: 'Profile', icon: Settings, category: 'User', description: 'Profile settings' },
    { path: '/settings', name: 'Settings', icon: Settings, category: 'User', description: 'Account settings' },
    { path: '/loyalty', name: 'Loyalty Program', icon: Trophy, category: 'User', description: 'Earn and redeem points' },
    { path: '/loyalty', name: 'Loyalty History', icon: Clock, category: 'User', description: 'Points history' },
    { path: '/rewards', name: 'Rewards', icon: Award, category: 'User', description: 'Available rewards' },
    { path: '/wallet', name: 'Wallet', icon: Wallet, category: 'User', description: 'Digital wallet' },
    { path: '/customer/bookings', name: 'My Bookings', icon: Calendar, category: 'User', description: 'Your appointments' },
    { path: '/referral', name: 'Referrals', icon: Share2, category: 'User', description: 'Refer friends' },
    { path: '/referrals', name: 'Referral Dashboard', icon: Share2, category: 'User', description: 'Track referrals' },
    { path: '/karma', name: 'Karma Dashboard', icon: Heart, category: 'User', description: 'Community karma' },
    { path: '/recommendations', name: 'Recommendations', icon: Target, category: 'User', description: 'Personalized suggestions' },
    { path: '/sales-agent-leaderboard', name: 'Leaderboard', icon: Trophy, category: 'User', description: 'Top supporters' },
    { path: '/my-tickets', name: 'My Tickets', icon: Ticket, category: 'User', description: 'Support tickets' },
    
    // Business
    { path: '/business-dashboard', name: 'Business Dashboard', icon: Building2, category: 'Business', description: 'Business overview' },
    { path: '/business-analytics', name: 'Business Analytics', icon: BarChart3, category: 'Business', description: 'Performance metrics' },
    { path: '/business-finances', name: 'Business Finances', icon: CreditCard, category: 'Business', description: 'Financial management' },
    { path: '/business-form', name: 'Register Business', icon: Building2, category: 'Business', description: 'Add new business' },
    { path: '/business/profile', name: 'Business Profile', icon: Building2, category: 'Business', description: 'Manage profile' },
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
    { path: '/sponsor-pricing', name: 'Sponsorship Pricing', icon: CreditCard, category: 'Corporate', description: 'Pricing tiers' },
    { path: '/sponsor-dashboard', name: 'Sponsor Dashboard', icon: BarChart3, category: 'Corporate', description: 'Sponsor overview' },
    { path: '/sponsor-success', name: 'Sponsor Success', icon: Trophy, category: 'Corporate', description: 'Success stories' },
    { path: '/coalition', name: 'Coalition', icon: Users, category: 'Corporate', description: 'Join the coalition' },
    { path: '/partnership-framework', name: 'Partnerships', icon: Handshake, category: 'Corporate', description: 'Partnership info' },
    { path: '/investor-portal', name: 'Investor Info', icon: TrendingUp, category: 'Corporate', description: 'Investment opportunities' },
    
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
    { path: '/challenges', name: 'Group Challenges', icon: Target, category: 'Tools', description: 'Team challenges' },
    { path: '/workflow-builder', name: 'Workflow Builder', icon: Zap, category: 'Tools', description: 'Automation tools' },
    
    // Education & Resources
    { path: '/education', name: 'Education', icon: GraduationCap, category: 'Resources', description: 'Learning resources' },
    { path: '/learning-hub', name: 'Learning Hub', icon: BookOpen, category: 'Resources', description: 'Courses & guides' },
    { path: '/user-guide', name: 'User Guide', icon: FileText, category: 'Resources', description: 'Platform guide' },
    { path: '/knowledge-base', name: 'Knowledge Base', icon: Database, category: 'Resources', description: 'Help articles' },
    { path: '/feature-guide', name: 'Feature Guide', icon: Sparkles, category: 'Resources', description: 'Feature details' },
    { path: '/loyalty-program-guide', name: 'Loyalty Guide', icon: Trophy, category: 'Resources', description: 'Loyalty program info' },
    { path: '/media-kit', name: 'Media Kit', icon: FileCode, category: 'Resources', description: 'Press materials' },
    { path: '/pitch-deck', name: 'Pitch Deck', icon: FileText, category: 'Resources', description: 'Presentation deck' },
    
    // Support
    { path: '/contact', name: 'Contact Us', icon: Mail, category: 'Support', description: 'Get in touch' },
    { path: '/help', name: 'Help Center', icon: HelpCircle, category: 'Support', description: 'Help & support' },
    { path: '/help', name: 'Help Center', icon: HelpCircle, category: 'Support', description: 'Support articles' },
    { path: '/support', name: 'Support', icon: MessagesSquare, category: 'Support', description: 'Customer support' },
    { path: '/submit-ticket', name: 'Submit Ticket', icon: Ticket, category: 'Support', description: 'Create support ticket' },
    { path: '/contact', name: 'Team Contact', icon: Users, category: 'Support', description: 'Contact team' },
    
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
    
  ];

  const categories = [
    'Main', 'Auth', 'User', 'Business', 'Sales', 'Corporate', 
    'Analytics', 'Tools', 'Resources', 'Support', 'Admin', 
    'Developers', 'Legal'
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
        <title>Platform Directory | 1325.AI</title>
        <meta name="description" content="Executive index of every page across the 1325.AI platform." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#00050f] via-[#02081a] to-black relative overflow-hidden">
        {/* Ambient accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 right-0 w-[34rem] h-[34rem] bg-mansablue/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 -left-24 w-[30rem] h-[30rem] bg-mansagold/10 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-12 relative z-10">
          {/* Masthead */}
          <header className="border-b border-white/10 pb-8 mb-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-mansagold/30 bg-mansagold/10">
                  <MapPin className="w-3.5 h-3.5 text-mansagold" />
                  <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-mansagold">
                    Platform Index
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  All Pages Directory
                </h1>
                <p className="text-base text-white max-w-2xl">
                  A complete, navigable map of every experience across the 1325.AI platform —
                  member, business, sponsor, and administrative.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:min-w-[280px]">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-4 py-3">
                  <p className="text-2xl font-bold text-mansagold">{pages.length}</p>
                  <p className="text-[11px] uppercase tracking-wider text-white/90">Total Pages</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-4 py-3">
                  <p className="text-2xl font-bold text-mansagold">{categories.length}</p>
                  <p className="text-[11px] uppercase tracking-wider text-white/90">Sections</p>
                </div>
              </div>
            </div>
          </header>

          {/* Search & Controls */}
          <div className="mb-10 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search by page name, path, or section…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-white/[0.04] border-white/10 text-white placeholder:text-white/40 focus:border-mansagold/50 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={expandAll}
                className="h-12 px-5 bg-white/[0.04] border-white/10 text-white font-medium hover:bg-mansagold/15 hover:border-mansagold/40 hover:text-white rounded-xl"
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                onClick={collapseAll}
                className="h-12 px-5 bg-white/[0.04] border-white/10 text-white font-medium hover:bg-mansagold/15 hover:border-mansagold/40 hover:text-white rounded-xl"
              >
                Collapse All
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-6">
                <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10 rounded-2xl">
                  <CardHeader className="pb-3 border-b border-white/10">
                    <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mansagold">
                      Quick Jump
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <ScrollArea className="h-auto max-h-[60vh]">
                      <nav className="space-y-0.5">
                        {filteredCategories.map(category => {
                          const count = filteredPages.filter(p => p.category === category).length;
                          return (
                            <button
                              key={category}
                              onClick={() => scrollToCategory(category)}
                              className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-white hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors group"
                            >
                              <span className="font-medium">{category}</span>
                              <span className="text-[11px] font-semibold text-white/80 group-hover:text-mansagold transition-colors">
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
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-4">
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
                    <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                          <div className="flex items-center gap-4">
                            <span className="h-8 w-1 rounded-full bg-gradient-to-b from-mansagold to-amber-600" />
                            <div className="text-left">
                              <h2 className="text-lg font-semibold tracking-tight text-white">{category}</h2>
                              <p className="text-xs text-white/80">{categoryPages.length} pages</p>
                            </div>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-white/80 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-mansagold' : ''}`}
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-6 pb-6 pt-1 border-t border-white/[0.06]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {categoryPages.map(page => {
                              const Icon = page.icon;
                              return (
                                <Link key={`${category}-${page.path}-${page.name}`} to={page.path} className="block">
                                  <div className="group h-full flex items-start gap-4 p-4 bg-black/30 rounded-xl border border-white/[0.07] hover:border-mansagold/40 hover:bg-white/[0.05] transition-all duration-200">
                                    <div className="flex-shrink-0 bg-mansagold/10 w-10 h-10 rounded-lg flex items-center justify-center border border-mansagold/20 group-hover:bg-mansagold/20 transition-colors">
                                      <Icon className="h-5 w-5 text-mansagold" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-mansagold transition-colors">
                                        {page.name}
                                      </h3>
                                      <p className="text-xs text-white/90 truncate mt-0.5">{page.description}</p>
                                      <code className="text-sm font-mono text-blue-200 block truncate mt-1.5">
                                        {page.path}
                                      </code>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-mansagold group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
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

              {filteredPages.length === 0 && (
                <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10 rounded-2xl p-16 text-center">
                  <Search className="h-10 w-10 text-white/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-1">No pages found</h3>
                  <p className="text-sm text-white/90">Try a different search term.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPagesDirectory;
