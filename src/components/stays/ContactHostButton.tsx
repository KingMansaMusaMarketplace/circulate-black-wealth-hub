import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageCircle, Loader2, Send } from 'lucide-react';
import { useStaysMessaging } from '@/hooks/useStaysMessaging';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ContactHostButtonProps {
  propertyId: string;
  hostId: string;
  propertyTitle: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ContactHostButton: React.FC<ContactHostButtonProps> = ({
  propertyId,
  hostId,
  propertyTitle,
  className,
  variant = 'outline',
  size = 'default',
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { startConversation, loading } = useStaysMessaging();
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = () => {
    if (!user) {
      toast.error('Please log in to message the host');
      navigate('/login', { state: { from: `/stays/${propertyId}` } });
      return;
    }

    if (user.id === hostId) {
      toast.info("This is your property");
      return;
    }

    setShowDialog(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const conversationId = await startConversation({
      propertyId,
      hostId,
      initialMessage: message,
    });

    if (conversationId) {
      toast.success('Message sent to host!');
      setShowDialog(false);
      setMessage('');
      navigate(`/stays/messages?conversation=${conversationId}`);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={className}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Contact Host
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Message the Host</DialogTitle>
            <DialogDescription className="text-white/60">
              Send a message about "{propertyTitle}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white/80">
                Your Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'm interested in your property. I have a few questions..."
                className="bg-slate-800 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
                maxLength={1000}
              />
              <p className="text-xs text-white/40 text-right">
                {message.length}/1000
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-white/60">
              <p>💡 Tips for a great first message:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Introduce yourself briefly</li>
                <li>Mention your travel dates</li>
                <li>Ask any specific questions</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDialog(false)}
              className="text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className="bg-mansagold text-black hover:bg-mansagold/90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactHostButton;
