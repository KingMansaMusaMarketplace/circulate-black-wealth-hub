import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Building2, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }).max(500),
  email: z.string().email({ message: "Please enter a valid email" }).max(255),
});

const QuickAddBusiness = () => {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const validation = formSchema.safeParse({ url, email });
    if (!validation.success) {
      const error = validation.error.errors[0];
      toast.error(error.message);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-bhm-listing-checkout', {
        body: { businessUrl: url, email },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Redirecting to checkout...');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-mansagold/20 via-amber-500/15 to-mansagold/20 border-2 border-mansagold/40 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-[#ff3333]" />
        <span className="text-xl md:text-2xl font-black text-[#ff3333] uppercase tracking-wide drop-shadow-[0_0_10px_rgba(255,51,51,0.5)]">
          Black History Month Special
        </span>
        <Sparkles className="w-6 h-6 text-[#ff3333]" />
      </div>

      {/* Title & Pricing */}
      <div className="text-center mb-4">
        <h3 className="text-lg md:text-xl font-bold text-white mb-1">
          Get Your Business Listed Today
        </h3>
        <div className="flex items-center justify-center gap-3">
          <span className="text-white/50 line-through text-lg">$250/year</span>
          <span className="text-2xl md:text-3xl font-black text-mansagold">$50/year</span>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
            80% Off
          </span>
        </div>
        <p className="text-sm text-white/70 mt-1">
          Limited time offer • Verified in 24-48 hours
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="url"
              placeholder="Your business website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 bg-white/90 border-mansagold/30 text-slate-900 placeholder:text-slate-500 h-11 text-sm rounded-lg"
              required
            />
          </div>
          <div className="relative flex-1">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/90 border-mansagold/30 text-slate-900 placeholder:text-slate-500 h-11 text-sm rounded-lg"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading || !url || !email}
          className="w-full bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-black h-12 text-base rounded-lg shadow-lg disabled:opacity-50 transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-5 w-5" />
              Get Listed for $50/year
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-center text-white/50 mt-3">
        We'll scrape your site, verify your business, and list you within 24-48 hours
      </p>
    </motion.div>
  );
};

export default QuickAddBusiness;
