import { createContext, useContext } from 'react';
import type { PreviewViewer } from './preview-access';

/** Server-verified viewer of the current private session (approved visitor or verified admin). Display/UX only; never grants access. */
export const ApprovedViewerContext = createContext<PreviewViewer | null>(null);
export const useApprovedViewer = () => useContext(ApprovedViewerContext);

/** True when a signed-in clinic account differs from the email the current viewing was approved for. */
export function isViewerEmailMismatch(signedInEmail: string | null | undefined, approvedEmail: string | null | undefined) {
  if (!signedInEmail || !approvedEmail) return false;
  return signedInEmail.trim().toLowerCase() !== approvedEmail.trim().toLowerCase();
}
