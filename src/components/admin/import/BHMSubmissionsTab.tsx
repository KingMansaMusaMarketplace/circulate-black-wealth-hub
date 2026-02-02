import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Mail, Clock, CheckCircle, XCircle, DollarSign, 
  ExternalLink, RefreshCw, Sparkles, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BHMSubmission {
  id: string;
  business_name: string;
  website_url: string | null;
  owner_email: string | null;
  validation_status: string | null;
  validation_notes: string | null;
  created_at: string | null;
  is_converted: boolean | null;
  converted_business_id: string | null;
}

export const BHMSubmissionsTab: React.FC = () => {
  const [submissions, setSubmissions] = useState<BHMSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('b2b_external_leads')
        .select('id, business_name, website_url, owner_email, validation_status, validation_notes, created_at, is_converted, converted_business_id')
        .eq('source_query', 'bhm_quick_add')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching BHM submissions:', error);
      toast.error('Failed to load BHM submissions');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSubmissions();
  };

  const getStatusBadge = (status: string | null, isConverted: boolean | null) => {
    if (isConverted) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>;
    }
    
    switch (status) {
      case 'pending_payment':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Pending Payment
        </Badge>;
      case 'paid':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <DollarSign className="w-3 h-3 mr-1" />
          Paid - Ready to Import
        </Badge>;
      case 'imported':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Imported
        </Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status || 'Unknown'}</Badge>;
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from('b2b_external_leads')
        .update({ validation_status: 'paid' })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Marked as paid - ready for import!');
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const paidCount = submissions.filter(s => s.validation_status === 'paid').length;
  const pendingCount = submissions.filter(s => s.validation_status === 'pending_payment').length;
  const publishedCount = submissions.filter(s => s.is_converted).length;

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-blue-200">Loading BHM submissions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff3333]" />
              BHM Quick Add Submissions
            </CardTitle>
            <CardDescription className="text-blue-200">
              $50/year directory listing submissions from the homepage widget
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 text-sm">
              <span className="text-yellow-400">{pendingCount} pending</span>
              <span className="text-white">•</span>
              <span className="text-blue-400">{paidCount} ready</span>
              <span className="text-white">•</span>
              <span className="text-green-400">{publishedCount} published</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-blue-200"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#ff3333] opacity-50" />
            <p className="text-blue-200">No BHM submissions yet</p>
            <p className="text-sm text-blue-300 mt-1">
              Submissions from the homepage Quick Add widget will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-[#ff3333]/20">
                    <Globe className="w-5 h-5 text-[#ff3333]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium truncate">
                        {submission.website_url || 'No URL provided'}
                      </p>
                      {submission.website_url && (
                        <a 
                          href={submission.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-blue-300">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {submission.owner_email || 'No email'}
                      </span>
                      <span className="text-white/30">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {submission.created_at 
                          ? format(new Date(submission.created_at), 'MMM d, yyyy h:mm a')
                          : 'Unknown date'
                        }
                      </span>
                    </div>
                    {submission.validation_notes && (
                      <p className="text-xs text-blue-400 mt-1 truncate">
                        {submission.validation_notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {getStatusBadge(submission.validation_status, submission.is_converted)}
                  
                  {submission.validation_status === 'pending_payment' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-300 hover:bg-green-500/10"
                      onClick={() => markAsPaid(submission.id)}
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Mark Paid
                    </Button>
                  )}
                  
                  {submission.validation_status === 'paid' && !submission.is_converted && (
                    <div className="flex items-center gap-1 text-xs text-blue-300">
                      <AlertCircle className="w-3 h-3" />
                      Use "Import from URL" above
                    </div>
                  )}

                  {submission.is_converted && submission.converted_business_id && (
                    <a
                      href={`/business/${submission.converted_business_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500/50 text-green-300 hover:bg-green-500/10"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Listing
                      </Button>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BHMSubmissionsTab;
