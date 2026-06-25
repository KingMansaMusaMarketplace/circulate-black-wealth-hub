import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface WorkflowAction {
  id: string;
  workflow_id: string;
  action_type: string;
  action_config: Record<string, any>;
  execution_order: number;
  condition_config: Record<string, any> | null;
  delay_seconds: number;
  is_condition: boolean;
}

interface ConditionConfig {
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "not_contains" | "exists" | "not_exists";
  value: any;
}

// Evaluate a condition against trigger data
function evaluateCondition(condition: ConditionConfig, data: Record<string, any>): boolean {
  const fieldValue = getNestedValue(data, condition.field);
  
  switch (condition.operator) {
    case "equals":
      return fieldValue == condition.value;
    case "not_equals":
      return fieldValue != condition.value;
    case "greater_than":
      return Number(fieldValue) > Number(condition.value);
    case "less_than":
      return Number(fieldValue) < Number(condition.value);
    case "contains":
      return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
    case "not_contains":
      return !String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
    case "exists":
      return fieldValue !== undefined && fieldValue !== null;
    case "not_exists":
      return fieldValue === undefined || fieldValue === null;
    default:
      return true;
  }
}

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((curr, key) => curr?.[key], obj);
}

// Execute a single action
async function executeAction(
  supabase: any,
  action: WorkflowAction,
  triggerData: Record<string, any>,
  businessId: string,
  previousOutput: Record<string, any> | null
): Promise<{ success: boolean; output?: Record<string, any>; error?: string }> {
  const context = { ...triggerData, previous_output: previousOutput };

  try {
    switch (action.action_type) {
      case "send_email": {
        const { to, subject, body } = action.action_config;
        const resolvedTo = resolveTemplate(to, context);
        const resolvedSubject = resolveTemplate(subject, context);
        const resolvedBody = resolveTemplate(body, context);

        const response = await supabase.functions.invoke("send-notification-email", {
          body: { to: resolvedTo, subject: resolvedSubject, html: resolvedBody },
        });

        if (response.error) throw new Error((response.error as Error).message);
        return { success: true, output: { email_sent_to: resolvedTo } };
      }

      case "add_tag":
      case "remove_tag": {
        const { tag, target_table = "customers", target_id_field = "user_id" } = action.action_config;
        const targetId = getNestedValue(context, target_id_field);

        if (!targetId) throw new Error(`Target ID not found in field: ${target_id_field}`);

        // SECURITY: workflows may only tag customer-facing records they own.
        const ALLOWED_TAG_TABLES = new Set(["customers", "bookings", "b2b_connections"]);
        if (!ALLOWED_TAG_TABLES.has(target_table)) {
          throw new Error(`Table '${target_table}' not allowed for tag operations`);
        }


        const { data: current } = await supabase
          .from(target_table)
          .select("tags")
          .eq("id", targetId)
          .single();

        let tags = current?.tags || [];
        if (action.action_type === "add_tag") {
          if (!tags.includes(tag)) tags = [...tags, tag];
        } else {
          tags = tags.filter((t: string) => t !== tag);
        }

        const { error } = await supabase
          .from(target_table)
          .update({ tags })
          .eq("id", targetId);

        if (error) throw error;
        return { success: true, output: { tags } };
      }

      case "update_status": {
        const { status, target_table, target_id_field } = action.action_config;
        const targetId = getNestedValue(context, target_id_field);

        // SECURITY: hardcoded allowlist — workflows cannot touch admin/financial tables
        const ALLOWED_STATUS_TABLES = new Set([
          "customers",
          "bookings",
          "business_needs",
          "b2b_connections",
          "support_tickets",
        ]);
        if (!ALLOWED_STATUS_TABLES.has(target_table)) {
          throw new Error(`Table '${target_table}' not allowed for status updates`);
        }

        const { error } = await supabase
          .from(target_table)
          .update({ status })
          .eq("id", targetId);

        if (error) throw error;
        return { success: true, output: { status } };
      }

      case "notify_user": {
        const { user_id_field, title, message } = action.action_config;
        const userId = getNestedValue(context, user_id_field || "user_id");

        if (!userId) throw new Error("notify_user requires a target user_id");

        // SECURITY: only allow notifying users who are customers of this business.
        // Prevents workflows from being abused to spam arbitrary users.
        const { data: customerLink } = await supabase
          .from("customers")
          .select("id")
          .eq("user_id", userId)
          .eq("business_id", businessId)
          .maybeSingle();

        if (!customerLink) {
          throw new Error("notify_user target is not a customer of this business");
        }

        const { error } = await supabase.from("notifications").insert({
          user_id: userId,
          title: resolveTemplate(title, context),
          message: resolveTemplate(message, context),
          type: "workflow",
        });

        if (error) throw error;
        return { success: true, output: { notified_user: userId } };
      }


      case "create_task": {
        const { title, description, assignee_field } = action.action_config;
        const assignee = getNestedValue(context, assignee_field || "user_id");

        return {
          success: true,
          output: {
            task_created: true,
            title: resolveTemplate(title, context),
            assignee,
          },
        };
      }

      case "update_customer_field": {
        const { field, value, customer_id_field } = action.action_config;
        const customerId = getNestedValue(context, customer_id_field || "customer_id");

        // SECURITY: only allow safe non-financial profile fields. Block wallet_balance,
        // subscription_tier, economic_karma, is_founding_member, role columns, etc.
        const SAFE_PROFILE_FIELDS = new Set([
          "notes",
          "city",
          "state",
          "zip_code",
          "preferred_categories",
          "bio",
        ]);
        if (!SAFE_PROFILE_FIELDS.has(field)) {
          throw new Error(`Field '${field}' not allowed in workflows`);
        }

        // Restrict updates to customers that have interacted with this business
        const { data: customerLink } = await supabase
          .from("customers")
          .select("id")
          .eq("user_id", customerId)
          .eq("business_id", businessId)
          .maybeSingle();

        if (!customerLink) {
          throw new Error("Customer is not linked to this business");
        }

        const { error } = await supabase
          .from("profiles")
          .update({ [field]: resolveTemplate(value, context) })
          .eq("id", customerId);

        if (error) throw error;
        return { success: true, output: { field, value } };
      }

      case "webhook": {
        const { url, method = "POST", body_template } = action.action_config;

        // SECURITY: prevent SSRF — block private/loopback/link-local hosts and
        // known cloud metadata endpoints. Only http(s) is allowed.
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(url);
        } catch {
          throw new Error("Webhook url is not a valid URL");
        }
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          throw new Error("Webhook url must use http or https");
        }
        const hostname = parsedUrl.hostname.toLowerCase();
        const PRIVATE_HOST_RE = /^(localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|::1|fc00:|fd00:|fe80:)/i;
        const BLOCKED_HOSTS = new Set([
          "metadata.google.internal",
          "metadata.goog",
          "instance-data",
          "metadata",
        ]);
        if (PRIVATE_HOST_RE.test(hostname) || BLOCKED_HOSTS.has(hostname)) {
          throw new Error("Webhook url targets a private or metadata address");
        }

        const resolvedBody = body_template
          ? JSON.parse(resolveTemplate(JSON.stringify(body_template), context))
          : context;

        // SECURITY: do NOT forward caller-controlled headers (Authorization, Cookie, etc.)
        // to prevent credential relay / smuggling via webhook actions.
        const safeMethod = ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(String(method).toUpperCase())
          ? String(method).toUpperCase()
          : "POST";

        const resp = await fetch(parsedUrl.toString(), {
          method: safeMethod,
          headers: { "Content-Type": "application/json" },
          body: safeMethod === "GET" ? undefined : JSON.stringify(resolvedBody),
          redirect: "manual",
        });

        if (!resp.ok) throw new Error(`Webhook failed: ${resp.status}`);
        const respData = await resp.json().catch(() => ({}));
        return { success: true, output: respData };
      }


      default:
        return { success: false, error: `Unknown action type: ${action.action_type}` };
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// Simple template resolver: {{field.path}} → value
function resolveTemplate(template: string, data: Record<string, any>): string {
  if (!template) return template;
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const val = getNestedValue(data, path);
    return val !== undefined && val !== null ? String(val) : "";
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey) as any;

  try {
    const { trigger_type, trigger_data, business_id } = await req.json();

    if (!trigger_type || !business_id) {
      return new Response(
        JSON.stringify({ error: "trigger_type and business_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // AUTHZ: caller must be either a cron job (with secret) or the business owner/admin
    const cronSecret = Deno.env.get("CRON_SECRET");
    const providedCron = req.headers.get("x-cron-secret");
    const isCron = !!(cronSecret && providedCron && providedCron === cronSecret);

    if (!isCron) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const token = authHeader.replace("Bearer ", "");
      const { data: claims, error: claimsErr } = await (userClient as any).auth.getClaims(token);
      if (claimsErr || !claims?.claims?.sub) {
        return new Response(
          JSON.stringify({ error: "Invalid token" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const userId = claims.claims.sub as string;

      // Admin or business owner check
      const { data: isAdmin } = await (userClient as any).rpc("is_admin_secure");
      if (!isAdmin) {
        const { data: biz } = await supabase
          .from("businesses")
          .select("id")
          .eq("id", business_id)
          .or(`owner_id.eq.${userId},location_manager_id.eq.${userId}`)
          .maybeSingle();
        if (!biz) {
          return new Response(
            JSON.stringify({ error: "Forbidden: not authorized for this business" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Find active workflows matching this trigger
    const { data: workflows, error: wfError } = await supabase
      .from("workflows")
      .select("*, actions:workflow_actions(*)")
      .eq("business_id", business_id)
      .eq("trigger_type", trigger_type)
      .eq("is_active", true);

    if (wfError) throw wfError;

    if (!workflows || workflows.length === 0) {
      return new Response(
        JSON.stringify({ message: "No matching workflows found", executed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = [];

    for (const workflow of workflows) {
      // Check trigger config conditions (e.g., minimum amount)
      if (workflow.trigger_config && Object.keys(workflow.trigger_config).length > 0) {
        const triggerConditions = workflow.trigger_config.conditions as ConditionConfig[] | undefined;
        if (triggerConditions) {
          const allPass = triggerConditions.every((c: ConditionConfig) =>
            evaluateCondition(c, trigger_data || {})
          );
          if (!allPass) {
            results.push({ workflow_id: workflow.id, status: "skipped", reason: "trigger conditions not met" });
            continue;
          }
        }
      }

      // Create execution record
      const { data: execution, error: execError } = await supabase
        .from("workflow_executions")
        .insert({
          workflow_id: workflow.id,
          trigger_data: trigger_data || {},
          status: "running",
        })
        .select()
        .single();

      if (execError) throw execError;

      // Sort actions by execution_order
      const actions = (workflow.actions || []).sort(
        (a: WorkflowAction, b: WorkflowAction) => a.execution_order - b.execution_order
      );

      let previousOutput: Record<string, any> | null = null;
      let workflowFailed = false;

      for (const action of actions) {
        // Check condition
        if (action.is_condition && action.condition_config) {
          const conditions = Array.isArray(action.condition_config.conditions)
            ? action.condition_config.conditions
            : [action.condition_config];

          const conditionMet = conditions.every((c: ConditionConfig) =>
            evaluateCondition(c, { ...trigger_data, previous_output: previousOutput })
          );

          // Log the condition step
          await supabase.from("workflow_execution_steps").insert({
            execution_id: execution.id,
            action_id: action.id,
            status: conditionMet ? "completed" : "skipped",
            input_data: { conditions: action.condition_config, trigger_data },
            output_data: { condition_met: conditionMet },
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          });

          if (!conditionMet) {
            // Skip remaining actions in this branch
            break;
          }
          continue;
        }

        // Handle delayed actions
        if (action.delay_seconds && action.delay_seconds > 0) {
          const scheduledFor = new Date(Date.now() + action.delay_seconds * 1000).toISOString();
          await supabase.from("workflow_schedules").insert({
            execution_id: execution.id,
            action_id: action.id,
            scheduled_for: scheduledFor,
          });

          await supabase.from("workflow_execution_steps").insert({
            execution_id: execution.id,
            action_id: action.id,
            status: "pending",
            input_data: { scheduled_for: scheduledFor, delay_seconds: action.delay_seconds },
            started_at: new Date().toISOString(),
          });

          // Don't execute further actions — they'll be picked up by the scheduler
          break;
        }

        // Execute the action
        const stepStart = new Date().toISOString();
        const result = await executeAction(supabase, action, trigger_data || {}, business_id, previousOutput);

        await supabase.from("workflow_execution_steps").insert({
          execution_id: execution.id,
          action_id: action.id,
          status: result.success ? "completed" : "failed",
          input_data: { action_config: action.action_config, trigger_data },
          output_data: result.output || null,
          error_message: result.error || null,
          started_at: stepStart,
          completed_at: new Date().toISOString(),
        });

        if (result.success) {
          previousOutput = result.output || null;
        } else {
          workflowFailed = true;
          // Update execution as failed
          await supabase
            .from("workflow_executions")
            .update({
              status: "failed",
              error_message: result.error,
              completed_at: new Date().toISOString(),
            })
            .eq("id", execution.id);
          break;
        }
      }

      if (!workflowFailed) {
        await supabase
          .from("workflow_executions")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", execution.id);
      }

      results.push({
        workflow_id: workflow.id,
        execution_id: execution.id,
        status: workflowFailed ? "failed" : "completed",
        actions_executed: actions.length,
      });
    }

    return new Response(
      JSON.stringify({ executed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Workflow engine error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
