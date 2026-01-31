import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, CheckCircle, Trash2, Edit, Building2, 
  MapPin, Phone, Mail, Globe, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DraftBusiness {
  id: string;
  business_name: string;
  description: string | null;
  category: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  listing_status: string;
  created_at: string;
}

export const DraftBusinessesTab: React.FC = () => {
  const [drafts, setDrafts] = useState<DraftBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<DraftBusiness | null>(null);

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, business_name, description, category, address, city, state, phone, email, website, logo_url, listing_status, created_at')
        .eq('listing_status', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      console.error('Error loading drafts:', error);
      toast.error('Failed to load draft businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handlePublish = async (business: DraftBusiness) => {
    setPublishing(business.id);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ listing_status: 'live' })
        .eq('id', business.id);

      if (error) throw error;

      toast.success(`${business.business_name} is now live!`);
      setDrafts(prev => prev.filter(d => d.id !== business.id));
    } catch (error) {
      console.error('Error publishing business:', error);
      toast.error('Failed to publish business');
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedBusiness) return;
    
    setDeleting(selectedBusiness.id);
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', selectedBusiness.id);

      if (error) throw error;

      toast.success(`${selectedBusiness.business_name} has been deleted`);
      setDrafts(prev => prev.filter(d => d.id !== selectedBusiness.id));
    } catch (error) {
      console.error('Error deleting business:', error);
      toast.error('Failed to delete business');
    } finally {
      setDeleting(null);
      setDeleteDialogOpen(false);
      setSelectedBusiness(null);
    }
  };

  const openPreview = (businessId: string) => {
    window.open(`/business/${businessId}`, '_blank');
  };

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-yellow-400" />
                Draft Businesses
              </CardTitle>
              <CardDescription className="text-blue-200">
                Review and publish imported businesses
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDrafts}
              className="border-white/20 text-blue-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {drafts.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-blue-300 opacity-50" />
              <p className="text-blue-200">No draft businesses</p>
              <p className="text-sm text-blue-300">Import a business from URL to see it here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                >
                  <Avatar className="h-12 w-12 border-2 border-yellow-400/30">
                    <AvatarImage src={business.logo_url || ''} alt={business.business_name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                      {business.business_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white truncate">
                        {business.business_name}
                      </h3>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">
                        Draft
                      </Badge>
                    </div>

                    {business.category && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs mb-2">
                        {business.category}
                      </Badge>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-blue-200">
                      {(business.city || business.state) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span className="truncate">
                            {business.city}{business.city && business.state ? ', ' : ''}{business.state}
                          </span>
                        </div>
                      )}
                      {business.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-blue-400" />
                          <span className="truncate">{business.phone}</span>
                        </div>
                      )}
                      {business.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-blue-400" />
                          <span className="truncate">{business.email}</span>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-blue-400" />
                          <span className="truncate">{business.website}</span>
                        </div>
                      )}
                    </div>

                    {business.description && (
                      <p className="text-xs text-blue-300 mt-2 line-clamp-2">
                        {business.description}
                      </p>
                    )}

                    <p className="text-xs text-blue-400 mt-2">
                      Imported {new Date(business.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
                      onClick={() => openPreview(business.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500"
                      onClick={() => handlePublish(business)}
                      disabled={publishing === business.id}
                    >
                      {publishing === business.id ? (
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                      onClick={() => {
                        setSelectedBusiness(business);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Draft Business</AlertDialogTitle>
            <AlertDialogDescription className="text-blue-200">
              Are you sure you want to delete "{selectedBusiness?.business_name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!!deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DraftBusinessesTab;
