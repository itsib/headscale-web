// import { cacheNames, clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, /*setCatchHandler, setDefaultHandler, */ NavigationRoute } from 'workbox-routing'
import type { ManifestEntry } from 'workbox-build';

declare let self: ServiceWorkerGlobalScope;

const manifest = self.__WB_MANIFEST as ManifestEntry[];

self.addEventListener('message', (event) => {
  console.log(event);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
})

precacheAndRoute(manifest);

cleanupOutdatedCaches();

registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));
