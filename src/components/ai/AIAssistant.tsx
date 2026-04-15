import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Sparkles, Zap, Brain, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  modelUsed?: string;
}

const MODEL_BADGES: Record<string, { label: string; icon: typeof Zap; className: string }> = {
  gemini: { label: 'Gemini', icon: Zap, className: 'text-mansagold bg-mansagold/10 border-mansagold/20' },
  claude: { label: 'Claude', icon: Brain, className: 'text-mansablue-light bg-mansablue/20 border-mansablue/30' },
  perplexity: { label: 'Perplexity', icon: Search, className: 'text-mansagold-light bg-mansagold/10 border-mansagold/20' },
  'claude+perplexity': { label: 'Kayla+', icon: Sparkles, className: 'text-mansagold bg-mansagold/15 border-mansagold/30' },
};

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm **Kayla, Ph.D.** — your AI concierge for 1325.AI. Ask me anything about our loyalty program, rewards, or how to use the platform!",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = '';
    let modelUsed = '';

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Please sign in to use the AI assistant.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat-orchestrator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
        }
      );

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          toast.error('Rate limit reached. Please wait a moment.');
        } else if (response.status === 402) {
          toast.error('AI credits exhausted. Please contact support.');
        } else {
          toast.error('Failed to get response. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            
            if (parsed.model_used && !parsed.choices) {
              modelUsed = parsed.model_used;
              continue;
            }

            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              assistantContent += content;
              
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && !last.content.startsWith("Hi! I'm")) {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent, modelUsed } : m
                  );
                }
                return [...prev, { role: 'assistant', content: assistantContent, modelUsed }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (modelUsed) {
        setMessages(prev => prev.map((m, i) => 
          i === prev.length - 1 && m.role === 'assistant' ? { ...m, modelUsed } : m
        ));
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    await streamChat(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderModelBadge = (modelUsed?: string) => {
    if (!modelUsed) return null;
    const badge = MODEL_BADGES[modelUsed];
    if (!badge) return null;
    const Icon = badge.icon;
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 border ${badge.className}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto backdrop-blur-xl bg-mansablue/40 border border-mansagold/20 rounded-2xl shadow-2xl shadow-mansagold/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-mansagold/20 bg-gradient-to-r from-mansagold/15 via-mansablue/20 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-mansagold rounded-lg shadow-lg shadow-mansagold/30">
            <Sparkles className="w-5 h-5 text-mansablue-dark" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">Kayla, Ph.D.</h3>
            <p className="text-sm text-white/60">Triple-Model AI • Gemini + Claude + Perplexity</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-mansagold/20 border border-mansagold/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-mansagold" />
                </div>
              )}
              
              <div className="flex flex-col max-w-[80%]">
                <div
                  className={`rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-mansagold text-mansablue-dark font-medium'
                      : 'bg-white/10 backdrop-blur-sm border border-white/15 text-white'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="text-sm prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_a]:text-mansagold [&_strong]:text-mansagold">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'assistant' && renderModelBadge(msg.modelUsed)}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white/70" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-mansagold/20 border border-mansagold/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-mansagold" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15">
                <Loader2 className="w-4 h-4 animate-spin text-mansagold" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-mansagold/20 bg-mansablue/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Kayla anything about 1325.AI..."
            disabled={isLoading}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-mansagold focus:ring-mansagold/20"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-semibold shadow-lg shadow-mansagold/30 hover:shadow-mansagold/40 transition-all hover-glow-gold"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
