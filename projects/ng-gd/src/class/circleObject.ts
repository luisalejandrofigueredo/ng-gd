import { ShapeObject } from "./shape-object";
import { distance, getTransformedPoint } from "../trigonometrics";
import { ElementRef } from "@angular/core";
export class CircleObject extends ShapeObject {
    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        throw new Error("Method not implemented.");
    }
    radius = 0;
    borderColor: string | CanvasGradient | CanvasPattern= "";
    constructor(x: number, y: number, radius: number, color?: string | CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern,shadow?:boolean) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.type="circle";
        if (color) {
            this.color = color;
        } else {
            this.color = this.FgColor
        }
        if (borderColor) {
            this.borderColor = borderColor;
        } else {
            this.borderColor = this.FgColor;
        }
        if (shadow) {
            this.shadow=shadow;
        }
    }
    override drawShape(ctx: CanvasRenderingContext2D): void {
        if (this.visible===true){
            if (this.shadow===true){
                ctx.shadowColor = ShapeObject.shadowColor;
                ctx.shadowBlur = 6;
                ctx.shadowOffsetX = 6;
                ctx.shadowOffsetY = 6;
            } else {
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'rgba(0, 0, 0, 0)';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.borderColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }
    override inverseShape(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.BgColor;
        ctx.strokeStyle = this.BgColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    override inPoint(x: number, y: number): boolean {
        if (distance(this.x, this.y, x, y) < this.radius) {
            return true;
        }
        return false;
    }
    override move(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
    override moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
        if (ShapeObject.lastMove.x!==0 && ShapeObject.lastMove.y!==0){
            const deltaX=point.x-ShapeObject.lastMove.x;
            const deltaY=point.y-ShapeObject.lastMove.y;
            this.x+=deltaX;
            this.y+=deltaY;
        }
        ShapeObject.lastMove=point;
    }
}
