import React, { useState, useEffect, useCallback } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  DollarSign,
  Shield,
  AlertTriangle,
  Activity,
  Bot,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
  Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface CommandPaletteProps {
  onTabChange: (tab: string) => void;
  onExportOpen: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onTabChange, onExportOpen }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const navigationCommands = [
    { icon: LayoutDashboard, label: 'Go to Overview', action: () => onTabChange('overview') },
    { icon: Users, label: 'Go to Users', action: () => onTabChange('users') },
    { icon: Building2, label: 'Go to Businesses', action: () => onTabChange('businesses') },
    { icon: UserCheck, label: 'Go to Sales Agents', action: () => onTabChange('agents') },
    { icon: DollarSign, label: 'Go to Financials', action: () => onTabChange('financials') },
    { icon: Shield, label: 'Go to Security', action: () => onTabChange('security') },
    { icon: AlertTriangle, label: 'Go to Fraud Alerts', action: () => onTabChange('fraud') },
    { icon: Activity, label: 'Go to Activity Log', action: () => onTabChange('activity') },
  ];

  const actionCommands = [
    { icon: Download, label: 'Export Reports', action: onExportOpen },
    { icon: Bot, label: 'Open AI Assistant', action: () => navigate('/ai-assistant') },
    { icon: FileText, label: 'View Verification Queue', action: () => navigate('/admin/verification') },
    { icon: Settings, label: 'System Settings', action: () => onTabChange('security') },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-200 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 text-[10px] font-medium text-blue-200">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            {navigationCommands.map((cmd) => (
              <CommandItem
                key={cmd.label}
                onSelect={() => runCommand(cmd.action)}
                className="cursor-pointer"
              >
                <cmd.icon className="mr-2 h-4 w-4" />
                <span>{cmd.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Actions">
            {actionCommands.map((cmd) => (
              <CommandItem
                key={cmd.label}
                onSelect={() => runCommand(cmd.action)}
                className="cursor-pointer"
              >
                <cmd.icon className="mr-2 h-4 w-4" />
                <span>{cmd.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Account">
            <CommandItem
              onSelect={() => runCommand(() => signOut())}
              className="cursor-pointer text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CommandPalette;
