import React from 'react';
import { 
  BarChart3, Users, History, Ticket, Shield, Tag, Flag, TrendingUp, 
  MapPin, ShieldCheck, DollarSign, Download, Calendar, Lock, Database, 
  Eye, Sliders, Bot, UserCog, Home, Award, Scale, Handshake, BookOpen,
  Archive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminHubProps {
  onNavigate: (tab: string) => void;
}

const sections = [
  {
    group: 'Dashboard',
    items: [
      { id: 'overview', label: 'Overview', icon: BarChart3, description: 'Platform analytics and key metrics' },
    ]
  },
  {
    group: 'Analytics',
    items: [
      { id: 'retention', label: 'Retention', icon: TrendingUp, description: 'User retention and engagement trends' },
      { id: 'geographic', label: 'Geographic', icon: MapPin, description: 'Location-based analytics' },
    ]
  },
  {
    group: 'Users & Access',
    items: [
      { id: 'users', label: 'User Management', icon: UserCog, description: 'Manage users and permissions' },
      { id: 'roles', label: 'Admin Roles', icon: Lock, description: 'Configure admin access levels' },
      { id: 'impersonate', label: 'View As User', icon: Eye, description: 'Debug by viewing as a user' },
    ]
  },
  {
    group: 'Content & Support',
    items: [
      { id: 'audit', label: 'Audit Log', icon: History, description: 'Track all system activities' },
      { id: 'moderation', label: 'Moderation', icon: Shield, description: 'Review flagged content' },
      { id: 'support', label: 'Support Tickets', icon: Ticket, description: 'Handle user support requests' },
    ]
  },
  {
    group: 'Business',
    items: [
      { id: 'verifications', label: 'Verifications', icon: ShieldCheck, description: 'Approve business verifications' },
      { id: 'agents', label: 'Sales Agents', icon: Users, description: 'Manage sales agent network' },
      { id: 'financial', label: 'Financial', icon: DollarSign, description: 'Financial reports and payouts' },
      { id: 'loyalty', label: 'Loyalty Program', icon: Award, description: 'Manage loyalty points, tiers, and rewards' },
      { id: 'developers', label: 'Developers', icon: Database, description: 'Manage API developers and usage' },
      { id: 'ecosystem', label: 'Partner-Dev Ecosystem', icon: Handshake, description: 'Cross-pollination metrics and technical partners' },
    ]
  },
  {
    group: 'Legal & IP',
    items: [
      { id: 'patents', label: 'Patent Documents', icon: Scale, description: 'USPTO filing packages and IP exports' },
    ]
  },
  {
    group: 'Marketing',
    items: [
      { id: 'promos', label: 'Promo Codes', icon: Tag, description: 'Create and manage promotions' },
      { id: 'flags', label: 'Feature Flags', icon: Flag, description: 'Toggle features on/off' },
    ]
  },
  {
    group: 'Data & Reports',
    items: [
      { id: 'exports', label: 'Data Export', icon: Download, description: 'Export data for analysis' },
      { id: 'reports', label: 'Scheduled Reports', icon: Calendar, description: 'Automate report generation' },
      { id: 'database', label: 'DB Monitor', icon: Database, description: 'Database health and performance' },
    ]
  },
  {
    group: 'System',
    items: [
      { id: 'system', label: 'Settings', icon: Sliders, description: 'Platform configuration' },
      { id: 'ai', label: 'AI Tools', icon: Bot, description: 'AI-powered admin features' },
      { id: 'archive', label: 'Feature Archive', icon: Archive, description: 'Restore archived features instantly', highlight: true },
    ]
  },
  {
    group: 'Documentation',
    items: [
      { id: 'user-guide', label: 'User Guide', icon: BookOpen, description: 'Complete platform documentation and tutorials', route: '/user-guide' },
    ]
  },
];

const AdminHub: React.FC<AdminHubProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleItemClick = (item: { id: string; route?: string }) => {
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
          Quick access to all administrative tools. Click any section to get started.
        </p>
      </div>

      {/* Sections Grid */}
      {sections.map((section) => (
        <div key={section.group} className="space-y-3">
          <h3 className="text-sm font-semibold text-mansagold uppercase tracking-wider px-1">
            {section.group}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.items.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "group cursor-pointer transition-all duration-200",
                  item.highlight 
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-600/10 border-mansagold/40 hover:border-mansagold"
                    : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-mansagold/40",
                  "hover:shadow-lg hover:shadow-mansagold/5 hover:-translate-y-0.5"
                )}
              >
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
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminHub;
