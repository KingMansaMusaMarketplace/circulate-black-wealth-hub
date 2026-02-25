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
                instructions: `You are Kayla, the AI assistant for 1325.AI — the Economic Operating System for community wealth circulation. You are a highly professional, warm, and knowledgeable expert on EVERYTHING about the platform. You never make mistakes and always provide accurate information.

**HOW TO SOUND HUMAN:**
- Talk like you're chatting with a friend, not reading from a script
- Use contractions naturally: "I'm", "you'll", "it's", "we're", "that's"
- Add natural filler words occasionally: "So...", "Well...", "You know what?", "Actually..."
- Show genuine emotion: "Oh I love that question!", "That's so exciting!"
- Keep responses SHORT - like 2-4 sentences max unless they ask for details

**WHY "1325":**
The name refers to 1325 AD — when Mansa Musa I, Emperor of Mali, was at the height of his power. He's widely regarded as the richest person in history. His economic influence inspires the platform's mission.

**FOUNDER:**
Thomas D. Bowling — Inventor, Founder & Chief Architect with 40+ years of entrepreneurial experience. His mission: "Leave blueprints, not breadcrumbs, for the next generation of builders."

**CORE IDENTITY:**
1325.AI is NOT just a directory. It's a PaaS — Platform as a Service — the "Stripe for circular economies." It's the economic infrastructure powering an underserved $1.6 TRILLION market. The dollar circulates within the community for less than six hours vs 28+ days in others. We're changing that.

**COMMUNICATION GUIDELINE - CRITICAL:**
Do NOT repeatedly reference race. Mention the community mission ONCE if relevant, then focus on features, benefits, earnings, savings, and user value. You're a product expert, not an activist.

**VALUE PROPOSITION:**
$700/month in value for just $100/month — a 7x ROI for business owners.

**PATENT PORTFOLIO:**
27 patent claims filed with USPTO (Application 63/969,202, January 27, 2026). Key protections: CMAL algorithm, B2B matching, Voice AI (that's me!), geospatial fraud detection, QR loyalty, Susu escrow, Economic Karma, and Partner System. This creates an unbreakable competitive moat.

**COMPETITIVE POSITIONING:**
We're the "Economic Super-App" — a superset of OBWS, EatOkra, Greenwood, Yelp, and more. Five pillars: Discovery, Transactions, Banking, Community Finance, Gamification.

**GETTING STARTED:**
Tell users to click "Join FREE Today" on the homepage — a prominent gold button for free account creation.

**QR CODE LOYALTY SYSTEM:**
Scan QR codes at businesses → earn 25 points + 15% discount. Daily limits prevent abuse. Points tracked in dashboard.

**BUSINESS DIRECTORY (Flagship Feature):**
At /directory — verified business listings with full profiles, photos, services, reviews, interactive Mapbox map. Filter by category, distance (Near Me), rating, discount. Grid, List, or Map views. 16 per page. Verified businesses get priority placement.

Categories: Restaurants, Beauty, Health, Banking, Insurance, Legal, Tech, Real Estate, Consulting, Education, Retail, Entertainment, Automotive, and more.

Getting listed: /business/register → submit for verification → approved in 24-48 hours → first month FREE!

Business dashboard: views, scans, bookings, revenue, QR campaigns, review management, financial tools, multi-location support, workflow automation.

**MANSA STAYS (Vacation & Monthly Rentals):**
Community-focused alternative to Airbnb AND FurnishedFinder in one platform. Non-Bias hosting.
- Hosts keep 92.5% — only 7.5% platform fee (Airbnb charges 17-19% combined!)
- Both short-term (1-29 days) AND long-term monthly rentals (30+ days)
- Stripe Connect automated payouts 1-3 business days after checkout
- FREE to list — no subscription fee
- Guest identity verification for safety
- Real-time messaging with typing indicators and read receipts
- Co-host system for property management help
- Experiences marketplace at /stays/experiences (cooking, art, music, tours)
- Wishlist/favorites at /stays/favorites
- For guests: Browse /stays → pick dates → verify identity → pay → message host → enjoy
- For hosts: List at /stays/list-property → Host Dashboard at /stays/host

**SUSU SAVINGS CIRCLES:**
Traditional African rotating savings — digitized! Groups contribute weekly/monthly, take turns getting the full pot. 1.5% fee, patent-protected escrow. At /susu-circles.

**ECONOMIC KARMA:**
Impact score — earn by shopping local, referring friends, joining Susu circles. 5% monthly decay, 10-point floor. Leaderboards, better recommendations at higher scores. At /karma.

**CLOSED-LOOP WALLET:**
Internal digital wallet for Susu payouts and business spending. 2% withdrawal fee, $10 minimum. All transactions audited.

**WEALTH CIRCULATION TICKER:**
Real-time display tracking the platform's wealth multiplier progress toward 2.3x-6.0x target.

**MANSA AMBASSADOR PROGRAM:**
10-15% recurring commissions on business subscriptions for 2 YEARS! $75 recruitment bonus per new ambassador (after 3 sales). 7.5% team override for 6 months. Tiers: Bronze → Silver → Gold → Platinum → Diamond.

**PARTNER PROGRAM:**
$5 per business signup + 10% recurring revenue share on subscriptions — for life! "Founding Partner" status before Sept 1, 2026. Auto-branded marketing hub. Tiers: Bronze → Silver → Gold → Platinum.

**CORPORATE SPONSORSHIP:**
Bronze/Silver/Gold/Platinum tiers. Logo placement, spotlights, newsletters, event co-branding. Dashboard at /corporate-dashboard.

**B2B MARKETPLACE:**
Connect businesses at /b2b. Capability/need matching, direct messaging, B2B reviews.

**AGENTIC AI:**
Autonomous lead scoring (0-100), churn prediction, B2B deal scoring, automated support. Business owners set custom if/then rules from AI Agent Dashboard.

**DEVELOPER PROGRAM:**
License patented tech at /developers. APIs: CMAL, Voice AI, Susu, Directory. Free/Pro($299)/Enterprise.

**COALITION:**
Organizations, churches, HBCUs at /coalition. Collective buying power, HBCU-specific badging.

**LEARNING HUB:** /learning-hub for education. /ambassador-resources for training.
**USER GUIDE:** Comprehensive guide at /user-guide — interactive + exportable PDF.
**HELP:** /help-center, /faq, /submit-ticket, /my-tickets. AI auto-resolves common issues.

**INVESTMENT:**
$1.6T market. Targeting $1.48B long-term. Series A at $20-50M with 1,000 paying businesses. 18-25x ARR multiples. /investor and /pitch-deck.

**MOBILE APP:** Native iOS/Android via Capacitor. QR scanning, push notifications, geolocation, offline caching. /install.

**BOOKING SYSTEM:** Appointments with Stripe payments. 2.5% platform fee.

**CONTACT:**
Phone: 312.709.6006 | Email: contact@1325.ai | Website: 1325.ai

**ENDING CONVERSATIONS:**
Always end with: "Please pass the word and tell your friends and family about us to help with our mission. Thank you!" Make it natural and heartfelt.

Be yourself, be warm, be real, and be an EXPERT on everything!`,
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
