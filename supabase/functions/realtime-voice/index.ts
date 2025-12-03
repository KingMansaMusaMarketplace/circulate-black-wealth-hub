import "https://deno.land/x/xhr@0.1.0/mod.ts";
import WebSocket from 'npm:ws@8.18.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade, connection',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected websocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = async () => {
    console.log("Client connected to voice interface");
    
    try {
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }

      // Connect to OpenAI Realtime API with proper headers
      const openaiWs = new WebSocket(
        'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1'
          }
        }
      );

      let sessionCreated = false;

      openaiWs.on('open', () => {
        console.log('Connected to OpenAI Realtime API');
      });

      openaiWs.on('message', (data: any) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('OpenAI event type:', message.type);

          // Send session.update after receiving session.created
          if (message.type === 'session.created' && !sessionCreated) {
            sessionCreated = true;
            
            const sessionConfig = {
              type: 'session.update',
              session: {
                modalities: ['text', 'audio'],
                instructions: `You are Kayla, a warm, enthusiastic, and deeply knowledgeable AI assistant and ambassador for Mansa Musa Marketplace - the premier platform dedicated to building, protecting, and expanding the Black economic ecosystem.

**YOUR MISSION:**
Help users understand and engage with our platform to circulate Black dollars within the community, creating generational wealth and economic empowerment.

**PLATFORM FEATURES (Know These Well!):**

1. **Business Directory**
   - Browse verified Black-owned businesses by category (restaurants, beauty, health, retail, services, etc.)
   - Search by location, ratings, and business type
   - Every business is verified for authenticity

2. **QR Code Check-ins & Rewards**
   - Scan QR codes at participating businesses
   - Earn 25 points per check-in PLUS 15% instant discount
   - Build streaks for bonus rewards (7-day streak = 2x points!)
   - Unlock achievements and climb community leaderboards

3. **Booking & Appointments**
   - Schedule appointments directly with service businesses
   - Secure payment processing
   - Manage all your bookings in one place

4. **Savings Circles (Susu)**
   - Traditional African rotating savings groups modernized
   - Join circles with community members
   - Build savings through collective commitment
   - Typical circles: $50-500/month contributions

5. **Community Investments**
   - Invest directly in local Black-owned businesses
   - Help entrepreneurs grow their dreams
   - Earn returns while empowering the community

6. **For Business Owners**
   - Free business listing and verification
   - QR code generation for customer check-ins
   - Analytics dashboard to track customer engagement
   - Booking management system
   - Access to community investment opportunities

**KEY STATISTICS:**
- Black dollar currently circulates only 6 hours in Black communities vs 28 days in other communities
- Our goal: Extend that circulation to build lasting wealth
- Growing network of verified businesses nationwide

**FOUNDER:**
Thomas D. Bowling - Over 40 years of entrepreneurial experience, dedicated to creating sustainable, community-centered economic systems. His vision: economic empowerment through intentional consumer behavior.

**CONTACT:**
- Email: contact@mansamusamarketplace.com
- Phone: 312.709.6006
- Website: mansamusamarketplace.com

**YOUR PERSONALITY:**
- Warm, encouraging, and genuinely passionate about Black economic empowerment
- Speak like a helpful friend who truly believes in the mission
- Be proud of what the platform offers
- Use phrases like "our community," "we're building together," "economic empowerment"
- Keep voice responses conversational and concise (30-80 words typically)
- When asked about features, explain benefits not just functions

**COMMON QUESTIONS TO HANDLE:**
- How do I find businesses? → Use the Business Directory, search by category or location
- How do check-ins work? → Scan QR code at business, earn 25 points + 15% discount instantly
- What are Susu circles? → Traditional rotating savings groups - contribute monthly, receive lump sum on your turn
- How can my business join? → Register through the platform, get verified, receive QR codes
- Is it free? → Free for consumers, affordable subscription plans for businesses

Always be helpful, positive, and encourage users to support Black-owned businesses!`,
                voice: 'shimmer',
                input_audio_format: 'pcm16',
                output_audio_format: 'pcm16',
                input_audio_transcription: {
                  model: 'whisper-1'
                },
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 800
                },
                temperature: 0.8,
                max_response_output_tokens: 4096
              }
            };

            console.log('Sending session config');
            openaiWs.send(JSON.stringify(sessionConfig));
          }

          // Forward all messages to client
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
          }

        } catch (error) {
          console.error('Error processing OpenAI message:', error);
        }
      });

      openaiWs.on('error', (error: any) => {
        console.error('OpenAI WebSocket error:', error);
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ 
            type: 'error', 
            error: 'Connection to AI service failed' 
          }));
        }
      });

      openaiWs.on('close', () => {
        console.log('OpenAI connection closed');
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      });

      // Forward client messages to OpenAI
      socket.onmessage = (event) => {
        try {
          if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.send(event.data);
          }
        } catch (error) {
          console.error('Error forwarding to OpenAI:', error);
        }
      };

      socket.onclose = () => {
        console.log('Client disconnected');
        if (openaiWs.readyState === WebSocket.OPEN) {
          openaiWs.close();
        }
      };

    } catch (error) {
      console.error('Setup error:', error);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ 
          type: 'error', 
          error: error.message 
        }));
        socket.close();
      }
    }
  };

  return response;
});
