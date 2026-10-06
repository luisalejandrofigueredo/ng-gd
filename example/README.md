# Demo: declarative charts page (`<graph-view>`)

**Open it live:** https://stackblitz.com/github/luisalejandrofigueredo/ng-gd-demo
(demo repo: https://github.com/luisalejandrofigueredo/ng-gd-demo — this
`example/` folder is its canonical source; if you change it here, mirror it
there).

Standalone Angular 22 app showcasing all 4 chart types (`line`, `bars`,
`pie`, `candles`), with a dark-mode toggle and click detection. It consumes
the published `ng-gd` package (5.2.0+, where `<graph-view>` ships as stable),
so this folder is a complete project: `npm install`, `npm start`, done.

## Run it locally

```bash
cd example
npm install
npm start   # http://localhost:4200/
```

## Upload it to the internet

Pick one:

- **StackBlitz upload:** zip this `example/` folder **without**
  `node_modules/`, `dist/` and `.angular/` (they are gitignored and
  StackBlitz reinstalls them), then drag the zip into
  [stackblitz.com](https://stackblitz.com) (Dashboard → Import).
- **GitHub → StackBlitz (recommended for a stable link):** push this folder
  as its own repo (or subfolder) and open
  `https://stackblitz.com/github/<user>/<repo>` (add `/tree/main/example`
  if it lives in a subfolder). Share that URL.

## What it shows

| File | Purpose |
|---|---|
| `src/main.ts` | `bootstrapApplication(AppComponent)` |
| `src/app/app.component.ts` | The 4 `GraphViewOptions` (`line`, `bars`, `pie`, `candles`), dark-mode toggle, click handler |
| `src/app/app.component.html` | One `<graph-view [options]>` per chart + live JSON of each options object |
| `src/app/app.component.css` | Demo-only styling |

## Notes

- Each `<graph-view [options]>` owns its own `NgGdService` instance: it does
  not interfere with classic imperative code (injected `NgGdService`) living
  in the same app.
- For redrawing to work, `options` are updated by assigning a **new** object
  (`{ ...this.line, darkMode: true }`), never by mutating the old one
  (see `toggleDarkMode()` in the example).
- `pie` values are **degrees** and must add up to 360 (as `addPieChart`
  requires in the service).
- Angular is pinned to 22.1.x to match the `ng-gd` peer dependencies, so no
  `--legacy-peer-deps` flag is needed.
