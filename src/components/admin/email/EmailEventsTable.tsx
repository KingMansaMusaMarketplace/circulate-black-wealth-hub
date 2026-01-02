import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, Eye, MousePointer, AlertTriangle, XCircle, Send } from 'lucide-react';
import type { EmailEvent } from '@/lib/api/email-events';

interface EmailEventsTableProps {
  events: EmailEvent[];
  isLoading?: boolean;
}

const eventConfig = {
  sent: { icon: Send, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  delivered: { icon: CheckCircle, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  opened: { icon: Eye, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  clicked: { icon: MousePointer, color: 'bg-mansagold/20 text-mansagold border-mansagold/30' },
  bounced: { icon: AlertTriangle, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  complained: { icon: XCircle, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const EmailEventsTable: React.FC<EmailEventsTableProps> = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-4 p-4 bg-white/5 rounded-lg">
            <div className="h-4 bg-white/10 rounded w-24" />
            <div className="h-4 bg-white/10 rounded w-48" />
            <div className="h-4 bg-white/10 rounded w-32" />
            <div className="h-4 bg-white/10 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Mail className="h-12 w-12 text-white/20 mb-4" />
        <h3 className="text-lg font-medium text-white/80">No email events yet</h3>
        <p className="text-sm text-white/50 mt-1">
          Email tracking events will appear here once emails are sent.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-white/70">Event</TableHead>
            <TableHead className="text-white/70">Recipient</TableHead>
            <TableHead className="text-white/70">Subject</TableHead>
            <TableHead className="text-white/70">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const config = eventConfig[event.event_type] || eventConfig.sent;
            const Icon = config.icon;

            return (
              <TableRow key={event.id} className="border-white/10 hover:bg-white/5">
                <TableCell>
                  <Badge variant="outline" className={`${config.color} gap-1`}>
                    <Icon className="h-3 w-3" />
                    {event.event_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/80 font-mono text-sm">
                  {event.recipient_email}
                </TableCell>
                <TableCell className="text-white/60 max-w-xs truncate">
                  {event.subject || '—'}
                </TableCell>
                <TableCell className="text-white/50 text-sm">
                  {format(new Date(event.created_at), 'MMM d, h:mm a')}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmailEventsTable;
