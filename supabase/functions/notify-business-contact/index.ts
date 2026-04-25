import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotifyRequest {
  businessId: string
  senderName: string
  subject: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { businessId, senderName, subject }: NotifyRequest = await req.json()

    if (!businessId || !senderName || !subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get business owner info
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('business_name, owner_id, email')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      console.error('Business not found:', businessError)
      return new Response(
        JSON.stringify({ error: 'Business not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get owner's email from profiles if business email not set
    let recipientEmail = business.email
    if (!recipientEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', business.owner_id)
        .single()
      recipientEmail = profile?.email
    }

    if (!recipientEmail) {
      console.log('No recipient email found for business:', businessId)
      return new Response(
        JSON.stringify({ success: true, message: 'No email to notify' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send notification via Lovable transactional email infrastructure
    const { error: sendError } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'business-contact-notification',
        recipientEmail,
        idempotencyKey: `biz-contact-${businessId}-${Date.now()}`,
        templateData: {
          businessName: business.business_name,
          senderName,
          subject,
        },
      },
    })

    if (sendError) {
      console.error('Failed to send notification email:', sendError)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in notify-business-contact:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
