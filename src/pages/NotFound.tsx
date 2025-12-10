
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Map, InfoIcon, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden p-4">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-lg animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
        <div className="relative backdrop-blur-xl bg-slate-900/80 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          {/* Icon */}
          <div className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-red-500/30 to-orange-500/20 border border-red-500/30 shadow-lg shadow-red-500/20">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
          
          {/* Error Status */}
          <div className="text-7xl font-bold bg-gradient-to-r from-mansagold via-amber-400 to-orange-400 bg-clip-text text-transparent mb-4 font-display">
            404
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3 font-display">
            Page Not Found
          </h1>
          
          {/* Description */}
          <p className="text-blue-200/80 mb-8 font-body text-lg">
            Sorry, we couldn't find the page <span className="font-semibold text-mansagold">{location.pathname}</span>. It might have been removed or doesn't exist.
          </p>
          
          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300">
                <Home className="h-4 w-4" /> 
                Home Page
              </Button>
            </Link>
            <Link to="/directory" className="w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300">
                <Map className="h-4 w-4" /> 
                Business Directory
              </Button>
            </Link>
            <Link to="/how-it-works" className="w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300">
                <InfoIcon className="h-4 w-4" /> 
                How It Works
              </Button>
            </Link>
            <Link to="/about" className="w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300">
                <InfoIcon className="h-4 w-4" />
                About Us
              </Button>
            </Link>
          </div>
          
          {/* Return Home Button */}
          <Link to="/">
            <Button className="bg-gradient-to-r from-mansagold to-amber-500 hover:from-amber-500 hover:to-mansagold text-slate-900 font-semibold shadow-lg shadow-mansagold/30 hover:shadow-xl hover:shadow-mansagold/40 transition-all duration-300 px-8 py-3">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
