import React from 'react';
import { User, Settings, LogOut, Shield, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfileDropdown: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors outline-none">
        <Avatar className="h-8 w-8 border-2 border-yellow-500/50">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-yellow-500/20 text-yellow-400 text-xs font-bold">
            {user?.email ? getInitials(user.email) : 'AD'}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium text-white truncate max-w-[120px]">
            {user?.user_metadata?.full_name || 'Admin'}
          </span>
          <span className="text-[10px] text-blue-200/60 truncate max-w-[120px]">
            {user?.email}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-blue-200/60 hidden md:block" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 bg-slate-900 border-white/10" align="end">
        <DropdownMenuLabel className="text-white">
          <div className="flex flex-col">
            <span className="font-medium">{user?.user_metadata?.full_name || 'Admin User'}</span>
            <span className="text-xs text-blue-200/60 font-normal">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        
        <DropdownMenuItem 
          className="text-blue-200 hover:text-white hover:bg-white/10 cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-blue-200 hover:text-white hover:bg-white/10 cursor-pointer"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-blue-200 hover:text-white hover:bg-white/10 cursor-pointer">
          <Shield className="mr-2 h-4 w-4 text-yellow-400" />
          <span className="text-yellow-400">Admin Access</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-white/10" />
        
        <DropdownMenuItem 
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
