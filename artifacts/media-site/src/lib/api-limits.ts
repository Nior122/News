/**
 * Largest `limit` the Pages API accepts for a paginated article list.
 *
 * Must stay in sync with `MAX_PAGE_SIZE` in `functions/api/[[path]].mjs`: the
 * handler rejects anything above it with 400 "Invalid pagination parameters",
 * so asking for more silently empties every list on the page.
 */
export const MAX_ARTICLE_PAGE_SIZE = 50;
