import { useState } from 'react';
import { FlaskConical, Lock, Network, Pill } from 'lucide-react';
import logo1325 from '@/assets/1325-ai-logo.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CONNECTION_TYPES, connectionPreparation } from './connection-preparation';

const ICONS = { laboratory: FlaskConical, pharmacy: Pill, records: Network };

function ConnectionDetails({ id }: { id: string }) {
  const [preview, setPreview] = useState(false);
  const connection = connectionPreparation(id);
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><div><h3 className="font-semibold">{connection.title}</h3><p className="mt-1 text-sm text-muted-foreground">{connection.purpose}</p></div><Badge variant="outline">Not connected</Badge></div>
    <dl className="grid gap-4 text-sm sm:grid-cols-3">{[['Provider', 'Not selected'], ['Written vendor coverage', 'Not verified'], ['Connection validation', 'Not performed']].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl>
    <section aria-label="Connection requirements"><h4 className="mb-3 font-medium text-mansagold">Preparation requirements</h4><ol className="list-decimal space-y-3 pl-5 text-sm text-muted-foreground">{connection.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ol></section>
    <Button variant="outline" onClick={() => setPreview((value) => !value)}><Network className="mr-2 h-4 w-4" />{preview ? 'Hide fictional mapping' : 'View fictional mapping'}</Button>
    {preview && <section aria-label="Fictional connection mapping" className="space-y-3 border-y border-border py-4"><h4 className="font-medium">Illustrative field mapping — no exchange performed</h4><dl className="space-y-3 text-sm">{connection.sample.map((field) => <div key={field.field} className="grid gap-1 sm:grid-cols-2"><dt className="text-muted-foreground">{field.field}</dt><dd className="break-words">{field.value}</dd></div>)}</dl><p className="text-xs text-muted-foreground">Static examples only. No request, result, prescription or chart entry is created, received or saved.</p></section>}
    <div className="flex flex-wrap gap-2 border-t border-border pt-4">{['Connect provider', 'Receive records', 'Send order or prescription', 'Import into chart'].map((label) => <Button key={label} variant="outline" disabled className="h-auto whitespace-normal"><Lock className="mr-2 h-4 w-4 shrink-0" />{label}</Button>)}</div>
  </div>;
}

export default function ConnectionPreparation() {
  const [id, setId] = useState<string>(CONNECTION_TYPES[0].id);
  return <div className="space-y-5"><header className="flex items-start gap-3"><img src={logo1325} alt="1325.AI logo" className="h-10 w-10 object-contain" /><div><Badge variant="outline" className="mb-2 text-mansagold">Preparation only</Badge><h2 className="text-xl font-semibold">Clinical Connection Preparation</h2></div></header>
    <div className="border-l-2 border-mansagold pl-4"><p className="flex items-center gap-2 font-medium"><Lock className="h-4 w-4 shrink-0 text-mansagold" />Live exchange remains locked</p><p className="mt-2 text-sm text-muted-foreground">Attorney-reviewed clinic agreements, written Business Associate Agreement (BAA) coverage for each relevant vendor, independently verified healthcare safeguards and provider-specific validation are required. A signed agreement alone cannot activate connections.</p></div>
    <Tabs value={id} onValueChange={setId}><TabsList aria-label="Clinical connection categories" className="h-auto w-full flex-wrap justify-start gap-1">{CONNECTION_TYPES.map((connection) => { const Icon = ICONS[connection.id]; return <TabsTrigger key={connection.id} value={connection.id} className="gap-2 whitespace-normal"><Icon className="h-4 w-4 shrink-0" />{connection.title}</TabsTrigger>; })}</TabsList></Tabs>
    <ConnectionDetails key={id} id={id} />
    <p className="border-t border-border pt-4 text-xs text-muted-foreground">No vendor partnership, supported connection standard or certification is claimed. No credentials or patient records are accepted. Preview access and doctor sign-off do not authorize live exchange.</p>
  </div>;
}