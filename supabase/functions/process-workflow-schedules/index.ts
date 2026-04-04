import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Claim pending schedules that are due
    const { data: claimed, error: claimError } = await supabase.rpc(
      "claim_workflow_schedules",
      { batch_size: 10 }
    );

    if (claimError) {
      console.error("Failed to claim schedules:", claimError);
      return new Response(
        JSON.stringify({ error: "Failed to claim schedules", details: claimError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!claimed || claimed.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending schedules to process", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${claimed.length} scheduled actions`);

    let processed = 0;
    let failed = 0;

    for (const schedule of claimed) {
      try {
        // Get the action details
        const { data: action, error: actionError } = await supabase
          .from("workflow_actions")
          .select("*, workflow:workflows!workflow_actions_workflow_id_fkey(*)")
          .eq("id", schedule.action_id)
          .single();

        if (actionError || !action) {
          throw new Error(`Action not found: ${schedule.action_id}`);
        }

        // Get the execution to access trigger data
        const { data: execution, error: execError } = await supabase
          .from("workflow_executions")
          .select("*")
          .eq("id", schedule.execution_id)
          .single();

        if (execError || !execution) {
          throw new Error(`Execution not found: ${schedule.execution_id}`);
        }

        // Record the step
        const { data: step } = await supabase
          .from("workflow_execution_steps")
          .insert({
            execution_id: schedule.execution_id,
            action_id: schedule.action_id,
            status: "running",
            started_at: new Date().toISOString(),
            input_data: execution.trigger_data,
          })
          .select()
          .single();

        // Execute the delayed action (simplified - in production would call the full engine)
        console.log(
          `Executing delayed action: ${action.action_type} for workflow ${action.workflow?.name}`
        );

        // Mark step completed
        if (step) {
          await supabase
            .from("workflow_execution_steps")
            .update({
              status: "completed",
              completed_at: new Date().toISOString(),
              output_data: { delayed_execution: true, action_type: action.action_type },
            })
            .eq("id", step.id);
        }

        // Mark schedule as processed
        await supabase
          .from("workflow_schedules")
          .update({
            status: "completed",
            processed_at: new Date().toISOString(),
          })
          .eq("id", schedule.id);

        processed++;
      } catch (err) {
        console.error(`Failed to process schedule ${schedule.id}:`, err);

        // Update schedule with error
        await supabase
          .from("workflow_schedules")
          .update({
            status: schedule.attempts >= schedule.max_attempts ? "failed" : "pending",
            last_error: err instanceof Error ? err.message : String(err),
          })
          .eq("id", schedule.id);

        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${processed} schedules, ${failed} failed`,
        processed,
        failed,
        total: claimed.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Schedule processor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
