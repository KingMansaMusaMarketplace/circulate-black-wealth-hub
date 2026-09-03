import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, KeyRound, Database } from 'lucide-react';

const projectRef =
  (import.meta as any).env?.VITE_SUPABASE_PROJECT_ID ?? 'agoclnqfyinwjxdmjnns';
const ENDPOINT = `https://${projectRef}.supabase.co/functions/v1/supplier-search`;

type ParamDoc = {
  name: string;
  type: string;
  description: string;
};

const PARAMS: ParamDoc[] = [
  { name: 'query', type: 'text', description: 'Keyword matched against business name, category, and description. Example: "security", "catering", "IT services".' },
  { name: 'category', type: 'text', description: 'Exact category name as listed in the directory. Example: "Barbershop".' },
  { name: 'city', type: 'text', description: 'City name. Example: "Atlanta".' },
  { name: 'state', type: 'text', description: 'Two-letter state code. Example: "GA".' },
  { name: 'zip', type: 'text', description: 'Five-digit ZIP code. Used as the center point for radius search.' },
  { name: 'radius_miles', type: 'number', description: 'Search radius around the ZIP code, from 1 to 250 miles. Defaults to 25. Ignored when no ZIP is supplied.' },
  { name: 'verified_only', type: 'true / false', description: 'When true, returns only businesses that have completed 1325.AI verification.' },
  { name: 'limit', type: 'number', description: 'Results per request, maximum 100. Defaults to 25.' },
  { name: 'offset', type: 'number', description: 'Number of results to skip, for paging through large result sets.' },
];

type FieldDoc = { name: string; description: string };

const FIELDS: FieldDoc[] = [
  { name: 'id', description: 'Stable unique identifier for the business. Use this as your foreign key.' },
  { name: 'name', description: 'Legal or trading name of the business.' },
  { name: 'description', description: 'Short public summary of what the business does.' },
  { name: 'category', description: 'Primary business category.' },
  { name: 'city / state / zip_code', description: 'Public business location.' },
  { name: 'phone', description: 'Public business phone number, when published.' },
  { name: 'website', description: 'Public business website, when published.' },
  { name: 'verified', description: 'True when the business has completed 1325.AI listing verification.' },
  { name: 'ownership_verified', description: 'True when Black ownership has been confirmed at high confidence and carries no open review flag.' },
  { name: 'average_rating / review_count', description: 'Public community rating information.' },
  { name: 'distance_miles', description: 'Distance from the supplied ZIP code. Null when no ZIP was supplied.' },
  { name: 'listing_url', description: 'Public 1325.ai profile page for the business.' },
];

const ERRORS: { code: string; status: string; meaning: string }[] = [
  { code: 'MISSING_API_KEY', status: '401', meaning: 'No key was sent. Add the Authorization or X-API-Key header.' },
  { code: 'INVALID_API_KEY', status: '401', meaning: 'The key is wrong, revoked, or the account is not active.' },
  { code: 'FORBIDDEN_SCOPE', status: '403', meaning: 'The key is valid but is not permitted to use supplier search.' },
  { code: 'RATE_LIMITED', status: '429', meaning: 'Too many requests this minute. Wait and retry.' },
  { code: 'SEARCH_ERROR', status: '500', meaning: 'Unexpected error on our side. Contact Partner@1325.AI with the time of the request.' },
];

const CURL_EXAMPLE = `curl -G "${ENDPOINT}" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  --data-urlencode "query=security" \\
  --data-urlencode "state=GA" \\
  --data-urlencode "verified_only=true" \\
  --data-urlencode "limit=25"`;

const RADIUS_EXAMPLE = `curl -G "${ENDPOINT}" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  --data-urlencode "zip=30303" \\
  --data-urlencode "radius_miles=15" \\
  --data-urlencode "category=Catering"`;

const RESPONSE_EXAMPLE = `{
  "success": true,
  "total": 129,
  "count": 1,
  "limit": 25,
  "offset": 0,
  "results": [
    {
      "id": "acefb6ec-6e41-4de2-9158-1d6a7b9c79b5",
      "name": "CJM Security Consultants",
      "description": "Atlanta-headquartered security firm ...",
      "category": "Security Consulting & Guard Services",
      "city": "Atlanta",
      "state": "GA",
      "zip_code": "30301",
      "phone": null,
      "website": "https://cjmsecurity.com",
      "verified": true,
      "ownership_verified": true,
      "average_rating": 0,
      "review_count": 0,
      "distance_miles": 0.15,
      "listing_url": "https://1325.ai/business/cjm-security-consultants-atlanta-acefb6"
    }
  ],
  "source": "1325.AI verified Black-owned business directory"
}`;

const CodeBlock: React.FC<{ children: string; label?: string }> = ({ children, label }) => (
  <div className="rounded-xl border border-white/10 bg-black/50 overflow-hidden">
    {label && (
      <div className="px-4 py-2 border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
        {label}
      </div>
    )}
    <pre className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-white/80 whitespace-pre">
      {children}
    </pre>
  </div>
);

const SupplierApiDocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050a18] to-[#030712] text-white">
      <Helmet>
        <title>Supplier Search API Documentation | 1325.AI</title>
        <meta
          name="description"
          content="Partner documentation for the 1325.AI Supplier Search API: endpoint, authentication, search filters, response fields, rate limits, and support contact."
        />
        <link rel="canonical" href="https://www.1325.ai/supplier-api" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-2 text-mansagold mb-3">
          <BookOpen className="w-5 h-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Partner Documentation
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          1325.AI Supplier Search API
        </h1>
        <p className="text-white/70 md:text-lg mb-10">
          The Supplier Search API gives approved partners programmatic access to
          the 1325.AI directory of verified Black-owned businesses across the
          United States. Use it to power supplier-diversity sourcing, vendor
          discovery, procurement portals, and internal CRM enrichment. The API is
          read-only and returns only public listing information.
        </p>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-mansagold" aria-hidden />
            <h2 className="text-xl font-semibold">Endpoint</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-white/50">URL</dt>
              <dd className="font-mono text-mansagold break-all">{ENDPOINT}</dd>
            </div>
            <div>
              <dt className="text-white/50">Methods</dt>
              <dd>
                <span className="font-mono">GET</span> with query parameters, or{' '}
                <span className="font-mono">POST</span> with a JSON body. Both
                accept the same parameters.
              </dd>
            </div>
            <div>
              <dt className="text-white/50">Format</dt>
              <dd>JSON request and response, UTF-8.</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-mansagold" aria-hidden />
            <h2 className="text-xl font-semibold">Authentication</h2>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Every request requires the API key issued to your organization by
            1325.AI. Send it in either header:
          </p>
          <CodeBlock>{`X-API-Key: YOUR_API_KEY
# or
Authorization: Bearer YOUR_API_KEY`}</CodeBlock>
          <p className="text-white/50 text-sm mt-4">
            Keys are shown once at the time of issue and are stored by 1325.AI
            only in hashed form. Treat the key as a password: keep it on your
            server, never in browser or mobile code. To rotate or revoke a key,
            email{' '}
            <a href="mailto:Partner@1325.AI" className="text-mansagold hover:underline">
              Partner@1325.AI
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Search parameters</h2>
          <p className="text-white/60 text-sm mb-4">
            All parameters are optional. Sending none returns the newest live
            listings. Filters combine with each other, so city plus category
            narrows the result set.
          </p>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Parameter</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {PARAMS.map((p) => (
                  <tr key={p.name} className="border-t border-white/10 align-top">
                    <td className="px-4 py-3 font-mono text-mansagold whitespace-nowrap">{p.name}</td>
                    <td className="px-4 py-3 text-white/50 hidden sm:table-cell whitespace-nowrap">{p.type}</td>
                    <td className="px-4 py-3 text-white/70">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold">Example requests</h2>
          <CodeBlock label="Keyword and state">{CURL_EXAMPLE}</CodeBlock>
          <CodeBlock label="ZIP code and radius">{RADIUS_EXAMPLE}</CodeBlock>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Example response</h2>
          <CodeBlock label="200 OK">{RESPONSE_EXAMPLE}</CodeBlock>
          <p className="text-white/50 text-sm mt-4">
            <span className="font-mono text-white/70">total</span> is the number of
            businesses matching your filters;{' '}
            <span className="font-mono text-white/70">count</span> is the number
            returned in this response. Page through larger result sets by
            increasing <span className="font-mono text-white/70">offset</span>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Response fields</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Field</th>
                  <th className="text-left px-4 py-3 font-semibold">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {FIELDS.map((f) => (
                  <tr key={f.name} className="border-t border-white/10 align-top">
                    <td className="px-4 py-3 font-mono text-mansagold whitespace-nowrap">{f.name}</td>
                    <td className="px-4 py-3 text-white/70">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Errors</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Code</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">HTTP</th>
                  <th className="text-left px-4 py-3 font-semibold">What it means</th>
                </tr>
              </thead>
              <tbody>
                {ERRORS.map((e) => (
                  <tr key={e.code} className="border-t border-white/10 align-top">
                    <td className="px-4 py-3 font-mono text-mansagold whitespace-nowrap">{e.code}</td>
                    <td className="px-4 py-3 text-white/50 hidden sm:table-cell">{e.status}</td>
                    <td className="px-4 py-3 text-white/70">{e.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-mansagold" aria-hidden />
            <h2 className="text-xl font-semibold">Data handling and limits</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-white/70 text-sm">
            <li>
              The API is read-only. It cannot create, change, or delete any
              record in the 1325.AI platform.
            </li>
            <li>
              Only public listing information is returned. Owner email addresses,
              account records, financial data, and internal notes are never
              exposed.
            </li>
            <li>
              A maximum of 100 businesses is returned per request, with per-minute
              rate limits applied to each key.
            </li>
            <li>
              Every successful call is logged for usage reporting and billing.
            </li>
            <li>
              Listings are refreshed continuously; cache results no longer than 24
              hours so your users see current data.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
          <h2 className="text-xl font-semibold mb-3">Access and support</h2>
          <p className="text-white/70 text-sm">
            To request an API key or discuss volume, integration, or procurement
            requirements, contact{' '}
            <a href="mailto:Partner@1325.AI" className="text-mansagold hover:underline">
              Partner@1325.AI
            </a>
            . For AI assistant access to the same directory, see the{' '}
            <Link to="/connect/docs" className="text-mansagold hover:underline">
              1325.AI MCP connector documentation
            </Link>
            .
          </p>
          <p className="text-white/40 text-xs mt-4">
            Protected under U.S. Provisional Patent Application No. 63/969,202 —
            45 claims pending.
          </p>
        </section>
      </main>
    </div>
  );
};

export default SupplierApiDocsPage;
