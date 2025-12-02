import { AIAssistant } from '@/components/ai/AIAssistant';
import { Helmet } from 'react-helmet';

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <Helmet>
        <title>AI Assistant | Mansa Musa Marketplace</title>
      </Helmet>

      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">AI Assistant</h1>
          <p className="text-muted-foreground">
            Get instant answers about our loyalty program and marketplace
          </p>
        </div>

        <AIAssistant />
      </div>
    </div>
  );
}
