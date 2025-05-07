
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getCustomerRedeemedRewards,
  RedeemedReward
} from '@/lib/api/loyalty-api';
import { getCustomerQRScans, QRScan } from '@/lib/api/qr-code-api';
import { getCustomerTransactions, Transaction } from '@/lib/api/transaction-api';
import { toast } from 'sonner';

export const useLoyaltyHistory = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [qrScans, setQrScans] = useState<QRScan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Stats calculated from the data
  const [stats, setStats] = useState({
    totalPointsEarned: 0,
    totalPointsRedeemed: 0,
    visitsThisMonth: 0,
    businessesVisited: 0
  });

  // Load all history data
  const loadHistoryData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Fetch all history data in parallel
      const [rewards, scans, txns] = await Promise.all([
        getCustomerRedeemedRewards(user.id),
        getCustomerQRScans(user.id),
        getCustomerTransactions(user.id)
      ]);
      
      setRedeemedRewards(rewards);
      setQrScans(scans);
      setTransactions(txns);
      
      // Calculate stats from the data
      calculateStats(txns, scans);
    } catch (error) {
      console.error('Error loading loyalty history:', error);
      toast.error('Failed to load loyalty history');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from the data
  const calculateStats = (txns: Transaction[], scans: QRScan[]) => {
    // Calculate points earned and redeemed
    const pointsEarned = txns.reduce((sum, tx) => sum + (tx.points_earned || 0), 0);
    const pointsRedeemed = txns.reduce((sum, tx) => sum + (tx.points_redeemed || 0), 0);
    
    // Calculate visits this month
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const visitsThisMonth = scans.filter(scan => {
      const scanDate = new Date(scan.scan_date);
      return scanDate.getMonth() === thisMonth && scanDate.getFullYear() === thisYear;
    }).length;
    
    // Calculate unique businesses visited
    const businessIds = new Set(scans.map(scan => scan.business_id));
    
    setStats({
      totalPointsEarned: pointsEarned,
      totalPointsRedeemed: pointsRedeemed,
      visitsThisMonth,
      businessesVisited: businessIds.size
    });
  };

  // Load data on mount
  useEffect(() => {
    loadHistoryData();
  }, [user?.id]);

  return {
    loading,
    redeemedRewards,
    qrScans,
    transactions,
    stats,
    refreshHistory: loadHistoryData
  };
};
