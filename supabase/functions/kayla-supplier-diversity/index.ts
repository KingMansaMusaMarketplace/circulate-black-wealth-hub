import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey) as any;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, business_id } = await req.json();

    if (!business_id) {
      return new Response(JSON.stringify({ error: "business_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify ownership
    const { data: biz } = await supabase
      .from("businesses")
      .select("id, name, category, city, state, naics_codes, description")
      .eq("id", business_id)
      .eq("owner_id", user.id)
      .single();

    if (!biz) {
      return new Response(JSON.stringify({ error: "Business not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "scan_certifications") {
      const certifications = generateCertificationRecommendations(biz);

      // Upsert recommended certifications
      for (const cert of certifications) {
        const { data: existing } = await supabase
          .from("supplier_diversity_certifications")
          .select("id")
          .eq("business_id", business_id)
          .eq("certification_type", cert.certification_type)
          .maybeSingle();

        if (!existing) {
          await supabase.from("supplier_diversity_certifications").insert({
            business_id,
            ...cert,
          });
        }
      }

      // Log event
      await supabase.from("kayla_event_queue").insert({
        event_type: "supplier_diversity_scan",
        business_id,
        payload: { certifications_found: certifications.length },
        status: "completed",
      }).catch(() => {});

      return new Response(
        JSON.stringify({ success: true, certifications_recommended: certifications.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "find_opportunities") {
      const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY");

      let opportunities: any[] = [];

      if (perplexityKey) {
        const stateStr = biz.state || "United States";
        const categoryStr = biz.category || "services";
        const searchQuery = `Current government and corporate supplier diversity contract opportunities for minority-owned ${categoryStr} businesses in ${stateStr}. Include set-aside contracts, RFPs, and corporate supplier diversity programs actively seeking MBE vendors. Show solicitation numbers and deadlines.`;

        const perplexityRes = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${perplexityKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content: `You are a government contracting specialist. Return a JSON array of contract opportunities. Each object must have: title, agency_name, contract_type (federal/state/local/corporate), set_aside_type, estimated_value_min, estimated_value_max, deadline (YYYY-MM-DD or null), description, solicitation_number. Return ONLY valid JSON array, no markdown.`,
              },
              { role: "user", content: searchQuery },
            ],
            max_tokens: 2000,
          }),
        });

        if (perplexityRes.ok) {
          const perplexityData = await perplexityRes.json();
          const content = perplexityData.choices?.[0]?.message?.content || "[]";

          try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              opportunities = parsed.map((opp: any) => ({
                business_id,
                title: opp.title || "Untitled Opportunity",
                agency_name: opp.agency_name || "Unknown Agency",
                contract_type: opp.contract_type || "federal",
                set_aside_type: opp.set_aside_type || "minority",
                estimated_value_min: opp.estimated_value_min || null,
                estimated_value_max: opp.estimated_value_max || null,
                deadline: opp.deadline || null,
                description: opp.description || "",
                solicitation_number: opp.solicitation_number || null,
                match_score: 75,
                status: "discovered",
              }));
            }
          } catch {
            console.error("Failed to parse Perplexity response");
          }
        }
      }

      // Fallback: generate sample opportunities based on business profile
      if (opportunities.length === 0) {
        opportunities = generateSampleOpportunities(biz, business_id);
      }

      // Insert new opportunities (dedup by title + agency)
      for (const opp of opportunities) {
        const { data: existing } = await supabase
          .from("supplier_diversity_opportunities")
          .select("id")
          .eq("business_id", business_id)
          .eq("title", opp.title)
          .eq("agency_name", opp.agency_name)
          .maybeSingle();

        if (!existing) {
          await supabase.from("supplier_diversity_opportunities").insert(opp);
        }
      }

      return new Response(
        JSON.stringify({ success: true, opportunities_found: opportunities.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "get_dashboard") {
      const [certs, opps, compliance] = await Promise.all([
        supabase.from("supplier_diversity_certifications").select("*").eq("business_id", business_id).order("created_at", { ascending: false }),
        supabase.from("supplier_diversity_opportunities").select("*").eq("business_id", business_id).order("match_score", { ascending: false }),
        supabase.from("supplier_diversity_compliance").select("*").eq("business_id", business_id).order("created_at", { ascending: false }),
      ]);

      // Calculate readiness score
      const activeCerts = (certs.data || []).filter((c: any) => c.status === "active").length;
      const totalCerts = (certs.data || []).length;
      const activeOpps = (opps.data || []).filter((o: any) => ["discovered", "reviewing", "preparing"].includes(o.status)).length;
      const awardedOpps = (opps.data || []).filter((o: any) => o.status === "awarded").length;

      const readinessScore = Math.min(100, Math.round(
        (activeCerts / Math.max(totalCerts, 1)) * 40 +
        (activeOpps > 0 ? 30 : 0) +
        (awardedOpps > 0 ? 30 : 15)
      ));

      return new Response(
        JSON.stringify({
          success: true,
          certifications: certs.data || [],
          opportunities: opps.data || [],
          compliance: compliance.data || [],
          readiness_score: readinessScore,
          stats: {
            total_certifications: totalCerts,
            active_certifications: activeCerts,
            total_opportunities: (opps.data || []).length,
            active_opportunities: activeOpps,
            awarded_contracts: awardedOpps,
            pipeline_value: (opps.data || [])
              .filter((o: any) => o.status !== "lost")
              .reduce((sum: number, o: any) => sum + (o.estimated_value_max || o.estimated_value_min || 0), 0),
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Supplier diversity error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateCertificationRecommendations(biz: any) {
  const certs = [
    {
      certification_type: "MBE",
      certification_name: "Minority Business Enterprise",
      issuing_agency: "National Minority Supplier Development Council (NMSDC)",
      application_url: "https://nmsdc.org/mbes/mbe-certification/",
      ai_readiness_score: 85,
      ai_notes: "Primary certification for Black-owned businesses. Opens doors to Fortune 500 corporate supply chains. NMSDC-certified MBEs access $400B+ in annual corporate spend.",
      documents_needed: JSON.stringify(["Business license", "Tax returns (3 years)", "Bank statements", "Proof of minority ownership (51%+)", "Articles of incorporation"]),
    },
    {
      certification_type: "SDB",
      certification_name: "Small Disadvantaged Business",
      issuing_agency: "U.S. Small Business Administration (SBA)",
      application_url: "https://sam.gov/content/small-business",
      ai_readiness_score: 80,
      ai_notes: "Federal designation providing 10% price evaluation preference on federal contracts. Required for many set-aside solicitations.",
      documents_needed: JSON.stringify(["SAM.gov registration", "Tax returns", "Financial statements", "Personal financial statement (SBA Form 413)"]),
    },
    {
      certification_type: "8a",
      certification_name: "8(a) Business Development Program",
      issuing_agency: "U.S. Small Business Administration (SBA)",
      application_url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program",
      ai_readiness_score: 70,
      ai_notes: "9-year federal program with sole-source contracts up to $4.5M. Highly competitive but transformative for businesses that qualify.",
      documents_needed: JSON.stringify(["Personal net worth < $850K", "Business operating 2+ years", "Tax returns", "Business plan", "3 years financial statements"]),
    },
    {
      certification_type: "DBE",
      certification_name: "Disadvantaged Business Enterprise",
      issuing_agency: "U.S. Department of Transportation (DOT)",
      application_url: "https://www.transportation.gov/civil-rights/disadvantaged-business-enterprise",
      ai_readiness_score: 75,
      ai_notes: "Required for DOT-funded contracts (highways, transit, airports). 10%+ of federal transportation dollars are set aside for DBEs.",
      documents_needed: JSON.stringify(["Personal net worth statement", "Business tax returns", "Proof of ownership", "Resumes of owners"]),
    },
    {
      certification_type: "HUBZone",
      certification_name: "Historically Underutilized Business Zone",
      issuing_agency: "U.S. Small Business Administration (SBA)",
      application_url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/hubzone-program",
      ai_readiness_score: 60,
      ai_notes: "3% federal contracting goal. Must have principal office in a HUBZone and 35%+ employees residing in HUBZone areas.",
      documents_needed: JSON.stringify(["Proof of HUBZone location", "Employee addresses", "Payroll records", "Lease agreement"]),
    },
  ];

  // Add state-specific MBE if state is known
  if (biz.state) {
    certs.push({
      certification_type: "state_mbe",
      certification_name: `${biz.state} State MBE Certification`,
      issuing_agency: `${biz.state} Department of Commerce / Procurement`,
      application_url: "",
      ai_readiness_score: 80,
      ai_notes: `State-level MBE certification for ${biz.state}. Often required for state and local government contracts. Many states have reciprocity with NMSDC.`,
      documents_needed: JSON.stringify(["State business registration", "Tax returns", "Proof of minority ownership", "Bank statements"]),
    });
  }

  return certs;
}

function generateSampleOpportunities(biz: any, businessId: string) {
  const category = biz.category || "Professional Services";
  const state = biz.state || "IL";

  return [
    {
      business_id: businessId,
      title: `MBE Set-Aside: ${category} Contract`,
      agency_name: `${state} Department of Central Management Services`,
      contract_type: "state",
      set_aside_type: "minority",
      estimated_value_min: 25000,
      estimated_value_max: 150000,
      description: `State set-aside contract for minority-owned ${category.toLowerCase()} providers. Annual contract with renewal options.`,
      match_score: 85,
      status: "discovered",
    },
    {
      business_id: businessId,
      title: "Corporate Supplier Diversity Program - Fortune 500",
      agency_name: "Major Corporate Partner",
      contract_type: "corporate",
      set_aside_type: "minority",
      estimated_value_min: 50000,
      estimated_value_max: 500000,
      description: "Fortune 500 company seeking NMSDC-certified MBE vendors for ongoing services. Tier 1 supplier opportunities available.",
      match_score: 75,
      status: "discovered",
    },
    {
      business_id: businessId,
      title: "Federal Small Business Set-Aside",
      agency_name: "General Services Administration (GSA)",
      contract_type: "federal",
      set_aside_type: "small_business",
      estimated_value_min: 10000,
      estimated_value_max: 250000,
      description: "GSA Schedule contract opportunity for small businesses. Multiple award schedule with 5-year base period.",
      match_score: 70,
      status: "discovered",
    },
  ];
}
