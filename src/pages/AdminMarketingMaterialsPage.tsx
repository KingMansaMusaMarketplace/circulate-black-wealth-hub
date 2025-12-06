import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Download, Eye, EyeOff, Upload, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAllMarketingMaterials,
  createMarketingMaterial,
  updateMarketingMaterial,
  deleteMarketingMaterial,
  toggleMaterialStatus
} from '@/lib/api/marketing-materials-api';
import { MarketingMaterial, MarketingMaterialFormData, MaterialType } from '@/types/marketing-material';
import BulkUploadDialog from '@/components/marketing/BulkUploadDialog';

const AdminMarketingMaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [materials, setMaterials] = useState<MarketingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MarketingMaterial | null>(null);
  const [formData, setFormData] = useState<MarketingMaterialFormData>({
    title: '',
    description: '',
    type: 'banner',
    dimensions: '',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (userRole !== 'admin') {
      toast.error('Access Denied', {
        description: 'You need administrator privileges to access this page. Please contact an admin if you believe you should have access.',
        duration: 5000,
      });
      navigate('/');
      return;
    }
    loadMaterials();
  }, [userRole, navigate]);

  const loadMaterials = async () => {
    try {
      const data = await getAllMarketingMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error loading materials:', error);
      toast.error('Failed to load marketing materials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData: MarketingMaterialFormData = {
        ...formData,
        file: file || undefined,
      };

      if (editingMaterial) {
        await updateMarketingMaterial(editingMaterial.id, submitData);
        toast.success('Material updated successfully');
      } else {
        await createMarketingMaterial(submitData);
        toast.success('Material created successfully');
      }

      setDialogOpen(false);
      resetForm();
      loadMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      toast.error('Failed to save material');
    }
  };

  const handleEdit = (material: MarketingMaterial) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      type: material.type,
      dimensions: material.dimensions || '',
    });
    setFile(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      await deleteMarketingMaterial(id);
      toast.success('Material deleted successfully');
      loadMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleMaterialStatus(id, !currentStatus);
      toast.success(`Material ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadMaterials();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'banner',
      dimensions: '',
    });
    setFile(null);
    setEditingMaterial(null);
  };

  const handleNewMaterial = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-mansablue/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-mansagold/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mansagold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-mansablue/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-mansagold/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/3 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-slate-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-mansagold/20 to-mansablue/20 border border-mansagold/30">
                  <Sparkles className="h-6 w-6 text-mansagold" />
                </div>
                <h1 className="text-4xl font-bold text-white">Manage Marketing Materials</h1>
              </div>
              <p className="text-slate-400 text-lg">
                Add, edit, and manage marketing materials for sales agents
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => navigate('/admin/marketing-analytics')} 
                variant="outline"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-mansagold"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button 
                onClick={() => setBulkUploadOpen(true)} 
                variant="outline"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-mansagold"
              >
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
              <Button 
                onClick={handleNewMaterial}
                className="bg-gradient-to-r from-mansagold to-amber-500 text-[#0a1628] hover:from-mansagold/90 hover:to-amber-500/90 font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Material
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-mansagold/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">Total Materials</span>
              <Sparkles className="h-5 w-5 text-mansagold" />
            </div>
            <div className="text-3xl font-bold text-white">{materials.length}</div>
            <p className="text-xs text-slate-500 mt-1">All marketing assets</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-mansagold/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">Active</span>
              <Eye className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">{materials.filter(m => m.is_active).length}</div>
            <p className="text-xs text-slate-500 mt-1">Available to agents</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-mansagold/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">Total Downloads</span>
              <Download className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              {materials.reduce((sum, m) => sum + m.download_count, 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">All-time downloads</p>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div 
              key={material.id} 
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-mansagold/30 transition-all duration-300 ${!material.is_active ? 'opacity-60' : ''}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{material.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {material.type} • {material.download_count} downloads
                    </p>
                    {material.dimensions && (
                      <p className="text-xs text-slate-500">{material.dimensions}</p>
                    )}
                  </div>
                  {!material.is_active && (
                    <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded">Inactive</span>
                  )}
                </div>
                
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {material.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleEdit(material)}
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-mansagold"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleToggleStatus(material.id, material.is_active)}
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-mansagold"
                  >
                    {material.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleDelete(material.id)}
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {material.file_url && (
                    <Button
                      onClick={() => window.open(material.file_url!, '_blank')}
                      size="sm"
                      variant="outline"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-mansagold"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {materials.length === 0 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
            <Sparkles className="h-12 w-12 text-mansagold/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No materials yet</h3>
            <p className="text-slate-400 mb-6">Get started by adding your first marketing material</p>
            <Button 
              onClick={handleNewMaterial}
              className="bg-gradient-to-r from-mansagold to-amber-500 text-[#0a1628] hover:from-mansagold/90 hover:to-amber-500/90 font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Material
            </Button>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-[#0f1d32] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingMaterial ? 'Edit Material' : 'Add New Material'}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingMaterial ? 'Update the marketing material details' : 'Create a new marketing material for agents'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-mansagold/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-300">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: MaterialType) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1d32] border-white/10">
                      <SelectItem value="banner" className="text-white hover:bg-white/10">Banner</SelectItem>
                      <SelectItem value="social" className="text-white hover:bg-white/10">Social Media</SelectItem>
                      <SelectItem value="email" className="text-white hover:bg-white/10">Email Template</SelectItem>
                      <SelectItem value="document" className="text-white hover:bg-white/10">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-mansagold/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions" className="text-slate-300">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 1200x628px"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-mansagold/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-slate-300">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept="image/*,.pdf,.doc,.docx"
                    className="bg-white/5 border-white/20 text-white file:bg-mansagold/20 file:text-mansagold file:border-0 file:rounded file:mr-3"
                  />
                  {editingMaterial?.file_url && !file && (
                    <p className="text-xs text-slate-500">
                      Current file: {editingMaterial.file_url.split('/').pop()}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-mansagold to-amber-500 text-[#0a1628] hover:from-mansagold/90 hover:to-amber-500/90 font-semibold"
                >
                  {editingMaterial ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <BulkUploadDialog
          open={bulkUploadOpen}
          onOpenChange={setBulkUploadOpen}
          onSuccess={loadMaterials}
        />
      </div>
    </div>
  );
};

export default AdminMarketingMaterialsPage;
