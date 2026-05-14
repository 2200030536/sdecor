// Next.js App Router manifest — generates /manifest.json for PWA discoverability
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest

export default function manifest() {
  return {
    name: 'SDecor — Premium Event Decorations in Patna',
    short_name: 'SDecor',
    description:
      "Patna's most trusted event decoration service. Book stunning balloon & floral decorations for birthdays, anniversaries, weddings and more.",
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#ec4899',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
    ],
    categories: ['shopping', 'lifestyle', 'events'],
    lang: 'en-IN',
  };
}
