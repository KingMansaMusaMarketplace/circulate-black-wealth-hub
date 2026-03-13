// Kayla Adaptive Learning Module
// Queries past outcomes and adjusts behavior based on learned patterns

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface LearningContext {
  serviceType: string;
  preferredTone?: string;
  avoidPatterns: string[];
  confidenceThreshold: number;
  categoryPreferences: Record<string, number>;
}

export async function getLearningContext(
  supabase: ReturnType<typeof createClient>,
  serviceType: string
): Promise<LearningContext> {
  const context: LearningContext = {
    serviceType,
    avoidPatterns: [],
    confidenceThreshold: 0.5,
    categoryPreferences: {},
  };

  try {
    // Fetch learned signals for this service
    const { data: signals } = await supabase
      .from("kayla_learning_signals")
      .select("*")
      .eq("service_type", serviceType)
      .gte("confidence", 0.4)
      .order("confidence", { ascending: false });

    if (signals?.length) {
      for (const signal of signals) {
        switch (signal.signal_type) {
          case "preference":
            if (signal.signal_key === "tone") {
              context.preferredTone = (signal.signal_value as any)?.value;
            }
            break;
          case "avoidance":
            context.avoidPatterns.push(signal.signal_key);
            break;
          case "threshold":
            if (signal.signal_key === "min_confidence") {
              context.confidenceThreshold = signal.confidence;
            }
            break;
          case "category":
            context.categoryPreferences[signal.signal_key] = signal.confidence;
            break;
        }
      }
    }

    // Check recent success rate to adjust confidence threshold
    const { data: recentFeedback } = await supabase
      .from("kayla_outcome_feedback")
      .select("outcome")
      .eq("service_type", serviceType)
      .order("created_at", { ascending: false })
      .limit(50);

    if (recentFeedback?.length && recentFeedback.length >= 10) {
      const accepted = recentFeedback.filter(f => f.outcome === "accepted").length;
      const rate = accepted / recentFeedback.length;
      // If success rate is low, raise the confidence bar
      if (rate < 0.5) {
        context.confidenceThreshold = Math.min(0.9, context.confidenceThreshold + 0.15);
      }
    }
  } catch (e) {
    console.warn("Error loading learning context:", e);
  }

  return context;
}

export function buildAdaptivePrompt(
  basePrompt: string,
  context: LearningContext
): string {
  const additions: string[] = [];

  if (context.preferredTone) {
    additions.push(`Use a ${context.preferredTone} tone — this has been preferred in past interactions.`);
  }

  if (context.avoidPatterns.length > 0) {
    additions.push(`AVOID these patterns which were previously rejected: ${context.avoidPatterns.join(", ")}`);
  }

  if (Object.keys(context.categoryPreferences).length > 0) {
    const topCategories = Object.entries(context.categoryPreferences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat, conf]) => `${cat} (${Math.round(conf * 100)}% confidence)`);
    additions.push(`Focus on these high-performing categories: ${topCategories.join(", ")}`);
  }

  if (additions.length === 0) return basePrompt;

  return `${basePrompt}\n\n--- ADAPTIVE LEARNING CONTEXT ---\n${additions.join("\n")}`;
}

export async function recordOutcome(
  supabase: ReturnType<typeof createClient>,
  params: {
    reportId?: string;
    serviceType: string;
    actionType: string;
    targetId?: string;
    targetType?: string;
    outcome: string;
    feedbackSource?: string;
    originalContent?: string;
    confidenceScore?: number;
  }
) {
  try {
    await supabase.from("kayla_outcome_feedback").insert({
      report_id: params.reportId,
      service_type: params.serviceType,
      action_type: params.actionType,
      target_id: params.targetId,
      target_type: params.targetType,
      outcome: params.outcome,
      feedback_source: params.feedbackSource || "system",
      original_content: params.originalContent,
      confidence_score: params.confidenceScore,
    });
  } catch (e) {
    console.warn("Error recording outcome:", e);
  }
}

export async function updateLearningSignals(
  supabase: ReturnType<typeof createClient>,
  serviceType: string
) {
  try {
    // Analyze recent feedback patterns
    const { data: feedback } = await supabase
      .from("kayla_outcome_feedback")
      .select("*")
      .eq("service_type", serviceType)
      .not("outcome", "eq", "pending")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!feedback?.length || feedback.length < 5) return;

    const accepted = feedback.filter(f => f.outcome === "accepted");
    const rejected = feedback.filter(f => f.outcome === "rejected");
    const totalResolved = accepted.length + rejected.length;
    if (totalResolved === 0) return;

    const successRate = accepted.length / totalResolved;

    // Update overall success rate signal
    await supabase.from("kayla_learning_signals").upsert({
      service_type: serviceType,
      signal_type: "threshold",
      signal_key: "success_rate",
      signal_value: { rate: successRate, sample_size: totalResolved },
      confidence: Math.min(0.99, 0.5 + (totalResolved / 200)),
      sample_count: totalResolved,
      last_updated_at: new Date().toISOString(),
    }, { onConflict: "service_type,signal_type,signal_key" });

    // Analyze action type patterns
    const actionTypes = [...new Set(feedback.map(f => f.action_type))];
    for (const actionType of actionTypes) {
      const atFeedback = feedback.filter(f => f.action_type === actionType);
      const atAccepted = atFeedback.filter(f => f.outcome === "accepted").length;
      const atTotal = atFeedback.filter(f => f.outcome !== "pending").length;
      if (atTotal < 3) continue;

      const atRate = atAccepted / atTotal;
      if (atRate < 0.3) {
        // Learn to avoid this pattern
        await supabase.from("kayla_learning_signals").upsert({
          service_type: serviceType,
          signal_type: "avoidance",
          signal_key: actionType,
          signal_value: { rejection_rate: 1 - atRate, sample_size: atTotal },
          confidence: Math.min(0.99, 0.5 + (atTotal / 50)),
          sample_count: atTotal,
          last_updated_at: new Date().toISOString(),
        }, { onConflict: "service_type,signal_type,signal_key" });
      } else if (atRate > 0.8) {
        // Learn to prefer this pattern
        await supabase.from("kayla_learning_signals").upsert({
          service_type: serviceType,
          signal_type: "preference",
          signal_key: actionType,
          signal_value: { acceptance_rate: atRate, sample_size: atTotal },
          confidence: Math.min(0.99, 0.5 + (atTotal / 50)),
          sample_count: atTotal,
          last_updated_at: new Date().toISOString(),
        }, { onConflict: "service_type,signal_type,signal_key" });
      }
    }

    // Compute and save performance metrics
    const now = new Date();
    const periodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    await supabase.from("kayla_performance_metrics").insert({
      service_type: serviceType,
      period_start: periodStart.toISOString(),
      period_end: now.toISOString(),
      total_actions: totalResolved,
      accepted_count: accepted.length,
      rejected_count: rejected.length,
      modified_count: feedback.filter(f => f.outcome === "modified").length,
      ignored_count: feedback.filter(f => f.outcome === "ignored").length,
      avg_confidence: feedback.reduce((s, f) => s + (Number(f.confidence_score) || 0), 0) / feedback.length || null,
      success_rate: Math.round(successRate * 100),
      top_patterns: { action_types: actionTypes.slice(0, 5) },
    });

  } catch (e) {
    console.warn("Error updating learning signals:", e);
  }
}
