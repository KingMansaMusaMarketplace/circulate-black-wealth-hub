import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Gift, Users, Zap } from 'lucide-react';
import { CoalitionTransaction } from '@/hooks/use-coalition';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CoalitionTransactionsListProps {
  transactions: CoalitionTransaction[];
}

const transactionTypeConfig = {
  earn: { icon: ArrowUpRight, color: 'text-green-500', bgColor: 'bg-green-500/10', label: 'Earned' },
  redeem: { icon: ArrowDownRight, color: 'text-red-500', bgColor: 'bg-red-500/10', label: 'Redeemed' },
  bonus: { icon: Gift, color: 'text-purple-500', bgColor: 'bg-purple-500/10', label: 'Bonus' },
  referral: { icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10', label: 'Referral' },
  transfer: { icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', label: 'Transfer' },
};

export function CoalitionTransactionsList({ transactions }: CoalitionTransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ArrowUpRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">No Transactions Yet</h3>
        <p className="text-sm text-muted-foreground">
          Start earning points at any coalition business!
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => {
          const config = transactionTypeConfig[transaction.transaction_type] || transactionTypeConfig.earn;
          const Icon = config.icon;
          const isPositive = transaction.points > 0;

          return (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", config.bgColor)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {transaction.description || config.label}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{format(new Date(transaction.created_at), 'MMM d, yyyy')}</span>
                    {transaction.source_business?.business_name && (
                      <>
                        <span>•</span>
                        <span>{transaction.source_business.business_name}</span>
                      </>
                    )}
                    {transaction.redeem_business?.business_name && (
                      <>
                        <span>•</span>
                        <span>at {transaction.redeem_business.business_name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-semibold",
                  isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {isPositive ? '+' : ''}{transaction.points.toLocaleString()}
                </p>
                <Badge variant="outline" className="text-xs">
                  {config.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
