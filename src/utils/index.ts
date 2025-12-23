


/**
 * Base44 apps often use PascalCase routes (e.g. /RiskMap, /FireDepartments).
 *
 * We previously lowercased the route which breaks navigation in React Router
 * (and especially on case-sensitive hosts like Linux/Vercel).
 *
 * This helper keeps casing as provided by the caller and preserves querystrings.
 */
export function createPageUrl(pageName: string) {
    // Allow callers to pass absolute paths
    if (pageName.startsWith('/')) return pageName;

    // Preserve query strings, if any
    const [pathPart, query] = pageName.split('?');
    const path = '/' + pathPart.replace(/ /g, '-');
    return query ? `${path}?${query}` : path;
}