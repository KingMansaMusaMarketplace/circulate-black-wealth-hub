import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Globe, MapPin, ExternalLink, UserPlus, Mail, Phone, Linkedin, Sparkles } from 'lucide-react';
import { DiscoveredBusiness } from '@/types/b2b-external';

interface ExternalLeadCardProps {
  business: DiscoveredBusiness;
  onSaveLead: (business: DiscoveredBusiness) => void;
  onInvite?: (business: DiscoveredBusiness) => void;
  isSaving?: boolean;
}

export function ExternalLeadCard({ business, onSaveLead, onInvite, isSaving }: ExternalLeadCardProps) {
  const confidenceColor = business.confidence >= 0.8 
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : business.confidence >= 0.6
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : 'bg-slate-500/20 text-slate-300 border-slate-500/30';

  return (
    <Card className="bg-gradient-to-br from-blue-950/50 to-slate-900/50 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 overflow-hidden group">
      {/* Web Discovery Badge */}
      <div className="absolute top-0 right-0">
        <div className="bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-bl-lg border-l border-b border-blue-500/30">
          <div className="flex items-center gap-1.5 text-xs text-blue-300">
            <Globe className="h-3 w-3" />
            <span>Web Discovery</span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2 pt-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg truncate group-hover:text-blue-200 transition-colors">
              {business.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600/50 text-xs">
                {business.category}
              </Badge>
              <Badge variant="outline" className={`text-xs ${confidenceColor}`}>
                <Sparkles className="h-3 w-3 mr-1" />
                {Math.round(business.confidence * 100)}% match
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300 line-clamp-2">
          {business.description}
        </p>

        {/* Location & Website */}
        <div className="flex flex-wrap gap-3 text-sm">
          {business.location && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              <span>{business.location}</span>
            </div>
          )}
          {business.website && (
            <a 
              href={business.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Website</span>
            </a>
          )}
        </div>

        {/* Contact Info */}
        {business.contact && (business.contact.email || business.contact.phone || business.contact.linkedin) && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {business.contact.email && (
              <a 
                href={`mailto:${business.contact.email}`}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                <Mail className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{business.contact.email}</span>
              </a>
            )}
            {business.contact.phone && (
              <a 
                href={`tel:${business.contact.phone}`}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                <Phone className="h-3 w-3" />
                <span>{business.contact.phone}</span>
              </a>
            )}
            {business.contact.linkedin && (
              <a 
                href={business.contact.linkedin.startsWith('http') ? business.contact.linkedin : `https://${business.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-3 w-3" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSaveLead(business)}
            disabled={isSaving}
            className="flex-1 border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200"
          >
            Save Lead
          </Button>
          {onInvite && (
            <Button
              size="sm"
              onClick={() => onInvite(business)}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-medium"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Invite
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
