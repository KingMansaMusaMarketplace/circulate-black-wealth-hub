
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Home } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';

const NotFoundState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-2xl animate-fade-in">
          <div className="glass-card p-12 space-y-6 border-border/50">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            
            <h1 className="text-4xl font-display font-bold text-foreground">
              Business Not Found
            </h1>
            
            <p className="text-lg text-muted-foreground font-body">
              The business you're looking for doesn't exist or has been removed from our directory.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link to="/directory">
                <Button className="gap-2 w-full sm:w-auto">
                  <Search className="w-4 h-4" />
                  Explore Businesses
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundState;
