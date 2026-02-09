import React from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import StaysMessaging from '@/components/stays/messaging/StaysMessaging';
import { Sparkles } from 'lucide-react';

const StaysMessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get('conversation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Gold accent line at top */}
      <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent opacity-60" />

      {/* Enhanced animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-mansagold text-sm font-mono tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Mansa Stays
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-white/60 mt-1">
            Communicate with hosts and guests
          </p>
        </motion.div>

        {/* Messaging Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StaysMessaging initialConversationId={conversationId} />
        </motion.div>
      </div>
    </div>
  );
};

export default StaysMessagesPage;
