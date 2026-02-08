
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, LayoutDashboard, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';


interface UserMenuProps {
  user: any;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const displayName = user?.user_metadata?.full_name || user?.email || 'User';
  const userType = user?.user_metadata?.user_type || 'customer';

  // If no user, show login/signup buttons
  if (!user) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Link to="/login" className="text-white/80 hover:text-mansagold transition-colors font-bold text-sm sm:text-base px-2 sm:px-3 py-2 whitespace-nowrap">
          Login
        </Link>
        <Button asChild className="font-bold text-sm sm:text-base px-2 sm:px-4 h-8 sm:h-10">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div data-tour="user-menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 w-10 rounded-full select-none touch-manipulation"
              style={{
                WebkitUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
                WebkitTapHighlightColor: 'transparent',
                minHeight: '44px',
                minWidth: '44px'
              }}
            >
              <Avatar className="h-8 w-8 pointer-events-none">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt="User avatar" draggable={false} />
                <AvatarFallback className="select-none">{getUserInitials(displayName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900/95 backdrop-blur-xl border-white/10" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-white">{displayName}</p>
                <p className="w-[200px] truncate text-sm text-white/60">
                  {user?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            
            {userType === 'business' ? (
              <DropdownMenuItem asChild className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10">
                <Link to="/business-dashboard" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Business Dashboard</span>
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10">
                <Link to="/dashboard" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem asChild className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10">
              <Link to="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10">
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            
            {/* Delete Account - Required for Apple 5.1.1(v) compliance */}
            <DropdownMenuItem asChild className="text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10">
              <Link to="/settings?tab=account" className="flex items-center">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Account</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuItem onClick={handleLogout} className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default UserMenu;
