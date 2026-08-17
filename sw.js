const CACHE_VERSION = 'twittor-v1';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.webmanifest',
    './css/style.css',
    './css/animate.css',
    './js/libs/jquery.js',
    './js/app.js',
    './img/favicon.ico',
    './img/icons/icon-192.png',
    './img/icons/icon-512.png',
    './img/icons/icon-maskable-192.png',
    './img/icons/icon-maskable-512.png',
    './img/avatars/spiderman.jpg',
    './img/avatars/ironman.jpg',
    './img/avatars/wolverine.jpg',
    './img/avatars/thor.jpg',
    './img/avatars/hulk.jpg'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(function(cache) {
                return cache.addAll(APP_SHELL);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function(cacheName) {
                            return cacheName.startsWith('twittor-') && cacheName !== CACHE_VERSION;
                        })
                        .map(function(cacheName) {
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(function() {
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') {
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(function(response) {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_VERSION).then(function(cache) {
                            cache.put('./index.html', copy);
                        });
                    }
                    return response;
                })
                .catch(function() {
                    return caches.match('./index.html');
                })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then(function(networkResponse) {
                if (networkResponse.ok || networkResponse.type === 'opaque') {
                    const copy = networkResponse.clone();
                    caches.open(CACHE_VERSION).then(function(cache) {
                        cache.put(event.request, copy);
                    });
                }
                return networkResponse;
            });
        })
    );
});
