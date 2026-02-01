import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  Book, 
  Search, 
  ChevronRight, 
  ChevronDown,
  Rocket,
  Building2,
  QrCode,
  Sparkles,
  Users,
  Wallet,
  LayoutDashboard,
  BadgeCheck,
  Calendar,
  Handshake,
  UserCheck,
  Code2,
  Settings,
  HelpCircle,
  FileDown,
  Printer,
  ExternalLink,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ALL_USER_GUIDE_SECTIONS, 
  GuideSection, 
  GuideContent 
} from '@/lib/user-guide-content';
import { exportUserGuideToPDF } from '@/components/admin/UserGuideExport';
import neuralBrainLogo from '@/assets/1325-neural-brain-logo.jpeg';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="h-5 w-5" />,
  Building2: <Building2 className="h-5 w-5" />,
  QrCode: <QrCode className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Wallet: <Wallet className="h-5 w-5" />,
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
  BadgeCheck: <BadgeCheck className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  Handshake: <Handshake className="h-5 w-5" />,
  UserCheck: <UserCheck className="h-5 w-5" />,
  Code2: <Code2 className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
  HelpCircle: <HelpCircle className="h-5 w-5" />
};

const UserGuidePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<Set<string>>(new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll for back-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter content based on search
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return ALL_USER_GUIDE_SECTIONS;
    
    const term = searchTerm.toLowerCase();
    return ALL_USER_GUIDE_SECTIONS.map(category => ({
      ...category,
      sections: category.sections.map(section => ({
        ...section,
        content: section.content.filter(content => 
          content.title.toLowerCase().includes(term) ||
          content.summary.toLowerCase().includes(term) ||
          content.details.toLowerCase().includes(term) ||
          (content.steps && content.steps.some(step => step.toLowerCase().includes(term)))
        )
      })).filter(section => section.content.length > 0)
    })).filter(category => category.sections.length > 0);
  }, [searchTerm]);

  const toggleContent = (contentId: string) => {
    setExpandedContent(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contentId)) {
        newSet.delete(contentId);
      } else {
        newSet.add(contentId);
      }
      return newSet;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Helmet>
        <title>User Guide | 1325.AI Platform Documentation</title>
        <meta name="description" content="Comprehensive user guide for the 1325.AI platform. Learn about all features including business directory, loyalty points, Susu circles, Karma system, and more." />
      </Helmet>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-mansagold/15 to-amber-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-block mb-4">
            <img 
              src={neuralBrainLogo} 
              alt="1325.AI Neural Brain Logo" 
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain drop-shadow-[0_0_20px_rgba(214,158,46,0.4)]"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
            1325.AI Platform User Guide
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-blue-200/80 max-w-3xl mx-auto">
            Complete documentation for all platform features
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button 
              onClick={handlePrint}
              variant="outline" 
              size="sm"
              className="bg-slate-800/60 border-white/10 text-white hover:bg-slate-700/60"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={exportUserGuideToPDF}
              variant="outline" 
              size="sm"
              className="bg-slate-800/60 border-white/10 text-white hover:bg-slate-700/60"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              type="text"
              placeholder="Search the user guide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/60 backdrop-blur-xl border-white/10 text-white placeholder:text-white/40 rounded-xl focus:border-mansagold/50 focus:ring-mansagold/20"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </Button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-blue-200/60 mt-2 text-center">
              Found {filteredSections.reduce((acc, cat) => acc + cat.sections.reduce((a, s) => a + s.content.length, 0), 0)} results
            </p>
          )}
        </div>

        {/* Two-Column Layout: Sidebar + Content */}
        <div className="flex gap-8">
          {/* Sticky Sidebar Navigation - Hidden on mobile */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Book className="h-5 w-5 text-mansagold" />
                    Quick Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-4">
                    {ALL_USER_GUIDE_SECTIONS.map((category) => (
                      <div key={category.category}>
                        <h3 className="font-semibold text-mansagold text-sm mb-2">{category.category}</h3>
                        <ul className="space-y-1.5">
                          {category.sections.map((section) => (
                            <li key={section.id}>
                              <a
                                href={`#${section.id}`}
                                className="text-blue-200/70 hover:text-mansagold text-sm flex items-center gap-2 py-1 px-2 rounded-md hover:bg-white/5 transition-colors"
                              >
                                <span className="flex-shrink-0">{iconMap[section.icon]}</span>
                                <span className="truncate">{section.title}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Table of Contents */}
            <Card className="lg:hidden bg-slate-800/60 backdrop-blur-xl border-white/10 mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Book className="h-5 w-5 text-mansagold" />
                  Jump to Section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_USER_GUIDE_SECTIONS.flatMap(cat => cat.sections).map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="text-blue-200/70 hover:text-mansagold text-sm flex items-center gap-2 p-2 rounded-lg bg-slate-900/40 hover:bg-slate-900/60 transition-colors"
                    >
                      <span className="flex-shrink-0">{iconMap[section.icon]}</span>
                      <span className="truncate">{section.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="space-y-10">
              {filteredSections.map((category) => (
                <div key={category.category} className="space-y-6">
                  {/* Category Header */}
                  <div className="border-b border-white/10 pb-3">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">{category.category}</h2>
                  </div>

                  {/* Sections as a Grid */}
                  <div className="grid gap-6">
                    {category.sections.map((section) => (
                      <section key={section.id} id={section.id} className="scroll-mt-24">
                        <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-mansablue/20 to-blue-900/20 border-b border-white/10 py-4">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-gradient-to-br from-mansagold to-amber-500 rounded-xl shadow-lg flex-shrink-0">
                                {iconMap[section.icon]}
                              </div>
                              <div className="min-w-0">
                                <CardTitle className="text-xl lg:text-2xl text-white">{section.title}</CardTitle>
                                <CardDescription className="text-blue-200/70 text-sm lg:text-base">{section.description}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            {/* Content Grid for larger screens */}
                            <div className="divide-y divide-white/5">
                              {section.content.map((content, idx) => (
                                <div key={content.id} className="p-4 lg:p-6 hover:bg-slate-700/20 transition-colors">
                                  <div className="flex gap-4">
                                    <Badge variant="outline" className="bg-mansablue/20 text-blue-200 border-mansablue/30 h-7 w-7 flex items-center justify-center flex-shrink-0 text-sm">
                                      {idx + 1}
                                    </Badge>
                                    <div className="flex-1 min-w-0 space-y-3">
                                      <div>
                                        <h4 className="font-semibold text-white text-base lg:text-lg">{content.title}</h4>
                                        <p className="text-blue-200/60 text-sm">{content.summary}</p>
                                      </div>
                                      
                                      {/* Details - Always visible for better readability */}
                                      <p className="text-blue-200/80 leading-relaxed text-sm lg:text-base">
                                        {content.details}
                                      </p>

                                      {/* Steps in horizontal layout when possible */}
                                      {content.steps && content.steps.length > 0 && (
                                        <div className="bg-slate-900/40 rounded-lg p-4">
                                          <h5 className="font-semibold text-white text-sm flex items-center gap-2 mb-3">
                                            <ChevronRight className="h-4 w-4 text-mansagold" />
                                            Steps
                                          </h5>
                                          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                            {content.steps.map((step, stepIdx) => (
                                              <li key={stepIdx} className="text-blue-200/70 text-sm flex items-start gap-2">
                                                <span className="bg-mansablue/30 text-blue-200 text-xs font-medium px-2 py-0.5 rounded flex-shrink-0">
                                                  {stepIdx + 1}
                                                </span>
                                                <span>{step}</span>
                                              </li>
                                            ))}
                                          </ol>
                                        </div>
                                      )}

                                      {/* Tips */}
                                      {content.tips && content.tips.length > 0 && (
                                        <div className="bg-mansagold/10 border border-mansagold/20 rounded-lg p-4">
                                          <h5 className="font-semibold text-mansagold text-sm flex items-center gap-2 mb-2">
                                            <Sparkles className="h-4 w-4" />
                                            Pro Tips
                                          </h5>
                                          <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                            {content.tips.map((tip, tipIdx) => (
                                              <li key={tipIdx} className="text-amber-200/80 text-sm flex items-start gap-2">
                                                <span className="text-mansagold">•</span>
                                                <span>{tip}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Related Links */}
                                      {content.relatedLinks && content.relatedLinks.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                          {content.relatedLinks.map((link, linkIdx) => (
                                            <Link key={linkIdx} to={link.path}>
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="bg-slate-900/60 border-white/10 text-blue-200 hover:bg-mansablue/20 hover:border-mansablue/30 text-xs"
                                              >
                                                {link.label}
                                                <ExternalLink className="h-3 w-3 ml-1.5" />
                                              </Button>
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </section>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Need More Help */}
        <Card className="mt-16 bg-gradient-to-br from-mansablue/20 via-blue-900/20 to-mansagold/10 border-white/10">
          <CardContent className="p-8 text-center">
            <div className="inline-block mb-4">
              <div className="p-3 bg-mansagold/20 rounded-full border border-mansagold/30">
                <HelpCircle className="h-10 w-10 text-mansagold" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Need More Help?</h2>
            <p className="text-blue-200/80 mb-6 max-w-xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/help">
                <Button className="bg-gradient-to-r from-mansablue to-blue-600 hover:opacity-90 text-white">
                  Visit Help Center
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-mansagold/30 text-mansagold hover:bg-mansagold/10">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Legal Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center space-y-2">
          <p className="text-xs text-white/60">
            © 2026 1325.AI. All Rights Reserved.
          </p>
          <p className="text-xs text-white/50">
            CONFIDENTIAL & PROPRIETARY - Unauthorized reproduction or distribution prohibited.
          </p>
          <p className="text-xs text-white/40">
            1325.AI™ and the Neural Brain logo are trademarks of 1325.AI.
          </p>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-mansagold hover:bg-amber-500 text-slate-900 rounded-full p-3 shadow-xl z-50"
            size="icon"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .fixed, button, input, nav, header, footer {
            display: none !important;
          }
          .bg-gradient-to-br, .bg-gradient-to-r {
            background: white !important;
          }
          * {
            color: black !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserGuidePage;
