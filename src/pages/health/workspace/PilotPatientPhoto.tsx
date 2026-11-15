import { UserRound } from 'lucide-react';
import marcus from '@/assets/pilot-patients/sample_patient_marcus.jpg';
import alicia from '@/assets/pilot-patients/sample_patient_alicia.jpg';
import harold from '@/assets/pilot-patients/sample_patient_harold.jpg';
import face01 from '@/assets/pilot-patients/gallery_face_01.jpg';
import face02 from '@/assets/pilot-patients/gallery_face_02.jpg';
import face03 from '@/assets/pilot-patients/gallery_face_03.jpg';
import face04 from '@/assets/pilot-patients/gallery_face_04.jpg';
import face05 from '@/assets/pilot-patients/gallery_face_05.jpg';
import face06 from '@/assets/pilot-patients/gallery_face_06.jpg';
import face07 from '@/assets/pilot-patients/gallery_face_07.jpg';
import face08 from '@/assets/pilot-patients/gallery_face_08.jpg';
import { PHOTO_CAPTIONS, photoDisplay, photoInitials, photoKey, type GalleryPhotoKey, type PhotoKey } from '@/lib/clinical/pilot-photos';
import { usePilotPrivacy } from './PilotPrivacy';
import type { Row } from './hc';

export const GALLERY_PHOTOS: Record<GalleryPhotoKey, string> = {
  'face-01': face01, 'face-02': face02, 'face-03': face03, 'face-04': face04,
  'face-05': face05, 'face-06': face06, 'face-07': face07, 'face-08': face08,
};
const PHOTOS: Record<PhotoKey, string> = { 'marcus-bell': marcus, 'alicia-grant': alicia, 'harold-jenkins': harold, ...GALLERY_PHOTOS };

/**
 * Patient photo spot: bundled computer-generated faces for made-up patients only; initials for real
 * patients and anyone without a chosen face. No uploads. `namesHidden` overrides the privacy switch
 * (the patient portal shows a patient their own face).
 */
export default function PilotPatientPhoto({ patient, size = 'lg', namesHidden }: { patient: Row; size?: 'sm' | 'lg'; namesHidden?: boolean }) {
  const { privacy } = usePilotPrivacy();
  const display = photoDisplay(patient, namesHidden ?? privacy);
  const key = photoKey(patient);
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
