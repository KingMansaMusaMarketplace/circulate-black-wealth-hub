/**
 * Pilot patient photos (display only).
 * Only the three fixed, made-up sample patients have a computer-generated face bundled with the app.
 * Nothing is ever uploaded or saved: every other chart (test or real) shows an initials placeholder.
 * A face identifies a person just like a name, so the photo follows the same "Hide names" switch.
 */
export type PhotoPatient = { first_name?: string | null; last_name?: string | null; is_sample?: boolean | null; is_real?: boolean | null };

export const SAMPLE_PHOTO_KEYS = ['marcus-bell', 'alicia-grant', 'harold-jenkins'] as const;
export type SamplePhotoKey = (typeof SAMPLE_PHOTO_KEYS)[number];
export type PhotoDisplay = 'photo' | 'hidden' | 'placeholder';

export function samplePhotoKey(p?: PhotoPatient | null): SamplePhotoKey | null {
  if (!p || p.is_real || p.is_sample !== true) return null;
  const key = `${(p.first_name ?? '').trim()}-${(p.last_name ?? '').trim()}`.toLowerCase();
  return (SAMPLE_PHOTO_KEYS as readonly string[]).includes(key) ? (key as SamplePhotoKey) : null;
}

/** What the photo spot shows: the sample face only when names are showing, never for real or typed-in patients. */
export function photoDisplay(p: PhotoPatient | null | undefined, namesHidden: boolean): PhotoDisplay {
  if (!samplePhotoKey(p)) return 'placeholder';
  return namesHidden ? 'hidden' : 'photo';
}

export function photoInitials(p?: PhotoPatient | null): string {
  const i = `${(p?.first_name ?? '').trim().charAt(0)}${(p?.last_name ?? '').trim().charAt(0)}`.toUpperCase();
  return i || '?';
}

export const PHOTO_CAPTIONS: Record<PhotoDisplay, string> = {
  photo: 'Computer-generated sample face · not a real person',
  hidden: 'Photo hidden with names · press Show full names',
  placeholder: 'Patient photo · available at go-live',
};
