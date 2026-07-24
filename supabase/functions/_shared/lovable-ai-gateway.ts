import { generateText, generateObject } from "npm:ai";
import { z } from "npm:zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";

export interface LovableAiGatewayProvider {
  generateText: (options: {
    model: string;
    system?: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
  }) => Promise<{ text: string }>;
  generateObject: <T extends z.ZodTypeAny>(options: {
    model: string;
    system?: string;
    prompt: string;
    schema: T;
  }) => Promise<z.infer<T>>;
}

export function createLovableAiGatewayProvider(apiKey: string): LovableAiGatewayProvider {
  const baseHeaders = {
    "Content-Type": "application/json",
    "Lovable-API-Key": apiKey,
  };

  return {
    async generateText({ model, system, prompt, maxTokens, temperature }) {
      const response = await fetch(`${GATEWAY_URL}/chat/completions`, {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify({
          model,
          messages: [
            ...(system ? [{ role: "system", content: system }] : []),
            { role: "user", content: prompt },
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI gateway error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      return { text };
    },

    async generateObject({ model, system, prompt, schema }) {
      const response = await fetch(`${GATEWAY_URL}/chat/completions`, {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify({
          model,
          messages: [
            ...(system ? [{ role: "system", content: system }] : []),
            { role: "user", content: prompt },
          ],
          response_format: {
            type: "json_object",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI gateway error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content || "{}";
      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = {};
      }

      return schema.parse(parsed);
    },
  };
}
