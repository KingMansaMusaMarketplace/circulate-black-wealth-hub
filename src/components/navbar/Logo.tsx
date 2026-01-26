import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo1325 from '@/assets/1325-ai-logo.png';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

const Logo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Clickable logo that opens modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button 
            className="group focus:outline-none"
            aria-label="View full logo"
          >
            <img 
              src={logo1325} 
              alt="1325.AI" 
              className="h-14 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] cursor-pointer"
            />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-slate-900/95 border-mansagold/30 backdrop-blur-xl p-8">
          <div className="flex flex-col items-center gap-6">
            <img 
              src={logo1325} 
              alt="1325.AI - The Intelligence Layer for Black Economic Power" 
              className="w-full max-w-md object-contain animate-scale-in"
            />
            <p className="text-mansagold font-mono text-lg tracking-wider text-center">
              The Intelligence Layer for Black Economic Power
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Home link */}
      <Link 
        to="/" 
        className="text-xl font-mono font-bold tracking-wider text-mansagold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
      >
        1325.AI
      </Link>
    </div>
  );
};

export default Logo;
