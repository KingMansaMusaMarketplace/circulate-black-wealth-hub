import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DashboardAIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your Admin Dashboard assistant. Ask me anything about the dashboard features, how to use them, or what each section does. I can help you navigate and understand the platform better!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const dashboardContext = `
You are a helpful assistant for the Mansa Musa Marketplace Admin Dashboard. Here's what you know about the dashboard:

NAVIGATION FEATURES:
- Breadcrumb Navigation: Shows current location, click to go back
- Global Search (press /): Search users, businesses, transactions
- Command Palette (⌘K or Ctrl+K): Quick commands and navigation

MONITORING FEATURES:
- Live Data Counters: Real-time metrics for users, businesses, revenue, growth
- System Health Monitor: Shows Database, API, Auth status with latency
- Notification Center (bell icon): Real-time alerts for new users, businesses, fraud

QUICK ACTIONS:
- Export Reports: Export data as CSV or JSON
- Quick Actions FAB (floating button bottom-right): Fast access to AI Dashboard, Verification, Exports
- Theme Toggle: Switch dark/light mode
- User Profile dropdown: Settings, profile, sign out

DASHBOARD TABS (use G+letter shortcuts):
- Overview (G+O): Platform summary and key metrics
- Users (G+U): Manage platform users
- Businesses (G+B): Manage registered businesses
- Sales Agents (G+A): Track agent performance and commissions
- Financials (G+F): Revenue and transactions
- Security (G+S): Security settings and audit logs
- Fraud Alerts: Suspicious activity monitoring
- Activity Log: Platform activity history

KEYBOARD SHORTCUTS:
- ⌘K: Command palette
- /: Global search
- ?: Show all shortcuts
- G+O/U/B/A/F/S: Navigate to tabs

Answer questions about these features helpfully and concisely.
`;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-assistant', {
        body: {
          type: 'dashboard_help',
          prompt: userMessage,
          data: { context: dashboardContext },
        },
      });

      if (error) throw error;

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.content || "I'm sorry, I couldn't process that request. Please try again." },
      ]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      // Fallback response
      const fallbackResponse = getFallbackResponse(userMessage);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: fallbackResponse },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('search')) {
      return "Press '/' to open Global Search, or use ⌘K for the Command Palette. You can search for users, businesses, and transactions.";
    }
    if (q.includes('export')) {
      return "Click the Export Reports option from the Command Palette (⌘K) or the Quick Actions button (floating '+' at bottom-right). You can export users, businesses, transactions, agents, and activity logs as CSV or JSON.";
    }
    if (q.includes('notification')) {
      return "The Notification Center (bell icon) shows real-time alerts for new users, businesses, fraud alerts, and important events. Click a notification to mark it as read.";
    }
    if (q.includes('shortcut') || q.includes('keyboard')) {
      return "Press '?' to see all keyboard shortcuts. Key ones: ⌘K (command palette), / (search), G+O/U/B/A/F/S (navigate tabs).";
    }
    if (q.includes('health') || q.includes('status')) {
      return "The System Health Monitor shows Database, API, and Auth status with latency. Green = healthy, Yellow = degraded, Red = down. It refreshes every 30 seconds.";
    }
    if (q.includes('theme') || q.includes('dark') || q.includes('light')) {
      return "Use the Theme Toggle button (sun/moon icon) to switch between dark and light mode. Your preference is saved automatically.";
    }
    
    return "I can help you understand the dashboard features! Try asking about: search, exports, notifications, shortcuts, system health, themes, or any specific dashboard section.";
  };

  const suggestedQuestions = [
    "How do I search for a user?",
    "What do the health indicators mean?",
    "How can I export data?",
    "What keyboard shortcuts are available?",
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-purple-500/30 text-purple-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/50 relative"
          data-tour="ai-assistant"
          title="AI Assistant"
        >
          <Bot className="h-5 w-5" />
          <Sparkles className="h-2.5 w-2.5 text-yellow-400 absolute -top-1 -right-1" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96 bg-slate-900 border-white/10 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-yellow-400" />
            Dashboard Assistant
          </SheetTitle>
          <SheetDescription className="text-blue-200/70">
            Ask me anything about the admin dashboard
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 mt-4 pr-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-yellow-500/20 text-white'
                      : 'bg-white/10 text-blue-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-xs text-blue-200/60 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="text-xs px-2 py-1 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-white/10">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about dashboard features..."
            className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardAIAssistant;
