
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { GraduationCap, Users, TrendingUp, Scan, Gift, Building2, BookOpen, HelpCircle, Shield, Sparkles, Headphones, FolderOpen, Heart, Award } from 'lucide-react';

const NavLinks: React.FC = () => {
  const linkClassName = "text-foreground hover:text-mansagold transition-all duration-300 font-semibold px-3 py-2 rounded-md hover:bg-accent/50 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-mansagold after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";
  const triggerClassName = "text-foreground hover:text-mansagold transition-all duration-300 font-semibold";

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="flex gap-1">
        {/* Primary Links */}
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
          <Link to="/impact" className={`${linkClassName} flex items-center gap-1.5`}>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            My Impact
          </Link>
        </NavigationMenuItem>

        {/* About & Learn Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>About & Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 bg-background/95 backdrop-blur-lg border border-border shadow-xl rounded-lg">
              <li>
                <Link to="/about" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">About Us</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Learn about our mission to build Black wealth
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">How It Works</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Discover how our marketplace empowers the community
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/learning-hub" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Learning Hub</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Educational resources for financial empowerment
                  </p>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Services Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 bg-background/95 backdrop-blur-lg border border-border shadow-xl rounded-lg z-50">
              <li>
                <Link to="/sponsor-pricing" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Corporate Sponsorship</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Partner with us to support Black businesses
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/business/how-it-works" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Business Owner Guide</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Learn how QR payments work for your business
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/sales-agent" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Sales Agent</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Earn commissions by referring businesses
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]" data-tour="qr-scanner">
                  <div className="flex items-center gap-2">
                    <Scan className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">QR Scanner</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Scan codes to earn loyalty rewards
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Rewards</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    View and redeem your loyalty points
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/community-finance" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-mansagold" />
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

        {/* Community & Support Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>Community & Support</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 bg-background/95 backdrop-blur-lg border border-border shadow-xl rounded-lg z-50">
              <li>
                <Link to="/recommendations" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Discover</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Find personalized business recommendations
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/community" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Community</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Connect with other members of the marketplace
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/social-proof" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Success Stories</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    See our community's real impact and growth
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/help" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Help Center</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Get support and answers to your questions
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/security" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Security</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Learn how we keep your data safe
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/support" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Support</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Contact support and find answers
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
            <ul className="grid w-[400px] gap-3 p-4 bg-background/95 backdrop-blur-lg border border-border shadow-xl rounded-lg z-50">
              <li>
                <Link to="/features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Feature Guide</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Explore all platform features
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Blog</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Latest news and insights
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/all-pages" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">All Pages</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Browse complete directory of pages
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
