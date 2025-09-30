import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, TrendingUp } from 'lucide-react';
import { paymentService, type PlatformTransaction } from '@/lib/services/payment-service';
import { formatDistanceToNow } from 'date-fns';

interface TransactionsListProps {
  businessId?: string;
  customerId?: string;
  showRevenue?: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  businessId,
  customerId,
  showRevenue = false,
}) => {
  const [transactions, setTransactions] = useState<PlatformTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState<any>(null);

  useEffect(() => {
    loadTransactions();
    if (showRevenue) {
      loadRevenue();
    }
  }, [businessId, customerId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      let data;
      if (businessId) {
        data = await paymentService.getBusinessTransactions(businessId);
      } else if (customerId) {
        data = await paymentService.getCustomerTransactions(customerId);
      }
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRevenue = async () => {
    try {
      const revenueData = await paymentService.getPlatformRevenue();
      setRevenue(revenueData);
    } catch (error) {
      console.error('Error loading revenue:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-mansablue" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showRevenue && revenue && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${revenue.totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-mansablue" />
                <div>
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold">{revenue.transactionCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600">Avg Transaction</p>
                <p className="text-2xl font-bold">
                  ${revenue.avgTransactionValue.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {businessId ? 'Your Transactions' : 'Payment History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium">{transaction.description}</p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(transaction.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                    {transaction.customer_name && (
                      <p className="text-sm text-gray-600 mt-1">
                        {transaction.customer_name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${transaction.amount_total.toFixed(2)}
                    </p>
                    {businessId && (
                      <p className="text-sm text-gray-500">
                        Fee: ${transaction.amount_platform_fee.toFixed(2)}
                      </p>
                    )}
                    {businessId && (
                      <p className="text-sm text-green-600 font-medium">
                        You receive: ${transaction.amount_business.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsList;
