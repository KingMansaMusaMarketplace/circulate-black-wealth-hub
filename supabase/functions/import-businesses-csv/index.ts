import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CSVImportRequest {
  job_id: string;
  csv_data: string;
  field_mapping: Record<string, string>;
  source_query?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { job_id, csv_data, field_mapping, source_query = 'CSV Import' }: CSVImportRequest = await req.json();

    console.log(`[import-businesses-csv] Starting import for job: ${job_id}`);

    // Update job status to running
    await supabase
      .from('business_import_jobs')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .eq('id', job_id);

    // Parse CSV
    const lines = csv_data.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = parseCSVLine(lines[0]);
    const dataRows = lines.slice(1);

    console.log(`[import-businesses-csv] Found ${dataRows.length} rows to import`);

    let imported = 0;
    let duplicates = 0;
    let errors = 0;
    const errorDetails: any[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      try {
        const values = parseCSVLine(dataRows[i]);
        const rowData: Record<string, string> = {};
        
        headers.forEach((header, idx) => {
          rowData[header] = values[idx] || '';
        });

        // Map fields using the provided mapping
        const lead = {
          business_name: rowData[field_mapping.business_name] || '',
          owner_name: rowData[field_mapping.owner_name] || null,
          owner_email: rowData[field_mapping.owner_email] || null,
          phone_number: rowData[field_mapping.phone_number] || null,
          category: rowData[field_mapping.category] || null,
          city: rowData[field_mapping.city] || null,
          state: rowData[field_mapping.state] || null,
          zip_code: rowData[field_mapping.zip_code] || null,
          website_url: rowData[field_mapping.website_url] || null,
          business_description: rowData[field_mapping.business_description] || null,
          location: rowData[field_mapping.location] || null,
          source_query,
          import_job_id: job_id,
        };

        if (!lead.business_name) {
          errors++;
          errorDetails.push({ row: i + 2, error: 'Missing business name' });
          continue;
        }

        // Check for duplicates by business name + city/email
        const duplicateCheck = supabase
          .from('b2b_external_leads')
          .select('id')
          .eq('business_name', lead.business_name);

        if (lead.owner_email) {
          duplicateCheck.eq('owner_email', lead.owner_email);
        } else if (lead.city) {
          duplicateCheck.eq('city', lead.city);
        }

        const { data: existing } = await duplicateCheck.limit(1);

        if (existing && existing.length > 0) {
          duplicates++;
          continue;
        }

        // Insert the lead
        const { error: insertError } = await supabase
          .from('b2b_external_leads')
          .insert(lead);

        if (insertError) {
          errors++;
          errorDetails.push({ row: i + 2, error: insertError.message });
          continue;
        }

        imported++;

        // Update progress every 10 rows
        if (i % 10 === 0) {
          const progress = Math.round(((i + 1) / dataRows.length) * 100);
          await supabase
            .from('business_import_jobs')
            .update({ 
              progress_percent: progress,
              businesses_imported: imported,
              duplicates_skipped: duplicates,
              errors_count: errors,
            })
            .eq('id', job_id);
        }

      } catch (rowError: any) {
        errors++;
        errorDetails.push({ row: i + 2, error: rowError.message });
      }
    }

    // Finalize job
    await supabase
      .from('business_import_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        businesses_found: dataRows.length,
        businesses_imported: imported,
        duplicates_skipped: duplicates,
        errors_count: errors,
        error_details: errorDetails.length > 0 ? errorDetails.slice(0, 50) : null, // Store first 50 errors
        progress_percent: 100,
      })
      .eq('id', job_id);

    console.log(`[import-businesses-csv] Completed: ${imported} imported, ${duplicates} duplicates, ${errors} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        imported,
        duplicates,
        errors,
        total: dataRows.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("[import-businesses-csv] Error:", error);

    // Try to update job status on error
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { job_id } = await req.json().catch(() => ({ job_id: null }));
      if (job_id) {
        await supabase
          .from('business_import_jobs')
          .update({ status: 'failed', error_details: { error: error.message } })
          .eq('id', job_id);
      }
    } catch (e) {
      console.error('Failed to update job status:', e);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

// Parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

serve(handler);
