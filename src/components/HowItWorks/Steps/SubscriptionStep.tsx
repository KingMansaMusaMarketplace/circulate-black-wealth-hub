
import React from 'react';
import { motion } from 'framer-motion';

interface SubscriptionStepProps {
  isHovered: boolean;
}

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ isHovered }) => {
  return (
    <motion.div 
      className={`backdrop-blur-xl bg-white/10 rounded-xl p-4 border transition-all duration-300 border-blue-400/50`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)' }}
    >
      <div className="backdrop-blur-xl bg-white/5 rounded-lg shadow-sm p-6 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white">Subscription Plans</h3>
          <div className="bg-yellow-400 text-slate-900 px-2 py-1 rounded text-xs font-medium">
            Best Value
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border border-white/20 rounded-lg p-4 bg-white/5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <h4 className="font-bold text-white">Community Member</h4>
              <span className="font-bold text-yellow-400">100% FREE Forever</span>
            </div>
            <ul className="mt-3 space-y-1">
              <li className="text-sm text-white/80">• Full directory access</li>
              <li className="text-sm text-white/80">• QR scanning for discounts</li>
              <li className="text-sm text-white/80">• Loyalty points system</li>
              <li className="text-sm text-white/80">• Earn and redeem rewards</li>
              <li className="text-sm text-white/80">• Exclusive deals access</li>
            </ul>
          </div>
          
          <div className="border border-white/20 rounded-lg p-4 bg-white/5">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-white">Business Plans</h4>
              <div className="bg-blue-400 text-slate-900 px-2 py-1 rounded text-xs font-medium">
                Most Popular
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white/90">Starter Business</span>
                <span className="font-bold text-blue-300">$39/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white/90">Professional Business</span>
                <span className="font-bold text-blue-300">$79/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white/90">Multi-Location</span>
                <span className="font-bold text-blue-300">$149/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white/90">Enterprise</span>
                <span className="font-bold text-blue-300">$299/month</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1 pt-3 border-t border-white/20">
              <li className="text-sm text-white/80">• Business listing in directory</li>
              <li className="text-sm text-white/80">• Customer analytics dashboard</li>
              <li className="text-sm text-white/80">• QR code generation</li>
              <li className="text-sm text-white/80">• Premium support & mentorship</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionStep;
