import { AIAssistant } from '@/components/ai/AIAssistant';
import { Helmet } from 'react-helmet-async';

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      <Helmet>
        <title>Kayla AI | 1325.AI</title>
      </Helmet>

      {/* Animated gradient orbs using design tokens */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse bg-mansagold/10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse bg-mansablue/10" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl animate-pulse bg-mansagold/5" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-8 text-center card-premium-gold p-6">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            <span className="text-gradient-gold">Kayla, Ph.D.</span>
          </h1>
          <p className="text-muted-foreground">
            Triple-Model AI — instant answers about our loyalty program and marketplace
          </p>
        </div>

        <AIAssistant />
      </div>
    </div>
  );
}
