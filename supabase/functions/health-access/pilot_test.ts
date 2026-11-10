import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { accessRequestEmail } from "./confirmation.ts";
const base = { full_name: "Dr. Test", organization: "Clinic", role: "Physician", work_email: "a@b.co", phone: "3125550000" };
const links = { approve: "https://x/a", deny: "https://x/d", revoke: "https://x/r" };
Deno.test("pilot email is labeled and lists pilot details", () => {
  const e = accessRequestEmail({ ...base, source: "pilot", specialty: "Family Medicine", practice_location: "Chicago, IL", npi: "1234567890" }, links);
  assert(e.text.includes("Request type: Pilot Doctor"));
  assert(e.text.includes("NPI: 1234567890"));
  assert(e.html.includes("New Pilot Doctor request"));
});
Deno.test("general email has no pilot label", () => {
  const e = accessRequestEmail(base, links);
  assertEquals(e.text.includes("Pilot Doctor"), false);
});
