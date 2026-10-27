import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AGENT_PORTRAITS } from '@/assets/agents';
import { PERSONAS, type PersonaDept } from '@/data/kayla-personas';

const DEPARTMENTS: { name: PersonaDept; summary: string }[] = [
  { name: 'Growth & Marketing', summary: 'A consistent voice. A stronger presence.' },
  { name: 'Sales & Revenue', summary: 'Keep opportunities moving forward.' },
  { name: 'Customer Success', summary: 'Build relationships that last.' },
  { name: 'Operations & Finance', summary: 'Bring clarity to your daily operations.' },
  { name: 'Product, Data & Engineering', summary: 'Turn information into better decisions.' },
  { name: 'Brand, Legal & People', summary: 'Prepare your business for its next chapter.' },
];

export default function FlagshipWorkforce() {
  const [selected, setSelected] = useState(DEPARTMENTS[0]);
  const members = PERSONAS.filter(person => person.department === selected.name);
  return (
    <section id="workforce" className="border-t border-border py-20 md:py-28">
      <div className="flagship-content">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-20 mb-12">
          <div><p className="text-primary text-sm mb-4">THE WORKFORCE</p><h2 className="text-3xl md:text-5xl font-medium leading-tight">One Kayla.<br />An entire team.</h2></div>
          <div><p className="text-muted-foreground text-lg leading-relaxed">42 Agentic AI Employees, coordinated by Kayla. Specialized roles for the work behind your business.</p><p className="text-muted-foreground text-sm mt-4">Explore six core departments below. Faces are AI-generated portraits of AI employees, not real people. Also included: hospitality, mobility, automation and risk specialists in the full roster.</p></div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-16">
          <div role="tablist" aria-label="Workforce departments" className="flex flex-col gap-1">
            {DEPARTMENTS.map((department, index) => <Button noHint key={department.name} id={`department-${index}`} role="tab" aria-selected={selected.name === department.name} aria-controls="department-panel" variant="ghost" onClick={() => setSelected(department)} className={`h-auto min-h-12 justify-between px-4 py-3 text-left whitespace-normal rounded-sm ${selected.name === department.name ? 'bg-accent text-primary' : 'text-muted-foreground'}`}><span>{department.name}</span><ArrowRight className="shrink-0" /></Button>)}
          </div>
          <div id="department-panel" role="tabpanel" aria-labelledby={`department-${DEPARTMENTS.indexOf(selected)}`} className="min-h-[360px] border-t border-border pt-6">
            <div className="flex items-center gap-3 text-primary mb-3"><Network className="h-5 w-5" /><span className="text-sm">{selected.name}</span></div>
            <h3 className="text-2xl md:text-3xl font-medium mb-7">{selected.summary}</h3>
            <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {members.map(member => <li key={member.id} className="flex items-center gap-4">{AGENT_PORTRAITS[member.id] ? <img src={AGENT_PORTRAITS[member.id]} alt={`${member.name}, AI employee portrait`} loading="lazy" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover border border-border" /> : <Check className="text-primary h-4 w-4 shrink-0" />}<div><p className="font-medium">{member.name}</p><p className="text-sm text-muted-foreground mt-1">{member.role}</p></div></li>)}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 flex flex-wrap justify-between gap-4"><p className="text-sm text-muted-foreground">Your goals. A coordinated workforce. You remain in control.</p><Button variant="link" noHint asChild className="h-auto p-0 text-primary"><Link to="/what-kayla-does">Explore Kayla’s capabilities <ArrowRight /></Link></Button></div>
      </div>
    </section>
  );
}