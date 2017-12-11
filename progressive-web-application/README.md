# Progressive Web Applications (PWA)
- Definition
- Charasteristics
- Technologies one by one
- Platform support
- Lighthouse

---
# Definition
"Progressive Web Apps (PWAs) use modern web capabilities to deliver fast, engaging, and reliable mobile web experiences that are great for users and businesses."

---
# PWA
![PWA](progressive-web-application/pwa.jpg "PWA")

---
# Characteristics
- *Progressive* - Work for every user, regardless of browser choice because they’re built with progressive enhancement as a core tenet.
- *Responsive* - Fit any form factor: desktop, mobile, tablet, or forms yet to emerge.
- *Connectivity* independent - Service workers allow work offline, or on low quality networks.
- *App-like* - Feel like an app to the user with app-style interactions and navigation.
- *Fresh* - Always up-to-date thanks to the service worker update process.
- *Safe* - Served via HTTPS to prevent snooping and ensure content hasn’t been tampered with.
- *Discoverable* - Are identifiable as “applications” thanks to W3C manifests and service worker registration scope allowing search engines to find them.
- *Re-engageable* - Make re-engagement easy through features like push notifications.
- *Installable* - Allow users to “keep” apps they find most useful on their home screen without the hassle of an app store.
- *Linkable* - Easily shared via a URL and do not require complex installation.

---
# Who Uses PWAs?
- Twitter Lite
- Ali Express
- Trivago
- Washington Post
- Forbes
- Flipboard
- Telegram

---
# Technologies
- Service Worker
- Web App Manifest
- Server-side rendering
- Local databases

---
# Universal Rendering
- JS app that can be rendered either in browser or in the server
- Once the app (JS) is loaded in the browser the HTML representation is replaced with the JS one
- Supported by _@angular/cli@1.6.0_
- Server-side rendering (SSR) often used term
    - Takes application and route as input and produces HTML representation
- [CLI Tutorial](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/universal-rendering.md)
- Benefits:
    - Fast first load
    - Caching
    - Search-engine optimization

---
# Exercise
Build Universal app ([source](https://blog.angular.io/angular-5-1-more-now-available-27d372f5eb4e)):
1. Run:
```bash
npm install --save @angular/platform-server @nguniversal/module-map-ngfactory-loader ts-loader
ng g universal universal
```
2. Copy [this](https://gist.github.com/RoopeHakulinen/9c9653cf62326ddbaff065729e3d8b64) to be the `server.ts` in your project's root
3. Copy [this](https://gist.github.com/RoopeHakulinen/94bfa8023eea331f11f78a9ec815605b) to be the `webpack.server.config.js` in your project's root
4. Add these to the `scripts` section of `package.json`:
```json
"ssr": "npm run build:ssr && npm run serve:ssr",
"build:ssr": "npm run build:client-and-server-bundles && npm run webpack:server",
"serve:ssr": "node dist/server.js",
"build:client-and-server-bundles": "ng build --prod && ng build --prod --app 1 --output-hashing=false",
"webpack:server": "webpack --config webpack.server.config.js --progress --colors"
```

Continue to next slide ->

---
# Exercise
5. Alter `.angular-cli.json` to contain
```json
"outDir": "dist/server/",
```
for server and 
```json
"outDir": "dist/browser/",
```
for browser
5. Run 
```bash
npm run ssr
```
and go to `localhost:4000` to see what initial page load's HTML now looks

---
# State Retrieval
- Problem: Both, browser and backend, ask for the same data

![State Problem](progressive-web-application/state-problem.png "State Problem")

Image source: [Malcoded](https://malcoded.com/posts/angular-fundamentals-universal-server-side-rendering) 

---
# Solutions
- Solution 1: Data retrieved on both platforms
- Solution 2: Include state with JS

---
# Data retrieved on both platforms
- E.g. Browser makes HTTP call to backend while backend fetches data from database
- Works only if backend has direct access to the data source

---
# State Transfer
- Browser receives the data from the backend while bootstrapped
- Angular Transfer State API

![State Transfer API](progressive-web-application/state-transfer-api.png "State Transfer API")

Image source: [Malcoded](https://malcoded.com/posts/angular-fundamentals-universal-server-side-rendering)
    
---
# Angular State Transfer API
- Composed of a module for each platform: 
    - [`BrowserTransferStateModule`](https://angular.io/api/platform-browser/BrowserTransferStateModule) found from `@angular/platform-browser`
    - [`ServerTransferStateModule`](https://angular.io/api/platform-server/ServerTransferStateModule) found from `@angular/platform-server`
- Provides easy interface to move data from backend to the browser when control is changed

---
# Service Workers
- "A service worker is an event-driven worker registered against an origin and a path."
- Separate thread -> Has no DOM access!
- Only available over HTTPS
- AppCache replacement

---
# Service Worker Features
- Access to Background sync & Push APIs
- Network request interception
- Access to file system
- Communication with main thread

---
# Exercise
Enable offline usage via service workers
1. Run
```bash
npm install @angular/service-worker http-server
ng set apps.0.serviceWorker=true
```
2. Add to `imports` in `app.module.ts`:
```typescript
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
imports: [
    ...
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
]
```
3. Copy [this](https://gist.github.com/RoopeHakulinen/7d6f7457309d37c6cf369f4988e2aaa3) as `src/ngsw-config.json`
4. Run
```bash
ng build --prod
cd dist/browser/
http-server -p 8080
```

---
# Web App Manifest
- JSON file that contains metadata about the application
- Usually named `manifest.webmanifest`
- Contains:
    - General info such as name, description etc.
    - Look'n'feel (home screen icons, color theme, screen size and orientation)
    - Related applications

---
# Exercise
Add Web App Manifest:
1. Save [this](https://gist.github.com/RoopeHakulinen/0328cb84f20318b400dd292fe936219c) as `src/manifest.webmanifest`
2. Add "manifest.webmanifest" to the both `assets` arrays in `.angular-cli.json`
3. Add 
```html
<link rel="manifest" href="manifest.webmanifest"/>
```
to the `index.html` in `<head>` section

---
# IndexedDB
- Local noSQL database
- Good for large data blobs such as files
- Supports transactions

---
# Push Messages
![Push Messages](progressive-web-application/push-message.gif "Push Messages")

---
# Support
- caniuse.com:
    - [Service Worker](https://caniuse.com/#search=service%20worker)
    - [Push API](https://caniuse.com/#search=push%20api)
    - [Web App Manifest](https://caniuse.com/#search=web%20app%20manifest)
    - [IndexedDB](https://caniuse.com/#search=indexeddb)
- [Is Service Worker Ready?](https://jakearchibald.github.io/isserviceworkerready/)

---
# WebKit (Apple) Support
![Apple PWA news 1](progressive-web-application/apple-pwa-news-1.png "Apple PWA news 1")
![Apple PWA news 2](progressive-web-application/apple-pwa-news-2.png "Apple PWA news 2")

---
# Lighthouse - PWA assessment tool
![Lighthouse](progressive-web-application/lighthouse.png "Lighthouse")

---
# Exercise
Run Lighthouse for your application, you should get score of 64 for PWA section