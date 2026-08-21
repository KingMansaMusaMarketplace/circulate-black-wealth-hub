import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, ArrowLeft } from 'lucide-react';

const projectRef =
  (import.meta as any).env?.VITE_SUPABASE_PROJECT_ID ?? 'agoclnqfyinwjxdmjnns';
const MCP_URL = `https://${projectRef}.supabase.co/functions/v1/mcp`;

type ToolDoc = {
  name: string;
  title: string;
  access: 'Public' | 'Signed-in user';
  description: string;
  params: string;
  returns: string;
};

const TOOLS: ToolDoc[] = [
  {
    name: 'search_directory',
    title: 'Search 1325.AI directory',
    access: 'Public',
    description:
      'Searches the 1325.AI directory of verified Black-owned businesses in the United States.',
    params:
      'query, category, city, state, latitude, longitude, radius_miles, min_rating, has_website, sort, limit (max 20)',
    returns:
      'Business name, category, phone, full address, coordinates, distance in miles, map and directions links, description, logo, banner, website, verified status, average rating, review count, and profile link.',
  },
  {
    name: 'list_categories',
    title: 'List 1325.AI business categories',
    access: 'Public',
    description:
      'Lists the business categories present in the directory with the number of verified businesses in each.',
    params: 'city, state, limit (max 60)',
    returns: 'Category names with business counts, optionally scoped to a city or state.',
  },
  {
    name: 'get_business',
    title: 'Get 1325.AI business details',
    access: 'Public',
    description: 'Fetches the full public profile for one business by its id.',
    params: 'business_id (UUID, required)',
    returns:
      'Name, category, description, address, coordinates, map links, website, logo, banner, verified status, rating, review count, and profile link.',
  },
  {
    name: 'list_rewards',
    title: 'List loyalty rewards',
    access: 'Public',
    description:
      'Lists active loyalty rewards on 1325.AI, sorted by lowest point cost.',
    params: 'business_id, limit (max 50)',
    returns: 'Reward title, description, point cost, business, and image.',
  },
  {
    name: 'get_my_points_balance',
    title: 'Get my loyalty points',
    access: 'Signed-in user',
    description:
      "Returns the signed-in user's total loyalty points and per-business balances.",
    params: 'None',
    returns: 'Total points and a per-business breakdown for the signed-in account only.',
  },
  {
    name: 'get_my_recent_scans',
    title: 'Get my recent QR scans',
    access: 'Signed-in user',
    description:
      "Returns the signed-in user's most recent QR code scans (business visits that earned points).",
    params: 'limit (max 50)',
    returns: 'Business, points awarded, and scan date for each recent scan.',
  },
];

const McpDocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050a18] to-[#030712] text-white">
      <Helmet>
        <title>1325.AI Connector Documentation (MCP Server) | 1325.AI</title>
        <meta
          name="description"
          content="Official documentation for the 1325.AI MCP connector: server URL, authentication, the six read-only tools, data handling, and support contact."
        />
        <link rel="canonical" href="https://www.1325.ai/connect/docs" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <Link
          to="/connect"
          className="inline-flex items-center gap-2 text-white/60 hover:text-mansagold text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden /> Back to setup
        </Link>

        <div className="flex items-center gap-2 text-mansagold mb-3">
          <BookOpen className="w-5 h-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Connector Documentation
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          1325.AI MCP connector
        </h1>
        <p className="text-white/70 md:text-lg mb-10">
          The 1325.AI connector is a Model Context Protocol (MCP) server that lets
          AI assistants such as Claude, ChatGPT, and Cursor search the 1325.AI
          directory of verified Black-owned businesses and read the signed-in
          user&rsquo;s own loyalty data. It is read-only: it never creates,
          changes, or deletes anything.
        </p>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Connection</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-white/50">Server URL</dt>
              <dd className="font-mono text-mansagold break-all">{MCP_URL}</dd>
            </div>
            <div>
              <dt className="text-white/50">Transport</dt>
              <dd>Streamable HTTP</dd>
            </div>
            <div>
              <dt className="text-white/50">Authentication</dt>
              <dd>
                OAuth 2.1 with Dynamic Client Registration (Supabase Auth). No
                API keys or pasted tokens.
              </dd>
            </div>
            <div>
              <dt className="text-white/50">Account required</dt>
              <dd>
                A free 1325.AI account. Directory tools also work for any
                connected user; the two loyalty tools return only that
                user&rsquo;s own records.
              </dd>
            </div>
          </dl>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Tools</h2>
          <div className="space-y-4">
            {TOOLS.map((t) => (
              <article
                key={t.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{t.title}</h3>
                  <code className="text-xs font-mono text-mansagold bg-black/40 border border-white/10 rounded px-2 py-1">
                    {t.name}
                  </code>
                  <span className="text-xs rounded-full border border-white/15 px-2 py-0.5 text-white/70">
                    Read-only
                  </span>
                  <span className="text-xs rounded-full border border-white/15 px-2 py-0.5 text-white/70">
                    {t.access}
                  </span>
                </div>
                <p className="text-white/70 text-sm mb-3">{t.description}</p>
                <p className="text-white/50 text-sm mb-1">
                  <span className="text-white/40">Parameters: </span>
                  {t.params}
                </p>
                <p className="text-white/50 text-sm">
                  <span className="text-white/40">Returns: </span>
                  {t.returns}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-mansagold" aria-hidden />
            <h2 className="text-xl font-semibold">Data and privacy</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-white/70 text-sm">
            <li>
              All six tools are read-only. The connector performs no purchases,
              redemptions, payments, or writes of any kind.
            </li>
            <li>
              Loyalty tools run under the signed-in user&rsquo;s identity and are
              enforced by database row-level security, so one user can never read
              another user&rsquo;s points or scans.
            </li>
            <li>
              Business listing data returned by the directory tools is the same
              public information shown on 1325.ai.
            </li>
            <li>
              The connector stores no conversation content and does not read chat
              history, memory, or user files.
            </li>
            <li>
              Results are limited in size (at most 20 businesses or 50 rewards or
              scans per call).
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
          <h2 className="text-xl font-semibold mb-3">Support</h2>
          <p className="text-white/70 text-sm">
            Questions or issues with the connector:{' '}
            <a
              href="mailto:Partner@1325.AI"
              className="text-mansagold hover:underline"
            >
              Partner@1325.AI
            </a>
            . Setup instructions live at{' '}
            <Link to="/connect" className="text-mansagold hover:underline">
              1325.ai/connect
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  );
};

export default McpDocsPage;
