import { UserRound } from 'lucide-react';
import marcus from '@/assets/pilot-patients/sample_patient_marcus.jpg';
import alicia from '@/assets/pilot-patients/sample_patient_alicia.jpg';
import harold from '@/assets/pilot-patients/sample_patient_harold.jpg';
import { PHOTO_CAPTIONS, photoDisplay, photoInitials, samplePhotoKey, type SamplePhotoKey } from '@/lib/clinical/pilot-photos';
import { usePilotPrivacy } from './PilotPrivacy';
import type { Row } from './hc';

const PHOTOS: Record<SamplePhotoKey, string> = { 'marcus-bell': marcus, 'alicia-grant': alicia, 'harold-jenkins': harold };

/** Patient photo spot: bundled made-up faces for the fixed samples only; initials for everyone else. No uploads. */
export default function PilotPatientPhoto({ patient, size = 'lg' }: { patient: Row; size?: 'sm' | 'lg' }) {
  const { privacy } = usePilotPrivacy();
  const display = photoDisplay(patient, privacy);
  const key = samplePhotoKey(patient);
  const box = size === 'lg' ? 'h-28 w-24 rounded-lg text-2xl' : 'h-9 w-9 rounded-full text-xs';
  const face = display === 'photo' && key
    ? <img src={PHOTOS[key]} alt="Computer-generated face of a made-up sample patient" width={768} height={896} loading="lazy" className={`${box} shrink-0 border object-cover`} />
    : (
      <div aria-label={PHOTO_CAPTIONS[display]} role="img" className={`${box} flex shrink-0 flex-col items-center justify-center gap-1 border border-dashed bg-muted font-semibold text-muted-foreground`}>
        {size === 'lg' && <UserRound className="h-6 w-6" aria-hidden />}
        <span>{photoInitials(patient)}</span>
      </div>
    );
  if (size === 'sm') return face;
  return (
    <figure className="w-24 shrink-0 space-y-1">
      {face}
      <figcaption className="text-[11px] leading-tight text-muted-foreground">{PHOTO_CAPTIONS[display]}</figcaption>
    </figure>
  );
}
