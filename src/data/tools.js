// One entry per tool. `status` is "live" | "beta" | "planned".
// `href` should point at the tool's page once it's built; planned tools omit it.
export const tools = [
  {
    slug: 'jackdaw',
    name: 'Jackdaw',
    latin: 'Coloeus monedula',
    description: 'JPEG, PNG and WebP conversion, both directions. Runs entirely in your browser.',
    status: 'beta',
    href: '/tools/jackdaw'
  },
  {
    slug: 'nutcracker',
    name: 'Nutcracker',
    latin: 'Nucifraga columbiana',
    description: 'Merge, trim and reorder PDF pages, no upload required.',
    status: 'beta',
    href: '/tools/nutcracker'
  },
  {
    slug: 'chough',
    name: 'Chough',
    latin: 'Pyrrhocorax pyrrhocorax',
    description: 'QR code generator, with logo overlay and export sizes.',
    status: 'beta',
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
    description: 'Subnet Calculator.',
    status: 'live',
    href: '/tools/rook'
  },
  {
    slug: 'stellersjay',
    name: "Steller's Jay",
    latin: 'Cyanocitta stelleri',
    description: 'PoE budget and UPS runtime calculators.',
    status: 'beta',
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
