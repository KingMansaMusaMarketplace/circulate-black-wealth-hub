import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  HelpCircle,
  Search,
  Command,
  Bell,
  Activity,
  Download,
  Keyboard,
  Sun,
  User,
  BarChart3,
  Navigation,
  Zap,
  Shield,
  ChevronRight,
} from 'lucide-react';

interface HelpItem {
  icon: React.ElementType;
  title: string;
  description: string;
  shortcut?: string;
}

const HelpPanel: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('navigation');

  const sections: { id: string; title: string; items: HelpItem[] }[] = [
    {
      id: 'navigation',
      title: 'Navigation & Search',
      items: [
        {
          icon: Navigation,
          title: 'Breadcrumb Navigation',
          description: 'Shows your current location in the dashboard. Click any part to navigate back.',
        },
        {
          icon: Search,
          title: 'Global Search',
          description: 'Search across all users, businesses, and transactions. Type at least 2 characters to see results.',
          shortcut: '/',
        },
        {
          icon: Command,
          title: 'Command Palette',
          description: 'Quick access to all commands and navigation. Type to filter actions.',
          shortcut: '⌘K',
        },
      ],
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Alerts',
      items: [
        {
          icon: BarChart3,
          title: 'Live Data Counters',
          description: 'Real-time metrics showing users, businesses, revenue, and growth. Updates automatically every 30 seconds and on data changes.',
        },
        {
          icon: Activity,
          title: 'System Health Monitor',
          description: 'Shows status and latency of Database, API, and Authentication services. Green = healthy, Yellow = degraded, Red = down.',
        },
        {
          icon: Bell,
          title: 'Notification Center',
          description: 'Real-time notifications for new users, businesses, fraud alerts, and important events. Click to mark as read.',
        },
      ],
    },
    {
      id: 'actions',
      title: 'Quick Actions',
      items: [
        {
          icon: Download,
          title: 'Export Reports',
          description: 'Export users, businesses, transactions, agents, or activity logs as CSV or JSON files.',
        },
        {
          icon: Zap,
          title: 'Quick Actions Button',
          description: 'Floating button (bottom-right) for fast access to AI Dashboard, Verification Queue, and Export Reports.',
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      items: [
        {
          icon: Sun,
          title: 'Theme Toggle',
          description: 'Switch between dark and light mode. Your preference is saved automatically.',
        },
        {
          icon: User,
          title: 'User Profile',
          description: 'View your profile, access settings, and sign out. Shows your avatar and admin status.',
        },
        {
          icon: Keyboard,
          title: 'Keyboard Shortcuts',
          description: 'View all available keyboard shortcuts for faster navigation.',
          shortcut: '?',
        },
      ],
    },
    {
      id: 'tabs',
      title: 'Dashboard Sections',
      items: [
        {
          icon: Shield,
          title: 'Overview',
          description: 'Platform summary with key metrics, recent activity, and quick insights.',
          shortcut: 'G O',
        },
        {
          icon: Shield,
          title: 'Users',
          description: 'Manage all platform users, view details, and handle user-related actions.',
          shortcut: 'G U',
        },
        {
          icon: Shield,
          title: 'Businesses',
          description: 'View and manage registered businesses, verification status, and performance.',
          shortcut: 'G B',
        },
        {
          icon: Shield,
          title: 'Sales Agents',
          description: 'Track agent performance, commissions, referrals, and team metrics.',
          shortcut: 'G A',
        },
        {
          icon: Shield,
          title: 'Financials',
          description: 'Revenue tracking, transaction history, and financial reports.',
          shortcut: 'G F',
        },
        {
          icon: Shield,
          title: 'Security',
          description: 'Security settings, audit logs, and access management.',
          shortcut: 'G S',
        },
      ],
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-yellow-500/30 text-yellow-400 hover:text-white hover:bg-yellow-500/20 hover:border-yellow-500/50"
          data-tour="help-panel"
          title="Help Guide"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96 bg-slate-900 border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-yellow-400" />
            Dashboard Guide
          </SheetTitle>
          <SheetDescription className="text-blue-200/70">
            Learn about all dashboard features and shortcuts
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="font-medium text-white">{section.title}</span>
                  <ChevronRight
                    className={`h-4 w-4 text-blue-200 transition-transform ${
                      expandedSection === section.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                
                {expandedSection === section.id && (
                  <div className="p-3 space-y-3 animate-fade-in">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-2 rounded-lg bg-white/5"
                      >
                        <item.icon className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-white">{item.title}</h4>
                            {item.shortcut && (
                              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 border border-white/20 rounded text-blue-200">
                                {item.shortcut}
                              </kbd>
                            )}
                          </div>
                          <p className="text-xs text-blue-200/70 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HelpPanel;
