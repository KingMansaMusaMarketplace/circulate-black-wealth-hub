import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { GraduationCap, Users, TrendingUp, Scan, Gift, Building2, BookOpen, HelpCircle, Sparkles, FolderOpen, Heart, Award, Zap, Bot, FileText, Store, Globe, CircleDollarSign, Handshake } from 'lucide-react';

const NavLinks: React.FC = () => {
  const linkClassName = "text-foreground hover:text-mansagold transition-all duration-300 font-semibold px-3 py-2 rounded-md hover:bg-accent/50 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-mansagold after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";
  const goldLinkClassName = "text-mansagold transition-all duration-300 font-semibold px-3 py-2 rounded-md hover:bg-accent/50 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-mansagold after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";
  const triggerClassName = "!text-white hover:!text-mansagold transition-all duration-300 font-semibold";

  // Premium dark dropdown container
  const dropdownUlClass = "grid w-[420px] gap-1.5 p-3 bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-2xl border-2 border-white/10 shadow-2xl shadow-black/50 rounded-2xl z-50";

  // Standard link item
  const itemClass = "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 group";

  // Featured/highlighted link item
  const featuredItemClass = "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-mansagold/20 bg-mansagold/10 border border-mansagold/20 group";

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="flex gap-0.5">
        {/* Primary Links - Always Gold */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/" className={goldLinkClassName}>
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/directory" className={goldLinkClassName}>
              Directory
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/stays" className={goldLinkClassName}>
              Stays
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/ai-assistant" className={`${goldLinkClassName} flex items-center gap-1.5`}>
              <Bot className="w-4 h-4" />
              Kayla AI
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* About & Learn Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>About & Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className={dropdownUlClass}>
              <li>
                <Link to="/about" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-mansagold to-amber-600 shadow-sm">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">About Us</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Learn about our mission to build Black wealth
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/features" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-sm">
                      <Zap className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Features</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Discover powerful tools to support community businesses
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-sm">
                      <BookOpen className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">How It Works</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Discover how our marketplace empowers the community
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/learning-hub" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm">
                      <GraduationCap className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Learning Hub</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Educational resources for financial empowerment
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/education" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 shadow-sm">
                      <BookOpen className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Education</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Financial literacy and business education
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/loyalty-program-guide" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm">
                      <Award className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Loyalty Program Guide</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
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
            <ul className={dropdownUlClass}>
              <li>
                <Link to="/stays" className={featuredItemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-mansagold to-amber-600 shadow-sm">
                      <Building2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-mansagold">Stays 🏠</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Book Black-owned accommodations
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/business/how-it-works" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-sm">
                      <BookOpen className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Business Owner Guide</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Learn how QR payments work for your business
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/karma" className={featuredItemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-mansagold">Karma Dashboard ✨</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Track your economic impact score
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/susu-circles" className={featuredItemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-sm">
                      <CircleDollarSign className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-mansagold">Susu Circles 💰</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Join community savings groups
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/community-finance" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 shadow-sm">
                      <Users className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Community Finance</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Savings circles and community investments
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/sponsor-pricing" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm">
                      <Building2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Corporate Sponsorship</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Partner with us to support Black businesses
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/scanner" className={itemClass} data-tour="qr-scanner">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 shadow-sm">
                      <Scan className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">QR Scanner</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Scan codes to earn loyalty rewards
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm">
                      <Gift className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Rewards</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    View and redeem your loyalty points
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/sales-agent" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 shadow-sm">
                      <TrendingUp className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Sales Agent</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
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
            <ul className={dropdownUlClass}>
              <li>
                <Link to="/partner-portal" className={featuredItemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-mansagold to-amber-600 shadow-sm">
                      <Handshake className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-mansagold">Partner Portal 🤝</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Join as a partner and grow with us
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/impact" className={featuredItemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 shadow-sm">
                      <Heart className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-mansagold">My Impact ❤️</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Track your personal economic impact journey
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/founders-wall" className={featuredItemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm">
                      <Award className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-mansagold">Founder's Wall ✨</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    First 100 community businesses - claim your spot!
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/community" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-sm">
                      <Users className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Community</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Connect with other members of the marketplace
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/community-impact" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 shadow-sm">
                      <Globe className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Community Impact</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    See the difference we're making together
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/social-proof" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm">
                      <Award className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Success Stories</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    See our community's real impact and growth
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/help" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm">
                      <HelpCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Help Center</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Get support and answers to your questions
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-sm">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">AI Assistant</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
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
            <ul className={dropdownUlClass}>
              <li>
                <Link to="/directory" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-sm">
                      <Store className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Directory</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Browse all community businesses
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/blog" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm">
                      <BookOpen className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Blog</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Latest news and insights
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/media-kit" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-mansagold to-amber-600 shadow-sm">
                      <FileText className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">Media Kit</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
                    Press resources and brand assets
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/all-pages" className={itemClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 shadow-sm">
                      <FolderOpen className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-mansagold transition-colors">All Pages</div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-slate-400 mt-1 ml-8">
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
