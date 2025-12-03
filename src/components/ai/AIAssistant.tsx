import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI assistant for Mansa Musa Marketplace. Ask me anything about our loyalty program, rewards, or how to use the platform!'
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

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMsg] }),
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
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              assistantContent += content;
              
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
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

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border-white/20">
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-mansagold/20 to-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-mansagold rounded-lg">
            <Sparkles className="w-5 h-5 text-mansablue" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">AI Assistant</h3>
            <p className="text-sm text-white/60">Powered by Lovable AI</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-mansagold/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-mansagold" />
                </div>
              )}
              
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-mansagold text-mansablue'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white/70" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-mansagold/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-mansagold" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20">
                <Loader2 className="w-4 h-4 animate-spin text-mansagold" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Mansa Musa..."
            disabled={isLoading}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-mansagold"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="bg-mansagold hover:bg-mansagold/90 text-mansablue"
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
