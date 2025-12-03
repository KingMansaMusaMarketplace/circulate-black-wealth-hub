import { AIAssistant } from '@/components/ai/AIAssistant';
import { Helmet } from 'react-helmet';

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen gradient-primary p-6 relative overflow-hidden">
      <Helmet>
        <title>AI Assistant | Mansa Musa Marketplace</title>
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-8 text-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <h1 className="text-4xl font-bold mb-2 text-white">AI Assistant</h1>
          <p className="text-white/70">
            Get instant answers about our loyalty program and marketplace
          </p>
        </div>

        <AIAssistant />
      </div>
    </div>
  );
}
