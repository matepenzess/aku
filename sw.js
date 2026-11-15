// Hálózat először, hálózat nélkül a legutóbbi mentett példány (az adat mindig a szerverről jön, ez csak az app kerete)
const V = 'aku-v3';
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

// Push-értesítés (a szerver a Cloudflare átjátszón át küldi). iOS-en minden push megjelenik, ezért mindig showNotification.
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'AKU', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'AKU', { body: d.body || '', tag: d.tag || undefined, data: { tab: d.url || '' }, icon: 'icon-192.png', badge: 'icon-192.png' }));
});
// Koppintásra az app megnyílik, és a megfelelő fülre ugrik (spec / teendo / level / bent / csomag)
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const tab = (e.notification.data && e.notification.data.tab) || '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if ('focus' in c) { c.postMessage({ aku: 'ful', tab }); return c.focus(); } }
    return self.clients.openWindow('./' + (tab ? '#' + tab : ''));
  }));
});
