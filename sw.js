const C='bitacora-base-v31';const F=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-180.png'];
const KEEP=u=>u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(!KEEP(u))return;
  const fromCache=()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'?caches.match('index.html'):undefined));
  const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;});
  e.respondWith(new Promise(res=>{let done=false;const t=setTimeout(()=>{fromCache().then(r=>{if(r&&!done){done=true;res(r);}});},3000);
    net.then(r=>{if(!done){done=true;clearTimeout(t);res(r);}}).catch(()=>{clearTimeout(t);fromCache().then(r=>{if(!done){done=true;res(r||Response.error());}});});}));});
