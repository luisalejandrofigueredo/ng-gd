export interface CommonProperties {
    x: number;
    y: number;
    name: string;
    zOrder: number;
    color: string | CanvasGradient | CanvasPattern;
    visible: boolean;
    toX?:number;
    toY?:number;
}
