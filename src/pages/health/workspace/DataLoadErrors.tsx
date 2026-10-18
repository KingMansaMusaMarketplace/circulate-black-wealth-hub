import { Button } from '@/components/ui/button';

export default function DataLoadErrors({ sources }: { sources: { error?: string; reload: () => Promise<unknown> }[] }) {
  const errors = sources.filter(source => source.error);
  if (!errors.length) return null;
  return <section role="alert" className="space-y-2 border-l-2 border-destructive p-3 text-sm">
    <p>{errors[0].error}</p>
    <Button variant="outline" size="sm" onClick={() => { void Promise.all(errors.map(source => source.reload())); }}>Retry loading</Button>
  </section>;
}