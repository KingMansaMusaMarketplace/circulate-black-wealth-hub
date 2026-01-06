import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, DollarSign, Phone, Mail, Calendar, Plus, 
  MoreVertical, User, Globe, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useSponsorCRM, PIPELINE_STAGES, SponsorProspect, PipelineStage } from '@/hooks/use-sponsor-crm';
import { formatCurrency } from '@/lib/utils';

interface SponsorPipelineKanbanProps {
  onProspectClick?: (prospect: SponsorProspect) => void;
  onAddProspect?: () => void;
}

export const SponsorPipelineKanban: React.FC<SponsorPipelineKanbanProps> = ({
  onProspectClick,
  onAddProspect,
}) => {
  const { prospectsByStage, moveToStage, metrics, isLoading } = useSponsorCRM();

  const handleDragStart = (e: React.DragEvent, prospectId: string) => {
    e.dataTransfer.setData('prospectId', prospectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    const prospectId = e.dataTransfer.getData('prospectId');
    if (prospectId) {
      moveToStage({ id: prospectId, stage });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const ProspectCard: React.FC<{ prospect: SponsorProspect }> = ({ prospect }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      draggable
      onDragStart={(e) => handleDragStart(e as any, prospect.id)}
      onClick={() => onProspectClick?.(prospect)}
      className="p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {prospect.company_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white text-sm truncate">{prospect.company_name}</p>
            {prospect.primary_contact_name && (
              <p className="text-xs text-blue-300 truncate">{prospect.primary_contact_name}</p>
            )}
          </div>
        </div>
        <Badge className={`text-xs ${getPriorityColor(prospect.priority)}`}>
          {prospect.priority}
        </Badge>
      </div>

      {prospect.deal_value && (
        <div className="flex items-center gap-1 text-green-400 text-sm mb-2">
          <DollarSign className="w-3 h-3" />
          <span>{formatCurrency(prospect.deal_value)}</span>
          <span className="text-xs text-blue-300">({prospect.probability}%)</span>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {prospect.expected_tier && (
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
            {prospect.expected_tier}
          </Badge>
        )}
        {prospect.industry && (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
            {prospect.industry}
          </Badge>
        )}
      </div>

      {prospect.next_follow_up && (
        <div className="flex items-center gap-1 text-xs text-yellow-400 mt-2">
          <Calendar className="w-3 h-3" />
          <span>Follow up: {new Date(prospect.next_follow_up).toLocaleDateString()}</span>
        </div>
      )}
    </motion.div>
  );

  // Show only active stages for the Kanban view
  const activeStages = PIPELINE_STAGES.filter(s => 
    !['closed_lost', 'on_hold'].includes(s.value) || 
    (prospectsByStage[s.value]?.length || 0) > 0
  );

  return (
    <div className="space-y-4">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-xs text-blue-200">Total Prospects</p>
          <p className="text-2xl font-bold text-white">{metrics.totalProspects}</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-xs text-blue-200">Pipeline Value</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(metrics.totalPipelineValue)}</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-xs text-blue-200">Weighted Value</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(metrics.weightedPipelineValue)}</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-xs text-blue-200">Closed Won</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(metrics.closedWonValue)}</p>
        </Card>
      </div>

      {/* Kanban Board */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-w-max">
          {activeStages.map((stage) => {
            const prospects = prospectsByStage[stage.value] || [];
            const stageValue = prospects.reduce((sum, p) => sum + (p.deal_value || 0), 0);

            return (
              <div
                key={stage.value}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.value)}
                className="w-72 flex-shrink-0"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium text-white text-sm">{stage.label}</span>
                    <Badge variant="secondary" className="bg-white/10 text-blue-200 text-xs">
                      {prospects.length}
                    </Badge>
                  </div>
                  <span className="text-xs text-green-400">
                    {formatCurrency(stageValue)}
                  </span>
                </div>

                <div className="space-y-2 min-h-[200px] p-2 bg-white/5 rounded-lg border border-white/10">
                  {prospects.map((prospect) => (
                    <ProspectCard key={prospect.id} prospect={prospect} />
                  ))}

                  {stage.value === 'research' && (
                    <Button
                      variant="ghost"
                      onClick={onAddProspect}
                      className="w-full border-2 border-dashed border-white/20 text-blue-300 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Prospect
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
