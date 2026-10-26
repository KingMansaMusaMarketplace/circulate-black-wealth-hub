import { useEffect, useId, useState } from 'react';
import { ChevronDown, ChevronUp, Coins, Package, Users, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { browserConnection, collectionTotals, OPERATIONS_SCENARIO, supplyStatus } from './operations-scenario';

const kes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;
const SampleLabel = () => <p className="text-xs font-medium text-mansagold">Illustrative · sample data only</p>;

export default function ClinicalOperationsTiles() {
  const id = useId();
  const [stageId, setStageId] = useState<string | null>(null);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [suppliesOpen, setSuppliesOpen] = useState(false);
  const [connection, setConnection] = useState(browserConnection);
  useEffect(() => {
    const update = () => setConnection(browserConnection());
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  const totals = collectionTotals(OPERATIONS_SCENARIO.collections);
  const selected = OPERATIONS_SCENARIO.flow.find(stage => stage.id === stageId);
  const lowStock = OPERATIONS_SCENARIO.supplies.filter(item => supplyStatus(item.quantity, item.minimum) === 'Low stock');

  return <section aria-label="Clinic operations snapshot" className="space-y-4">
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
      <h2 className="text-lg font-semibold">Clinic operations snapshot</h2>
      <p className="text-sm text-muted-foreground">{OPERATIONS_SCENARIO.name} · {OPERATIONS_SCENARIO.date}</p>
    </div>
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <Card className="min-w-0 rounded-lg">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="h-5 w-5 shrink-0 text-mansagold" />Patient flow</CardTitle><SampleLabel /></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {OPERATIONS_SCENARIO.flow.map(stage => <Button key={stage.id} variant="outline" className="h-24 min-w-0 flex-col gap-1 whitespace-normal text-center" aria-expanded={stageId === stage.id} aria-controls={`${id}-flow`} onClick={() => setStageId(stageId === stage.id ? null : stage.id)}>
              <span className="text-2xl font-semibold text-mansagold">{stage.entries.length}</span><span className="text-xs">{stage.label}</span>
            </Button>)}
          </div>
          <p className="text-xs text-muted-foreground">Fixed queue example · not linked to charts, appointments or completed care.</p>
          {selected && <div id={`${id}-flow`} className="space-y-2 border-t border-border pt-3">
            <h3 className="text-sm font-semibold">{selected.label} · fictional entries</h3>
            {selected.entries.map(entry => <div key={entry.id} className="flex flex-wrap justify-between gap-2 text-sm"><span>{entry.id} · fictional visitor</span><span className="text-muted-foreground">{entry.minutes === null ? 'Fictional completion only' : `${entry.minutes} min in stage (illustrative)`}</span></div>)}
          </div>}
        </CardContent>
      </Card>
      <Card className="min-w-0 rounded-lg">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Coins className="h-5 w-5 shrink-0 text-mansagold" />Collections · Kenya scenario</CardTitle><SampleLabel /></CardHeader>
        <CardContent className="space-y-4">
          <div><p className="text-sm text-muted-foreground">Illustrative cash + M-Pesa received</p><p className="text-2xl font-semibold text-mansagold">{kes(totals.received)}</p><p className="text-xs text-muted-foreground">Kenyan shillings · invented example, not a forecast</p></div>
          <svg viewBox="0 0 100 8" className="h-3 w-full overflow-hidden rounded-sm" role="img" aria-label={`Illustrative received amounts: M-Pesa ${kes(OPERATIONS_SCENARIO.collections.mpesa)}, cash ${kes(OPERATIONS_SCENARIO.collections.cash)}`}>
            <rect width={OPERATIONS_SCENARIO.collections.mpesa / totals.received * 100} height="8" fill="currentColor" className="text-mansagold" />
            <rect x={OPERATIONS_SCENARIO.collections.mpesa / totals.received * 100} width={OPERATIONS_SCENARIO.collections.cash / totals.received * 100} height="8" fill="currentColor" className="text-muted-foreground" />
          </svg>
          <div className="flex flex-wrap justify-between gap-2 text-xs"><span>M-Pesa · {kes(OPERATIONS_SCENARIO.collections.mpesa)}</span><span>Cash · {kes(OPERATIONS_SCENARIO.collections.cash)}</span></div>
          <div className="border-t border-border pt-3"><p className="text-sm font-medium">SHA awaiting payment · {kes(totals.awaiting)}</p><p className="text-xs text-muted-foreground">Social Health Authority · excluded from received total; no confirmed reimbursement.</p></div>
          <Button variant="ghost" size="sm" aria-expanded={collectionsOpen} aria-controls={`${id}-collections`} onClick={() => setCollectionsOpen(!collectionsOpen)}>{collectionsOpen ? <ChevronUp /> : <ChevronDown />}Sample breakdown</Button>
          {collectionsOpen && <dl id={`${id}-collections`} className="space-y-2 border-t border-border pt-3 text-sm">{[['Cash received (fictional)', OPERATIONS_SCENARIO.collections.cash], ['M-Pesa received (fictional)', OPERATIONS_SCENARIO.collections.mpesa], ['Received total (fictional)', totals.received], ['SHA pending (fictional, separate)', totals.awaiting]].map(([label, amount]) => <div key={label} className="flex flex-wrap justify-between gap-2"><dt>{label}</dt><dd className="font-medium">{kes(Number(amount))}</dd></div>)}</dl>}
          <p className="text-xs text-muted-foreground">No transactions, settlement, payer checks or M-Pesa/SHA connection.</p>
        </CardContent>
      </Card>
      <Card className="min-w-0 rounded-lg">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Package className="h-5 w-5 shrink-0 text-mansagold" />Dispensary supply alerts</CardTitle><SampleLabel /></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl font-semibold text-mansagold">{lowStock.length} low-stock examples</p>
          <p className="text-sm text-muted-foreground">{lowStock.map(item => item.label).join(' · ')}</p>
          <Button variant="ghost" size="sm" aria-expanded={suppliesOpen} aria-controls={`${id}-supplies`} onClick={() => setSuppliesOpen(!suppliesOpen)}>{suppliesOpen ? <ChevronUp /> : <ChevronDown />}Sample inventory</Button>
          {suppliesOpen && <ul id={`${id}-supplies`} className="space-y-3 border-t border-border pt-3">{OPERATIONS_SCENARIO.supplies.map(item => <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 text-sm"><div><p className="font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.quantity} {item.unit} · sample minimum {item.minimum}</p></div><Badge variant="outline">{supplyStatus(item.quantity, item.minimum)}</Badge></li>)}</ul>}
          <p className="text-xs text-muted-foreground">Stock and thresholds are invented assumptions, not clinical recommendations. No dispensing, ordering or supplier connection.</p>
        </CardContent>
      </Card>
      <Card className="min-w-0 rounded-lg">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base">{connection === 'Offline' ? <WifiOff className="h-5 w-5 shrink-0 text-mansagold" /> : <Wifi className="h-5 w-5 shrink-0 text-mansagold" />}Browser connection</CardTitle><p className="text-xs text-muted-foreground">Device indication · not fictional activity</p></CardHeader>
        <CardContent className="space-y-4">
          <p role="status" aria-label="Browser connection state" className="text-2xl font-semibold">{connection}</p>
          <p className="text-sm text-muted-foreground">Browser-reported state only; clinical service reachability is unverified.</p>
          <dl className="space-y-2 border-t border-border pt-3 text-sm"><div><dt className="font-medium">Offline clinical records</dt><dd className="text-muted-foreground">Unavailable in this preview</dd></div><div><dt className="font-medium">Clinical syncing</dt><dd className="text-muted-foreground">Unavailable in this preview</dd></div></dl>
          <p className="text-xs text-muted-foreground">No clinical changes are queued. Access deadlines continue while offline.</p>
        </CardContent>
      </Card>
    </div>
  </section>;
}