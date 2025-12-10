import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { BusinessNeed } from '@/hooks/use-b2b';
import { formatDistanceToNow } from 'date-fns';

interface NeedCardProps {
  need: BusinessNeed;
  onConnect: () => void;
}

const urgencyColors = {
  immediate: 'bg-red-500/10 text-red-600 border-red-200',
  within_week: 'bg-orange-500/10 text-orange-600 border-orange-200',
  within_month: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  planning: 'bg-blue-500/10 text-blue-600 border-blue-200',
  flexible: 'bg-green-500/10 text-green-600 border-green-200',
};

const urgencyLabels = {
  immediate: 'Immediate',
  within_week: 'Within a Week',
  within_month: 'Within a Month',
  planning: 'Planning Phase',
  flexible: 'Flexible Timeline',
};

export function NeedCard({ need, onConnect }: NeedCardProps) {
  const formatBudget = () => {
    if (need.budget_min && need.budget_max) {
      return `$${need.budget_min.toLocaleString()} - $${need.budget_max.toLocaleString()}`;
    }
    if (need.budget_max) {
      return `Up to $${need.budget_max.toLocaleString()}`;
    }
    if (need.budget_min) {
      return `From $${need.budget_min.toLocaleString()}`;
    }
    return 'Budget TBD';
  };

  const urgencyColor = need.urgency 
    ? urgencyColors[need.urgency as keyof typeof urgencyColors] 
    : urgencyColors.flexible;
  
  const urgencyLabel = need.urgency 
    ? urgencyLabels[need.urgency as keyof typeof urgencyLabels]
    : 'Flexible';

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="pt-4 flex-1">
        {/* Business Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={need.business?.logo_url || undefined} 
              alt={need.business?.business_name} 
            />
            <AvatarFallback>
              {need.business?.business_name?.charAt(0) || 'B'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-sm">
              {need.business?.business_name}
            </p>
            {need.business?.city && need.business?.state && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {need.business.city}, {need.business.state}
              </p>
            )}
          </div>
        </div>

        {/* Need Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {need.category}
            </Badge>
            <Badge className={`text-xs ${urgencyColor}`} variant="outline">
              <AlertCircle className="h-3 w-3 mr-1" />
              {urgencyLabel}
            </Badge>
          </div>

          <h3 className="font-semibold">{need.title}</h3>
          
          {need.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {need.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {formatBudget()}
            </span>
            {need.quantity && (
              <span>Qty: {need.quantity}</span>
            )}
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Posted {formatDistanceToNow(new Date(need.created_at), { addSuffix: true })}
          </p>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Button onClick={onConnect} className="w-full" size="sm">
          I Can Help
        </Button>
      </CardFooter>
    </Card>
  );
}
