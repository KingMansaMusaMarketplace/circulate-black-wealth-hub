import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Download, Eye, EyeOff, Upload, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
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
      <ResponsiveLayout title="Admin - Marketing Materials">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Admin - Marketing Materials">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Manage Marketing Materials</h1>
              <p className="text-muted-foreground text-lg">
                Add, edit, and manage marketing materials for sales agents
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/admin/marketing-analytics')} variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button onClick={() => setBulkUploadOpen(true)} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
              <Button onClick={handleNewMaterial}>
                <Plus className="mr-2 h-4 w-4" />
                Add Material
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <Card key={material.id} className={!material.is_active ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {material.type} • {material.download_count} downloads
                    </p>
                    {material.dimensions && (
                      <p className="text-xs text-muted-foreground">{material.dimensions}</p>
                    )}
                  </div>
                  {!material.is_active && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">Inactive</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {material.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleEdit(material)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleToggleStatus(material.id, material.is_active)}
                    size="sm"
                    variant="outline"
                  >
                    {material.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleDelete(material.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {material.file_url && (
                    <Button
                      onClick={() => window.open(material.file_url!, '_blank')}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingMaterial ? 'Edit Material' : 'Add New Material'}
              </DialogTitle>
              <DialogDescription>
                {editingMaterial ? 'Update the marketing material details' : 'Create a new marketing material for agents'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: MaterialType) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email Template</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 1200x628px"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  {editingMaterial?.file_url && !file && (
                    <p className="text-xs text-muted-foreground">
                      Current file: {editingMaterial.file_url.split('/').pop()}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
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
    </ResponsiveLayout>
  );
};

export default AdminMarketingMaterialsPage;
