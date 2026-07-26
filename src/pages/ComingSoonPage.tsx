import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, Home } from 'lucide-react';

const ComingSoonPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md text-center"
      >
        <div className="w-20 h-20 rounded-full bg-mansagold/10 border border-mansagold/30 flex items-center justify-center mx-auto mb-6">
          <Clock className="h-10 w-10 text-mansagold" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Coming Soon
        </h1>

        <p className="text-base text-slate-300 mb-8 leading-relaxed">
          This 1325.AI module is being polished before launch. Come back soon, or head back to the main directory to find verified Black-owned businesses today.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-mansagold text-slate-900 hover:bg-mansagold/90 font-bold rounded-xl"
          >
            <Link to="/directory">
              <Home className="h-4 w-4 mr-2" />
              Browse Directory
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 rounded-xl"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage;
