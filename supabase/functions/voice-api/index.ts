/**
 * Voice AI Bridge API - 1325.AI Developer Platform
 * 
 * Protected under USPTO Provisional 63/969,202 (Claims 6, 11)
 * © 2024-2025 1325.ai - All Rights Reserved
 * 
 * Endpoints:
 * - POST /v1/voice/session/create - Create voice session
 * - POST /v1/voice/transcribe - Transcribe audio
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  validateApiKey,
  logApiUsage,
  errorResponse,
  successResponse,
} from "../_shared/api-gateway-utils.ts";

const REQUIRED_SCOPE = "voice:read";

interface SessionRequest {
  persona_config?: {
    name?: string;
    system_prompt?: string;
    voice_id?: string;
  };
  vad_settings?: {
    threshold?: number;
    silence_duration_ms?: number;
  };
  business_context?: {
    business_id?: string;
    business_name?: string;
  };
}

interface TranscribeRequest {
  audio_base64: string;
  language?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  
  // Expected paths: /v1/voice/session/create, /v1/voice/transcribe
  const endpoint = pathParts.slice(2).join("/"); // Remove function name prefix
  
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Validate API key
  const validation = await validateApiKey(req, supabase, REQUIRED_SCOPE);
  if (!validation.valid) {
    return errorResponse(validation.error!, validation.statusCode);
  }

  const developer = validation.developer!;

  try {
    let result: any;
    let billedUnits = 1;

    if (req.method === "POST" && (endpoint === "session/create" || endpoint === "v1/voice/session/create")) {
      // Create voice session
      const body: SessionRequest = await req.json();
      
      // Generate session ID
      const sessionId = crypto.randomUUID();
      
      // Build WebSocket URL for realtime voice
      const wsUrl = `wss://${supabaseUrl.replace("https://", "")}/functions/v1/realtime-voice`;
      
      result = {
        session_id: sessionId,
        websocket_url: wsUrl,
        config: {
          persona: body.persona_config || {
            name: "Kayla",
            system_prompt: "You are a helpful AI assistant for the 1325.ai marketplace.",
            voice_id: "EXAVITQu4vr4xnSDxMaL",
          },
          vad: body.vad_settings || {
            threshold: 0.5,
            silence_duration_ms: 500,
          },
          business_context: body.business_context || null,
        },
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min session
        patent_notice: "Protected under USPTO Provisional 63/969,202",
      };
      
      billedUnits = 1; // Session creation = 1 unit

    } else if (req.method === "POST" && (endpoint === "transcribe" || endpoint === "v1/voice/transcribe")) {
      // Transcribe audio
      const body: TranscribeRequest = await req.json();
      
      if (!body.audio_base64) {
        return errorResponse("audio_base64 is required", 400);
      }

      // Call the transcribe-audio function
      const transcribeResponse = await fetch(
        `${supabaseUrl}/functions/v1/transcribe-audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            audio: body.audio_base64,
          }),
        }
      );

      if (!transcribeResponse.ok) {
        const errorText = await transcribeResponse.text();
        console.error("Transcription error:", errorText);
        return errorResponse("Transcription failed", 500);
      }

      const transcription = await transcribeResponse.json();
      
      result = {
        text: transcription.text,
        language: body.language || "en",
        confidence: 0.95,
        patent_notice: "Protected under USPTO Provisional 63/969,202",
      };
      
      // Bill based on audio length (estimate ~1 unit per 15 seconds)
      const audioSizeKb = body.audio_base64.length / 1024;
      billedUnits = Math.max(1, Math.ceil(audioSizeKb / 50));

    } else {
      return errorResponse("Unknown endpoint. Available: POST /session/create, POST /transcribe", 404);
    }

    const latencyMs = Date.now() - startTime;

    // Log usage
    await logApiUsage(
      supabase,
      developer,
      `/v1/voice/${endpoint}`,
      req.method,
      200,
      latencyMs,
      billedUnits,
      req
    );

    return successResponse(result);

  } catch (error) {
    console.error("Voice API error:", error);
    
    const latencyMs = Date.now() - startTime;
    await logApiUsage(
      supabase,
      developer,
      `/v1/voice/${endpoint}`,
      req.method,
      500,
      latencyMs,
      0,
      req
    );

    return errorResponse(error.message || "Internal server error", 500);
  }
});
