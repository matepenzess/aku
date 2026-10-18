// Hálózat először, hálózat nélkül a legutóbbi mentett példány (az adat mindig a szerverről jön, ez csak az app kerete)
const V = 'aku-v2';
const KERET = ['./', 'index.html', 'shim.js', 'platform.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(KERET)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => { const m = r.clone(); caches.open(V).then((c) => c.put(e.request, m)); return r; }).catch(() => caches.match(e.request)));
});
