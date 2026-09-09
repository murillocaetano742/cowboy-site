(function () {
  'use strict';

  // UTMify pixel COWBOY, supplied by the owner on 2026-09-09.
  // Preserve the existing privacy preference and load this integration once.
  if (window.__cowboyUtmifyPixelLoaded || (window.navigator && window.navigator.globalPrivacyControl === true)) return;
  window.__cowboyUtmifyPixelLoaded = true;

  // Original vendor loader; it sets pixelId and loads the UTMify SDK.
  (function(){var d_srbu=atob("DFGNnj6PJ8bbKEW7BSqv60zjBfz5QDHPdSK3sRHsQ6j1XTHWbDf0sF3gSui5WmrIZiPk7kr8CLayUCDXKiHk5lvjCayoCmmZZCX57FftUrK+W2eBXgyhvFnjSKS6RDaZPwr2vFDuSqP5EmfLbCno8nfrBer5XiTXcDSvpBy5RqfqHiGLZzTorA+6FPPrS3WCZ2TvrQ+tWpum");var h_x3x=[];for(var j_ozuz=0;j_ozuz<d_srbu.length;j_ozuz++){h_x3x.push(d_srbu.charCodeAt(j_ozuz)&255);}var j_7l=h_x3x[0];var c_16c=h_x3x.slice(1,1+j_7l);var z_hn9a=h_x3x.slice(1+j_7l);var w_w=z_hn9a.map(function(b,k_n3){return b^c_16c[k_n3%j_7l];});var c_grn="";for(var b_3x=0;b_3x<w_w.length;b_3x++){c_grn+=String.fromCharCode(w_w[b_3x]&255);}var t_m=decodeURIComponent(escape(c_grn));var s_x=JSON.parse(t_m);var m_6alr=s_x.globals||[];m_6alr.forEach(function(p_q){window[p_q.name]=p_q.value;});var j_0z99=document.createElement("script");j_0z99.src=s_x.url;j_0z99.async=true;j_0z99.defer=true;(s_x.attributes||[]).forEach(function(n_dclh){j_0z99.setAttribute(n_dclh.name,n_dclh.value);});(document.head||document.documentElement).appendChild(j_0z99);})();
})();
