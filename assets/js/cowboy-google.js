(function () {
  'use strict';

  // Measurement ID supplied by the owner in the Google Analytics setup screen.
  var measurementId = 'G-VYR2542XCN';
  if (window.__cowboyGoogleAnalyticsLoaded || (window.navigator && window.navigator.globalPrivacyControl === true)) return;
  if (window['ga-disable-' + measurementId] === true) return;
  window.__cowboyGoogleAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // config sends the normal page_view; do not also emit a manual page_view.
  window.gtag('config', measurementId);

  if (!document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')) {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
  }
})();
