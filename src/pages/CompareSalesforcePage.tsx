import React from 'react';
import { Link } from 'react-router-dom';
import PageSEO from '@/components/SEO/PageSEO';
import { Button } from '@/components/ui/button';

const rows: [string, string, string][] = [
  ['Built for', 'Large enterprises already on Salesforce', 'Independent and small-to-midsize business owners'],
  ['Setup', 'Typically needs admins, IT staff or certified consultants', 'Sign up on the web or iPhone and start'],
  ['AI workforce', 'A platform to build and configure your own agents', '42 Agentic AI Employees across 6 departments, ready on day one'],
  ['Pricing style', 'Usage-based charges on top of Salesforce licenses', 'One flat monthly plan'],
  ['Brings new customers?', 'Manages customers you already have', 'Yes — a public directory where customers find you'],
  ['Trust layer', 'General business software', '51% Black-owned attestation, reviewer approval, separate Ally network'],
];

const Section = ({ title, items }: { title: string; items: [string, string][] }) => (
  <section className="mt-12">
    <h2 className="text-2xl md:text-3xl font-bold text-mansagold mb-4">{title}</h2>
    <ul className="space-y-3">
      {items.map(([b, t]) => (
        <li key={b} className="text-gray-300 text-lg leading-relaxed">
          <span className="font-semibold text-white">{b}</span> {t}
        </li>
      ))}
    </ul>
  </section>
);

const CompareSalesforcePage: React.FC = () => (
  <div className="min-h-screen bg-black text-white">
    <PageSEO
      title="1325.AI vs. Salesforce Agentforce"
      description="How 1325.AI's 42 Agentic AI Employees compare with Salesforce Agentforce for independent and small business owners."
      path="/compare/salesforce"
    />
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-mansagold uppercase tracking-widest text-sm font-semibold">Comparison</p>
      <h1 className="text-4xl md:text-5xl font-bold mt-2">1325.AI vs. Salesforce Agentforce</h1>
      <p className="text-xl text-gray-300 mt-4">“The Agentic Enterprise” — for Fortune 500s, or for every business?</p>

      <section className="mt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-mansagold mb-4">The bottom line</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          Salesforce is telling the world that the future of business is <strong className="text-white">AI agents that take action</strong>,
          working alongside people. That is the same idea behind Kayla and the <strong className="text-white">42 Agentic AI Employees</strong>.
        </p>
        <p className="text-gray-300 text-lg leading-relaxed mt-4">
          The difference is who it's for. Agentforce is built for large companies with IT teams. 1325.AI gives independent
          owners a ready-made AI staff <strong className="text-white">plus</strong> a public directory where customers find them.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-mansagold mb-4">At a glance</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead className="bg-mansablue">
              <tr>
                <th className="p-4"></th>
                <th className="p-4 font-semibold">Salesforce Agentforce</th>
                <th className="p-4 font-semibold text-mansagold">1325.AI</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, s, m]) => (
                <tr key={k} className="border-t border-white/10 align-top">
                  <td className="p-4 font-semibold text-white">{k}</td>
                  <td className="p-4 text-gray-300">{s}</td>
                  <td className="p-4 text-white bg-mansagold/10">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Section title="Where Salesforce is strong" items={[
        ['Trusted by big companies.', 'Many large corporations already use Salesforce.'],
        ['Deep data connections.', 'Its agents sit on top of years of customer records.'],
        ['Large partner network.', 'Many consultants and partners sell and install it.'],
        ['Helped move the market', 'from chatbots that answer to agents that act.'],
      ]} />
      <Section title="Where enterprise software falls short for small owners" items={[
        ['Complexity.', 'A barbershop, clinic, contractor or restaurant usually can’t turn it on without help.'],
        ['Hard-to-plan costs.', 'Usage-based charges plus licenses are tough for a small budget.'],
        ['Do-it-yourself agents.', 'Owners have to design what each agent does.'],
        ['No front door.', 'It organizes customers you already found; it doesn’t bring new ones.'],
      ]} />
      <Section title="Where 1325.AI wins" items={[
        ['Front door + back office.', 'Customers find you in the directory; Kayla and the 42 Agentic AI Employees help run your business.'],
        ['Ready on day one.', 'Your staff is already organized into 6 departments. Just ask.'],
        ['Predictable price.', 'One flat monthly plan — not an IT project.'],
        ['Mission and trust.', 'Verified Black-owned listings, a separate Ally network, and community wealth that circulates.'],
      ]} />

      <div className="mt-14 rounded-2xl border border-mansagold/40 bg-mansagold/10 p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Your AI staff is already hired.</h2>
        <p className="text-gray-300 mt-2 text-lg">List your business free and meet Kayla and the 42 Agentic AI Employees.</p>
        <Button asChild size="lg" className="mt-6 bg-mansagold text-black hover:bg-mansagold/90 font-semibold">
          <Link to="/business-signup">Get started</Link>
        </Button>
      </div>

      <p className="text-sm text-gray-400 mt-12">
        Based on Salesforce’s public marketing materials as of October 2026; features and pricing may change. Salesforce and
        Agentforce are trademarks of Salesforce, Inc. 1325.AI is not affiliated with or endorsed by Salesforce.
      </p>
    </div>
  </div>
);

export default CompareSalesforcePage;
