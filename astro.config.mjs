import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://corvidae.tools',
  output: 'static',
  build: { format: 'file' },
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      manifest: {
        name: 'corvidae.tools',
        short_name: 'corvidae',
        description: 'A small flock of browser-based tools. Nothing you drop in here gets uploaded anywhere.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0d0d0f',
        theme_color: '#0d0d0f',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Activate a new service worker as soon as it installs, instead of waiting for every tab to close.
        skipWaiting: true,
        clientsClaim: true,
        // Pages, scripts and icons are cached up front, so every tool opens offline.
        // The large bird art is cached the first time each page is viewed instead.
        globPatterns: ['**/*.{html,js,css,svg,ico,webmanifest}', 'favicon-*.png', 'icon-*.png', 'apple-touch-icon.png'],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('-mark.webp'),
            handler: 'CacheFirst',
            options: { cacheName: 'bird-art', expiration: { maxEntries: 30 } }
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ]
});
