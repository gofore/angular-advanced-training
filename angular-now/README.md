# Angular Now

---
# Contents
- Angular's version history
- Couple of new features show-cased
- Guesses on the future
- @angular/cli status

---
# Angular History
#### Angular 2 (September 2016)
##### [Angular 2.1](http://angularjs.blogspot.fi/2016/10/angular-210-now-available.html) (October 2016)
- Preloading of lazy loaded routes
- `:enter` & `:leave` animation aliases

##### [Angular 2.2](http://angularjs.blogspot.fi/2016/11/angular-220-now-available.html) (November 2016)
- AOT with `@angular/upgrade`

##### [Angular 2.3](http://angularjs.blogspot.fi/2016/12/angular-230-now-available.html) (December 2016)
- [`@angular/language-service`](https://angular.io/guide/language-service)
- Improved Zone.js error messages

##### [Angular 2.4](http://angularjs.blogspot.fi/2016/12/angular-240-now-available.html) (December 2016)
- RxJS 5.0.0 stable

---
### Angular 3 
- [Skipped for consistency](http://angularjs.blogspot.fi/2016/12/ok-let-me-explain-its-going-to-be.html)

---
#### [Angular 4](http://angularjs.blogspot.fi/2017/03/angular-400-now-available.html) (March 2017)
- Smaller and faster
- First deprecations
- Animations -> `@angular/animations`
- Improved `*ngIf` and `*ngFor`
- Angular Universal adopted by the core team
- TS 2.1 and 2.2 compatibility
- Packaging updates (FESM, ES2015 builds, Closure)

##### [Angular 4.1](http://angularjs.blogspot.fi/2017/04/angular-410-now-available.html) (April 2017)
- `strictNullChecks` TS compiler option
- TS 2.3 support

##### [Angular 4.2](http://angularjs.blogspot.fi/2017/06/angular-42-now-available.html) (June 2017)
- Huge improvements on animations
- New [angular.io](https://angular.io/) 

##### [Angular 4.3](http://angularjs.blogspot.fi/2017/07/angular-43-now-available.html) (July 2017)
- `HttpClient`
- New router lifecycle hooks (`GuardsCheckStart`, `GuardsCheckEnd`, `ResolveStart`, `ResolveEnd`)
- Conditionally disable animations (`[@.disabled]`)

---
#### [Angular 5](https://blog.angular.io/version-5-0-0-of-angular-now-available-37e414935ced) (November 2017)
- First removed APIs (e.g. `OpaqueToken`)
- Improved support for PWAs
- Build optimizer
- Deprecate `@angular/http` in favor of `HttpClient` in `@angular/common/http` introduced in 4.3
- [RxJS 5.5 lettable operators](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md)
- Angular Universal State Transfer API and DOM Support
- Angular compiler is now a TypeScript transform -> incremental rebuilds dramatically faster (`ng serve --aot`)
- [Preserve Whitespace](https://angular.io/api/core/Component#preserveWhitespaces) option
- Update on blur/submit:
```angular2html
<input name="firstName" ngModel [ngModelOptions]="{updateOn: 'blur'}">
```

##### [Angular 5.1](https://blog.angular.io/angular-5-1-more-now-available-27d372f5eb4e) (December 2017)
- TS 2.5 compatibility
- Angular Material & CDK stable release

---
# `@angular/language-service`
- Code completion, errors, hints etc. for templates
- Works at least in VS Code & JetBrains products (IntelliJ IDEA & WebStorm)
- Installable as simply as
```bash
npm install --save-dev @angular/language-service
```
or
```json
devDependencies {
	"@angular/language-service": "^5.0.0"
}
```
![Language Completion](angular-now/language-completion.gif "Language Completion")
![Language Error](angular-now/language-error.gif "Language Error")
---
# Build Optimizer
- Produces smaller bundles by for example skipping _vendor.bundle.js_ generation and removing decorators
- On by default for production builds with CLI if using Angular 5
- Usage otherwise: `ng build --build-optimizer`
- [Details](https://www.npmjs.com/package/@angular-devkit/build-optimizer)

---
# Guesses On the Future
Main concentration in near future (Angular 5.x):
- `@angular/service-worker` and other PWA updates
- CLI fixes
- Further watch mode speed improvements and fixes
- Documentation improvements
- TS 2.6 and stricter defaults in CLI

---
# @angular/cli Status
- 1.6 just released with support for the latest Angular (5.1)
- Still huge number of problems but getting more stable
- Now supports PWAs better, yet not perfectly

---
# Stuff Considered for @angular/cli V2
- AOT on everywhere by default (now only with `--prod`) 
- [NativeScript](https://www.nativescript.org/) support
- Usability upgrades based on actual user feedback
- Configuration in JS/TS instead of JSON
- Webpack 4 -> further speed improvements