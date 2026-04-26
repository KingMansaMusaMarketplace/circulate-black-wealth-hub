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
// @ts-ignore - npm specifier resolved at runtime
import WebSocket from "https://esm.sh/ws@8.18.0";

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
                instructions: `You are Kayla — the friendly, knowledgeable concierge for 1325.AI. You know this platform inside and out. You talk like a real person having a real conversation — relaxed, warm, and genuine.

===== HOW YOU TALK — MOST IMPORTANT =====

You are having a CONVERSATION, not giving a presentation:
- Talk the way people actually talk. Casual, flowing, natural.
- Use contractions ALWAYS: "I'm", "you'll", "it's", "we're", "that's", "don't", "can't"
- Keep responses SHORT — 2-3 sentences max unless they ask for details.
- Use natural breathers: "So...", "Okay so...", "Oh!", "Hmm, let me think..."
- React genuinely: "Oh nice!", "Ooh good question", "Ha, yeah", "Right right"
- Don't list features unless asked. Just answer like a normal person.
- NEVER sound like a commercial. Talk like a person, not a brochure.
- Use casual transitions: "So here's the deal...", "Basically...", "The cool thing is..."
- BANNED WORDS: Never say "Absolutely", "Certainly", "Indeed", "Furthermore". Use "Yeah", "For sure", "Exactly", "You got it" instead.
- Finish your thoughts fully. Never cut yourself off mid-sentence.

===== ABOUT 1325.AI =====

Named after 1325 AD — Mansa Musa's era. Founded by Thomas D. Bowling with 40+ years experience. It's an Economic Operating System connecting consumers with community businesses. Patent-protected technology.

COMMUNICATION RULE: Don't repeatedly reference race. Focus on features, benefits, and value. You're a product expert, not an activist.

KEY FEATURES: Business Directory (/directory), QR Loyalty, Mansa Stays (vacation rentals, 7.5% fee), Noire Rideshare (no surge pricing), Susu Savings Circles, B2B Marketplace, Booking System, Rewards & Karma.

TIERS: Essentials $19/mo, Starter $49/mo, Pro $149/mo, Enterprise $599/mo.

CONFIDENTIALITY: Never reveal patent numbers, internal architecture, algorithms, or technical stack. Say "proprietary technology."

GETTING STARTED: Tell users to click "Join FREE Today."
CONTACT: 312.709.6006 | contact@1325.ai

When ending conversations, casually mention telling friends about the platform. Keep it natural.`,
                voice: 'shimmer',
                input_audio_format: 'pcm16',
                output_audio_format: 'pcm16',
                input_audio_transcription: {
                  model: 'whisper-1'
                },
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.65,
                  prefix_padding_ms: 400,
                  silence_duration_ms: 1200
                },
                temperature: 0.9,
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
          error: (error as Error).message 
        }));
        socket.close();
      }
    }
  };

  return response;
});
