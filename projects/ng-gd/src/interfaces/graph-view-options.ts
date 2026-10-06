import { Point } from './point';
import { Candlestick } from './candle-stick';

/** Chart type rendered by `<graph-view>`. */
export type GraphViewKind = 'line' | 'bars' | 'pie' | 'candles';

export type GraphColor = string | CanvasGradient | CanvasPattern;

/**
 * Declarative configuration of `<graph-view>`.
 *
 * Thin adapter: every field ends up delegating 1:1 to the existing
 * `NgGdService` methods (`addLineChart`, `addGraphBars`, `addPieChart`,
 * `addCandleChart`, `addAxisX`/`addAxisY`). It does not change the geometry.
 */
export interface GraphViewOptions {
  kind: GraphViewKind;
  /** Values for `line`/`bars`/`pie` (`pie` takes degrees, as in the service). */
  values?: number[];
  /** Candles for `candles`. */
  candles?: Candlestick[];
  /** Palette for `bars`/`pie`/`candles` (bull). */
  colors?: GraphColor[];
  /** Single color for `line` (and fallback for the rest). */
  color?: GraphColor;
  /** Bear color for `candles`. */
  bearColor?: GraphColor;
  width?: number;
  height?: number;
  /** Cartesian origin. Default: `{ x: 50, y: height - 50 }`. */
  origin?: Point;
  /** Horizontal gap between points (`line`) and between candles (`candles`). */
  distance?: number;
  /** Width of each bar (`bars`). */
  barWidth?: number;
  /** Sector radius (`pie`) and candle height reference (`candles`). */
  size?: number;
  /** Candle height (`candles`). Default 100. */
  candleHeight?: number;
  /** Radial offset of each sector (`pie`). */
  pieDistance?: number;
  /** Start angle in degrees (`pie`). */
  pieStart?: number;
  /** Labels for each sector (`pie`). */
  pieLabels?: string[];
  /** Draws marks on each point (`line`). */
  marks?: boolean;
  showAxisX?: boolean;
  showAxisY?: boolean;
  xLabels?: string[];
  yLabels?: string[];
  /** Axis length. Default: 400. */
  axisLength?: number;
  fontSize?: number;
  /** true → setDarkMode, false → setLightMode, undefined → leaves colors untouched. */
  darkMode?: boolean;
  shadow?: boolean;
}

/** Options with all defaults applied. */
export interface ResolvedGraphViewOptions {
  kind: GraphViewKind;
  values: number[];
  candles: Candlestick[];
  colors: GraphColor[];
  color: GraphColor;
  bearColor: GraphColor;
  width: number;
  height: number;
  origin: Point;
  distance: number;
  barWidth: number;
  size: number;
  candleHeight: number;
  pieDistance: number;
  pieStart: number;
  pieLabels: string[];
  marks: boolean;
  showAxisX: boolean;
  showAxisY: boolean;
  xLabels: string[];
  yLabels: string[];
  axisLength: number;
  fontSize: number;
  darkMode: boolean | undefined;
  shadow: boolean;
}

const DEFAULT_COLORS: GraphColor[] = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

/**
 * Applies the `<graph-view>` defaults. Pure function (no canvas, no
 * TestBed) so it can be tested with vitest.
 */
export function resolveGraphViewOptions(input: GraphViewOptions): ResolvedGraphViewOptions {
  const width = input.width ?? 640;
  const height = input.height ?? 480;
  const color: GraphColor = input.color ?? input.colors?.[0] ?? '#000000';
  const colors = input.colors && input.colors.length > 0 ? [...input.colors] : [color];
  while (colors.length < (input.values?.length ?? input.candles?.length ?? 1)) {
    colors.push(DEFAULT_COLORS[colors.length % DEFAULT_COLORS.length]);
  }
  return {
    kind: input.kind,
    values: input.values ? [...input.values] : [],
    candles: input.candles ? [...input.candles] : [],
    colors,
    color,
    bearColor: input.bearColor ?? input.colors?.[1] ?? '#0000ff',
    width,
    height,
    origin: input.origin ? { ...input.origin } : { x: 50, y: height - 50 },
    distance: input.distance ?? 50,
    barWidth: input.barWidth ?? 30,
    size: input.size ?? 60,
    candleHeight: input.candleHeight ?? 100,
    pieDistance: input.pieDistance ?? 0,
    pieStart: input.pieStart ?? 0,
    pieLabels: input.pieLabels ? [...input.pieLabels] : [],
    marks: input.marks ?? false,
    showAxisX: input.showAxisX ?? false,
    showAxisY: input.showAxisY ?? false,
    xLabels: input.xLabels ? [...input.xLabels] : [],
    yLabels: input.yLabels ? [...input.yLabels] : [],
    axisLength: input.axisLength ?? 400,
    fontSize: input.fontSize ?? 12,
    darkMode: input.darkMode,
    shadow: input.shadow ?? false,
  };
}
