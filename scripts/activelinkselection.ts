export type ActiveLinkItem = string | { href: string };

/*
Active link selection guide

Pass either href strings or link objects. The selected value is returned in
the same shape, so object callers can use its href (or other link metadata).

  const links = [
    { label: "Exact", href: "/home/hello1?name=kishor" },
    { label: "Page", href: "/home/hello1" },
    { label: "Section", href: "/home" },
  ];

  const active = selectActiveLink(links, "/home/hello1?name=kishor");
  // active.label === "Exact"

Matching rules:
1. A candidate path must equal the current path or be a whole path segment
   ancestor. For example, /home matches /home/yoyo, but not /homepage.
2. Every query parameter on a candidate must match the current URL. A
   candidate with a conflicting value is skipped.
3. Among matches, the deepest path wins, then the candidate with more matching
   query parameters. If tied, the first candidate in the input wins.

On the client, omit currentHref to read window.location. During server
rendering that returns null, so pass the current URL explicitly when selecting
links on the server. Re-run selection when the current URL changes.
*/

type ParsedLink = {
  pathname: string;
  searchParams: URLSearchParams;
};

function parseLink(href: string): ParsedLink | null {
  try {
    const url = new URL(href, "https://neup.local");
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    return { pathname, searchParams: url.searchParams };
  } catch {
    return null;
  }
}

function getPathDepth(pathname: string): number {
  return pathname === "/" ? 0 : pathname.split("/").filter(Boolean).length;
}

function isPathMatch(candidatePath: string, currentPath: string): boolean {
  return candidatePath === currentPath
    || candidatePath === "/"
    || currentPath.startsWith(`${candidatePath}/`);
}

function queryMatches(candidate: URLSearchParams, current: URLSearchParams): boolean {
  for (const [key, value] of candidate) {
    if (!current.getAll(key).includes(value)) return false;
  }
  return true;
}

/** Returns the browser's current path, query, and hash, or null during SSR. */
export function getCurrentLink(): string | null {
  if (typeof window === "undefined") return null;
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

/**
 * Selects the most specific matching link. Candidate query parameters must
 * match the current URL; candidates without query parameters match by path.
 */
export function selectActiveLink<T extends ActiveLinkItem>(
  links: readonly T[],
  currentHref: string | null = getCurrentLink(),
): T | null {
  if (!currentHref) return null;

  const current = parseLink(currentHref);
  if (!current) return null;

  let bestLink: T | null = null;
  let bestDepth = -1;
  let bestQueryCount = -1;
  let bestExactPath = false;

  for (const link of links) {
    const href = typeof link === "string" ? link : link.href;
    const candidate = parseLink(href);
    if (!candidate || !isPathMatch(candidate.pathname, current.pathname)) continue;
    if (!queryMatches(candidate.searchParams, current.searchParams)) continue;

    const exactPath = candidate.pathname === current.pathname;
    const depth = getPathDepth(candidate.pathname);
    const queryCount = [...candidate.searchParams].length;
    const isBetter = depth > bestDepth
      || (depth === bestDepth && exactPath && !bestExactPath)
      || (depth === bestDepth && exactPath === bestExactPath && queryCount > bestQueryCount);

    if (isBetter) {
      bestLink = link;
      bestDepth = depth;
      bestQueryCount = queryCount;
      bestExactPath = exactPath;
    }
  }

  return bestLink;
}
