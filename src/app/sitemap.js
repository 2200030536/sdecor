// Next.js App Router native sitemap — generates /sitemap.xml automatically
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

const SITE_URL = 'https://sdecor.vercel.app';

const CATEGORY_SLUGS = ['birthday', 'anniversary', 'baby-shower', 'wedding', 'engagement'];

// Package slugs from our seed data — used as a reliable fallback if the API
// is unreachable during the build / ISR regeneration.
const FALLBACK_PACKAGE_SLUGS = [
  'romantic-room-decoration',
  'birthday-balloon-blast',
  'car-boot-surprise-setup',
  'baby-shower-bliss-package',
  'wedding-canopy-elegance',
  'engagement-stage-setup',
  'birthday-photo-booth-setup',
  'anniversary-canopy-dream',
  'simple-birthday-room-decor',
  'royal-wedding-stage-decor',
  'baby-shower-balloon-cloud',
  'engagement-table-setup',
];

async function getPackageSlugs() {
  try {
    const res = await fetch(`${SITE_URL}/api/packages`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const packages = data.data || [];
    return packages.map(p => p.slug).filter(Boolean);
  } catch {
    return FALLBACK_PACKAGE_SLUGS;
  }
}

export default async function sitemap() {
  const packageSlugs = await getPackageSlugs();
  const now = new Date().toISOString();

  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...CATEGORY_SLUGS.map(slug => ({
      url: `${SITE_URL}/category/${slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    })),
  ];

  const packageRoutes = packageSlugs.map(slug => ({
    url: `${SITE_URL}/packages/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...packageRoutes];
}
