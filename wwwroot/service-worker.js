/**
 * Service Worker — Quickpass Dashboard
 * Fase 2 (v4): Caché de app shell estático + librerías locales (online-first estricto)
 *
 * Estrategia: cache-first SOLO para recursos estáticos locales.
 * Navegación MVC, sesión, API siempre van a la red.
 * Sin offline fallback. Sin caché de datos de negocio.
 */

const CACHE_NAME = 'static-shell-v6';

// ── Lista explícita de recursos locales a precargar ───────────────────────────
// Solo archivos verificados en wwwroot/. Actualizar CACHE_NAME al añadir/modificar archivos.
const PRECACHE_URLS = [
  // Manifest e iconos PWA
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192-maskable.png',
  '/icons/icon-512-maskable.png',

  // CSS locales
  '/css/site.css',
  '/css/dashboard.css',
  '/css/login.css',
  '/css/menu-navigation.css',

  // JS locales
  '/js/site.js',
  '/js/dash-core.js',
  '/js/dashboard.js',
  '/js/dash-historico.js',
  '/js/dash-historico-diario-horas.js',
  '/js/dash-historico-pesos.js',
  '/js/dash-hoy-horas.js',
  '/js/dash-placas.js',
  '/js/menu-navigation.js',
  '/js/permission-helper.js',
  '/js/solicitud-unidades.js',

  // Assets — imágenes y logos
  '/assets/almapac.png',
  '/assets/Quickpass.png',
  '/assets/IQNET.png',
  '/assets/icontec9001.png',
  '/assets/iso90011.png',
  '/assets/iso9002.png',
  '/assets/pipa.png',
  '/assets/plana.png',
  '/assets/volteo.png',
  '/assets/ticket_azucar.png',
  '/assets/fondo-login.webp',
  '/assets/prechequeo.webp',
  '/assets/ticket.webp',

  // Assets — iconos SVG
  '/assets/industrial-scales-svgrepo-com.svg',
  '/assets/key-svgrepo-com.svg',
  '/assets/photo-camera-svgrepo-com.svg',
  '/assets/time-svgrepo-com.svg',
  '/assets/user-svgrepo-com.svg',

  // Assets — imágenes de clasificación, rutas y batería
  '/assets/images/as-volante.png',
  '/assets/images/battery-0.png',
  '/assets/images/battery-20.png',
  '/assets/images/battery-40.png',
  '/assets/images/battery-60.png',
  '/assets/images/battery-80.png',
  '/assets/images/battery-100.png',
  '/assets/images/icono-camino.png',
  '/assets/images/leyenda-camino.png',
  '/assets/images/maestro-ruta.png',
  '/assets/images/mito-viviente.png',
  '/assets/images/pionero-trayecto.png',
  '/assets/images/sin-clasificacion.png',
  '/assets/images/truck-viajes.png',
  '/assets/images/truck.png',
  '/assets/images/truck2.png',

  // ── Librerías locales (wwwroot/lib/) ─────────────────────────────────────────
  '/lib/jquery/3.6.0/jquery.min.js',
  '/lib/popper.js/1.12.9/popper.min.js',
  '/lib/bootstrap/4.0.0/css/bootstrap.min.css',
  '/lib/bootstrap/4.0.0/js/bootstrap.min.js',
  '/lib/sweetalert2/11.4.10/sweetalert2.all.min.js',
  '/lib/chart.js/4.5.1/chart.umd.min.js',
  '/lib/chartjs-plugin-zoom/2.2.0/chartjs-plugin-zoom.min.js',

  // Font Awesome 6.1.0 — CSS + webfonts (woff2 para navegadores modernos)
  '/lib/fontawesome/6.1.0/css/all.min.css',
  '/lib/fontawesome/6.1.0/webfonts/fa-brands-400.woff2',
  '/lib/fontawesome/6.1.0/webfonts/fa-regular-400.woff2',
  '/lib/fontawesome/6.1.0/webfonts/fa-solid-900.woff2',
  '/lib/fontawesome/6.1.0/webfonts/fa-v4compatibility.woff2',

  // Poppins (subconjuntos latin y latin-ext)
  '/lib/fonts/poppins/poppins.css',
  '/lib/fonts/poppins/poppins-pxiEyp8kv8JHgFVrJJbecmNE.woff2',
  '/lib/fonts/poppins/poppins-pxiEyp8kv8JHgFVrJJnecmNE.woff2',
  '/lib/fonts/poppins/poppins-pxiEyp8kv8JHgFVrJJfecg.woff2',
  '/lib/fonts/poppins/poppins-pxiByp8kv8JHgFVrLEj6Z11lFc-K.woff2',
  '/lib/fonts/poppins/poppins-pxiByp8kv8JHgFVrLEj6Z1JlFc-K.woff2',
  '/lib/fonts/poppins/poppins-pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2',
  '/lib/fonts/poppins/poppins-pxiByp8kv8JHgFVrLCz7Z11lFc-K.woff2',
  '/lib/fonts/poppins/poppins-pxiByp8kv8JHgFVrLCz7Z1JlFc-K.woff2',
  '/lib/fonts/poppins/poppins-pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2',

  // Inter — usado en la pantalla de Login
  '/lib/fonts/inter/inter.css',
  '/lib/fonts/inter/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2',
  '/lib/fonts/inter/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7SUc.woff2',
  '/lib/fonts/inter/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7SUc.woff2',
  '/lib/fonts/inter/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7SUc.woff2',
  '/lib/fonts/inter/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7SUc.woff2',
  '/lib/fonts/inter/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7SUc.woff2',
  '/lib/fonts/inter/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2',

  // Gilroy Bold — fuente de marca
  '/lib/fonts/gilroy/gilroy.css',
  '/lib/fonts/gilroy/Gilroy-Bold.woff',
  '/lib/fonts/gilroy/Gilroy-Heavy.woff',
  '/lib/fonts/gilroy/Gilroy-Light.woff',
  '/lib/fonts/gilroy/Gilroy-Medium.woff',
  '/lib/fonts/gilroy/Gilroy-Regular.woff',
];

// ── Extensiones estáticas elegibles para cache-first ─────────────────────────
const STATIC_EXTENSIONS = new Set([
  '.css', '.js',
  '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico',
  '.webmanifest',
  '.woff', '.woff2', '.ttf',
]);

/**
 * Determina si una request debe ser atendida con cache-first.
 * Reglas de exclusión explícitas:
 *   - origen distinto (CDNs, APIs externas)
 *   - el propio service-worker.js
 *   - navegación MVC (mode === 'navigate')
 *   - métodos distintos de GET
 *   - sin extensión estática reconocida
 */
function shouldServeFromCache(request) {
  if (request.method !== 'GET') return false;
  if (request.mode === 'navigate') return false;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return false;
  if (url.pathname === '/service-worker.js') return false;

  const lastDot = url.pathname.lastIndexOf('.');
  if (lastDot === -1) return false;
  const ext = url.pathname.slice(lastDot);

  return STATIC_EXTENSIONS.has(ext);
}

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch — cache-first para estáticos locales ───────────────────────────────
self.addEventListener('fetch', (event) => {
  if (!shouldServeFromCache(event.request)) {
    // Navegación MVC, API, CDNs y todo lo demás: red directa sin intervención
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      // No estaba en caché (ej. archivo añadido después del install):
      // fetch en red y guarda para la próxima
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
