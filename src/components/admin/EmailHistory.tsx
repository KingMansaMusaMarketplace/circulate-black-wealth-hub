import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Mail, Search, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';

interface EmailNotification {
  id: string;
  user_id: string;
  email_type: string;
  recipient_email: string;
  subject: string;
  content: string;
  status: string;
  sent_at: string;
}

const EmailHistory: React.FC = () => {
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0 });

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_notifications')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      
      setEmails(data || []);
      
      // Calculate stats
      const sent = data?.filter(e => e.status === 'sent').length || 0;
      const failed = data?.filter(e => e.status === 'failed').length || 0;
      
      setStats({
        total: data?.length || 0,
        sent,
        failed,
      });
    } catch (error: any) {
      toast.error('Failed to load email history: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmails = emails.filter(email =>
    email.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.email_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return <Badge className={colors[status] || 'bg-gray-100'}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      new_business: 'bg-blue-100 text-blue-800',
      verification_approved: 'bg-green-100 text-green-800',
      new_customer: 'bg-purple-100 text-purple-800',
      sponsor_welcome: 'bg-yellow-100 text-yellow-800',
      sponsor_rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[type] || 'bg-gray-100'}>{type.replace(/_/g, ' ')}</Badge>;
  };

  // Sanitize HTML content to prevent XSS attacks
  const sanitizeEmailContent = (content: string): string => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'img'],
      ALLOWED_ATTR: ['href', 'target', 'style', 'class', 'src', 'alt', 'width', 'height'],
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successfully Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email History
              </CardTitle>
              <CardDescription>View all emails sent by the platform</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(email.sent_at), 'MMM d, yyyy h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell>{email.recipient_email}</TableCell>
                    <TableCell>{getTypeBadge(email.email_type)}</TableCell>
                    <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                    <TableCell>{getStatusBadge(email.status)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedEmail(email);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Email Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
            <DialogDescription>Full email information and content</DialogDescription>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Recipient</div>
                  <div>{selectedEmail.recipient_email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div>{getTypeBadge(selectedEmail.email_type)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div>{getStatusBadge(selectedEmail.status)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Sent At</div>
                  <div>{format(new Date(selectedEmail.sent_at), 'MMM d, yyyy h:mm a')}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Subject</div>
                <div className="p-3 bg-gray-50 rounded">{selectedEmail.subject}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Email Content</div>
                <div 
                  className="p-4 bg-gray-50 rounded border overflow-auto max-h-96"
                  dangerouslySetInnerHTML={{ __html: sanitizeEmailContent(selectedEmail.content) }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailHistory;
