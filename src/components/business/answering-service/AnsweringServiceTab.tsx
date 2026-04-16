
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, MessageSquare, BarChart3, Phone } from 'lucide-react';
import { AnsweringServiceSetup } from './AnsweringServiceSetup';
import { AnsweringServiceLogs } from './AnsweringServiceLogs';
import { AnsweringServiceAnalytics } from './AnsweringServiceAnalytics';
import { useAnsweringConfig } from '@/hooks/use-answering-config';

interface AnsweringServiceTabProps {
  businessId: string;
}

export default function AnsweringServiceTab({ businessId }: AnsweringServiceTabProps) {
  const [subTab, setSubTab] = useState('setup');
  const config = useAnsweringConfig(businessId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-mansablue flex items-center gap-2">
          <Phone className="h-6 w-6" />
          AI Answering Service
        </h2>
        <p className="text-muted-foreground mt-1">
          Let Kayla handle customer calls and texts — answer FAQs, take messages, and notify you.
        </p>
      </div>

      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings size={14} />
            Setup
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <MessageSquare size={14} />
            Message Log
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={14} />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="mt-4">
          <AnsweringServiceSetup businessId={businessId} config={config} />
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <AnsweringServiceLogs businessId={businessId} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <AnsweringServiceAnalytics businessId={businessId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
