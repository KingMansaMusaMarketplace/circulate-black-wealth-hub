import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BatchedEvent {
  id: string;
  notification_type: string;
  event_data: any;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing notification batches...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get admin batching preferences
    const { data: preferences, error: prefError } = await supabase
      .from('admin_notification_preferences')
      .select('*')
      .eq('enable_batching', true)
      .eq('send_immediate', true);

    if (prefError) {
      console.error('Error fetching preferences:', prefError);
      throw prefError;
    }

    if (!preferences || preferences.length === 0) {
      console.log('No admins have batching enabled');
      return new Response(
        JSON.stringify({ message: 'No batching enabled' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get default batch window (5 minutes)
    const batchWindowMinutes = preferences[0]?.batch_window_minutes || 5;
    const minBatchSize = preferences[0]?.min_batch_size || 2;
    const cutoffTime = new Date(Date.now() - batchWindowMinutes * 60 * 1000);

    // Get unprocessed notifications older than cutoff time
    const { data: queuedNotifications, error: queueError } = await supabase
      .from('notification_batch_queue')
      .select('*')
      .is('processed_at', null)
      .lt('created_at', cutoffTime.toISOString())
      .order('created_at', { ascending: true });

    if (queueError) {
      console.error('Error fetching queued notifications:', queueError);
      throw queueError;
    }

    if (!queuedNotifications || queuedNotifications.length === 0) {
      console.log('No notifications to batch');
      return new Response(
        JSON.stringify({ message: 'No notifications to process' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${queuedNotifications.length} notifications to process`);

    // Group notifications by batch_key
    const batchGroups = new Map<string, BatchedEvent[]>();
    queuedNotifications.forEach((notif: any) => {
      const key = notif.batch_key;
      if (!batchGroups.has(key)) {
        batchGroups.set(key, []);
      }
      batchGroups.get(key)!.push(notif);
    });

    // Process each batch group
    let batchesProcessed = 0;
    for (const [batchKey, events] of batchGroups.entries()) {
      // Only batch if we have minimum batch size
      if (events.length < minBatchSize) {
        // Send individually if below threshold
        for (const event of events) {
          await sendIndividualNotification(supabase, resend, event);
          await markAsProcessed(supabase, event.id);
        }
        continue;
      }

      // Send as batch
      const notificationType = events[0].notification_type;
      const recipients = await getRecipients(supabase);

      if (recipients.length === 0) {
        console.log('No recipients configured');
        continue;
      }

      const batchId = crypto.randomUUID();
      const emailHtml = generateBatchEmail(notificationType, events);

      // Send email to each recipient
      for (const recipient of recipients) {
        try {
          await resend.emails.send({
            from: "Admin Notifications <onboarding@resend.dev>",
            to: [recipient],
            subject: `${events.length} ${getNotificationTypeLabel(notificationType)} Notifications`,
            html: emailHtml,
          });
          console.log(`Batch sent to ${recipient}`);
        } catch (error) {
          console.error(`Failed to send batch to ${recipient}:`, error);
        }
      }

      // Record the batch
      await supabase
        .from('notification_batches')
        .insert({
          id: batchId,
          batch_key: batchKey,
          notification_type: notificationType,
          event_count: events.length,
          events: events.map(e => e.event_data),
          recipients,
        });

      // Mark all events as processed
      const eventIds = events.map(e => e.id);
      await supabase
        .from('notification_batch_queue')
        .update({ processed_at: new Date().toISOString(), batch_id: batchId })
        .in('id', eventIds);

      batchesProcessed++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        batchesProcessed,
        notificationsProcessed: queuedNotifications.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error processing batches:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

async function getRecipients(supabase: any): Promise<string[]> {
  const { data: preferences } = await supabase
    .from('admin_notification_preferences')
    .select('notification_email, send_to_multiple_emails')
    .eq('send_immediate', true)
    .limit(1)
    .single();

  if (!preferences) return [];

  const recipients: string[] = [preferences.notification_email];
  if (preferences.send_to_multiple_emails) {
    recipients.push(...preferences.send_to_multiple_emails);
  }

  return recipients.filter(email => email && email.trim() !== '');
}

async function sendIndividualNotification(supabase: any, resend: any, event: any) {
  const recipients = await getRecipients(supabase);
  const emailHtml = generateSingleEmail(event.notification_type, event.event_data);

  for (const recipient of recipients) {
    try {
      await resend.emails.send({
        from: "Admin Notifications <onboarding@resend.dev>",
        to: [recipient],
        subject: getNotificationSubject(event.notification_type, event.event_data),
        html: emailHtml,
      });
    } catch (error) {
      console.error(`Failed to send to ${recipient}:`, error);
    }
  }
}

async function markAsProcessed(supabase: any, eventId: string) {
  await supabase
    .from('notification_batch_queue')
    .update({ processed_at: new Date().toISOString() })
    .eq('id', eventId);
}

function getNotificationTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    'business_verification': 'Business Verification',
    'agent_milestone': 'Agent Milestone',
  };
  return labels[type] || type;
}

function getNotificationSubject(type: string, data: any): string {
  if (type === 'business_verification') {
    return `New Business Verification: ${data.businessName}`;
  } else if (type === 'agent_milestone') {
    return `Agent Milestone: ${data.agentName} - ${data.milestoneType}`;
  }
  return 'Admin Notification';
}

function generateSingleEmail(type: string, data: any): string {
  if (type === 'business_verification') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { background: white; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🏢 New Business Verification Request</h2>
          </div>
          <div class="content">
            <h3>${data.businessName}</h3>
            <p><strong>Owner:</strong> ${data.ownerName}</p>
            <p><strong>Email:</strong> ${data.ownerEmail}</p>
            <p><strong>Submitted:</strong> ${new Date(data.submittedAt).toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } else {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { background: white; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎯 Agent Milestone Achieved</h2>
          </div>
          <div class="content">
            <h3>${data.agentName}</h3>
            <p><strong>Milestone:</strong> ${data.milestoneType}</p>
            <p><strong>Value:</strong> ${data.value}</p>
            <p><strong>Achieved:</strong> ${new Date(data.achievedAt).toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

function generateBatchEmail(type: string, events: BatchedEvent[]): string {
  const typeLabel = getNotificationTypeLabel(type);

  if (type === 'business_verification') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .summary { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
          .count { font-size: 48px; font-weight: bold; color: #667eea; }
          .item { padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; background: #f8f9fa; }
          .item-title { font-weight: bold; color: #333; margin-bottom: 8px; }
          .item-meta { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏢 ${events.length} New Business Verification Requests</h1>
            <p>Multiple businesses have submitted verification requests</p>
          </div>
          
          <div class="summary">
            <div class="count">${events.length}</div>
            <p>Pending Verifications</p>
          </div>
          
          ${events.map(event => `
            <div class="item">
              <div class="item-title">${event.event_data.businessName}</div>
              <div class="item-meta">
                Owner: ${event.event_data.ownerName} (${event.event_data.ownerEmail})<br>
                Submitted: ${new Date(event.event_data.submittedAt).toLocaleString()}
              </div>
            </div>
          `).join('')}
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${Deno.env.get('SITE_URL')}/admin" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review All Verifications
            </a>
          </p>
        </div>
      </body>
      </html>
    `;
  } else if (type === 'agent_milestone') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .summary { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
          .count { font-size: 48px; font-weight: bold; color: #667eea; }
          .item { padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; background: #f8f9fa; }
          .item-title { font-weight: bold; color: #333; margin-bottom: 8px; }
          .item-meta { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 ${events.length} Agent Milestones Achieved</h1>
            <p>Multiple agents have reached performance milestones</p>
          </div>
          
          <div class="summary">
            <div class="count">${events.length}</div>
            <p>New Milestones</p>
          </div>
          
          ${events.map(event => `
            <div class="item">
              <div class="item-title">${event.event_data.agentName} - ${event.event_data.milestoneType}</div>
              <div class="item-meta">
                Value: ${event.event_data.value}<br>
                Achieved: ${new Date(event.event_data.achievedAt).toLocaleString()}
              </div>
            </div>
          `).join('')}
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${Deno.env.get('SITE_URL')}/admin" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Agent Dashboard
            </a>
          </p>
        </div>
      </body>
      </html>
    `;
  }

  return '';
}

serve(handler);
