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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <img 
              src={neuralBrainLogo} 
              alt="1325.AI Neural Brain Logo" 
              className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(214,158,46,0.4)]"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
            1325.AI Platform User Guide
          </h1>
          <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
            Comprehensive documentation for everything you need to know about using the 1325.AI platform
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button 
              onClick={handlePrint}
              variant="outline" 
              className="bg-slate-800/60 border-white/10 text-white hover:bg-slate-700/60"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Guide
            </Button>
            <Button 
              onClick={exportUserGuideToPDF}
              variant="outline" 
              className="bg-slate-800/60 border-white/10 text-white hover:bg-slate-700/60"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              type="text"
              placeholder="Search the user guide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/60 backdrop-blur-xl border-white/10 text-white placeholder:text-white/40 rounded-xl focus:border-mansagold/50 focus:ring-mansagold/20"
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

        {/* Table of Contents (Quick Nav) */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 mb-12">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Book className="h-5 w-5 text-mansagold" />
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_USER_GUIDE_SECTIONS.map((category) => (
                <div key={category.category} className="space-y-2">
                  <h3 className="font-semibold text-mansagold">{category.category}</h3>
                  <ul className="space-y-1">
                    {category.sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="text-blue-200/70 hover:text-mansagold text-sm flex items-center gap-1 transition-colors"
                        >
                          {iconMap[section.icon]}
                          <span>{section.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-16">
          {filteredSections.map((category) => (
            <div key={category.category} className="space-y-8">
              {/* Category Header */}
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-3xl font-bold text-white">{category.category}</h2>
              </div>

              {/* Sections */}
              {category.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-mansablue/20 to-blue-900/20 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-mansagold to-amber-500 rounded-xl shadow-lg">
                          {iconMap[section.icon]}
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-white">{section.title}</CardTitle>
                          <CardDescription className="text-blue-200/70">{section.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Accordion type="multiple" className="w-full">
                        {section.content.map((content, idx) => (
                          <AccordionItem 
                            key={content.id} 
                            value={content.id}
                            className="border-b border-white/5 last:border-0"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-slate-700/30 text-white hover:no-underline">
                              <div className="flex items-center gap-3 text-left">
                                <Badge variant="outline" className="bg-mansablue/20 text-blue-200 border-mansablue/30">
                                  {idx + 1}
                                </Badge>
                                <div>
                                  <div className="font-semibold">{content.title}</div>
                                  <div className="text-sm text-blue-200/60">{content.summary}</div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div className="space-y-6 pl-10">
                                {/* Main Description */}
                                <p className="text-blue-200/80 leading-relaxed">
                                  {content.details}
                                </p>

                                {/* Steps */}
                                {content.steps && content.steps.length > 0 && (
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                      <ChevronRight className="h-4 w-4 text-mansagold" />
                                      Steps
                                    </h4>
                                    <ol className="space-y-2 list-decimal list-inside">
                                      {content.steps.map((step, stepIdx) => (
                                        <li key={stepIdx} className="text-blue-200/70 pl-2">
                                          {step}
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                )}

                                {/* Tips */}
                                {content.tips && content.tips.length > 0 && (
                                  <div className="bg-mansagold/10 border border-mansagold/20 rounded-lg p-4 space-y-2">
                                    <h4 className="font-semibold text-mansagold flex items-center gap-2">
                                      <Sparkles className="h-4 w-4" />
                                      Pro Tips
                                    </h4>
                                    <ul className="space-y-1">
                                      {content.tips.map((tip, tipIdx) => (
                                        <li key={tipIdx} className="text-amber-200/80 text-sm flex items-start gap-2">
                                          <span className="text-mansagold">•</span>
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Related Links */}
                                {content.relatedLinks && content.relatedLinks.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {content.relatedLinks.map((link, linkIdx) => (
                                      <Link key={linkIdx} to={link.path}>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="bg-slate-900/60 border-white/10 text-blue-200 hover:bg-mansablue/20 hover:border-mansablue/30"
                                        >
                                          {link.label}
                                          <ExternalLink className="h-3 w-3 ml-2" />
                                        </Button>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </section>
              ))}
            </div>
          ))}
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
