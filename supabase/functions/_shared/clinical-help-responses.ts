import { createOpenAI } from "npm:@ai-sdk/openai@3.0.130";
import { streamText, type ModelMessage } from "npm:ai@6.0.309";
import { fetchAIWithRetry } from './kayla-brain.ts';
import { helpGatewayFailure } from './clinical-help-errors.ts';

import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./clinical-help-run-id.ts";

export function createResponsesCall(
  request: Request,
  config: { baseURL: string; apiKey: string; model: string; onBlocked?: (failure: ReturnType<typeof helpGatewayFailure>) => Promise<void> },
  messages: ModelMessage[],
  instructions?: string,
) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  let failure: ReturnType<typeof helpGatewayFailure> | undefined;
  let settleHeaders: () => void = () => {};
  const headersReady = new Promise<void>(resolve => { settleHeaders = resolve; });
  const provider = createOpenAI({
    baseURL: `${config.baseURL.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1`,
    apiKey: config.apiKey,
    headers: { "Lovable-API-Key": config.apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      try {
        // Shared resilience with one attempt: never retry network timeouts or terminal denials.
        const requestInit = init as RequestInit | undefined;
        const headers = new Headers(requestInit?.headers);
        const runId = runIdFetch.getRunId();
        if (runId) headers.set('X-Lovable-AIG-Run-ID', runId);
        const response = await fetchAIWithRetry(String(input), { ...requestInit, headers }, { attempts: 1, label: 'clinical-product-help' });
        if (!response.ok) {
          failure = helpGatewayFailure(response.status, await response.clone().json().catch(() => ({})));
          if (failure.paused) await config.onBlocked?.(failure);
        }
        return await runIdFetch.fetchResponse(response);
      } catch (e) { failure = { status: request.signal.aborted ? 499 : 503, message: e instanceof Error ? e.message : 'AI connection failed', paused: false }; throw e; }
      finally { settleHeaders(); }
    },
  });
  const reasoning = config.model !== "openai/chat-latest";
  const result = streamText({
    model: provider.responses(config.model),
    // AI SDK 6 lacks `instructions`: rename this key to `system` there.
    ...(instructions ? { system: instructions } : {}),
    maxRetries: 0,
    onError: ({ error }) => {
      failure ??= { status: request.signal.aborted ? 499 : 503, message: error instanceof Error ? error.message : 'Kayla could not start the answer.', paused: false };
      settleHeaders();
    },
    messages,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        ...(reasoning
          ? {
              forceReasoning: true,
              reasoningEffort: "medium",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            }
          : {}),
      },
    },
  });
  return {
    result,
    gateway: runIdFetch,
    headersReady,
    failure: () => failure,
    response: () =>
      withLovableAiGatewayRunIdHeader(result.toUIMessageStreamResponse({ sendReasoning: true }), runIdFetch),
  };
}
