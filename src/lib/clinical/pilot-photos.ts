/**
 * Pilot patient photos (display only).
 * The three fixed, made-up sample patients have a computer-generated face bundled with the app.
 * Other made-up test patients may be given one of eight bundled computer-generated faces (a gallery
 * choice, saved only as a short key such as "face-03"). Nothing is ever uploaded: real patients always
 * show an initials placeholder until go-live approval adds a real photo step.
 * A face identifies a person just like a name, so the photo follows the same "Hide names" switch.
 */
export type PhotoPatient = {
  first_name?: string | null; last_name?: string | null; is_sample?: boolean | null; is_real?: boolean | null; photo_choice?: string | null;
};

export const SAMPLE_PHOTO_KEYS = ['marcus-bell', 'alicia-grant', 'harold-jenkins'] as const;
export type SamplePhotoKey = (typeof SAMPLE_PHOTO_KEYS)[number];
export const GALLERY_PHOTO_KEYS = ['face-01', 'face-02', 'face-03', 'face-04', 'face-05', 'face-06', 'face-07', 'face-08'] as const;
export type GalleryPhotoKey = (typeof GALLERY_PHOTO_KEYS)[number];
export type PhotoKey = SamplePhotoKey | GalleryPhotoKey;
export type PhotoDisplay = 'photo' | 'hidden' | 'placeholder';

export function samplePhotoKey(p?: PhotoPatient | null): SamplePhotoKey | null {
  if (!p || p.is_real || p.is_sample !== true) return null;
  const key = `${(p.first_name ?? '').trim()}-${(p.last_name ?? '').trim()}`.toLowerCase();
  return (SAMPLE_PHOTO_KEYS as readonly string[]).includes(key) ? (key as SamplePhotoKey) : null;
}

export const isGalleryKey = (v: unknown): v is GalleryPhotoKey => typeof v === 'string' && (GALLERY_PHOTO_KEYS as readonly string[]).includes(v);

/** Which bundled face a patient shows: the fixed sample face first, else a gallery choice; never for real patients. */
export function photoKey(p?: PhotoPatient | null): PhotoKey | null {
  if (!p || p.is_real) return null;
  return samplePhotoKey(p) ?? (isGalleryKey(p.photo_choice) ? p.photo_choice : null);
}

/** Problem with a chosen gallery face, or null. Mirrors the database rule. */
export function validatePhotoChoice(choice: string | null | undefined, real: boolean): string | null {
  if (choice == null || choice === '') return null;
  if (real) return 'Real patients cannot be given a sample face.';
  return isGalleryKey(choice) ? null : 'Choose one of the sample faces.';
}

/** What the photo spot shows: a bundled face only when names are showing, never for real patients. */
export function photoDisplay(p: PhotoPatient | null | undefined, namesHidden: boolean): PhotoDisplay {
  if (!photoKey(p)) return 'placeholder';
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
