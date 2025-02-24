import { ShapeObject } from './shape-object'
import { rectangle, isPointInsideRectangle, getTransformedPoint, distance, angle, move, calculateHypotenuse } from "../trigonometrics";
import { Point } from '../interfaces/point';
import { ElementRef } from '@angular/core';
export class RectangleObject extends ShapeObject {
    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        throw new Error('Method not implemented.');
    }
    angle = 0;
    borderColor:string | CanvasGradient | CanvasPattern = "#ffffff";
    height = 10;
    width = 10;
    constructor(x: number, y: number, width: number, height: number, angle?: number, color?: string | CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern,shadow?:boolean) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = "rectangle";
        if (angle) {
            this.angle = angle;
        }
        if (color) {
            this.color = color;
        } else {
            this.color = this.FgColor;
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
        const rect = rectangle(this.x, this.y, this.height, this.width, this.angle);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        ctx.beginPath();
        ctx.moveTo(rect.first.x, rect.first.y);
        ctx.lineTo(rect.second.x, rect.second.y);
        ctx.lineTo(rect.third.x, rect.third.y);
        ctx.lineTo(rect.forth.x, rect.forth.y);
        ctx.lineTo(rect.first.x, rect.first.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    override inverseShape(ctx: CanvasRenderingContext2D): void {
        const rect = rectangle(this.x, this.y, this.height, this.width, this.angle);
        ctx.fillStyle = this.BgColor;
        ctx.strokeStyle = this.BgColor;
        ctx.beginPath();
        ctx.moveTo(rect.first.x, rect.first.y);
        ctx.lineTo(rect.second.x, rect.second.y);
        ctx.lineTo(rect.third.x, rect.third.y);
        ctx.lineTo(rect.forth.x, rect.forth.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    override inPoint(x: number, y: number): boolean {
        const rect = rectangle(this.x, this.y, this.height, this.width, this.angle);
        if (isPointInsideRectangle({ x: x, y: y }, rect.first, rect.second, rect.third, rect.forth)) {
            return true;
        }
        return false
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
