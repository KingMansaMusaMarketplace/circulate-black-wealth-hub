import React from 'react';
import {
  BarChart3, Users, History, Ticket, Shield, Tag, Flag, TrendingUp,
  MapPin, ShieldCheck, DollarSign, Download, Calendar, Lock, Database,
  Eye, Sliders, Bot, UserCog, Home, Award, Scale, Handshake, BookOpen,
  Archive, ClipboardList, Upload, Search as SearchIcon, Link2, Filter,
  Mail, Sparkles, Rocket, Gem, Trophy, Route, Megaphone, Gauge, Activity,
  Webhook, Key, ScanLine, CreditCard, Code2, Car, ListChecks, FileText,
  Video, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AdminRevenueWidget from './AdminRevenueWidget';
import { useAdminBadgeCounts } from '@/hooks/useAdminBadgeCounts';

interface AdminHubProps {
  onNavigate: (tab: string) => void;
}

type HubItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  route?: string;
  highlight?: boolean;
  badgeKey?: 'submissions' | 'verifications' | 'fraudAlerts' | 'supportTickets' | 'moderation';
};

const sections: { group: string; items: HubItem[] }[] = [
  {
    group: '⚡ Needs Attention',
    items: [
      { id: 'admin-submissions', label: 'Business Submissions', icon: ClipboardList, description: 'Review new business signups from the homepage', route: '/admin/submissions', badgeKey: 'submissions', highlight: true },
      { id: 'verifications', label: 'Verification Queue', icon: ShieldCheck, description: 'Approve pending business verifications', badgeKey: 'verifications' },
      { id: 'business-review', label: 'Business Review Queue', icon: ListChecks, description: 'Review businesses flagged for follow-up', route: '/admin/business-review' },
      { id: 'moderation', label: 'Content Moderation', icon: Shield, description: 'Review flagged content', badgeKey: 'moderation' },
      { id: 'support', label: 'Support Tickets', icon: Ticket, description: 'Handle user support requests', badgeKey: 'supportTickets' },
      { id: 'admin-fraud', label: 'Fraud Detection', icon: AlertTriangle, description: 'Review fraud alerts and suspicious activity', route: '/admin/fraud-detection', badgeKey: 'fraudAlerts' },
    ]
  },
  {
    group: 'Dashboard',
    items: [
      { id: 'overview', label: 'Overview', icon: BarChart3, description: 'Platform analytics and key metrics' },
      { id: 'valuation', label: 'Valuation Metrics', icon: Gem, description: 'Company valuation and cap-table stats' },
      { id: 'growth', label: 'Growth Dashboard', icon: Rocket, description: 'Growth loops and viral metrics' },
      { id: 'admin-revenue', label: 'Platform Revenue', icon: DollarSign, description: 'Revenue by tier, MRR, and payouts', route: '/admin/revenue' },
    ]
  },
  {
    group: 'Analytics & SEO',
    items: [
      { id: 'retention', label: 'Retention', icon: TrendingUp, description: 'User retention and engagement trends' },
      { id: 'geographic', label: 'Geographic', icon: MapPin, description: 'Location-based analytics' },
      { id: 'admin-funnel', label: 'Funnel Analytics', icon: Filter, description: 'Signup and conversion funnels', route: '/admin/funnel' },
      { id: 'admin-seo', label: 'SEO Dashboard', icon: SearchIcon, description: 'Keyword rankings and page audits', route: '/admin/seo' },
      { id: 'admin-backlinks', label: 'Backlinks', icon: Link2, description: 'Referring domains and gap analysis', route: '/admin/backlinks' },
      { id: 'partner-success', label: 'Partner Stories', icon: Trophy, description: 'Success stories from partners' },
    ]
  },
  {
    group: 'Users & Access',
    items: [
      { id: 'users', label: 'User Management', icon: UserCog, description: 'Manage users and permissions' },
      { id: 'beta-testers', label: 'Beta Testers', icon: Flag, description: 'Manage beta tester cohorts' },
      { id: 'roles', label: 'Admin Roles', icon: Lock, description: 'Configure admin access levels' },
      { id: 'impersonate', label: 'View As User', icon: Eye, description: 'Debug by viewing as a user' },
    ]
  },
  {
    group: 'Content & Support',
    items: [
      { id: 'audit', label: 'Audit Log', icon: History, description: 'Track all system activities' },
    ]
  },
  {
    group: 'Business & Directory',
    items: [
      { id: 'admin-import', label: 'Business Import', icon: Upload, description: 'Bulk import businesses & geocode', route: '/admin/business-import' },
      { id: 'agents', label: 'Sales Agents', icon: Users, description: 'Manage sales agent network' },
      { id: 'admin-commissions', label: 'Commissions', icon: DollarSign, description: 'Agent commission payouts', route: '/admin/commissions' },
      { id: 'financial', label: 'Financial', icon: DollarSign, description: 'Financial reports and payouts' },
      { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, description: 'Manage user subscriptions' },
      { id: 'loyalty', label: 'Loyalty Program', icon: Award, description: 'Points, tiers, and rewards' },
      { id: 'qr-fraud', label: 'QR Fraud Monitor', icon: ScanLine, description: 'Monitor QR scan abuse' },
      { id: 'partners', label: 'Partners', icon: Handshake, description: 'Manage partner applications' },
      { id: 'partner-onboarding', label: 'Partner Onboarding', icon: Route, description: 'Onboarding funnel for partners' },
      { id: 'developers', label: 'Developers', icon: Code2, description: 'Manage API developers' },
      { id: 'admin-api-clients', label: 'API Clients', icon: Key, description: 'API client keys and usage', route: '/admin/api-clients' },
      { id: 'ecosystem', label: 'Partner-Dev Ecosystem', icon: Handshake, description: 'Cross-pollination metrics' },
    ]
  },
  {
    group: 'Sponsors & Outreach',
    items: [
      { id: 'sponsors-manage', label: 'Sponsors (Manage)', icon: Award, description: 'Manage active corporate sponsors', route: '/admin/sponsors' },
      { id: 'sponsor-crm', label: 'Sponsor CRM', icon: Handshake, description: 'Sponsor pipeline and outreach', route: '/admin/sponsor-crm' },
      { id: 'outreach-crm', label: 'Directory Outreach', icon: Megaphone, description: 'Outreach to directory prospects', route: '/admin/outreach' },
      { id: 'investor-portal-admin', label: 'Investor Portal', icon: Shield, description: 'Investor portal admin', route: '/admin/investor-portal' },
    ]
  },
  {
    group: 'Marketing',
    items: [
      { id: 'promos', label: 'Promo Codes', icon: Tag, description: 'Create and manage promotions' },
      { id: 'flags', label: 'Feature Flags', icon: Flag, description: 'Toggle features on/off' },
      { id: 'broadcasts', label: 'Broadcasts', icon: Megaphone, description: 'Broadcast announcements to users' },
      { id: 'admin-email-list', label: 'Email List', icon: Mail, description: 'Manage the marketing email list', route: '/admin/email-list' },
      { id: 'admin-emails', label: 'Email Analytics', icon: Mail, description: 'Email campaign performance', route: '/admin/emails' },
      { id: 'admin-marketing-analytics', label: 'Marketing Analytics', icon: BarChart3, description: 'Marketing campaign metrics', route: '/admin/marketing-analytics' },
      { id: 'admin-marketing-materials', label: 'Marketing Materials', icon: FileText, description: 'Downloadable marketing assets', route: '/admin/marketing-materials' },
      { id: 'admin-sentiment', label: 'Sentiment Analysis', icon: Sparkles, description: 'Review sentiment across the platform', route: '/admin/sentiment-analysis' },
      { id: 'admin-heygen', label: 'HeyGen Studio', icon: Video, description: 'Generate spokesperson videos', route: '/admin/heygen' },
    ]
  },
  {
    group: 'Mansa Stays & Rides',
    items: [
      { id: 'mansa-stays', label: 'Mansa Stays', icon: Home, description: 'Vacation rental admin' },
      { id: 'noire-rideshare', label: 'Noire Rideshare', icon: Car, description: 'Rideshare admin' },
    ]
  },
  {
    group: 'Legal & IP',
    items: [
      { id: 'patents', label: 'Patent Documents', icon: Scale, description: 'USPTO filing packages and IP exports' },
    ]
  },
  {
    group: 'Data & Reports',
    items: [
      { id: 'exports', label: 'Data Export', icon: Download, description: 'Export data for analysis' },
      { id: 'reports', label: 'Scheduled Reports', icon: Calendar, description: 'Automate report generation' },
      { id: 'database', label: 'DB Monitor', icon: Database, description: 'Database health and performance' },
      { id: 'backups', label: 'Backup & Restore', icon: Shield, description: 'Backups and restore points' },
    ]
  },
  {
    group: 'System',
    items: [
      { id: 'system', label: 'Settings', icon: Sliders, description: 'Platform configuration' },
      { id: 'ai', label: 'AI Tools', icon: Bot, description: 'AI-powered admin features' },
      { id: 'admin-ai-workforce', label: 'AI Workforce', icon: Bot, description: 'The 42 Agentic AI Employees status', route: '/admin/ai-workforce' },
      { id: 'kayla-cost', label: 'Kayla Cost Meter', icon: Gauge, description: 'Track Kayla AI usage costs' },
      { id: 'system-health', label: 'System Health', icon: Activity, description: 'Live system health' },
      { id: 'webhooks', label: 'Webhooks', icon: Webhook, description: 'Manage outbound webhooks' },
      { id: 'api-tokens', label: 'API Tokens', icon: Key, description: 'Admin API tokens' },
      { id: 'setup', label: 'Database Setup', icon: Database, description: 'Initial DB setup helper' },
      { id: 'archive', label: 'Feature Archive', icon: Archive, description: 'Restore archived features', highlight: true },
    ]
  },
  {
    group: 'Documentation',
    items: [
      { id: 'user-guide', label: 'User Guide', icon: BookOpen, description: 'Complete platform documentation', route: '/user-guide' },
    ]
  },
];

