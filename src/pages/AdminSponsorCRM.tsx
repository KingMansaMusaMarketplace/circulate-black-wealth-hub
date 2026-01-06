import React, { useState } from 'react';
import { SponsorPipelineKanban } from '@/components/admin/crm/SponsorPipelineKanban';
import { useSponsorCRM, SponsorProspect } from '@/hooks/use-sponsor-crm';
import { Button } from '@/components/ui/button';
import { Plus, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AdminSponsorCRM: React.FC = () => {
  const { createProspect, creatingProspect } = useSponsorCRM();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    primary_contact_name: '',
    primary_contact_email: '',
    expected_tier: '',
    deal_value: '',
    website: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name) {
      toast.error('Company name is required');
      return;
    }

    createProspect({
      company_name: formData.company_name,
      industry: formData.industry || null,
      primary_contact_name: formData.primary_contact_name || null,
      primary_contact_email: formData.primary_contact_email || null,
      expected_tier: formData.expected_tier || null,
      deal_value: formData.deal_value ? parseFloat(formData.deal_value) : null,
      website: formData.website || null,
      pipeline_stage: 'research',
    }, {
      onSuccess: () => {
        setShowAddDialog(false);
        setFormData({
          company_name: '',
          industry: '',
          primary_contact_name: '',
          primary_contact_email: '',
          expected_tier: '',
          deal_value: '',
          website: '',
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Sponsor CRM
            </h1>
            <p className="text-blue-200">Manage sponsor prospects and pipeline</p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Prospect
          </Button>
        </div>

        {/* Kanban Board */}
        <SponsorPipelineKanban onAddProspect={() => setShowAddDialog(true)} />

        {/* Add Prospect Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add New Prospect</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-blue-200">Company Name *</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="bg-white/5 border-white/20"
                  placeholder="e.g., Nike, Target"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-blue-200">Industry</Label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="bg-white/5 border-white/20"
                    placeholder="e.g., Retail, Finance"
                  />
                </div>
                <div>
                  <Label className="text-blue-200">Expected Tier</Label>
                  <Select
                    value={formData.expected_tier}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, expected_tier: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze">Bronze ($2,500/yr)</SelectItem>
                      <SelectItem value="silver">Silver ($5,000/yr)</SelectItem>
                      <SelectItem value="gold">Gold ($10,000/yr)</SelectItem>
                      <SelectItem value="platinum">Platinum ($25,000/yr)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-blue-200">Contact Name</Label>
                <Input
                  value={formData.primary_contact_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, primary_contact_name: e.target.value }))}
                  className="bg-white/5 border-white/20"
                  placeholder="Decision maker name"
                />
              </div>
              <div>
                <Label className="text-blue-200">Contact Email</Label>
                <Input
                  type="email"
                  value={formData.primary_contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, primary_contact_email: e.target.value }))}
                  className="bg-white/5 border-white/20"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <Label className="text-blue-200">Deal Value ($)</Label>
                <Input
                  type="number"
                  value={formData.deal_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, deal_value: e.target.value }))}
                  className="bg-white/5 border-white/20"
                  placeholder="10000"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="border-white/20">
                  Cancel
                </Button>
                <Button type="submit" disabled={creatingProspect} className="bg-gradient-to-r from-purple-500 to-blue-500">
                  {creatingProspect ? 'Adding...' : 'Add Prospect'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminSponsorCRM;
