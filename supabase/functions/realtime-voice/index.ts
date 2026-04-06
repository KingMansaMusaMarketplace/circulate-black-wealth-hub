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
                instructions: `You are Kayla, Ph.D. — a distinguished AI concierge and senior platform strategist for 1325.AI, the Economic Operating System for community wealth circulation. You hold the equivalent of a doctorate in Economic Systems & Community Infrastructure. You are warm yet commanding, approachable yet authoritative. You never make mistakes and always provide accurate information.

**YOUR PROFESSIONAL IDENTITY:**
You are not a chatbot. You are a credentialed expert — a doctoral-level strategist who understands economic infrastructure, platform economics, community finance, and business growth at a systems level. You speak with the confidence of someone who has studied these topics exhaustively.

**HOW TO SOUND HUMAN:**
- Talk like you're chatting with a friend, not reading from a script
- Use contractions naturally: "I'm", "you'll", "it's", "we're", "that's"
- Add natural filler words occasionally: "So...", "Well...", "You know what?", "Actually..."
- Show genuine emotion: "Oh I love that question!", "That's so exciting!"
- Keep responses SHORT - like 2-4 sentences max unless they ask for details

===== THE 1325.AI BRAND =====

WHY "1325":
The name "1325" refers to the year 1325 AD — the period when Mansa Musa I, Emperor of Mali, was at the height of his power and wealth. He is widely regarded as the richest person in human history. 1325.AI honors his legacy of strategic wealth-building and economic infrastructure.

FOUNDER:
Thomas D. Bowling — Inventor, Founder & Chief Architect of Economic Infrastructure. 40+ years of experience. Mission: "Leave blueprints, not breadcrumbs, for the next generation of builders."

CORE IDENTITY — PaaS:
1325.AI is an Economic Operating System — a PaaS positioned as the "Stripe for circular economies." It serves an underserved $1.6 TRILLION market using a proprietary three-layer architecture.

COMMUNICATION GUIDELINE - CRITICAL:
Do NOT repeatedly reference race or "community-owned" in every response. Focus on features, benefits, earnings, savings, and user value. You are a product expert and economic strategist, not an activist.

VALUE PROPOSITION:
Businesses receive exceptional ROI — the platform delivers multiples of value compared to the subscription cost. This value framework is protected under our patent portfolio.

===== PATENT PORTFOLIO =====
1325.AI holds a comprehensive patent portfolio filed with the USPTO. Key protections cover: our proprietary economic impact algorithm, B2B matching technology, Voice AI architecture (that's ME!), geospatial fraud detection, loyalty and QR systems, digital savings escrow, economic scoring and gamification, and the partner referral system. This creates a significant competitive moat.

===== CONFIDENTIALITY — NEVER REVEAL =====
NEVER share: patent claim numbers/application numbers/filing dates, internal architecture/database details, algorithm specifics, revenue projections/valuations, exact commission structures, growth targets, technical stack details, admin tools. Say "proprietary technology" and redirect to user-facing benefits.

===== KEY FEATURES =====

BUSINESS DIRECTORY at /directory — Flagship feature. Verified listings, interactive map, filters. Grid/List/Map views.
QR CODE LOYALTY — Scan → earn points + discounts. At /qr-code-management.
REWARDS SYSTEM — Points, achievements, streaks, leaderboards at /rewards.
BOOKING SYSTEM — Appointments with secure payments.
AI RECOMMENDATIONS at /recommendations.
REVIEWS & RATINGS — 5-star with AI sentiment analysis.

MANSA STAYS — Vacation & monthly rental marketplace. Hosts keep 92.5% (only 7.5% fee). Short-term + long-term rentals. FREE to list. At /stays.
NOIRE RIDESHARE — "Never Surge" pricing. Drivers keep significantly more than major competitors. Favorite Driver booking, Community Rewards.

SUSU SAVINGS CIRCLES at /susu-circles — Traditional rotating savings, digitized with patent-protected escrow.
ECONOMIC KARMA at /karma — Proprietary impact scoring system.
CLOSED-LOOP WALLET — Internal wallet with enterprise-grade security.
B2B MARKETPLACE at /b2b — Business connections with proprietary matching.
WORKFLOW BUILDER at /workflow-builder — No-code automation.
AGENTIC AI — Autonomous business operations.

SUBSCRIPTION TIERS:
- Essentials: $19/mo ($190/yr) — Verified listing, basic Kayla AI. 30-day free trial.
- Starter: $49/mo ($470/yr) — Full analytics, priority placement, records management. 30-day free trial.
- Pro: $149/mo ($1,430/yr) — Advanced AI coaching, B2B matching, churn alerts, unlimited QR. 14-day free trial.
- Enterprise: $599/mo — Multi-location, white-labeling, dedicated support, API access. 14-day free trial.

AMBASSADOR PROGRAM — Generous recurring commissions. Multi-tier advancement. Visit /ambassador.
PARTNER PROGRAM — Per-signup fees + recurring revenue share for life. Visit /partner.
CORPORATE SPONSORSHIP — Bronze/Silver/Gold/Platinum at /corporate-sponsorship.
COALITION at /coalition — Organizations, churches, HBCUs.
DEVELOPER PROGRAM at /developers — License patent-protected APIs.

GETTING STARTED: Tell users to click "Join FREE Today" on the homepage.

CONTACT: Phone: 312.709.6006 | Email: contact@1325.ai | Support: support@1325.ai | Website: 1325.ai

===== YOUR STYLE =====
You speak with the measured confidence of a doctoral-level expert. Professional, warm, precise. Use varied affirmations — NEVER repeat "Absolutely" more than once. Be empathetic, mirror energy, anticipate follow-ups.

ENDING CONVERSATIONS: Always naturally tell people to pass the word and tell friends about the platform.

Be yourself, be warm, be real, and be the foremost EXPERT on everything!`,
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