const AdminHub: React.FC<AdminHubProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { data: badges } = useAdminBadgeCounts();

  const handleItemClick = (item: HubItem) => {
    if (item.route) {
      navigate(item.route);
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mansagold/20 border border-mansagold/30 mb-4">
          <Home className="w-8 h-8 text-mansagold" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin Control Center</h2>
        <p className="text-white/60 max-w-md mx-auto">
          Every admin tool in one place. Items with a gold badge need your attention.
        </p>
      </div>

      {/* Live revenue snapshot */}
      <AdminRevenueWidget />

      {/* Sections Grid */}
      {sections.map((section) => (
        <div key={section.group} className="space-y-3">
          <h3 className="text-sm font-semibold text-mansagold uppercase tracking-wider px-1">
            {section.group}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.items.map((item) => {
              const count = item.badgeKey ? badges?.[item.badgeKey] ?? 0 : 0;
              const showBadge = item.badgeKey && count > 0;
              return (
                <Card
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "group cursor-pointer transition-all duration-200 relative",
                    item.highlight
                      ? "bg-gradient-to-br from-amber-500/20 to-orange-600/10 border-mansagold/40 hover:border-mansagold"
                      : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-mansagold/40",
                    "hover:shadow-lg hover:shadow-mansagold/5 hover:-translate-y-0.5"
                  )}
                >
                  {showBadge && (
                    <Badge className="absolute top-2 right-2 bg-mansagold text-slate-900 font-bold border-0">
                      {count}
                    </Badge>
                  )}
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                      item.highlight
                        ? "bg-mansagold/30 border-mansagold/50"
                        : "bg-white/5 group-hover:bg-mansagold/20 border-white/10 group-hover:border-mansagold/30",
                      "transition-colors border"
                    )}>
                      <item.icon className={cn(
                        "w-5 h-5 transition-colors",
                        item.highlight ? "text-mansagold" : "text-white/70 group-hover:text-mansagold"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "font-semibold transition-colors truncate",
                        item.highlight ? "text-mansagold" : "text-white group-hover:text-mansagold"
                      )}>
                        {item.label}
                      </h4>
                      <p className="text-sm text-white/50 line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminHub;
