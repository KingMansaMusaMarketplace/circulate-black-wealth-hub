import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TierSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number;
}

const TIER_SCHEDULES: Record<string, TierSchedule> = {
  platinum: { frequency: 'daily' },
  gold: { frequency: 'weekly', dayOfWeek: 1 }, // Monday
  silver: { frequency: 'monthly', dayOfMonth: 1 },
  bronze: { frequency: 'monthly', dayOfMonth: 1 },
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayOfMonth = today.getDate();

    // Fetch active sponsors
    const { data: sponsors, error: fetchError } = await supabase
      .from('corporate_subscriptions')
      .select('id, user_id, company_name, tier, contact_email, logo_url')
      .eq('status', 'active');

    if (fetchError) throw fetchError;

    const remindersToSend: Array<{
      subscriptionId: string;
      companyName: string;
      tier: string;
      email: string;
    }> = [];

    for (const sponsor of sponsors || []) {
      const schedule = TIER_SCHEDULES[sponsor.tier];
      if (!schedule) continue;

      let shouldSendToday = false;

      switch (schedule.frequency) {
        case 'daily':
          shouldSendToday = true;
          break;
        case 'weekly':
          shouldSendToday = dayOfWeek === schedule.dayOfWeek;
          break;
        case 'monthly':
          shouldSendToday = dayOfMonth === schedule.dayOfMonth;
          break;
      }

      if (shouldSendToday) {
        // Get contact email - try contact_email first, then fetch from auth
        let email = sponsor.contact_email;
        
        if (!email && sponsor.user_id) {
          const { data: userData } = await supabase.auth.admin.getUserById(sponsor.user_id);
          email = userData?.user?.email;
        }

        if (email) {
          remindersToSend.push({
            subscriptionId: sponsor.id,
            companyName: sponsor.company_name,
            tier: sponsor.tier,
            email,
          });
        }
      }
    }

    // Send reminders
    const results = [];
    
    for (const reminder of remindersToSend) {
      // Check if we already sent a reminder today
      const { data: existingPost } = await supabase
        .from('sponsor_social_posts')
        .select('id')
        .eq('subscription_id', reminder.subscriptionId)
        .eq('scheduled_date', today.toISOString().split('T')[0])
        .single();

      if (existingPost) {
        console.log(`Reminder already exists for ${reminder.companyName} today`);
        continue;
      }

      // Create social post record
      const { data: socialPost, error: insertError } = await supabase
        .from('sponsor_social_posts')
        .insert({
          subscription_id: reminder.subscriptionId,
          scheduled_date: today.toISOString().split('T')[0],
          status: 'pending',
          post_content: generateSuggestedContent(reminder.companyName, reminder.tier),
        })
        .select()
        .single();

      if (insertError) {
        console.error(`Failed to create social post for ${reminder.companyName}:`, insertError);
        continue;
      }

      // Send email reminder
      if (RESEND_API_KEY) {
        try {
          const emailHtml = generateEmailHtml(reminder.companyName, reminder.tier);
          
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Mansa Musa Marketplace <noreply@mansamusamarketplace.com>',
              to: [reminder.email],
              subject: `🌟 Time for your ${getTierFrequencyText(reminder.tier)} social media spotlight!`,
              html: emailHtml,
            }),
          });

          if (emailResponse.ok) {
            // Update reminder_sent_at
            await supabase
              .from('sponsor_social_posts')
              .update({ reminder_sent_at: new Date().toISOString() })
              .eq('id', socialPost.id);

            results.push({
              company: reminder.companyName,
              status: 'sent',
            });
          } else {
            const errorText = await emailResponse.text();
            console.error(`Failed to send email to ${reminder.email}:`, errorText);
            results.push({
              company: reminder.companyName,
              status: 'email_failed',
              error: errorText,
            });
          }
        } catch (emailError) {
          console.error(`Email error for ${reminder.companyName}:`, emailError);
          results.push({
            company: reminder.companyName,
            status: 'email_error',
            error: String(emailError),
          });
        }
      } else {
        console.log('RESEND_API_KEY not configured, skipping email');
        results.push({
          company: reminder.companyName,
          status: 'email_skipped_no_api_key',
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        reminders_processed: results.length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-social-reminder:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function getTierFrequencyText(tier: string): string {
  switch (tier) {
    case 'platinum':
      return 'daily';
    case 'gold':
      return 'weekly';
    default:
      return 'monthly';
  }
}

function generateSuggestedContent(companyName: string, tier: string): string {
  const templates = [
    `🌟 Proud to spotlight ${companyName}, one of our amazing ${tier} sponsors! Their support helps us empower Black-owned businesses every day. #MansamusaMarketplace #SupportBlackBusiness`,
    `A huge thank you to ${companyName} for their continued support as a ${tier} sponsor! Together, we're building economic empowerment in our community. 🙏 #BlackOwnedBusiness #CommunitySupport`,
    `Meet ${companyName} – a valued ${tier} sponsor helping us make a difference! Their commitment to our mission means the world. 💫 #EconomicEmpowerment #BlackExcellence`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateEmailHtml(companyName: string, tier: string): string {
  const frequency = getTierFrequencyText(tier);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1b365d 0%, #0f172a 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px;">🌟 Social Media Spotlight Reminder</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px;">Dear ${companyName} Team,</p>
        
        <p>It's time for your <strong>${frequency}</strong> social media recognition as a valued <strong style="color: #d4af37; text-transform: uppercase;">${tier} Sponsor</strong>!</p>
        
        <div style="background: #fff; border-left: 4px solid #d4af37; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: bold; color: #1b365d;">Suggested Post:</p>
          <p style="margin: 10px 0 0 0; font-style: italic; color: #666;">
            "Proud to support @MansamusaMarketplace in their mission to empower Black-owned businesses! Together, we're making a difference. 💪🏾 #SupportBlackBusiness #EconomicEmpowerment"
          </p>
        </div>
        
        <p>Your social media posts help us:</p>
        <ul style="color: #555;">
          <li>Increase visibility for Black-owned businesses</li>
          <li>Attract new community members</li>
          <li>Inspire other companies to support our mission</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mansamusamarketplace.com/sponsor-dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #d4af37, #b8960f); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            View Your Impact Dashboard
          </a>
        </div>
        
        <p style="color: #888; font-size: 14px;">
          As a ${tier} sponsor, you receive ${frequency} social media recognition as part of your benefits package.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          Thank you for your continued support!<br>
          <strong>The Mansa Musa Marketplace Team</strong>
        </p>
      </div>
    </body>
    </html>
  `;
}
