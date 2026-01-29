import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Building2, Globe, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DeveloperSignupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_website: '',
    company_description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to create a developer account');
      navigate('/auth');
      return;
    }

    if (!formData.company_name.trim()) {
      toast.error('Company name is required');
      return;
    }

    setLoading(true);
    try {
      // Check if user already has a developer account
      const { data: existingAccount } = await supabase
        .from('developer_accounts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingAccount) {
        toast.info('You already have a developer account');
        navigate('/developers/dashboard');
        return;
      }

      // Create developer account
      const { error } = await supabase
        .from('developer_accounts')
        .insert({
          user_id: user.id,
          company_name: formData.company_name.trim(),
          company_website: formData.company_website.trim() || null,
          company_description: formData.company_description.trim() || null,
          tier: 'free',
          status: 'active', // Auto-activate for now
        });

      if (error) throw error;

      toast.success('Developer account created successfully!');
      navigate('/developers/dashboard');
    } catch (error) {
      console.error('Error creating developer account:', error);
      toast.error('Failed to create developer account');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-mansablue-dark to-slate-900 p-4">
        <Card className="w-full max-w-md glass-card border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Sign In Required</CardTitle>
            <CardDescription className="text-white/60">
              Please sign in to create a developer account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-mansablue-dark to-slate-900 py-12 px-4">
      {/* Decorative elements */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansagold/10 to-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-mansablue/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <Button 
          variant="ghost" 
          className="mb-6 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => navigate('/developers')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Developer Portal
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Create Developer Account</CardTitle>
              <CardDescription className="text-white/60">
                Register your company to get API access to our patented engines.
                Start with the Free tier and upgrade anytime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="flex items-center gap-2 text-white/80">
                    <Building2 className="h-4 w-4 text-mansagold" />
                    Company Name *
                  </Label>
                  <Input
                    id="company_name"
                    placeholder="Your company or project name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                    className="bg-slate-900/60 border-white/20 text-white placeholder:text-white/40 focus:border-mansablue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_website" className="flex items-center gap-2 text-white/80">
                    <Globe className="h-4 w-4 text-mansablue" />
                    Website
                  </Label>
                  <Input
                    id="company_website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.company_website}
                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                    className="bg-slate-900/60 border-white/20 text-white placeholder:text-white/40 focus:border-mansablue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_description" className="flex items-center gap-2 text-white/80">
                    <FileText className="h-4 w-4 text-mansablue" />
                    Project Description
                  </Label>
                  <Textarea
                    id="company_description"
                    placeholder="Tell us about your project and how you plan to use our APIs"
                    value={formData.company_description}
                    onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
                    rows={4}
                    className="bg-slate-900/60 border-white/20 text-white placeholder:text-white/40 focus:border-mansablue resize-none"
                  />
                </div>

                <div className="bg-slate-900/60 rounded-lg p-4 border border-white/10">
                  <h4 className="font-medium mb-3 text-mansagold">Free Tier Includes:</h4>
                  <ul className="space-y-2">
                    {[
                      '1,000 CMAL API calls/month',
                      '100 Voice AI minutes/month',
                      '50 Susu transactions/month',
                      '100 Fraud analyses/month',
                      'Community support',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle className="h-4 w-4 text-mansagold" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-white/40">
                  By creating an account, you agree to our Terms of Service and acknowledge 
                  that our APIs are protected under USPTO Provisional Application 63/969,202.
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Developer Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperSignupPage;
