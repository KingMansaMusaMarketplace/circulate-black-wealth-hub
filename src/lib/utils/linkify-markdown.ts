/**
 * Converts plain URLs in a markdown string to clickable markdown links.
 * Avoids double-linking URLs that are already inside markdown link syntax.
 */

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function linkifyMarkdown(text: string): string {
  if (!text) return text;

  // Placeholder for existing markdown links so we don't double-link them.
  const placeholders: string[] = [];
  const placeholderToken = `__MD_LINK_${Math.random().toString(36).slice(2, 11)}__`;

  const withPlaceholders = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
    placeholders.push(match);
    return placeholderToken;
  });

  // Convert absolute plain URLs to markdown links.
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;
  const linkified = withPlaceholders.replace(urlRegex, (url) => {
    // Strip trailing punctuation that is unlikely to be part of the URL.
    let cleanUrl = url;
    while (cleanUrl.endsWith('.') || cleanUrl.endsWith(',')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    return `[${cleanUrl}](${cleanUrl})`;
  });

  // Convert well-known relative platform paths to markdown links.
  const relativePathRegex = /(^|[\s(])\/(business(?:\/(?:register|signup))?|directory|subscription|partner|stays|susu-circles|partner(?:s|-framework)?|help-center|faq|about|features|contact|login|signup|business-signup)(?=[\s.,!?;)]|$)/g;
  const withRelativeLinks = linkified.replace(relativePathRegex, (_, prefix, path) => {
    const display = `/${path}`;
    return `${prefix}[${display}](https://1325.ai${display})`;
  });

  // Restore original markdown links.
  let result = withRelativeLinks;
  for (const placeholder of placeholders) {
    result = result.replace(placeholderToken, placeholder);
  }
  return result;
}
