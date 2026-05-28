/**
 * Cloudflare Pages Function — serves /robots.txt
 */

export async function onRequest({ request }) {
  const origin = new URL(request.url).origin;

  const content = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
