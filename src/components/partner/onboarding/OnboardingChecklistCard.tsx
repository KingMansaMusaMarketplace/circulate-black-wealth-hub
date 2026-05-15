import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { ONBOARDING_STEPS, usePartnerOnboarding } from '@/hooks/use-partner-onboarding';

interface Props {
  onResume?: () => void;
}

const OnboardingChecklistCard: React.FC<Props> = ({ onResume }) => {
  const { progress, completionPercent, isComplete, loading } = usePartnerOnboarding();

  if (loading || !progress || isComplete) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Finish your setup</CardTitle>
          <span className="text-sm text-muted-foreground">{completionPercent}% complete</span>
        </div>
        <Progress value={completionPercent} className="mt-2" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {ONBOARDING_STEPS.map((s) => {
            const done = progress.steps_completed.includes(s.id);
            return (
              <li key={s.id} className="flex items-center gap-3 text-sm">
                {done
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                <span className={done ? 'text-muted-foreground line-through' : ''}>{s.label}</span>
              </li>
            );
          })}
        </ul>
        <Button className="w-full mt-4" onClick={onResume}>
          Resume setup <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklistCard;
