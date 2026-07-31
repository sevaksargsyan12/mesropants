import DOMPurify from "isomorphic-dompurify";

// WYSIWYG content sometimes carries stray empty wrapper elements (e.g. an
// accidental copy-paste of markup with nothing inside) -- strip these so
// they don't render as an empty box. Only removes elements with no visible
// content (whitespace/&nbsp; only), so real content is never touched.
// Repeats until stable to also clear nested empty wrappers.
function stripEmptyElements(html: string): string {
  let previous: string;
  let result = html;
  do {
    previous = result;
    result = result.replace(
      /<(div|p|span)(?:\s[^>]*)?>(?:\s|&nbsp;|&#160;)*<\/\1>/gi,
      ""
    );
  } while (result !== previous);
  return result;
}

export function sanitizeHtml(html: string): string {
  return stripEmptyElements(DOMPurify.sanitize(html));
}

// Plain-text excerpt for contexts (card previews, meta descriptions) that
// can't render HTML -- strips tags from already-sanitized markup.
export function htmlToText(html: string): string {
  return sanitizeHtml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
