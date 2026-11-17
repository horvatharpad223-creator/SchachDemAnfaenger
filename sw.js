const CACHE_NAME = "schachbuch-cache-v1";

// Alle Dateien, die offline verfügbar sein müssen
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://jsdelivr.net",
  "https://jsdelivr.net",
  "https://jsdelivr.net",
  "https://jsdelivr.net",
  "https://jsdelivr.net",
  "https://jsdelivr.net"
];

// 1. Installation: Dateien in den Cache laden
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Abruf: Erst im Cache suchen, falls nicht vorhanden aus dem Netz laden
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Cache-Treffer zurückgeben oder Anfrage normal ausführen und cachen
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

// 3. Alte Caches löschen, wenn du die CACHE_NAME-Version erhöhst
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});
