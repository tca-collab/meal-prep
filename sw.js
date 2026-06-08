// Meal Prep Recipes — Service Worker
// Relative paths + navigation fallback so it works at any GitHub Pages
// subpath and never 404s when reopened offline.

var CACHE = "meal-prep-v3";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE){ return caches.delete(k); }
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).catch(function(){ return caches.match("./index.html"); })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function(cached){ return cached || fetch(req); })
  );
});
