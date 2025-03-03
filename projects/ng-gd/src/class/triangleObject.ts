import { angle, distance, getTransformedPoint, isPointInTriangle, move } from '../trigonometrics';
import { ShapeObject } from './shape-object'
import { Point } from '../interfaces/point';
import { ElementRef } from '@angular/core';
interface vector {
    angle: number,
    distance: number
}
export class TriangleObject extends ShapeObject {
    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        const touch = event.touches[0];
        const rect = canvas.nativeElement.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        const point = getTransformedPoint(ctx, offsetX, offsetY);
        this.move(point.x, point.y);
    }
    second: Point = { x: 0, y: 0 };
    third: Point = { x: 0, y: 0 };
    borderColor: string | CanvasGradient | CanvasPattern = "";
    constructor(first: Point, second: Point, third: Point, color?: string | CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern, shadow?: boolean) {
        super();
        this.x = first.x;
        this.y = first.y;
        this.second = second;
        this.third = third;
        this.type = "triangle";
        if (color) {
            this.color = color;
        } else {
            this.color = this.FgColor;
        }
        if (borderColor) {
            this.borderColor = borderColor;
        } else {
            this.borderColor = this.BgColor;
        }
        if (shadow) {
            this.shadow = shadow;
        }
    }
    override drawShape(ctx: CanvasRenderingContext2D): void {
        if (this.visible === true) {
            if (this.shadow === true) {
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
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.second.x, this.second.y);
            ctx.lineTo(this.third.x, this.third.y);
            ctx.lineTo(this.x, this.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    override inverseShape(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.BgColor;
        ctx.strokeStyle = this.BgColor;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.second.x, this.second.y);
        ctx.lineTo(this.third.x, this.third.y);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    override inPoint(x: number, y: number): boolean {
        if (isPointInTriangle({ x: this.x, y: this.y }, this.second, this.third, { x: x, y: y })) {
            return true
        }
        return false;
    }
    override move(x: number, y: number): void {
        this.moveTriangle({ x: x, y: y });
        this.x = x;
        this.y = y;
    }
    override moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
        if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
            const deltaX = point.x - ShapeObject.lastMove.x;
            const deltaY = point.y - ShapeObject.lastMove.y;
            this.moveTriangle({ x: this.x + deltaX, y: this.y + deltaY });
            this.x += deltaX;
            this.y += deltaY;
        }
        ShapeObject.lastMove = point;
    }
    moveTriangle(point: Point) {
        const secondPoint: vector = { distance: distance(this.x, this.y, this.second.x, this.second.y), angle: angle(this.x, this.y, this.second.x, this.second.y) };
        const thirdPoint: vector = { distance: distance(this.x, this.y, this.third.x, this.third.y), angle: angle(this.x, this.y, this.third.x, this.third.y) };
        this.second = move(point.x, point.y, secondPoint.angle, secondPoint.distance);
        this.third = move(point.x, point.y, thirdPoint.angle, thirdPoint.distance);
    }

}
