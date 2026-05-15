import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CheckCircle2, ChevronLeft, ChevronRight, Sparkles, User, Target,
  BookOpen, LinkIcon, X,
} from 'lucide-react';
import { ONBOARDING_STEPS, usePartnerOnboarding, type StepId } from '@/hooks/use-partner-onboarding';

const GOAL_OPTIONS = [
  'Earn passive referral income',
  'Promote Black-owned businesses',
  'Build my directory traffic',
  'Sponsor community events',
  'Access marketing resources',
];

interface Props {
  partnerName?: string;
  onSkip?: () => void;
  onCompleteAll?: () => void;
}

const PartnerOnboardingWizard: React.FC<Props> = ({ partnerName, onSkip, onCompleteAll }) => {
  const { progress, completeStep, skipOnboarding, completionPercent, isComplete } = usePartnerOnboarding();
  const [currentIdx, setCurrentIdx] = useState(progress ? Math.max(0, progress.current_step - 1) : 0);

  // Form state
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [audience, setAudience] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [refLink, setRefLink] = useState('');

  if (!progress) return null;

  React.useEffect(() => {
    if (isComplete) onCompleteAll?.();
  }, [isComplete, onCompleteAll]);

  const step = ONBOARDING_STEPS[currentIdx];
  const isStepDone = progress.steps_completed.includes(step.id);

  const goNext = async (extra: Record<string, unknown> = {}) => {
    await completeStep(step.id as StepId, extra);
    if (currentIdx < ONBOARDING_STEPS.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const handleSkipAll = async () => {
    await skipOnboarding();
    onSkip?.();
  };

  const stepIcons: Record<string, React.ElementType> = {
    welcome: Sparkles, profile: User, goals: Target, resources: BookOpen, first_link: LinkIcon,
  };
  const Icon = stepIcons[step.id] || Sparkles;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-xs text-muted-foreground">
              Step {currentIdx + 1} of {ONBOARDING_STEPS.length}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkipAll}>
              <X className="h-3 w-3 mr-1" /> Skip onboarding
            </Button>
          </div>
          <Progress value={completionPercent} className="mb-6" />

          {/* Step body */}
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">{step.label}</h2>
            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
          </div>

          <div className="space-y-4 min-h-[200px]">
            {step.id === 'welcome' && (
              <div className="text-sm text-foreground/80 space-y-3">
                <p>Welcome{partnerName ? `, ${partnerName}` : ''}! You've been approved as a 1325.AI partner.</p>
                <p>This 5-step setup takes about 3 minutes and unlocks:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your unique referral link</li>
                  <li>Marketing kit (banners, flyers, social assets)</li>
                  <li>Embeddable widget for your site</li>
                  <li>Performance dashboard with payouts</li>
                </ul>
              </div>
            )}

            {step.id === 'profile' && (
              <>
                <Textarea placeholder="Short bio (optional, shown on partner spotlights)" value={bio} onChange={(e) => setBio(e.target.value.slice(0, 500))} rows={3} />
                <Input placeholder="Your website URL" value={website} onChange={(e) => setWebsite(e.target.value.slice(0, 200))} />
                <Input placeholder="Audience size (e.g. 5,000 newsletter subscribers)" value={audience} onChange={(e) => setAudience(e.target.value.slice(0, 200))} />
              </>
            )}

            {step.id === 'goals' && (
              <div className="space-y-2">
                {GOAL_OPTIONS.map((g) => (
                  <label key={g} className="flex items-center gap-3 rounded border p-3 cursor-pointer hover:bg-muted/50">
                    <Checkbox
                      checked={goals.includes(g)}
                      onCheckedChange={() => setGoals((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g])}
                    />
                    <span className="text-sm">{g}</span>
                  </label>
                ))}
              </div>
            )}

            {step.id === 'resources' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  { title: 'Marketing Hub', desc: 'Social posts, flyers, email templates' },
                  { title: 'Embed Widget', desc: 'Drop our directory into your site' },
                  { title: 'Brand Assets', desc: 'Logos, colors, talking points' },
                  { title: 'Success Stories', desc: 'Real partner case studies' },
                ].map((r) => (
                  <div key={r.title} className="rounded border p-3">
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                  </div>
                ))}
                <p className="col-span-full text-xs text-muted-foreground text-center mt-2">
                  All of these will be available in your dashboard after this step.
                </p>
              </div>
            )}

            {step.id === 'first_link' && (
              <div className="space-y-3 text-sm">
                <p className="text-foreground/80">
                  Generate your first referral link. Paste any 1325.AI URL and we'll add your tracking code.
                </p>
                <Input
                  placeholder="https://1325.ai/business/example"
                  value={refLink}
                  onChange={(e) => setRefLink(e.target.value.slice(0, 500))}
                />
                <p className="text-xs text-muted-foreground">
                  You'll find a full link generator and analytics in your dashboard.
                </p>
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div className="text-xs text-muted-foreground">{completionPercent}% complete</div>
            <Button
              onClick={() => {
                const extra: Record<string, unknown> = {};
                if (step.id === 'profile') extra.profile_completed = true;
                if (step.id === 'goals') extra.goals = { selected: goals };
                if (step.id === 'resources') extra.resources_viewed = true;
                if (step.id === 'first_link') extra.first_link_generated = true;
                goNext(extra);
              }}
            >
              {currentIdx === ONBOARDING_STEPS.length - 1 ? (
                <>Finish <CheckCircle2 className="h-4 w-4 ml-1" /></>
              ) : (
                <>{isStepDone ? 'Continue' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerOnboardingWizard;
