---
'gsap-encore': major
---

Renamed to `gsap-encore`, rewritten around `gsap.context()`.

- One `setup(key, fn, { scope, persist })` per feature returns `{ context, contextSafe }`; everything GSAP created in `fn` or in a `contextSafe` wrapper is reverted on the next page swap (`revert()`, not `kill()`, so `from()` tweens restore inline styles).
- Removed `animate`, `timeline`, `scroll`, `register`, `registerScrollTriggers`, `isActive`, `isPersistent`, `removePersistence`, `getStatus`, `debug`, `forceCleanupAll` (`cleanupAll(true)`), `refresh(keys)` (`refresh()` only), the global `ScrollTrigger.getAll()` sweep and the UMD build.
- `encore.register(gsap)` injects your gsap instance; the plugin is no longer registered at import time.
- Adapters (`swupAdapter`, `barbaAdapter`, `astroAdapter`) are exported from the main entry with structural types: no `swup` or `@barba/core` types leak. Swup detaches with `hooks.off`; Barba uses `hooks.beforeLeave` / `hooks.afterEnter` (the v1 names did not exist).
- Console badge and `window.encore` moved to `gsap-encore/debug` (`attach(encore)`), with `orphans()` listing tweens and ScrollTriggers no setup owns.
- `encore.events` (`before-swap`, `after-swap`, `setup`, `cleanup`).
