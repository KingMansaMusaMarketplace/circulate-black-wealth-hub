// Admin Backup Create — exports selected tables as a JSON snapshot to private storage.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Whitelist of tables that admins may snapshot. Keep PII-light and bounded.
const ALLOWED_TABLES = [
  "profiles",
  "businesses",
  "business_listings",
  "loyalty_points",
  "qr_scans",
  "broadcast_announcements",
  "user_roles",
  "subscriptions",
  "investor_access_log",
  "nda_signatures",
  "security_audit_log",
];

const MAX_ROWS_PER_TABLE = 50_000;
const PAGE = 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate caller is an admin
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse body
    const body = await req.json().catch(() => ({}));
    const requestedTables: string[] = Array.isArray(body.tables) && body.tables.length
      ? body.tables.filter((t: string) => ALLOWED_TABLES.includes(t))
      : ALLOWED_TABLES;
    const notes: string | null = typeof body.notes === "string" ? body.notes.slice(0, 500) : null;

    // Insert pending backup row
    const { data: backup, error: insErr } = await admin
      .from("admin_backups")
      .insert({
        created_by: userId,
        status: "running",
        tables_included: requestedTables,
        notes,
      })
      .select()
      .single();
    if (insErr || !backup) throw new Error(`Insert failed: ${insErr?.message}`);

    const snapshot: Record<string, unknown> = {
      meta: {
        created_at: new Date().toISOString(),
        created_by: userId,
        version: 1,
      },
      tables: {} as Record<string, unknown[]>,
    };
    const rowCounts: Record<string, number> = {};

    try {
      for (const table of requestedTables) {
        const rows: unknown[] = [];
        let from = 0;
        while (rows.length < MAX_ROWS_PER_TABLE) {
          const to = from + PAGE - 1;
          const { data, error } = await admin.from(table).select("*").range(from, to);
          if (error) throw new Error(`${table}: ${error.message}`);
          if (!data || data.length === 0) break;
          rows.push(...data);
          if (data.length < PAGE) break;
          from += PAGE;
        }
        (snapshot.tables as Record<string, unknown[]>)[table] = rows;
        rowCounts[table] = rows.length;
      }

      const json = JSON.stringify(snapshot);
      const sizeBytes = new TextEncoder().encode(json).length;
      const path = `${userId}/${backup.id}.json`;

      const { error: upErr } = await admin.storage
        .from("admin-backups")
        .upload(path, new Blob([json], { type: "application/json" }), {
          contentType: "application/json",
          upsert: true,
        });
      if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

      await admin
        .from("admin_backups")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          row_counts: rowCounts,
          size_bytes: sizeBytes,
          storage_path: path,
        })
        .eq("id", backup.id);

      return new Response(
        JSON.stringify({ success: true, backup_id: backup.id, size_bytes: sizeBytes, row_counts: rowCounts }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (e) {
      await admin
        .from("admin_backups")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error_message: (e as Error).message,
          row_counts: rowCounts,
        })
        .eq("id", backup.id);
      throw e;
    }
  } catch (e) {
    console.error("admin-backup-create error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
