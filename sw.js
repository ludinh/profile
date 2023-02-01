importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js');

var registerRoute = workbox.routing.registerRoute;
var CacheFirst = workbox.strategies.CacheFirst;
var CacheableResponsePlugin = workbox.cacheableResponse.CacheableResponsePlugin;
var ExpirationPlugin  = workbox.expiration.ExpirationPlugin;
var maxAgeSeconds = 7 * 24 * 60 * 60;
var maxEntries = 60;

var cacheName = 'VIOLINST-LU-DINH-cache';

var matchCallback = function matchCallback(_ref) {
  var request = _ref.request;
  return (
    //CSS
    request.destination === '/css/.*' || 
	//JS
    request.destination === '/js/.*' || 
	//IMAGES
    request.destination === '/images/.*' ||
	//PICTURE	
    request.destination === '/pictures/.*' 
  );
};

registerRoute(matchCallback, new CacheFirst({
  cacheName: cacheName,
  plugins: [
    new CacheableResponsePlugin({
    statuses: [0, 200]
  }), 
    new ExpirationPlugin({
    maxEntries: maxEntries,
    maxAgeSeconds: maxAgeSeconds
  })]
}));

/*console.log(matchCallback)*/
/*console.log(ExpirationPlugin)

console.log(CacheableResponsePlugin)

console.log(CacheFirst)

console.log(registerRoute)
*/





//SELF INSTALL
var expectedCaches = ['LU-DINH'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open('LU-DINH').then(function (cache) {
     return cache.addAll(['/']);
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (key) {
      if (!expectedCaches.includes(key)) {
        return caches.delete(key);
      }
    }));
  }).then(function () {
    console.log('LU-DINH now ready to handle fetches!');
  }));
});

self.addEventListener('fetch', function (e) {
  console.log(e.request.url);
  e.respondWith(caches.match(e.request).then(function (response) {
    return response || fetch(e.request);
  }));
});
