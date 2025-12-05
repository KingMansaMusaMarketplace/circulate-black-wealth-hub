import React from 'react';
import { 
  BarChart3, Users, History, Ticket, Shield, Tag, Flag, TrendingUp, 
  MapPin, ShieldCheck, DollarSign, Download, Calendar, Lock, Database, 
  Eye, Sliders, Bot, UserCog, ChevronDown, PanelLeft
} from 'lucide-react';
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

const menuGroups = [
  {
    label: 'Dashboard',
    items: [
      { id: 'overview', label: 'Overview', icon: BarChart3 },
    ]
  },
  {
    label: 'Analytics',
    items: [
      { id: 'retention', label: 'Retention', icon: TrendingUp },
      { id: 'geographic', label: 'Geographic', icon: MapPin },
    ]
  },
  {
    label: 'Users & Access',
    items: [
      { id: 'users', label: 'User Management', icon: UserCog },
      { id: 'roles', label: 'Admin Roles', icon: Lock },
      { id: 'impersonate', label: 'View As User', icon: Eye },
    ]
  },
  {
    label: 'Content & Support',
    items: [
      { id: 'audit', label: 'Audit Log', icon: History },
      { id: 'moderation', label: 'Moderation', icon: Shield },
      { id: 'support', label: 'Support Tickets', icon: Ticket },
    ]
  },
  {
    label: 'Business',
    items: [
      { id: 'verifications', label: 'Verifications', icon: ShieldCheck },
      { id: 'agents', label: 'Sales Agents', icon: Users },
      { id: 'financial', label: 'Financial', icon: DollarSign },
    ]
  },
  {
    label: 'Marketing',
    items: [
      { id: 'promos', label: 'Promo Codes', icon: Tag },
      { id: 'flags', label: 'Feature Flags', icon: Flag },
    ]
  },
  {
    label: 'Data & Reports',
    items: [
      { id: 'exports', label: 'Data Export', icon: Download },
      { id: 'reports', label: 'Scheduled Reports', icon: Calendar },
      { id: 'database', label: 'DB Monitor', icon: Database },
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'system', label: 'Settings', icon: Sliders },
      { id: 'ai', label: 'AI Tools', icon: Bot },
    ]
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

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
                <p style={{ color: 'rgba(148, 163, 184, 0.7)' }} className="text-xs">Mansa Musa</p>
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
                          onClick={() => onTabChange(item.id)}
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
