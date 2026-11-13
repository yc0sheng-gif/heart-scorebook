const CACHE="pig-scorebook-v10";
const FILES=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith("pig-scorebook-")&&k!==CACHE)||k==="heart-scorebook-v1").map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(e.request,copy));}
      return response;
    }).catch(()=>caches.open(CACHE).then(cache=>cache.match(e.request)).then(r=>r||caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.open(CACHE).then(cache=>cache.match(e.request)).then(r=>r||fetch(e.request)));
});


