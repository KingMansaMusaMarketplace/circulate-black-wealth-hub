import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ListingSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
        >
          <CheckCircle className="w-12 h-12 text-green-400" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Payment Successful!
        </h1>
        
        <p className="text-blue-100/70 mb-6">
          Thank you for listing your business with <span className="text-mansagold font-semibold">1325.AI</span>. 
          Our team will verify your business and have it live in the directory within 24-48 hours.
        </p>

        <div className="bg-mansagold/10 border border-mansagold/30 rounded-xl p-4 mb-6">
          <h3 className="text-mansagold font-semibold mb-2">What happens next?</h3>
          <ul className="text-sm text-white/70 text-left space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-mansagold">1.</span>
              We'll scrape your website and extract business details
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mansagold">2.</span>
              Our team verifies your business authenticity
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mansagold">3.</span>
              You'll receive an email once your listing is live
            </li>
          </ul>
        </div>

        {sessionId && (
          <p className="text-xs text-white/40 mb-6">
            Confirmation ID: {sessionId.slice(0, 20)}...
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
            <Link to="/directory">
              Explore Businesses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ListingSuccessPage;
