// 版本号：以后改了电影模式.html，把下面数字加1，手机会更快换成新版
const VER = 'learn-v1';
const FILES = [
  './',
  './%E7%94%B5%E5%BD%B1%E6%A8%A1%E5%BC%8F.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VER).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 有网：优先拿最新的并更新缓存；没网：用缓存。只处理本站文件，不碰 Gemini 等外部请求
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res && res.ok) { const cp = res.clone(); caches.open(VER).then(c => c.put(r, cp)); }
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match('./%E7%94%B5%E5%BD%B1%E6%A8%A1%E5%BC%8F.html')))
  );
});
