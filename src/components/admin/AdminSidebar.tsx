import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, History, Ticket, Shield, Tag, Flag, TrendingUp,
  MapPin, ShieldCheck, DollarSign, Download, Calendar, Lock, Database,
  Eye, Sliders, Bot, UserCog, ChevronDown, PanelLeft, Home, Award, Mail,
  Handshake, Rocket, Trophy, FileText, Code2, BookOpen, Gem, Car, CreditCard, ListChecks, ScanLine, Gauge, Megaphone, Webhook, Key, Activity, Route,
  ClipboardList, Upload, Search as SearchIcon, Link2, Filter, Sparkles, Video, AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAdminBadgeCounts } from '@/hooks/useAdminBadgeCounts';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuGroups: {
  label: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    route?: string;
    badgeKey?: 'submissions' | 'verifications' | 'fraudAlerts' | 'supportTickets' | 'moderation';
  }[];
}[] = [
  {
    label: 'Home',
    items: [
      { id: 'hub', label: 'Hub', icon: Home },
    ]
  },
  {
    label: '⚡ Needs Attention',
    items: [
      { id: 'admin-submissions', label: 'Business Submissions', icon: ClipboardList, route: '/admin/submissions', badgeKey: 'submissions' },
      { id: 'verifications', label: 'Verifications', icon: ShieldCheck, badgeKey: 'verifications' },
      { id: 'business-review', label: 'Business Review', icon: ListChecks, route: '/admin/business-review' },
      { id: 'moderation', label: 'Moderation', icon: Shield, badgeKey: 'moderation' },
      { id: 'support', label: 'Support Tickets', icon: Ticket, badgeKey: 'supportTickets' },
      { id: 'admin-fraud', label: 'Fraud Detection', icon: AlertTriangle, route: '/admin/fraud-detection', badgeKey: 'fraudAlerts' },
    ]
  },
  {
    label: 'Dashboard',
    items: [
      { id: 'overview', label: 'Overview', icon: BarChart3 },
      { id: 'valuation', label: 'Valuation Metrics', icon: Gem },
      { id: 'growth', label: 'Growth Dashboard', icon: Rocket },
      { id: 'admin-revenue', label: 'Platform Revenue', icon: DollarSign, route: '/admin/revenue' },
    ]
  },
  {
    label: 'Analytics & SEO',
    items: [
      { id: 'retention', label: 'Retention', icon: TrendingUp },
      { id: 'geographic', label: 'Geographic', icon: MapPin },
      { id: 'admin-funnel', label: 'Funnel Analytics', icon: Filter, route: '/admin/funnel' },
      { id: 'admin-seo', label: 'SEO Dashboard', icon: SearchIcon, route: '/admin/seo' },
      { id: 'admin-backlinks', label: 'Backlinks', icon: Link2, route: '/admin/backlinks' },
      { id: 'partner-success', label: 'Partner Stories', icon: Trophy },
    ]
  },
  {
    label: 'Users & Access',
    items: [
      { id: 'users', label: 'User Management', icon: UserCog },
      { id: 'beta-testers', label: 'Beta Testers', icon: Flag },
      { id: 'roles', label: 'Admin Roles', icon: Lock },
      { id: 'impersonate', label: 'View As User', icon: Eye },
    ]
  },
  {
    label: 'Content & Support',
    items: [
      { id: 'audit', label: 'Audit Log', icon: History },
    ]
  },
  {
    label: 'Business & Directory',
    items: [
      { id: 'listing-queue', label: 'Listing Queue', icon: ListChecks },
      { id: 'admin-import', label: 'Business Import', icon: Upload, route: '/admin/business-import' },
      { id: 'agents', label: 'Sales Agents', icon: Users },
      { id: 'admin-commissions', label: 'Commissions', icon: DollarSign, route: '/admin/commissions' },
      { id: 'financial', label: 'Financial', icon: DollarSign },
      { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
      { id: 'loyalty', label: 'Loyalty Program', icon: Award },
      { id: 'qr-fraud', label: 'QR Fraud Monitor', icon: ScanLine },
      { id: 'partners', label: 'Partners', icon: Handshake },
      { id: 'partner-onboarding', label: 'Partner Onboarding', icon: Route },
      { id: 'developers', label: 'Developers', icon: Code2 },
      { id: 'admin-api-clients', label: 'API Clients', icon: Key, route: '/admin/api-clients' },
    ]
  },
  {
    label: 'Sponsors & Outreach',
    items: [
      { id: 'sponsorship', label: 'Sponsorship (Public)', icon: Award, route: '/corporate-sponsorship' },
      { id: 'sponsors-manage', label: 'Sponsors (Manage)', icon: Award, route: '/admin/sponsors' },
      { id: 'sponsor-crm', label: 'Sponsor CRM', icon: Handshake, route: '/admin/sponsor-crm' },
      { id: 'outreach-crm', label: 'Directory Outreach', icon: Megaphone, route: '/admin/outreach' },
      { id: 'investor-portal-admin', label: 'Investor Portal', icon: Shield, route: '/admin/investor-portal' },
    ]
  },
  {
    label: 'Marketing',
    items: [
      { id: 'promos', label: 'Promo Codes', icon: Tag },
      { id: 'flags', label: 'Feature Flags', icon: Flag },
      { id: 'broadcasts', label: 'Broadcasts', icon: Megaphone },
      { id: 'admin-email-list', label: 'Email List', icon: Mail, route: '/admin/email-list' },
      { id: 'email-analytics', label: 'Email Analytics', icon: Mail, route: '/admin/emails' },
      { id: 'admin-marketing-analytics', label: 'Marketing Analytics', icon: BarChart3, route: '/admin/marketing-analytics' },
      { id: 'admin-marketing-materials', label: 'Marketing Materials', icon: FileText, route: '/admin/marketing-materials' },
      { id: 'admin-sentiment', label: 'Sentiment Analysis', icon: Sparkles, route: '/admin/sentiment-analysis' },
      { id: 'admin-heygen', label: 'HeyGen Studio', icon: Video, route: '/admin/heygen' },
    ]
  },
  {
    label: 'Mansa Stays & Rides',
    items: [
      { id: 'mansa-stays', label: 'Mansa Stays', icon: Home },
      { id: 'noire-rideshare', label: 'Noire Rideshare', icon: Car },
    ]
  },
  {
    label: 'Data & Reports',
    items: [
      { id: 'exports', label: 'Data Export', icon: Download },
      { id: 'reports', label: 'Scheduled Reports', icon: Calendar },
      { id: 'database', label: 'DB Monitor', icon: Database },
      { id: 'backups', label: 'Backup & Restore', icon: Shield },
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'system', label: 'Settings', icon: Sliders },
      { id: 'ai', label: 'AI Tools', icon: Bot },
      { id: 'admin-ai-workforce', label: 'AI Workforce', icon: Bot, route: '/admin/ai-workforce' },
      { id: 'kayla-cost', label: 'Kayla Cost Meter', icon: Gauge },
      { id: 'system-health', label: 'System Health', icon: Activity },
      { id: 'webhooks', label: 'Webhooks', icon: Webhook },
      { id: 'api-tokens', label: 'API Tokens', icon: Key },
      { id: 'setup', label: 'Database Setup', icon: Database },
      { id: 'archive', label: 'Archive Recovery', icon: History },
    ]
  },
  {
    label: 'Documentation',
    items: [
      { id: 'user-guide', label: 'User Guide', icon: BookOpen, route: '/user-guide' },
    ]
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const navigate = useNavigate();

  const handleItemClick = (item: { id: string; route?: string }) => {
    if (item.route) {
      navigate(item.route);
    } else {
      onTabChange(item.id);
    }
  };

  return (
    <Sidebar 
      collapsible="icon"
      className="border-r border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-mansagold to-amber-600 flex items-center justify-center">
                <span style={{ color: '#0f172a' }} className="font-bold text-sm">A</span>
              </div>
              <div>
                <h2 style={{ color: '#ffffff' }} className="font-semibold text-sm">Admin Panel</h2>
                <p style={{ color: 'rgba(148, 163, 184, 0.7)' }} className="text-xs">1325.AI</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {menuGroups.map((group) => (
          <Collapsible key={group.label} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel 
                  className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-md px-2 py-1"
                  style={{ color: 'rgba(148, 163, 184, 0.9)' }}
                >
                  {!isCollapsed && <span className="text-xs font-medium uppercase tracking-wider">{group.label}</span>}
                  {!isCollapsed && <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => handleItemClick(item)}
                          isActive={activeTab === item.id}
                          tooltip={isCollapsed ? item.label : undefined}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                            ${activeTab === item.id 
                              ? 'bg-mansagold text-slate-900 font-medium' 
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                            }
                          `}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!isCollapsed && <span className="text-sm">{item.label}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4">
        {!isCollapsed && (
          <p style={{ color: 'rgba(148, 163, 184, 0.6)' }} className="text-xs text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-xs">⌘B</kbd> to toggle
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
