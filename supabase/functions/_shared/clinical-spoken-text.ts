// Turns a written Kayla answer into words for the speaker: no markdown symbols or web
// addresses, and the brand and product acronyms said the way Kayla says them in her videos.
// Shared by the browser (device voice) and the Kayla voice service, so both say the same words.

/** Longest answer (in spoken characters) sent to Kayla's recorded voice; longer answers use the device voice. */
export const KAYLA_VOICE_MAX_CHARS = 4000;

export const spokenText = (text: string) => text
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/https?:\/\/\S+/g, '')
  .replace(/1325\.AI/gi, 'thirteen twenty-five dot A I')
  .replace(/\b1325\b/g, 'thirteen twenty-five')
  .replace(/\bEMR\b/g, 'E M R')
  .replace(/\bEHR\b/g, 'E H R')
  .replace(/\bIDSR\b/g, 'I D S R')
  .replace(/\bFHIR\b/g, 'F H I R')
  .replace(/[*#`>_|]/g, '')
  .replace(/^\s*[-•]\s+/gm, '');
