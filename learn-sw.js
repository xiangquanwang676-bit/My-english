// 版本号：以后改了电影模式.html，把下面数字加1，手机会更快换成新版
const VER = 'learn-v2';
const FILES = [
  './',
  './learn-manifest.json'
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
    }).catch(() => caches.match(r).then(m => m || caches.match('./')))
  );
});
