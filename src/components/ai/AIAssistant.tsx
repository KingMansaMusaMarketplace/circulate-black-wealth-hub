import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Sparkles, Zap, Brain, Search, ImagePlus, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import { Capacitor } from '@capacitor/core';

interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

interface Message {
  role: 'user' | 'assistant';
  content: string | MessageContent[];
  modelUsed?: string;
  imagePreview?: string; // For UI display only
}

const MODEL_BADGES: Record<string, { label: string; icon: typeof Zap; className: string }> = {
  gemini: { label: 'Gemini', icon: Zap, className: 'text-mansagold bg-mansagold/10 border-mansagold/20' },
  claude: { label: 'Claude', icon: Brain, className: 'text-mansablue-light bg-mansablue/20 border-mansablue/30' },
  perplexity: { label: 'Perplexity', icon: Search, className: 'text-mansagold-light bg-mansagold/10 border-mansagold/20' },
  'claude+perplexity': { label: 'Kayla+', icon: Sparkles, className: 'text-mansagold bg-mansagold/15 border-mansagold/30' },
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getTextContent(content: string | MessageContent[]): string {
  if (typeof content === 'string') return content;
  return content.filter(c => c.type === 'text').map(c => c.text).join('') || '';
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm **Kayla, Ph.D.** — your AI concierge for 1325.AI. Ask me anything about our loyalty program, rewards, or how to use the platform! You can also share images with me 📸",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ base64: string; name: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Stable per-conversation id so Kayla can persist memory across reloads via ai_chat_sessions.
  const sessionIdRef = useRef<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('kayla_session_id') : null
  );

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, GIF, or WebP image.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image must be under 5MB.');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPendingImage({ base64, name: file.name });
    } catch {
      toast.error('Failed to read image.');
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const streamChat = async (userMessage: string, imageBase64?: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Build user message content
    let messageContent: string | MessageContent[];
    if (imageBase64) {
      messageContent = [
        { type: 'text' as const, text: userMessage || 'What do you see in this image?' },
        { type: 'image_url' as const, image_url: { url: imageBase64 } },
      ];
    } else {
      messageContent = userMessage;
    }

    const userMsg: Message = {
      role: 'user',
      content: messageContent,
      imagePreview: imageBase64 || undefined,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setPendingImage(null);

    let assistantContent = '';
    let modelUsed = '';

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.error('Please sign in to use the AI assistant.');
        setIsLoading(false);
        return;
      }

      // Build messages for API - convert all messages to API format
      const apiMessages = [...messages, userMsg].map(m => {
        if (typeof m.content === 'string') {
          return { role: m.role, content: m.content };
        }
        // For multimodal messages, send the content array
        return { role: m.role, content: m.content };
      });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat-orchestrator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ messages: apiMessages, session_id: sessionIdRef.current }),
          signal: controller.signal,
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
              if (parsed.session_id && parsed.session_id !== sessionIdRef.current) {
                sessionIdRef.current = parsed.session_id;
                try { localStorage.setItem('kayla_session_id', parsed.session_id); } catch {}
              }
              continue;
            }

            const content = parsed.choices?.[0]?.delta?.content as string | undefined;

            if (content) {
              assistantContent += content;

              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && !getTextContent(last.content).startsWith("Hi! I'm")) {
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
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Chat error:', error);
      toast.error('Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingImage) || isLoading) return;
    const message = input.trim();
    setInput('');
    await streamChat(message || '', pendingImage?.base64);
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
            <p className="text-sm text-white/60">Triple-Model AI • Gemini + Claude + Perplexity • Vision</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
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
                {/* Show image preview for user messages with images */}
                {msg.role === 'user' && msg.imagePreview && (
                  <div className="mb-1 rounded-lg overflow-hidden max-w-[200px] ml-auto">
                    <img src={msg.imagePreview} alt="Uploaded" className="w-full h-auto rounded-lg" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-mansagold text-mansablue-dark font-medium'
                      : 'bg-white/10 backdrop-blur-sm border border-white/15 text-white'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="text-base prose prose-base prose-invert max-w-none [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-1 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-base [&_a]:text-mansagold [&_strong]:text-mansagold">
                      <ReactMarkdown>{getTextContent(msg.content)}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{getTextContent(msg.content)}</p>
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
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Pending image preview */}
      {pendingImage && (
        <div className="px-4 pb-2">
          <div className="relative inline-block">
            <img src={pendingImage.base64} alt="Pending" className="h-16 w-auto rounded-lg border border-mansagold/30" />
            <button
              onClick={() => setPendingImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 hover:bg-red-400 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-mansagold/20 bg-mansablue/30">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageSelect}
            className="hidden"
          />
          {Capacitor.isNativePlatform() ? (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={async () => {
                  try {
                    const { Camera: CapCamera, CameraResultType, CameraSource } = await import('@capacitor/camera');
                    const photo = await CapCamera.getPhoto({
                      quality: 90,
                      allowEditing: false,
                      resultType: CameraResultType.Base64,
                      source: CameraSource.Camera,
                      correctOrientation: true,
                    });
                    if (photo.base64String) {
                      const mimeType = photo.format === 'png' ? 'image/png' : 'image/jpeg';
                      setPendingImage({ base64: `data:${mimeType};base64,${photo.base64String}`, name: `photo.${photo.format}` });
                    }
                  } catch (err: any) {
                    if (!err?.message?.includes('cancel')) {
                      toast.error('Camera error: ' + (err?.message || 'Failed'));
                    }
                  }
                }}
                disabled={isLoading}
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-mansagold shrink-0"
                title="Take photo"
              >
                <Camera className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={async () => {
                  try {
                    const { Camera: CapCamera, CameraResultType, CameraSource } = await import('@capacitor/camera');
                    const photo = await CapCamera.getPhoto({
                      quality: 90,
                      allowEditing: false,
                      resultType: CameraResultType.Base64,
                      source: CameraSource.Photos,
                    });
                    if (photo.base64String) {
                      const mimeType = photo.format === 'png' ? 'image/png' : 'image/jpeg';
                      setPendingImage({ base64: `data:${mimeType};base64,${photo.base64String}`, name: `photo.${photo.format}` });
                    }
                  } catch (err: any) {
                    if (!err?.message?.includes('cancel')) {
                      toast.error('Gallery error: ' + (err?.message || 'Failed'));
                    }
                  }
                }}
                disabled={isLoading}
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-mansagold shrink-0"
                title="Pick from gallery"
              >
                <ImagePlus className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-mansagold shrink-0"
              title="Upload image"
            >
              <ImagePlus className="w-4 h-4" />
            </Button>
          )}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={pendingImage ? "Ask about this image..." : "Ask Kayla anything about 1325.AI..."}
            disabled={isLoading}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-mansagold focus:ring-mansagold/20"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !pendingImage)}
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
