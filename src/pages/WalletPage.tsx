import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, CreditCard, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WalletBalance from '@/components/wallet/WalletBalance';
import WalletTransactionHistory from '@/components/wallet/WalletTransactionHistory';
import { Link } from 'react-router-dom';

const WalletPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-700/20 border-2 border-emerald-500/40 mb-4">
            <Wallet className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            My Wallet
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Manage your funds, track transactions, and spend at Black-owned businesses.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Balance and Actions */}
          <div className="lg:col-span-1 space-y-6">
            <WalletBalance />

            {/* Quick Actions */}
            <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                
                <Link to="/directory">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 border-white/10 hover:bg-white/5"
                  >
                    <CreditCard className="w-4 h-4 text-mansagold" />
                    <span>Spend at Businesses</span>
                  </Button>
                </Link>

                <Link to="/susu-circles">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 border-white/10 hover:bg-white/5"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                    <span>Susu Circles</span>
                  </Button>
                </Link>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 border-white/10 hover:bg-white/5 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Wallet className="w-4 h-4 text-slate-400" />
                  <span>Cash Out (Coming Soon)</span>
                </Button>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border border-emerald-500/20 bg-emerald-900/10 backdrop-blur-xl">
              <CardContent className="p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Secure Wallet</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Your funds are protected with bank-level security. All transactions are encrypted and logged.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Transaction History */}
          <div className="lg:col-span-2">
            <WalletTransactionHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
