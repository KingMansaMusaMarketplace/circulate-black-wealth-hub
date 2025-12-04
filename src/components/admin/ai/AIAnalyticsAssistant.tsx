import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Bot, Send, User, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What are the top performing businesses this month?",
  "Show me user signup trends",
  "Which agents have the highest conversion rates?",
  "Are there any concerning patterns in recent activity?",
  "Summarize platform revenue for the past week",
];

const AIAnalyticsAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Analytics Assistant. I can help you understand your platform data, identify trends, and provide actionable insights. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [platformData, setPlatformData] = useState<Record<string, unknown>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPlatformData();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchPlatformData = async () => {
    try {
      const [usersRes, businessesRes, transactionsRes, agentsRes] = await Promise.all([
        supabase.from('profiles').select('id, created_at, user_type').limit(1000),
        supabase.from('businesses').select('id, created_at, is_verified, subscription_status').limit(500),
        supabase.from('transactions').select('id, amount, type, created_at').limit(500),
        supabase.from('sales_agents').select('id, status, total_earnings, total_referrals').limit(100),
      ]);

      setPlatformData({
        users: {
          total: usersRes.data?.length || 0,
          recent: usersRes.data?.filter(u => {
            const created = new Date(u.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return created > weekAgo;
          }).length || 0,
        },
        businesses: {
          total: businessesRes.data?.length || 0,
          verified: businessesRes.data?.filter(b => b.is_verified).length || 0,
          active: businessesRes.data?.filter(b => b.subscription_status === 'active').length || 0,
        },
        transactions: {
          total: transactionsRes.data?.length || 0,
          totalAmount: transactionsRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
        },
        agents: {
          total: agentsRes.data?.length || 0,
          active: agentsRes.data?.filter(a => a.status === 'active').length || 0,
          totalEarnings: agentsRes.data?.reduce((sum, a) => sum + (a.total_earnings || 0), 0) || 0,
          totalReferrals: agentsRes.data?.reduce((sum, a) => sum + (a.total_referrals || 0), 0) || 0,
        },
      });
    } catch (error) {
      console.error('Error fetching platform data:', error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-assistant', {
        body: {
          type: 'analytics_chat',
          prompt: text,
          data: platformData,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.result || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get AI response');
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Analytics Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about your platform data and get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {messages.length === 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => sendMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Ask about your platform data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage(input)}
            disabled={loading}
          />
          <Button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalyticsAssistant;
