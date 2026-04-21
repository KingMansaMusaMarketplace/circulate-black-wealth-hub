/**
 * Tracks the last directory URL the user was on so the "Back" button
 * on a business detail page returns them to the same filtered listing
 * (e.g. /directory?category=Acupuncture%20Clinic) rather than the top
 * of the directory.
 */

const KEY = 'mm:lastDirectoryUrl';

/** Save the current location as the directory the user came from. */
export const rememberDirectoryUrl = (url: string) => {
  try {
    sessionStorage.setItem(KEY, url);
  } catch {
    // sessionStorage can throw in private mode — safe to ignore.
  }
};

/** Read the saved directory URL, if any. */
export const getRememberedDirectoryUrl = (): string | null => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};
