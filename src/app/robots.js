// Next.js App Router native robots — generates /robots.txt automatically
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

const SITE_URL = 'https://sdecor.vercel.app';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/login'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
