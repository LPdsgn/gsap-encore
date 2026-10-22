# @lpdsgn/gsap-spa-manager

## 2.0.1

### Patch Changes

- [#7](https://github.com/LPdsgn/gsap-encore/pull/7) [`6c87b28`](https://github.com/LPdsgn/gsap-encore/commit/6c87b289b21b8dbedc43dce01e05778144c6caa6) Thanks [@LPdsgn](https://github.com/LPdsgn)! - `gsap-encore/debug` types resolve under TypeScript's legacy `node10` module resolution too (`typesVersions`).

## 2.0.0

### Major Changes

- [#5](https://github.com/LPdsgn/gsap-encore/pull/5) [`1c4826e`](https://github.com/LPdsgn/gsap-encore/commit/1c4826e43c724b20b1db824b5b200799a13bb3f2) Thanks [@LPdsgn](https://github.com/LPdsgn)! - Renamed to `gsap-encore`, rewritten around `gsap.context()`.
  - One `setup(key, fn, { scope, persist })` per feature returns `{ context, contextSafe }`; everything GSAP created in `fn` or in a `contextSafe` wrapper is reverted on the next page swap (`revert()`, not `kill()`, so `from()` tweens restore inline styles).
  - Removed `animate`, `timeline`, `scroll`, `register`, `registerScrollTriggers`, `isActive`, `isPersistent`, `removePersistence`, `getStatus`, `debug`, `forceCleanupAll` (`cleanupAll(true)`), `refresh(keys)` (`refresh()` only), the global `ScrollTrigger.getAll()` sweep and the UMD build.
  - `encore.register(gsap)` injects your gsap instance; the plugin is no longer registered at import time.
  - Adapters (`swupAdapter`, `barbaAdapter`, `astroAdapter`) are exported from the main entry with structural types: no `swup` or `@barba/core` types leak. Swup detaches with `hooks.off`; Barba uses `hooks.beforeLeave` / `hooks.afterEnter` (the v1 names did not exist).
  - Console badge and `window.encore` moved to `gsap-encore/debug` (`attach(encore)`), with `orphans()` listing tweens and ScrollTriggers no setup owns.
  - `encore.events` (`before-swap`, `after-swap`, `setup`, `cleanup`).

## 1.0.0

### Major Changes

- [`eade479`](https://github.com/LPdsgn/gsap-spa-manager/commit/eade4798b3fee1b748836e2e3097c5ab1835bc76) Thanks [@LPdsgn](https://github.com/LPdsgn)! - First stable release. Fix package entry points: the build emitted `index.esm.js`/`index.cjs.js` while `exports` pointed to `index.js`/`index.cjs`, so the package could not be imported from Node, esbuild or Vite. CommonJS consumers now also get `index.d.cts` types.

## 0.1.1

### Patch Changes

- [`35fa1ce`](https://github.com/LPdsgn/gsap-spa-manager/commit/35fa1ce0bcf5500f8681570b20082bf3e72f495c) Thanks [@LPdsgn](https://github.com/LPdsgn)! - `window.AM` is now exposed only when `AM.init({ debug: true })` is called, instead of on import. Fixed adapter names and package name in JSDoc and README examples.

- [`3dda8a4`](https://github.com/LPdsgn/gsap-spa-manager/commit/3dda8a454c394e5f78b38d8626e69a5e388e056f) Thanks [@LPdsgn](https://github.com/LPdsgn)! - `setup()` callback now receives `ctx: gsap.Context` (no longer optional), so callbacks typed `(ctx: gsap.Context) => …` are accepted.
