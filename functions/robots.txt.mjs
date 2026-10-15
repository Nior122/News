/**
 * Cloudflare Pages Function — serves /robots.txt.
 */

const SITE_ORIGIN = 'https://scrolltek.name.ng';

export async function onRequest() {
  const content = `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
