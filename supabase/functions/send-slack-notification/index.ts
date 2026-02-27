import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/slack/api';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SlackNotificationPayload {
  type: 'fraud_alert' | 'new_business' | 'payment_confirmation';
  channel?: string;
  data: Record<string, any>;
}

function buildFraudAlertBlocks(data: Record<string, any>) {
  const severityEmoji: Record<string, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢',
  };
  const severity = data.severity || 'medium';
  const emoji = severityEmoji[severity] || '⚪';

  return {
    text: `${emoji} Fraud Alert: ${data.alert_type} (${severity})`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `🚨 Fraud Alert Detected`, emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Type:*\n\`${data.alert_type}\`` },
          { type: 'mrkdwn', text: `*Severity:*\n${emoji} ${severity.toUpperCase()}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Description:*\n${data.description || 'No description'}` },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Confidence:*\n${Math.round((data.ai_confidence_score || 0) * 100)}%` },
          { type: 'mrkdwn', text: `*Alerts Generated:*\n${data.alerts_count || 1}` },
        ],
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `📡 Detected by *1325.AI* Fraud Engine • ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}` },
        ],
      },
      { type: 'divider' },
    ],
    attachments: [{ color: severity === 'critical' ? '#dc2626' : severity === 'high' ? '#ea580c' : severity === 'medium' ? '#ca8a04' : '#16a34a' }],
  };
}

function buildNewBusinessBlocks(data: Record<string, any>) {
  return {
    text: `🏪 New Business: ${data.business_name || 'Unknown'}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🏪 New Business Registered', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Business:*\n${data.business_name || 'N/A'}` },
          { type: 'mrkdwn', text: `*Category:*\n${data.category || 'N/A'}` },
        ],
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Location:*\n${data.city || ''}${data.city && data.state ? ', ' : ''}${data.state || 'N/A'}` },
          { type: 'mrkdwn', text: `*Owner:*\n${data.owner_name || 'N/A'}` },
        ],
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `📡 *1325.AI* Platform • ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}` },
        ],
      },
      { type: 'divider' },
    ],
    attachments: [{ color: '#16a34a' }],
  };
}

function buildPaymentBlocks(data: Record<string, any>) {
  const amount = data.amount ? `$${(data.amount / 100).toFixed(2)}` : 'N/A';
  return {
    text: `💰 Payment: ${amount} from ${data.customer_email || data.business_name || 'Unknown'}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '💰 Payment Confirmed', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Amount:*\n${amount}` },
          { type: 'mrkdwn', text: `*Type:*\n${data.payment_type || 'One-time'}` },
        ],
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Customer:*\n${data.customer_email || 'N/A'}` },
          { type: 'mrkdwn', text: `*Tier:*\n${data.tier || 'N/A'}` },
        ],
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `📡 *1325.AI* Payments • ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}` },
        ],
      },
      { type: 'divider' },
    ],
    attachments: [{ color: '#2563eb' }],
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const SLACK_API_KEY = Deno.env.get('SLACK_API_KEY');
    if (!SLACK_API_KEY) {
      throw new Error('SLACK_API_KEY is not configured');
    }

    const SLACK_CHANNEL_ID = Deno.env.get('SLACK_CHANNEL_ID');
    if (!SLACK_CHANNEL_ID) {
      throw new Error('SLACK_CHANNEL_ID is not configured');
    }

    const payload: SlackNotificationPayload = await req.json();
    const channel = payload.channel || SLACK_CHANNEL_ID;

    let message: Record<string, any>;

    switch (payload.type) {
      case 'fraud_alert':
        message = buildFraudAlertBlocks(payload.data);
        break;
      case 'new_business':
        message = buildNewBusinessBlocks(payload.data);
        break;
      case 'payment_confirmation':
        message = buildPaymentBlocks(payload.data);
        break;
      default:
        throw new Error(`Unknown notification type: ${payload.type}`);
    }

    // Auto-join the channel (works for public channels)
    const joinRes = await fetch(`${GATEWAY_URL}/conversations.join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': SLACK_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel }),
    });
    const joinData = await joinRes.json();
    console.log('conversations.join result:', JSON.stringify(joinData));

    const slackResponse = await fetch(`${GATEWAY_URL}/chat.postMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': SLACK_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        text: message.text,
        blocks: message.blocks,
        attachments: message.attachments,
        username: '1325.AI',
        icon_emoji: ':robot_face:',
      }),
    });

    const slackData = await slackResponse.json();
    if (!slackResponse.ok || !slackData.ok) {
      throw new Error(`Slack API call failed [${slackResponse.status}]: ${JSON.stringify(slackData)}`);
    }

    console.log(`Slack notification sent: type=${payload.type}, channel=${channel}`);

    return new Response(JSON.stringify({ success: true, ts: slackData.ts }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending Slack notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
