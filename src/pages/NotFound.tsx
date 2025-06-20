
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Map, InfoIcon } from "lucide-react";
import { Navbar } from '@/components/navbar';
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl font-bold text-red-400">404</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Page not found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the page <span className="font-medium text-gray-700">{location.pathname}</span>. It might have been removed or doesn't exist.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Home className="h-4 w-4" /> 
                Home Page
              </Button>
            </Link>
            <Link to="/directory" className="w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Map className="h-4 w-4" /> 
                Business Directory
              </Button>
            </Link>
            <Link to="/how-it-works" className="w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <InfoIcon className="h-4 w-4" /> 
                How It Works
              </Button>
            </Link>
            <Link to="/about" className="w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <InfoIcon className="h-4 w-4" />
                About Us
              </Button>
            </Link>
          </div>
          
          <Link to="/">
            <Button className="bg-mansablue hover:bg-mansablue-dark text-white px-6 py-2 rounded-md flex items-center mx-auto">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
