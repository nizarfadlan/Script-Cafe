if(!self.define){let e,a={};const s=(s,c)=>(s=new URL(s+".js",c).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(c,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(a[n])return;let d={};const r=e=>s(e,n),t={module:{uri:n},exports:d,require:r};a[n]=Promise.all(c.map((e=>t[e]||r(e)))).then((e=>(i(...e),d)))}}define(["./workbox-ffadd75e"],(function(e){"use strict";importScripts("fallback-AzrymKAzve2WzRgjfb0qc.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/",revision:"AzrymKAzve2WzRgjfb0qc"},{url:"/_next/static/AzrymKAzve2WzRgjfb0qc/_buildManifest.js",revision:"08ab04a11a83287f84a91ca107a7d253"},{url:"/_next/static/AzrymKAzve2WzRgjfb0qc/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/158-fcbe2aa06a72cc99.js",revision:"fcbe2aa06a72cc99"},{url:"/_next/static/chunks/193-e628f7aa9bb2ad24.js",revision:"e628f7aa9bb2ad24"},{url:"/_next/static/chunks/385-b3eacaa895c1e47d.js",revision:"b3eacaa895c1e47d"},{url:"/_next/static/chunks/411-bb0a3000483db3f9.js",revision:"bb0a3000483db3f9"},{url:"/_next/static/chunks/43-2655875169382531.js",revision:"2655875169382531"},{url:"/_next/static/chunks/504-74899f89896dd522.js",revision:"74899f89896dd522"},{url:"/_next/static/chunks/53-4ee31a12c844d3b0.js",revision:"4ee31a12c844d3b0"},{url:"/_next/static/chunks/558-03044bca4be37b9e.js",revision:"03044bca4be37b9e"},{url:"/_next/static/chunks/560-afc34310a140448b.js",revision:"afc34310a140448b"},{url:"/_next/static/chunks/563-45b84ba3d9531d16.js",revision:"45b84ba3d9531d16"},{url:"/_next/static/chunks/58-edfbcf985cbf0d8c.js",revision:"edfbcf985cbf0d8c"},{url:"/_next/static/chunks/593-45a9f0c46d4672ac.js",revision:"45a9f0c46d4672ac"},{url:"/_next/static/chunks/754-26b7a0a6d9a4bdef.js",revision:"26b7a0a6d9a4bdef"},{url:"/_next/static/chunks/75fc9c18-25984afe689afff4.js",revision:"25984afe689afff4"},{url:"/_next/static/chunks/793-a74334aa000cb0f0.js",revision:"a74334aa000cb0f0"},{url:"/_next/static/chunks/856.454f047df49bbfde.js",revision:"454f047df49bbfde"},{url:"/_next/static/chunks/87-d3bb2d5c858da3a0.js",revision:"d3bb2d5c858da3a0"},{url:"/_next/static/chunks/998-232d21b9af13cd34.js",revision:"232d21b9af13cd34"},{url:"/_next/static/chunks/framework-2c79e2a64abdb08b.js",revision:"2c79e2a64abdb08b"},{url:"/_next/static/chunks/main-0b8f40daf424d887.js",revision:"0b8f40daf424d887"},{url:"/_next/static/chunks/pages/404-9c7c1d3e6b6fca97.js",revision:"9c7c1d3e6b6fca97"},{url:"/_next/static/chunks/pages/_app-4352ec340e0eafba.js",revision:"4352ec340e0eafba"},{url:"/_next/static/chunks/pages/_error-dc36bc69c68a7684.js",revision:"dc36bc69c68a7684"},{url:"/_next/static/chunks/pages/_offline-e3eb8e6aa43d122d.js",revision:"e3eb8e6aa43d122d"},{url:"/_next/static/chunks/pages/dashboard-8ab623d56bd3b272.js",revision:"8ab623d56bd3b272"},{url:"/_next/static/chunks/pages/dashboard/menu/item-b67fcb00c9045609.js",revision:"b67fcb00c9045609"},{url:"/_next/static/chunks/pages/dashboard/menu/item/%5Bid%5D-84b4e944c8a0b2b0.js",revision:"84b4e944c8a0b2b0"},{url:"/_next/static/chunks/pages/dashboard/menu/package-af458f1b97c703a6.js",revision:"af458f1b97c703a6"},{url:"/_next/static/chunks/pages/dashboard/menu/package/%5Bid%5D-5be8ccebd152c7af.js",revision:"5be8ccebd152c7af"},{url:"/_next/static/chunks/pages/dashboard/menu/package/%5Bid%5D/edit-e3adf913d5497213.js",revision:"e3adf913d5497213"},{url:"/_next/static/chunks/pages/dashboard/menu/package/add-e65b0dcad4f90ab8.js",revision:"e65b0dcad4f90ab8"},{url:"/_next/static/chunks/pages/dashboard/table-460e428bc9ae716d.js",revision:"460e428bc9ae716d"},{url:"/_next/static/chunks/pages/dashboard/transaction/booking-3f63a3178390449e.js",revision:"3f63a3178390449e"},{url:"/_next/static/chunks/pages/dashboard/transaction/order-470d73cdd68d305f.js",revision:"470d73cdd68d305f"},{url:"/_next/static/chunks/pages/dashboard/transaction/order/%5Bid%5D-e01313471e0dc461.js",revision:"e01313471e0dc461"},{url:"/_next/static/chunks/pages/dashboard/transaction/order/%5Bid%5D/edit-c2a5d9a5bbbeab2f.js",revision:"c2a5d9a5bbbeab2f"},{url:"/_next/static/chunks/pages/dashboard/transaction/order/add-0279737271630691.js",revision:"0279737271630691"},{url:"/_next/static/chunks/pages/dashboard/transaction/payment-0369511338ff1aef.js",revision:"0369511338ff1aef"},{url:"/_next/static/chunks/pages/dashboard/users-b04299cfba13aad5.js",revision:"b04299cfba13aad5"},{url:"/_next/static/chunks/pages/dashboard/users/%5Bid%5D-23c79d2cf4cd619c.js",revision:"23c79d2cf4cd619c"},{url:"/_next/static/chunks/pages/index-acb3dd1029667010.js",revision:"acb3dd1029667010"},{url:"/_next/static/chunks/pages/menu-33755a08fd4bd3e7.js",revision:"33755a08fd4bd3e7"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-57858736a8e81c8d.js",revision:"57858736a8e81c8d"},{url:"/_next/static/css/66f354c458e0a033.css",revision:"66f354c458e0a033"},{url:"/_next/static/media/0662b626da5db789-s.woff2",revision:"7092f7117afa134bee383085e5baffcb"},{url:"/_next/static/media/10939feefdad71be-s.woff2",revision:"72b3ae37567ee5efdf2254b657c36ba9"},{url:"/_next/static/media/1b097aa12b72d9f9-s.woff2",revision:"ba40202b1c1dcacbdbb7bcd2042a410f"},{url:"/_next/static/media/1fe84a733deddad4-s.woff2",revision:"c9f346d5d19d0d10e27b26904f5f6d7f"},{url:"/_next/static/media/20b8b8f6f47c1e10-s.woff2",revision:"7def222d1a45cb1cb7d8c3ae675dbdcc"},{url:"/_next/static/media/370d1cc320ec5619-s.woff2",revision:"a6ff41d10fa89e7f8fec937c243d7428"},{url:"/_next/static/media/376dd8dc38524313-s.p.woff2",revision:"af4d371a10271dafeb343f1eace762bc"},{url:"/_next/static/media/3828f203592f7603-s.woff2",revision:"e9fd398a43c9e51f9ee14e757eaf95d9"},{url:"/_next/static/media/51051a7edfeea436-s.woff2",revision:"f1b74fe764967ea8636858297f750d66"},{url:"/_next/static/media/591327bf3b62a611-s.woff2",revision:"0ed299a4bb5262e17e2145783b2c18f1"},{url:"/_next/static/media/7777133e901cd5ed-s.p.woff2",revision:"a09f2fccfee35b7247b08a1a266f0328"},{url:"/_next/static/media/7a78f1ce0329757f-s.p.woff2",revision:"15ef609d3bea2ccc8a36910ba440e1f3"},{url:"/_next/static/media/839135d04a097cea-s.woff2",revision:"79e6e81d255edac7e8627c7e16baccf5"},{url:"/_next/static/media/87c72f23c47212b9-s.woff2",revision:"790d0c8dbcd491d29d58f1369c199d40"},{url:"/_next/static/media/8d1a51bb45dd4d14-s.woff2",revision:"185244e129c78b5a1e8de9b0319e5f93"},{url:"/_next/static/media/916d3686010a8de2-s.p.woff2",revision:"9212f6f9860f9fc6c69b02fedf6db8c3"},{url:"/_next/static/media/953974ac5e9ff354-s.woff2",revision:"6731e1ba3788bda094c89ee8fc131aef"},{url:"/_next/static/media/9a881e2ac07d406b-s.p.woff2",revision:"25b0e113ca7cce3770d542736db26368"},{url:"/_next/static/media/9b44cfc48addbfc9-s.woff2",revision:"b8f12782fb372c92a5c8e3380f926e17"},{url:"/_next/static/media/ac614beb32f7a7c2-s.woff2",revision:"20f5992a9c019fb146a38e1cc0c101d3"},{url:"/_next/static/media/aefc8ad6d88b3354-s.woff2",revision:"6a4298fc0390ec22c52f618daa0e82bf"},{url:"/_next/static/media/bd427f25ac24d036-s.p.woff2",revision:"5426bf50c8455aab7a3e89d1138eb969"},{url:"/_next/static/media/c04551857776278f-s.p.woff2",revision:"8d91ec1ca2d8b56640a47117e313a3e9"},{url:"/_next/static/media/d36a2a2bb416f59e-s.p.woff2",revision:"a7f7eebec745ef48ccf7a3d08c66d84a"},{url:"/_next/static/media/d869208648ca5469-s.p.woff2",revision:"72993dddf88a63e8f226656f7de88e57"},{url:"/_next/static/media/e025c64520263018-s.woff2",revision:"dc820d9f0f62811268590ff631f36be9"},{url:"/_next/static/media/f93b79c1ea023ab6-s.woff2",revision:"96b6d54684daa94742f7bfd72a981213"},{url:"/_offline",revision:"AzrymKAzve2WzRgjfb0qc"},{url:"/avatar.png",revision:"e8c5595466fa8efa01bf4b720b4bb0d8"},{url:"/browserconfig.xml",revision:"316400062a8af188be5d1e990cddb48d"},{url:"/favicon.ico",revision:"df39383cbea90aa766e8dedb7111a6f8"},{url:"/gradient-left-dark.svg",revision:"0fafd0ba08deab7cb24a2468fa6f7f06"},{url:"/gradient-right-dark.svg",revision:"73dac8febd33f931d8fd824244186003"},{url:"/hero-dark.png",revision:"865053036ded047130a72d39f176f53c"},{url:"/hero.png",revision:"6facb53c22c73566b08a2dd74ad0b941"},{url:"/item.jpeg",revision:"8d982ca7b2ca690015504bb9d6d5d1b4"},{url:"/logo/android-chrome-192x192.png",revision:"d006f309f2ae91f6b37cec728b8c277a"},{url:"/logo/android-chrome-512x512.png",revision:"84cbbae052efe1bd5cc0db3a471b22fb"},{url:"/logo/apple-touch-icon.png",revision:"db202845e4790a022af74f870c4b4c2b"},{url:"/logo/favicon-16x16.png",revision:"21a50e5b4ba813862d017f2b369b9a87"},{url:"/logo/favicon-32x32.png",revision:"81484e4c4f12563167a1fce43e147fc8"},{url:"/logo/logo-152x152.png",revision:"fc46662b9a23e2eb38a3aed99440306e"},{url:"/logo/logo-192x192.png",revision:"a1954a2c246e4a4c9b6ec6f2c80fba46"},{url:"/logo/logo-256x256.png",revision:"2faf3b29b1cbfd98dd334ad1c69026d6"},{url:"/logo/logo-384x384.png",revision:"a93a8f285378ae44c929704556a297b8"},{url:"/logo/logo-40x40.png",revision:"607f167ddd9c4ffd89cc71ca91958c64"},{url:"/logo/logo-512x512.png",revision:"c796e8c6303537260ba77c4d33461b17"},{url:"/logo/logo-76x76.png",revision:"88094ff4e2c6322461591d32c0ae5771"},{url:"/manifest.webmanifest",revision:"1891e0d85f4a74a27758e5c197241f77"},{url:"/packageItem.jpeg",revision:"87b4fc4689303fd6f9f518cbe2a97797"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET")}));
