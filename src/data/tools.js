// One entry per tool. `status` is "live" | "beta" | "planned".
// `href` should point at the tool's page once it's built; planned tools omit it.
export const tools = [
  {
    slug: 'jackdaw',
    name: 'Jackdaw',
    latin: 'Coloeus monedula',
    description: 'JPEG, PNG and WebP conversion, plus iPhone HEIC photos, in batches. Runs entirely in your browser.',
    status: 'live',
    badge: 'Updated',
    href: '/tools/jackdaw'
  },
  {
    slug: 'nutcracker',
    name: 'Nutcracker',
    latin: 'Nucifraga columbiana',
    description: 'Merge, trim and reorder PDF pages, no upload required.',
    status: 'live',
    href: '/tools/nutcracker'
  },
  {
    slug: 'chough',
    name: 'Chough',
    latin: 'Pyrrhocorax pyrrhocorax',
    description: 'QR code generator, with logo overlay and export sizes.',
    status: 'live',
    href: '/tools/chough'
  },
  // {
  //  slug: 'magpie',
  //  name: 'Magpie',
  //  latin: 'Pica pica',
  //  description: 'A hand-picked list of tools and links worth bookmarking.',
  //  status: 'planned'
  // },
  {
    slug: 'rook',
    name: 'Rook',
    latin: 'Corvus frugilegus',
    description: 'IPv4 and IPv6 subnet calculator.',
    status: 'live',
    badge: 'Updated',
    href: '/tools/rook'
  },
  {
    slug: 'stellersjay',
    name: "Steller's Jay",
    latin: 'Cyanocitta stelleri',
    description: 'PoE budget and UPS runtime calculators.',
    status: 'live',
    href: '/tools/stellersjay'
  },
  {
    slug: 'bluejay',
    name: 'Blue Jay',
    latin: 'Cyanocitta cristata',
    description: 'DMX calculator: DIP switches, universes, Art-Net and sACN.',
    status: 'beta',
    href: '/tools/bluejay'
  }
];
