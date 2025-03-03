import { ElementRef } from '@angular/core';
import { Point } from '../interfaces/point';
import { move, isPointInTriangle, distance, angle, getTransformedPoint, toRadians } from '../trigonometrics';
import { ShapeObject } from './shape-object'
interface Triangle {
    p1: Point;
    p2: Point;
    p3: Point
}
export class MultiplesSidesObject extends ShapeObject {
    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        const touch = event.touches[0];
        const rect = canvas.nativeElement.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        const point = getTransformedPoint(ctx, offsetX, offsetY);
        this.move(point.x, point.y);
    }
    sides: number = 0;
    radius: number = 0;
    borderColor: string | CanvasGradient | CanvasPattern = ""
    triangles: Triangle[] = [];
    angle = 0;
    constructor(x: number, y: number, sides: number, radius: number, color?: string | CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern, angle?: number, shadow?: boolean) {
        super();
        this.x = x;
        this.y = y;
        this.sides = sides;
        this.radius = radius;
        this.type = "multiplesSides";
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
        if (angle) {
            this.angle = toRadians(angle);

        }
        if (shadow) {
            this.shadow = shadow;
        }
        const radian = 2 * Math.PI / this.sides;
        for (let i = 0; i < this.sides; i++) {
            const secondPoint = move(x, y, i * radian + this.angle, this.radius);
            const thirdPoint = move(x, y, i * radian + radian + this.angle, this.radius);
            this.triangles.push({ p1: { x: x, y: y }, p2: secondPoint, p3: thirdPoint } as Triangle)
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
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.borderColor;
            const length = this.triangles.length;
            this.triangles.forEach((triangle, index) => {
                if (index === 0) {
                    ctx.moveTo(triangle.p2.x, triangle.p2.y);
                }
                if (index < length - 1) {
                    ctx.lineTo(triangle.p3.x, triangle.p3.y);
                } else {
                    ctx.lineTo(this.triangles[0].p2.x, this.triangles[0].p2.y);
                }
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    override inverseShape(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.fillStyle = this.BgColor;
        ctx.strokeStyle = this.BgColor;
        const length = this.triangles.length;
        this.triangles.forEach((triangle, index) => {
            if (index === 0) {
                ctx.moveTo(triangle.p2.x, triangle.p2.y);
            }
            if (index < length - 1) {
                ctx.lineTo(triangle.p3.x, triangle.p3.y);
            } else {
                ctx.lineTo(this.triangles[0].p2.x, this.triangles[0].p2.y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    override inPoint(x: number, y: number): boolean {
        for (let index = 0; index < this.triangles.length; index++) {
            const element = this.triangles[index];
            if (isPointInTriangle(element.p1, element.p2, element.p3, { x: x, y: y })) {
                return true
            }
        }
        return false
    }

    override move(x: number, y: number): void {
        const dist = distance(this.triangles[0].p1.x, this.triangles[0].p1.y, this.triangles[0].p2.x, this.triangles[0].p2.y)
        this.triangles.forEach(element => {
            const ang1 = angle(element.p1.x, element.p1.y, element.p2.x, element.p2.y);
            const ang2 = angle(element.p1.x, element.p1.y, element.p3.x, element.p3.y);
            element.p2 = move(x, y, ang1, dist);
            element.p3 = move(x, y, ang2, dist);
            element.p1 = { x: x, y: y };
        });
        this.x = x;
        this.y = y;
    }

    override moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
        if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
            const deltaX = point.x - ShapeObject.lastMove.x;
            const deltaY = point.y - ShapeObject.lastMove.y;
            this.x += deltaX;
            this.y += deltaY;
            this.move(this.x, this.y);
        }
        ShapeObject.lastMove = point;
    }
}
