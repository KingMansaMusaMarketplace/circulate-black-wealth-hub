
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { GraduationCap, Users, TrendingUp, Scan, Gift, Building2, BookOpen, HelpCircle, Sparkles, FolderOpen, Heart, Award, Zap, Bot, FileText, Store, Globe, CircleDollarSign, Handshake } from 'lucide-react';

const NavLinks: React.FC = () => {
  const linkClassName = "text-foreground hover:text-mansagold transition-all duration-300 font-semibold px-3 py-2 rounded-md hover:bg-accent/50 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-mansagold after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";
  const goldLinkClassName = "text-mansagold transition-all duration-300 font-semibold px-3 py-2 rounded-md hover:bg-accent/50 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-mansagold after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";
  const triggerClassName = "!text-white hover:!text-mansagold transition-all duration-300 font-semibold";

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="flex gap-0.5">
        {/* Primary Links - Always Gold */}
        <NavigationMenuItem>
          <Link to="/" className={goldLinkClassName}>
            Home
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/directory" className={goldLinkClassName}>
            Directory
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/stays" className={goldLinkClassName}>
            Stays
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/partner-portal" className={`${goldLinkClassName} flex items-center gap-1.5`}>
            <Handshake className="h-4 w-4 text-mansagold" />
            Partner
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
                <Link to="/features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Features</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Discover powerful tools to support Black-owned businesses
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
              <li>
                <Link to="/education" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Education</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Financial literacy and business education
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/loyalty-program-guide" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Loyalty Program Guide</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Learn how our B2B & B2C loyalty rewards work
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
                <Link to="/karma" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02] bg-mansagold/10 border border-mansagold/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none text-mansagold">Karma Dashboard ✨</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Track your economic impact score
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/susu-circles" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02] bg-mansagold/10 border border-mansagold/20">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none text-mansagold">Susu Circles 💰</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Join community savings groups
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
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Community & Support Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>Community & Support</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 bg-background/95 backdrop-blur-lg border border-border shadow-xl rounded-lg z-50">
              <li>
                <Link to="/impact" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02] bg-mansagold/10 border border-mansagold/20">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    <div className="text-sm font-medium leading-none text-mansagold">My Impact ❤️</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Track your personal economic impact journey
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/founders-wall" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02] bg-mansagold/10 border border-mansagold/20">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none text-mansagold">Founder's Wall ✨</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    First 100 Black-owned businesses - claim your spot!
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
                <Link to="/community-impact" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Community Impact</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    See the difference we're making together
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
                <Link to="/ai-assistant" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">AI Assistant</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Get instant help with our AI chatbot
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
                <Link to="/directory" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Directory</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Browse all Black-owned businesses
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
                <Link to="/media-kit" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-mansagold" />
                    <div className="text-sm font-medium leading-none">Media Kit</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Press resources and brand assets
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
