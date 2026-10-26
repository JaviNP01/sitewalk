/* Site Walk — offline support for the home-screen app.
   - The tool itself (index.html): network first, so a newer upload is picked up when online,
     falling back to the saved copy when there is no signal.
   - Map / photo libraries from the CDNs: cached on install, then served from the cache.
   - Map tiles you have looked at: kept (up to MAX_TILES) so recently viewed areas show offline.
   Walk data (photos, sketches) is never stored here — it lives in the app's own storage. */
const VERSION = 'sitewalk-v2';
const SHELL_CACHE = VERSION + '-shell';
const LIB_CACHE = 'sitewalk-libs-v1';
const TILE_CACHE = 'sitewalk-tiles-v1';
const MAX_TILES = 2500;

const SHELL = ['./', './index.html', './manifest.webmanifest',
  './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png'];
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/images/spritesheet.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/images/spritesheet.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/images/spritesheet-2x.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/layers.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/layers-2x.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/exifr/dist/full.umd.js',
  'https://cdn.jsdelivr.net/npm/heic2any/dist/heic2any.min.js'
];
const LIB_HOSTS = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net'];
const TILE_HOSTS = ['tile.openstreetmap.org', 'server.arcgisonline.com'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    await Promise.all(SHELL.map(u => shell.add(u).catch(() => {})));
    const libs = await caches.open(LIB_CACHE);
    await Promise.all(LIBS.map(async u => {
      if (await libs.match(u)) return;
      try {
        const res = await fetch(u, { mode: 'cors' }).catch(() => fetch(u, { mode: 'no-cors' }));
        if (res && (res.ok || res.type === 'opaque')) await libs.put(u, res);
      } catch (e) { /* fetched later on first use */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = [SHELL_CACHE, LIB_CACHE, TILE_CACHE];
    for (const k of await caches.keys()) if (!keep.includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function networkFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return (await cache.match(req, { ignoreSearch: true })) ||
           (await cache.match('./index.html')) || Response.error();
  }
}
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req, { ignoreVary: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}
let trimming = false;
async function trimTiles() {
  if (trimming) return;
  trimming = true;
  try {
    const cache = await caches.open(TILE_CACHE);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - MAX_TILES; i++) await cache.delete(keys[i]);  // oldest first
  } finally { trimming = false; }
}
async function tile(req) {
  const cache = await caches.open(TILE_CACHE);
  const hit = await cache.match(req);
  const fresh = fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) { cache.put(req, res.clone()).then(trimTiles); }
    return res;
  }).catch(() => null);
  if (hit) { fresh.catch(() => {}); return hit; }
  return (await fresh) || Response.error();
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    const isPage = req.mode === 'navigate' || /\/$|\.html?$/i.test(url.pathname);
    event.respondWith(isPage ? networkFirst(req) : cacheFirst(req, SHELL_CACHE));
  } else if (LIB_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req, LIB_CACHE));
  } else if (TILE_HOSTS.some(h => url.hostname === h || url.hostname.endsWith('.' + h))) {
    event.respondWith(tile(req));
  }
  // everything else (road-name lookups etc.) goes straight to the network
});
