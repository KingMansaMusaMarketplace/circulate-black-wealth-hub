import { Building2, Hospital, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SAMPLE_FACILITIES, changeSampleFacility, resolveFacilityContext, type FacilityContext } from './workspace/facility-context';

export default function FacilitySelector({ value, onChange, clinicName }: { value: FacilityContext; onChange: (next: FacilityContext) => void; clinicName?: string }) {
  const { facility } = resolveFacilityContext(value);
  const Icon = facility.kind === 'practice' ? Building2 : Hospital;
  return <section aria-label="Fictional facility context" className="border-b border-border bg-card/80 px-4 py-3 md:px-6">
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex shrink-0 items-center gap-3"><Icon className="h-5 w-5 text-mansagold" aria-hidden="true" /><div><p className="text-sm font-semibold">{facility.kind === 'practice' ? 'Medical practice' : 'Hospital system'}</p><p className="text-xs text-muted-foreground">Fictional facility preview</p></div></div>
      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:max-w-2xl">
        <div className="min-w-0"><p id="sample-facility-label" className="mb-1 text-xs text-muted-foreground">Facility</p>
          <Select value={value.facilityId} onValueChange={(id) => onChange(changeSampleFacility(id))}>
            <SelectTrigger aria-labelledby="sample-facility-label" className="w-full min-w-0 border-mansagold/30"><SelectValue /></SelectTrigger>
            <SelectContent className="theme-clinical dark max-w-[calc(100vw-2rem)] bg-popover text-popover-foreground">{(['practice', 'hospital'] as const).map((kind) => <SelectGroup key={kind}><SelectLabel>{kind === 'practice' ? 'Medical practice · fictional' : 'Hospital locations · fictional'}</SelectLabel>{SAMPLE_FACILITIES.filter((item) => item.kind === kind).map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectGroup>)}</SelectContent>
          </Select>
        </div>
        <div className="min-w-0"><p id="sample-department-label" className="mb-1 text-xs text-muted-foreground">Department</p>
          <Select value={value.department} onValueChange={(department) => { const next = { ...value, department }; resolveFacilityContext(next); onChange(next); }}>
            <SelectTrigger aria-labelledby="sample-department-label" className="w-full min-w-0"><SelectValue /></SelectTrigger>
            <SelectContent className="theme-clinical dark bg-popover text-popover-foreground">{facility.departments.map((department) => <SelectItem key={department} value={department}>{department}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <p className="flex min-w-0 items-start gap-2 text-xs text-muted-foreground lg:ml-auto"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="max-w-xs break-words">{clinicName ? `Saved workspace: ${clinicName}. Fictional location selection does not move records or change clinic access.` : 'Fictional locations only · No live hospital connection'}</span></p>
    </div>
  </section>;
}