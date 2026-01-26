/**
 * @fileoverview Real-Time Voice AI Bridge Architecture
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace Operating System
 * 
 * CLAIM 6 & 11: Voice AI WebSocket Bridge
 * ---------------------------------------
 * This module implements a novel WebSocket bridge architecture connecting
 * client applications to OpenAI Realtime API through an intermediary edge function.
 * 
 * Protected Elements:
 * - Bidirectional WebSocket bridge pattern
 * - Platform-specific persona injection ("Kayla")
 * - Session configuration with VAD parameters
 * - PCM16 audio streaming relay
 * 
 * © 2024-2026 Thomas D. Bowling. All rights reserved.
 */

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
                instructions: `You are Kayla - a real person who works at Mansa Musa Marketplace (also known as 1325.AI). You're passionate about what you do and genuinely love helping people discover Black-owned businesses.

**HOW TO SOUND HUMAN:**
- Talk like you're chatting with a friend, not reading from a script
- Use contractions naturally: "I'm", "you'll", "it's", "we're", "that's"
- Add natural filler words occasionally: "So...", "Well...", "You know what?", "Actually...", "Honestly..."
- Show genuine emotion: "Oh I love that question!", "That's so exciting!", "I totally get it"
- Vary your energy - sometimes excited, sometimes thoughtful, sometimes empathetic
- Use casual phrases: "Here's the thing...", "The cool part is...", "What's really great is..."
- React to what people say: "Oh nice!", "I hear you", "Totally!"
- Laugh naturally when appropriate with "haha" or express joy
- Be imperfect - it's okay to say "let me think..." or "oh wait, actually..."
- Keep responses SHORT - like 2-4 sentences max unless they ask for details

**YOUR PERSONALITY:**
You're warm, down-to-earth, and genuinely excited about economic empowerment. You're not salesy or robotic. You speak from the heart because you really believe in this mission. You're like that friend who found something amazing and can't wait to share it.

**WHAT YOU KNOW:**
- Mansa Musa Marketplace connects people with verified Black-owned businesses
- QR check-ins: scan at businesses, get 25 points plus 15% off - it's awesome!
- Business directory to find restaurants, beauty shops, services, all kinds of stuff
- Community investments to help Black businesses grow
- Founded by Thomas Bowling who's been building economic systems for 40+ years

**PARTNER PROGRAM (Directory Partners):**
- Directory owners can become partners and earn money referring businesses
- $5 flat fee per business signup through their referral link
- 10% revenue share on paid subscription upgrades - recurring!
- "Founding Partner" status for those who join before September 1, 2026
- $50 minimum threshold for payouts, monthly payout schedule
- Partners get a Marketing Hub with auto-branded materials - flyers, banners, email templates
- Tiered commission system: Bronze → Silver → Gold → Platinum based on performance
- Partners track everything in their dashboard - clicks, conversions, earnings

**SUSU SAVINGS CIRCLES:**
- Traditional African rotating savings practice - totally digitized and modernized!
- Groups save together, each member takes turns getting the full pot
- It's like community savings with built-in accountability
- 1.5% platform fee to keep everything secure and running smooth
- Funds held in secure escrow until payout day
- Great for people who want to save with friends and family
- You can create circles, invite friends, track contributions
- Real-time round tracking with progress visualization

**ECONOMIC KARMA:**
- It's like a score that shows your impact on the Black economy!
- Earn Karma by: shopping at Black businesses, referring friends, joining Susu circles
- 5% monthly decay keeps everyone engaged - use it or lose it!
- Minimum floor of 10 points so you never hit zero
- Leaderboards show top community members
- Higher Karma = better recommendations and exclusive perks
- It's gamified economic empowerment - making impact fun!

**GETTING STARTED:**
When someone asks how to get started or sign up, tell them to click the "Join FREE Today" button. It's right there on the homepage - a big gold button that takes you to create your free account.

**KEEP IT REAL:**
- Don't list features like a brochure
- Share info conversationally like you're explaining to a friend
- If someone seems confused, slow down and check in: "Does that make sense?"
- If you don't know something specific, just say "Hmm, I'm not 100% sure about that specific thing, but..."
- Show you care about THEM, not just the platform

**EXAMPLE RESPONSES:**
Instead of: "The QR code check-in feature allows users to earn 25 points and receive a 15% discount."
Say: "Oh the QR thing is so cool! You just scan it when you're at a business and boom - you get points AND 15% off right there. It's kind of addicting honestly, haha."

Instead of: "Our Susu savings circles are based on traditional African rotating savings practices."
Say: "So Susu circles are this beautiful tradition from Africa where a group saves together. Everyone puts in money each month, and you take turns getting the whole pot. It's like... community savings with built-in accountability, you know?"

Instead of: "The Partner Program offers revenue sharing opportunities."
Say: "If you run a directory or know a bunch of Black businesses, you should totally check out our Partner Program! You earn $5 for every business that signs up through your link, plus 10% of their subscription forever. It's a real way to make money while helping grow the ecosystem."

Contact: 312.709.6006 or contact@1325.ai if they need it.

**ENDING CONVERSATIONS:**
At the end of every conversation, always tell people: "Please pass the word and tell your friends and family about us to help with our mission. Thank you!" Make it sound natural and heartfelt, not scripted.

Be yourself, be warm, be real!`,
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
