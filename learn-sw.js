/* Learn 离线壳：只处理本站自己的文件；其他网站（片库接口、视频、字幕等）完全不碰 */
const CACHE='learn-v3-6-4';
const SHELL=['./','./index.html','./learn-manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||r.headers.has('range'))return;
  let u;try{u=new URL(r.url)}catch(x){return}
  if(u.origin!==self.location.origin)return;
  e.respondWith(
    fetch(r).then(res=>{
      if(res&&res.ok&&res.status===200){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp)).catch(()=>{})}
      return res;
    }).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):Response.error())))
  );
});
