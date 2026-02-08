import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface HouseRulesAcceptanceProps {
  bookingId: string;
  propertyId: string;
  houseRules: string;
  onAccepted?: () => void;
  alreadyAccepted?: boolean;
}

const HouseRulesAcceptance: React.FC<HouseRulesAcceptanceProps> = ({
  bookingId,
  propertyId,
  houseRules,
  onAccepted,
  alreadyAccepted = false,
}) => {
  const { user } = useAuth();
  const [accepted, setAccepted] = useState(alreadyAccepted);
  const [loading, setLoading] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('stays_house_rules_acceptance').insert({
        booking_id: bookingId,
        guest_id: user.id,
        property_id: propertyId,
        rules_text: houseRules,
        rules_version: '1.0',
      });

      if (error) throw error;

      setAccepted(true);
      toast.success('House rules accepted');
      onAccepted?.();
    } catch (err: any) {
      console.error('Error accepting rules:', err);
      toast.error(err.message || 'Failed to accept house rules');
    } finally {
      setLoading(false);
    }
  };

  // Parse house rules - split by newlines or numbered items
  const rulesList = houseRules
    .split(/[\n\r]+/)
    .map(rule => rule.trim())
    .filter(rule => rule.length > 0);

  if (accepted) {
    return (
      <Card className="bg-green-500/10 border-green-500/30">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-white font-medium">House Rules Accepted</p>
            <p className="text-white/60 text-sm">
              You agreed to the host's house rules for this stay.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-mansagold" />
          House Rules
        </CardTitle>
        <p className="text-white/60 text-sm">
          Please read and accept the host's house rules before your stay.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea 
          className="h-48 rounded-lg bg-slate-900/50 p-4 border border-white/10"
          onScrollCapture={handleScroll}
        >
          <div className="space-y-3">
            {rulesList.map((rule, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-mansagold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-mansagold font-medium">{index + 1}</span>
                </div>
                <p className="text-white/80 text-sm">{rule}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        {!hasScrolledToBottom && rulesList.length > 5 && (
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Please scroll to read all rules</span>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Checkbox
            id="accept-rules"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
            disabled={!hasScrolledToBottom && rulesList.length > 5}
          />
          <Label htmlFor="accept-rules" className="text-white/80 text-sm leading-relaxed cursor-pointer">
            I have read and agree to follow the house rules during my stay. 
            I understand that violating these rules may result in additional fees or early termination of my booking.
          </Label>
        </div>

        <Button
          onClick={handleAccept}
          disabled={!accepted || loading}
          className="w-full bg-mansagold text-black hover:bg-mansagold/90"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Accept House Rules
        </Button>
      </CardContent>
    </Card>
  );
};

export default HouseRulesAcceptance;
