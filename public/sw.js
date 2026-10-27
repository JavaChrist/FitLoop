// FitLoop Service Worker
// Version de cache - incrémenter pour forcer la mise à jour
const CACHE_NAME = "fitloop-v1.0.0";
const OFFLINE_URL = "/";

// Ressources à mettre en cache
const CACHE_URLS = [
  "/",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
];

// Installation du service worker
self.addEventListener("install", (event) => {
  console.log("🔧 FitLoop Service Worker: Installation");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Mise en cache des ressources essentielles");
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        // Forcer l'activation immédiate
        return self.skipWaiting();
      })
  );
});

// Activation du service worker
self.addEventListener("activate", (event) => {
  console.log("✅ FitLoop Service Worker: Activation");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Supprimer les anciens caches
            if (cacheName !== CACHE_NAME) {
              console.log("🗑️ Suppression ancien cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Prendre le contrôle de tous les clients
        return self.clients.claim();
      })
  );
});

// Gestion des requêtes (stratégie Cache First pour les assets, Network First pour l'API)
self.addEventListener("fetch", (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== "GET") return;

  // Ignorer les requêtes externes (Mollie, Firebase, etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Stratégie pour les assets statiques (images, CSS, JS)
  if (event.request.url.match(/\.(png|jpg|jpeg|svg|css|js|woff2?|ttf)$/)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Retourner depuis le cache si disponible
        if (response) {
          return response;
        }

        // Sinon, récupérer depuis le réseau et mettre en cache
        return fetch(event.request).then((response) => {
          // Vérifier si la réponse est valide
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Cloner la réponse pour le cache
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }

  // Stratégie Network First pour les pages HTML et API
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si le réseau fonctionne, retourner la réponse et mettre en cache
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si le réseau échoue, essayer le cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }

          // Pour les pages HTML, retourner la page d'accueil en cache
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match(OFFLINE_URL);
          }

          // Pour les autres ressources, retourner une erreur
          return new Response("Ressource non disponible hors ligne", {
            status: 404,
            statusText: "Not Found",
          });
        });
      })
  );
});

// Gestion des messages depuis l'app principale
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Notification de mise à jour disponible
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CHECK_UPDATE") {
    // Vérifier s'il y a une nouvelle version
    caches.keys().then((cacheNames) => {
      const hasUpdate = !cacheNames.includes(CACHE_NAME);
      event.ports[0].postMessage({ hasUpdate });
    });
  }
});

console.log("🚀 FitLoop Service Worker chargé - Version:", CACHE_NAME);
