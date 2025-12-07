import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useSavingsCircles } from '@/hooks/use-community-finance';
import { Badge } from '@/components/ui/badge';

export const SavingsCircles: React.FC = () => {
  const { circles, myCircles, isLoading, createCircle, joinCircle } = useSavingsCircles();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    circle_name: '',
    description: '',
    target_amount: '',
    contribution_amount: '',
    frequency: 'monthly',
    max_members: '10'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCircle({
      ...formData,
      target_amount: parseFloat(formData.target_amount),
      contribution_amount: parseFloat(formData.contribution_amount),
      max_members: parseInt(formData.max_members)
    });
    setOpen(false);
    setFormData({
      circle_name: '',
      description: '',
      target_amount: '',
      contribution_amount: '',
      frequency: 'monthly',
      max_members: '10'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Savings Circles (Susu)</h2>
          <p className="text-white/80 font-medium">Pool resources and build wealth together</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-mansagold hover:bg-mansagold/90 text-slate-900 font-bold">
              <Users className="w-4 h-4" />
              Create Circle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white font-bold">Create Savings Circle</DialogTitle>
              <DialogDescription className="text-white/70">
                Start a savings circle and invite others to join
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="circle_name" className="text-white font-semibold">Circle Name</Label>
                <Input
                  id="circle_name"
                  value={formData.circle_name}
                  onChange={(e) => setFormData({ ...formData, circle_name: e.target.value })}
                  placeholder="My Savings Circle"
                  required
                  className="bg-slate-800 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white font-semibold">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this circle for?"
                  className="bg-slate-800 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_amount" className="text-white font-semibold">Target Amount</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    min="100"
                    step="0.01"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    placeholder="1000"
                    required
                    className="bg-slate-800 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="contribution_amount" className="text-white font-semibold">Contribution</Label>
                  <Input
                    id="contribution_amount"
                    type="number"
                    min="10"
                    step="0.01"
                    value={formData.contribution_amount}
                    onChange={(e) => setFormData({ ...formData, contribution_amount: e.target.value })}
                    placeholder="100"
                    required
                    className="bg-slate-800 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency" className="text-white font-semibold">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                      <SelectItem value="biweekly" className="text-white">Bi-weekly</SelectItem>
                      <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max_members" className="text-white font-semibold">Max Members</Label>
                  <Input
                    id="max_members"
                    type="number"
                    min="2"
                    max="20"
                    value={formData.max_members}
                    onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                    required
                    className="bg-slate-800 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-mansagold hover:bg-mansagold/90 text-slate-900 font-bold">
                Create Savings Circle
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Circles */}
      {myCircles && myCircles.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">My Circles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCircles.map((membership: any) => (
              <Card key={membership.id} className="bg-slate-800/60 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-white font-bold">{membership.savings_circles.circle_name}</CardTitle>
                  <CardDescription className="text-white/70">{membership.savings_circles.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80 font-medium">My Contribution</span>
                      <span className="font-bold text-mansagold">${membership.total_contributed}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80 font-medium">Position</span>
                      <Badge className="bg-mansablue/30 text-mansablue border-mansablue/50 font-bold">#{membership.payout_position}</Badge>
                    </div>
                    {membership.payout_date && (
                      <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
                        <Calendar className="w-4 h-4" />
                        Payout: {new Date(membership.payout_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Circles */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-white">Join a Circle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p className="col-span-full text-center py-8 text-white/70 font-medium">Loading...</p>
          ) : circles && circles.length > 0 ? (
            circles.map((circle: any) => (
              <Card key={circle.id} className="hover:shadow-lg transition-shadow bg-slate-800/60 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-white font-bold">{circle.circle_name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-white/70">{circle.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80 font-medium">Target</span>
                      <span className="font-bold text-mansagold">${circle.target_amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80 font-medium">Contribution</span>
                      <span className="font-bold text-white">${circle.contribution_amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80 font-medium">Members</span>
                      <span className="flex items-center gap-1 text-white font-semibold">
                        <Users className="w-4 h-4" />
                        {circle.current_members}/{circle.max_members}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70 font-medium">
                      <Calendar className="w-4 h-4" />
                      {circle.frequency}
                    </div>
                    <Button
                      onClick={() => joinCircle(circle.id)}
                      className="w-full mt-4 bg-mansablue hover:bg-mansablue/90 text-white font-bold"
                      disabled={circle.current_members >= circle.max_members}
                    >
                      {circle.current_members >= circle.max_members ? 'Full' : 'Join Circle'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full bg-slate-800/60 border-white/20 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <p className="text-white/70 font-medium">
                  No active savings circles yet. Create one to get started!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
