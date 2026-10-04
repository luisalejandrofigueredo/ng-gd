# AGENTS.md — ng-gd

Angular canvas library (`ng-gd`). Library-only repo: no app, no demo, no CI, no lint/format scripts.

## Layout (real sources)

- Library root: `projects/ng-gd/`; public entry: `projects/ng-gd/src/public-api.ts` (built by ng-packagr, dest `dist/ng-gd`). All new exports must go through `public-api.ts`.
- `src/lib/ng-gd.service.ts` — stateful `NgGdService` (holds `canvasObjects`). Consumer passes in its own `CanvasRenderingContext2D` for `clear/draw/click/tap/zoomInPoint`.
- `src/class/*` — shape objects (`ShapeObject` base + node/connection/line/rectangle/circle/triangle/arc/label/image/chart/candlestick/collateral/document).
- `src/interfaces/*`, `src/trigonometrics.ts` — pure math helpers (no TestBed needed).
- Ignore stale root duplicates: `point.ts`, `rectangle.ts`, `common-properties.ts`, root `ng-package.json`, root `tsconfig.lib*.json`. Real ones live under `projects/ng-gd/`. Never import from root copies (also note root `rectangle.ts` has typos `fist`/`forth`).
- `dist/`, `.angular/`, `out-tsc/` are gitignored build output — never edit.
- `example/` is a standalone Angular 22 demo app (own `package.json`, pinned to 22.1.x to match lib peers). Install/build inside that dir (`npm install`, `npx ng build`); root `npm test`/`npm run build` never touch it.

## Commands

- Build lib: `npm run build` (= `ng build ng-gd`). Publish (manual, per README): `cd dist/ng-gd && npm publish`.
- Test: `npm test` (= `vitest run`) runs **only** pure specs (node env, see `vitest.config.ts` `include`): `trigonometrics.spec.ts` + `interfaces/graph-view-options.spec.ts`. Run focused: `npx vitest run projects/ng-gd/src/interfaces/graph-view-options.spec.ts`.
- `angular.json` still declares a Karma target (`ng test ng-gd`), but there is **no `karma.conf.js`** and remaining `*.spec.ts` (`ng-gd.service`, `ng-gd.component`, `image-object`, `document-object`) are Jasmine/TestBed specs that `npm test` does **not** execute. Don't assume `npm test` covers them; don't add Karma config unless asked.

## Gotchas

- `NgGdService.start(width, height)` must be called first; it creates/resizes the index-0 `DocumentObject` backing the canvas. Tests/consumers that skip it operate on an empty object list.
- `rectangle(x, y, height, width, angle)` takes **height before width** (see `trigonometrics.spec.ts`). Don't "fix" the order — callers depend on it.
- `getNewParallelPoint(...)` offsets at **+60° (`Math.PI/3`)**, not perpendicular; label offsets also drift along the line. This is documented/tested behavior.
- Strict TS is on (`strict`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `moduleResolution: bundler`, `target/module ES2022`). Keep new code compliant.
- Version skew: root devDeps pin Angular `19.2.x`, but `projects/ng-gd/package.json` declares peers `^22.1.0`. Don't "align" versions unilaterally — flag it in PRs.
