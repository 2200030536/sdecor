import { Inter } from 'next/font/google';
import './globals.css';
import PublicShell from '@/components/PublicShell';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SITE_URL = 'https://sdecor.vercel.app';
const OG_IMAGE = `${SITE_URL}/opengraph-image`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SDecor | Premium Event Decorations in Patna',
    template: '%s | SDecor Patna',
  },
  description:
    'Book stunning balloon & floral decorations for birthdays, anniversaries, baby showers & more in Patna. Same-day service guaranteed. Lowest price promise.',
  keywords: [
    'event decoration Patna',
    'birthday decoration Patna',
    'anniversary decoration Patna',
    'baby shower decoration Patna',
    'wedding decoration Patna',
    'balloon decoration Patna',
    'SDecor',
    'same day decoration Patna',
  ],
  authors: [{ name: 'SDecor', url: SITE_URL }],
  creator: 'SDecor',
  publisher: 'SDecor',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'SDecor | Premium Event Decorations in Patna',
    description: "Patna's most trusted event decoration service. 10,000+ happy customers.",
    url: SITE_URL,
    siteName: 'SDecor',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'SDecor — Premium Event Decorations in Patna',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SDecor | Premium Event Decorations in Patna',
    description: "Patna's most trusted event decoration service.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: 'fFVAz3dAvpO64kaZIWzmiZUNVDMImZfRxuBKogwsLto',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: 'SDecor',
  description: "Patna's most trusted event decoration service for birthdays, anniversaries, weddings and more.",
  url: SITE_URL,
  telephone: '+91-99999-99999',
  email: 'hello@sdecor.in',
  image: OG_IMAGE,
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, UPI',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Patna',
    addressLocality: 'Patna',
    addressRegion: 'Bihar',
    postalCode: '800001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.5941,
    longitude: 85.1376,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '08:00',
      closes: '22:00',
    },
  ],
  sameAs: [`https://wa.me/919386738937`],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Event Decoration Packages',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Birthday Decoration' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Anniversary Decoration' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wedding Decoration' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Baby Shower Decoration' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Engagement Decoration' } },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} antialiased bg-[#FAFAFA] text-gray-900`}>
        <AuthProvider>
          <PublicShell>
            <main className="min-h-screen">{children}</main>
          </PublicShell>
        </AuthProvider>
      </body>
    </html>
  );
}
