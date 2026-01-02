import { supabase } from '@/integrations/supabase/client';

export interface EmailEvent {
  id: string;
  email_id: string;
  event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';
  recipient_email: string;
  subject: string | null;
  lead_id: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface EmailStats {
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  total_complained: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
}

export async function fetchEmailEvents(limit = 50, offset = 0): Promise<{ events: EmailEvent[]; total: number }> {
  const { data, error, count } = await supabase
    .from('email_events')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching email events:', error);
    throw error;
  }

  return {
    events: (data || []) as EmailEvent[],
    total: count || 0,
  };
}

export async function fetchEmailStats(): Promise<EmailStats> {
  const { data, error } = await supabase
    .from('email_events')
    .select('event_type');

  if (error) {
    console.error('Error fetching email stats:', error);
    throw error;
  }

  const events = data || [];
  const counts = {
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    complained: 0,
  };

  events.forEach((event) => {
    const eventType = event.event_type as keyof typeof counts;
    if (eventType in counts) {
      counts[eventType]++;
    }
  });

  const totalSent = counts.sent || 1; // Avoid division by zero

  return {
    total_sent: counts.sent,
    total_delivered: counts.delivered,
    total_opened: counts.opened,
    total_clicked: counts.clicked,
    total_bounced: counts.bounced,
    total_complained: counts.complained,
    delivery_rate: (counts.delivered / totalSent) * 100,
    open_rate: (counts.opened / totalSent) * 100,
    click_rate: (counts.clicked / totalSent) * 100,
    bounce_rate: (counts.bounced / totalSent) * 100,
  };
}

export async function fetchEmailEventsByRecipient(email: string): Promise<EmailEvent[]> {
  const { data, error } = await supabase
    .from('email_events')
    .select('*')
    .eq('recipient_email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching email events by recipient:', error);
    throw error;
  }

  return (data || []) as EmailEvent[];
}

export async function fetchEmailEventsByLead(leadId: string): Promise<EmailEvent[]> {
  const { data, error } = await supabase
    .from('email_events')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching email events by lead:', error);
    throw error;
  }

  return (data || []) as EmailEvent[];
}
