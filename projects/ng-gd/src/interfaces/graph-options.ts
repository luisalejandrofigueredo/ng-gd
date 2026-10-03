import { Point } from "./point";

/** Alternativa legible a los parámetros posicionales de `addNode`. */
export interface AddNodeOptions {
  point: Point;
  name: string;
  radius?: number;
  description?: string;
  net?: boolean;
  angleLabel?: number;
  distanceLabel?: number;
  shadow?: boolean;
  color?: string | CanvasGradient | CanvasPattern;
}

/** Alternativa legible a los parámetros posicionales de `addImage`. */
export interface AddImageOptions {
  point: Point;
  width: number;
  height: number;
  borderColor?: string | CanvasGradient | CanvasPattern;
  shadow?: boolean;
  angleLabel?: number;
  distanceLabel?: number;
  text?: string;
}

/** Alternativa legible a los parámetros posicionales de `addMultiplesSides`. */
export interface AddPolygonOptions {
  point: Point;
  sides: number;
  radius: number;
  color?: string | CanvasGradient | CanvasPattern;
  borderColor?: string | CanvasGradient | CanvasPattern;
  angle?: number;
  shadow?: boolean;
}

/** Alternativa legible a los parámetros posicionales de `addConnection`. */
export interface AddConnectionOptions {
  point: Point;
  toPoint: Point;
  color?: string | CanvasGradient | CanvasPattern;
  label?: string;
  shadow?: boolean;
  zOrder?: number;
}
