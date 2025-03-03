import { ShapeObject } from "./shape-object";
import { distance, move, toRadians, angle, toDegrees, getTransformedPoint } from '../trigonometrics';
import { ElementRef } from "@angular/core";
export class ArcObject extends ShapeObject {
    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        const touch = event.touches[0];
        const rect = canvas.nativeElement.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        const point = getTransformedPoint(ctx, offsetX, offsetY);
        this.move(point.x, point.y);
    }
    size: number = 0;
    beginGrades: number = 0;
    endGrades: number = 0;
    borderColor:string| CanvasGradient | CanvasPattern = "";
    constructor(x: number, y: number, size: number, beginGrades: number, endGrades: number, color?: string| CanvasGradient | CanvasPattern , borderColor?: string| CanvasGradient | CanvasPattern,shadow?:boolean) {
        super();
        this.x = x;
        this.y = y;
        this.size = size;
        this.beginGrades = beginGrades;
        this.endGrades = endGrades;
        this.type = "arc";
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
        if (this.visible === true) {
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
            const beginRadians = toRadians(this.beginGrades);
            const endRadians = toRadians(this.endGrades);
            const line = move(this.x, this.y, beginRadians, this.size);
            ctx.strokeStyle = this.borderColor;
            ctx.fillStyle = this.color;
            ctx.beginPath()
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(line.x, line.y);
            ctx.arc(this.x, this.y, this.size, beginRadians, endRadians);
            ctx.lineTo(this.x, this.y);
            ctx.closePath();
            ctx.fill();
        }
    }
    override inverseShape(ctx: CanvasRenderingContext2D): void {
        const beginRadians = toRadians(this.beginGrades);
        const endRadians = toRadians(this.endGrades);
        const line = move(this.x, this.y, beginRadians, this.size);
        ctx.strokeStyle = this.BgColor;
        ctx.fillStyle = this.BgColor;
        ctx.beginPath()
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(line.x, line.y);
        ctx.arc(this.x, this.y, this.size, beginRadians, endRadians);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fill();
    }
    override inPoint(x: number, y: number): boolean {
        let anglePoint = angle(this.x, this.y, x, y);
        if (anglePoint < 0) {
            anglePoint = Math.PI * 2 + anglePoint;
        }
        if (distance(x, y, this.x, this.y) < this.size && anglePoint >= toRadians(this.beginGrades) && anglePoint <= toRadians(this.endGrades)) {
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
        if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
            const deltaX = point.x - ShapeObject.lastMove.x;
            const deltaY = point.y - ShapeObject.lastMove.y;
            this.x += deltaX;
            this.y += deltaY;
        }
        ShapeObject.lastMove = point;
    }
}

