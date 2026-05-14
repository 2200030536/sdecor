// Server Component — supports generateMetadata for per-category SEO.
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import TrustBadges from '@/components/TrustBadges';
import CategoryCatalogSection from '@/components/CategoryCatalogSection';
import { categories } from '@/lib/mockData';

const SITE_URL = 'https://sdecor.vercel.app';

/** Map category slug → rich SEO copy */
const SEO_COPY = {
  birthday: {
    title: 'Birthday Decoration Patna',
    description:
      "Make birthdays unforgettable with SDecor's premium balloon arches, room décor & photo booth setups in Patna. Same-day booking available.",
    keywords: ['birthday decoration Patna', 'birthday balloon arch Patna', 'birthday room decor Patna', 'happy birthday setup Patna'],
  },
  anniversary: {
    title: 'Anniversary Decoration Patna',
    description:
      'Surprise your partner with romantic canopy setups, rose petal pathways & fairy lights from SDecor Patna. Perfect for anniversaries & surprise proposals.',
    keywords: ['anniversary decoration Patna', 'romantic room decoration Patna', 'anniversary canopy Patna', 'anniversary surprise Patna'],
  },
  'baby-shower': {
    title: 'Baby Shower Decoration Patna',
    description:
      'Pastel balloon clouds, teddy bear centrepieces & dreamy table setups for your baby shower celebration in Patna by SDecor.',
    keywords: ['baby shower decoration Patna', 'baby shower balloon Patna', 'baby shower setup Patna', 'pastel decoration Patna'],
  },
  wedding: {
    title: 'Wedding Decoration Patna',
    description:
      'Grand floral canopies, royal stage setups & aisle decorations for weddings in Patna. Premium quality, lowest price guaranteed by SDecor.',
    keywords: ['wedding decoration Patna', 'wedding stage decor Patna', 'wedding canopy Patna', 'floral wedding decoration Patna'],
  },
  engagement: {
    title: 'Engagement Decoration Patna',
    description:
      'Set the perfect stage for your engagement with LED backdrops, floral arrangements & ambient lighting from SDecor Patna.',
    keywords: ['engagement decoration Patna', 'engagement stage decor Patna', 'engagement table setup Patna', 'ring ceremony decoration Patna'],
  },
};

function getCatData(slug) {
  return categories.find(
    c => c.value.toLowerCase().replace(' ', '-') === slug
  );
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const catData = getCatData(category);
  if (!catData) return {};

  const seo = SEO_COPY[category] || {};
  const pageUrl = `${SITE_URL}/category/${category}`;
  const title = seo.title || `${catData.label} Decorations in Patna`;
  const description =
    seo.description ||
    `Hand-picked premium ${catData.label.toLowerCase()} decoration packages in Patna. Book online with SDecor.`;

  return {
    title,
    description,
    keywords: seo.keywords || [],
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${title} | SDecor`,
      description,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${catData.label} Decorations in Patna — SDecor`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | SDecor`,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const catData = getCatData(category);
  if (!catData) notFound();

  const pageUrl = `${SITE_URL}/category/${category}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${catData.label} Decorations`,
        item: pageUrl,
      },
    ],
  };

  return (
    <div className="pt-16">
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Category Hero Banner */}
      <div className="gradient-brand py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-white/70 text-xs mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-medium">{catData.label} Decorations</span>
          </nav>

          <div className="text-6xl mb-3" role="img" aria-label={catData.label}>
            {catData.emoji}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {catData.label} Decorations in Patna
          </h1>

          <p className="text-white/80 text-sm max-w-lg">
            Hand-picked premium decoration packages for your {catData.label.toLowerCase()} celebration in Patna.
            Same-day booking available.
          </p>
        </div>
      </div>

      {/* Interactive Catalog (client component) */}
      <CategoryCatalogSection categoryValue={catData.value} />

      {/* Trust Badges */}
      <TrustBadges />
    </div>
  );
}
