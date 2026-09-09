(function () {
  'use strict';

  // Pixel confirmed by the store owner. Purchase events belong to Cartpanda.
  var pixelId = '1006075098894986';
  if (window.__cowboyMetaPixelLoaded || (window.navigator && window.navigator.globalPrivacyControl === true)) return;
  window.__cowboyMetaPixelLoaded = true;

  if (!window.fbq) {
    var fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  window.fbq('init', pixelId);
  window.fbq('trackSingle', pixelId, 'PageView');
  window.fbq('trackSingle', pixelId, 'ViewContent', {
    content_name: 'COWBOY Energia',
    content_type: 'product'
  });
})();
