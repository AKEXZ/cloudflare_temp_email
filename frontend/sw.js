if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let l={};const t=e=>i(e,o),f={module:{uri:o},exports:l,require:t};s[o]=Promise.all(n.map((e=>f[e]||t(e)))).then((e=>(r(...e),l)))}}define(["./workbox-e1498109"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CSJ-BUKP.js",revision:null},{url:"assets/index-Xef8Ar_c.css",revision:null},{url:"assets/mail_parser_wasm-BuqT1d-4.js",revision:null},{url:"assets/vendor-wangeditor-BLevwKU-.js",revision:null},{url:"assets/vendor-wangeditor-ClYh1QsV.css",revision:null},{url:"assets/workbox-window.prod.es5-D5gOYdM7.js",revision:null},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"index.html",revision:"ad95626fc98e40b6b9e87d7e85cf2d3b"},{url:"logo.png",revision:"f13f7a9b0f4adf6b653f5320465b8f09"},{url:"logo.png",revision:"f13f7a9b0f4adf6b653f5320465b8f09"},{url:"manifest.webmanifest",revision:"52cbf60c43888438e291f314ecb8b3fd"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),self.__WB_DISABLE_DEV_LOGS=!0}));
