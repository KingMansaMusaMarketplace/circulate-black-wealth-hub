
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { GraduationCap, Users, TrendingUp, Scan, Gift, Building2, BookOpen, HelpCircle, Shield, Sparkles, Headphones, FolderOpen, Heart } from 'lucide-react';

const NavLinks: React.FC = () => {
  const linkClassName = "text-gray-700 hover:text-mansablue transition-colors font-bold px-3 py-2";
  const triggerClassName = "text-gray-700 hover:text-mansablue transition-colors font-bold text-base";

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="space-x-2">
        {/* Standalone Links */}
        <NavigationMenuItem>
          <Link to="/" className={linkClassName}>
            Home
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/businesses" className={linkClassName}>
            Marketplace
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/about" className={linkClassName}>
            About
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/how-it-works" className={linkClassName}>
            How It Works
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/recommendations" className={linkClassName}>
            Discover
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/impact" className={`${linkClassName} flex items-center gap-1.5`}>
            <Heart className="h-4 w-4" />
            My Impact
          </Link>
        </NavigationMenuItem>

        {/* Services Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 bg-white">
              <li>
                <Link to="/sponsor-pricing" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Corporate Sponsorship</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Partner with us to support Black businesses
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/business/how-it-works" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Business Owner Guide</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Learn how QR payments work for your business
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/sales-agent" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Sales Agent</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Earn by connecting businesses to our platform
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" data-tour="qr-scanner">
                  <div className="flex items-center gap-2">
                    <Scan className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">QR Scanner</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Scan codes to earn loyalty rewards
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Rewards</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    View and redeem your loyalty points
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/community-finance" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Community Finance</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Savings circles and community investments
                  </p>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Resources Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 bg-white">
              <li>
                <Link to="/all-pages" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">All Pages</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Browse complete directory of pages
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Feature Guide</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Explore all platform features
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Blog</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Latest news and insights
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/support" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Support</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Contact support and find answers
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/help" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Help Center</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Get support and answers
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">Accessibility</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Our commitment to inclusion
                  </p>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;
