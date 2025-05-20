import { ShapeObject } from "./shape-object";
import { LabelObject } from "../class/label-object";
import { distance, toRadians, toDegrees, move, fillCircle, getTransformedPoint, angle, offSet } from "../trigonometrics";
import { ElementRef } from "@angular/core";
export class NodeObject extends ShapeObject {
    description!: string;
    net: boolean = false;
    angleLabel: number = 0;
    distanceLabel: number = 10;
    radius: number = 40;
    shape = 0;
    labelObject = new LabelObject(0, 0, "");
    constructor(x: number, y: number, name: string, radius: number, description?: string, net?: boolean, angleLabel?: number, distanceLabel?: number, shadow?: boolean, color?: string | CanvasGradient | CanvasPattern) {
        super();
        this.x = x;
        this.y = y;
        this.name = name;
        this.type = 'node';
        this.dataBaseId = "";
        this.radius = radius;
        this.labelObject.x = x;
        this.labelObject.y = y;
        this.labelObject.text = name;
        if (description) {
            this.description = description;
        }
        if (net) {
            this.net = net;
        }
        if (angleLabel) {
            this.angleLabel = angleLabel;
        }
        if (distanceLabel) {
            this.distanceLabel = distanceLabel;
        }
        if (shadow) {
            this.shadow = shadow;
        }
        if (color) {
            this.color = color;
        }
    }

    moveMouseText(ctx: CanvasRenderingContext2D, event: MouseEvent) {
        const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
        this.labelObject.moveMouse(ctx, event)
        this.distanceLabel = distance(this.x, this.y, this.labelObject.x, this.labelObject.y,);
        this.angleLabel = toDegrees(angle(this.x, this.y, this.labelObject.x, this.labelObject.y));
        ShapeObject.lastMove = point;
    }

    override moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent) {
        const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
        if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
            const deltaX = point.x - ShapeObject.lastMove.x;
            const deltaY = point.y - ShapeObject.lastMove.y;
            this.x += deltaX;
            this.y += deltaY;
        }
        ShapeObject.lastMove = point;
    }

    moveTouchText(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent) {
        const varOffSet = offSet(canvas, event);
        const point = getTransformedPoint(ctx, varOffSet.offSetX, varOffSet.offSetY);
        this.labelObject.moveTouch(canvas, ctx, event)
        this.distanceLabel = distance(this.x, this.y, this.labelObject.x, this.labelObject.y,);
        this.angleLabel = toDegrees(angle(this.x, this.y, this.labelObject.x, this.labelObject.y));
        ShapeObject.lastMove = point;
    }

    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        const varOffSet = offSet(canvas, event);
        const point = getTransformedPoint(ctx, varOffSet.offSetX, varOffSet.offSetY);
        if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
            const deltaX = point.x - ShapeObject.lastMove.x;
            const deltaY = point.y - ShapeObject.lastMove.y;
            this.x += deltaX;
            this.y += deltaY;
        }
        ShapeObject.lastMove = point;
    }

    override move(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    override inverseShape(ctx: CanvasRenderingContext2D): void {
        const movePos = move(this.x, this.y, toRadians(this.angleLabel), this.distanceLabel);
        ctx.font = "16px Arial"
        ctx.fillStyle = this.BgColor;
        ctx.strokeStyle = this.BgColor;
        ctx.fillText(this.name, movePos.x, movePos.y);
        fillCircle(ctx, this.x, this.y, this.radius, this.BgColor);
        ctx.lineWidth = 1
    }

    override drawShape(ctx: CanvasRenderingContext2D): void {
        if (this.visible === true) {
            const movePos = move(this.x, this.y, toRadians(this.angleLabel), this.distanceLabel);
            ctx.font = "16px Arial"
            ctx.fillStyle = this.FgColor;
            ctx.strokeStyle = this.FgColor;
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
            fillCircle(ctx, this.x, this.y, this.radius, this.color);
            this.labelObject.x = movePos.x;
            this.labelObject.y = movePos.y;
            this.labelObject.drawShape(ctx);
            ctx.lineWidth = 1
            if (this.net === true) {
                ctx.fillStyle = this.Color;
                ctx.strokeStyle = this.Color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill()
            }
        }
    }

    inPointLabel(x: number, y: number): boolean {
        if (this.labelObject.inPoint(x, y) === true) {
            return true;
        }
        return false;
    }



    override inPoint(x: number, y: number): boolean {
        if (distance(this.x, this.y, x, y) <= this.radius) {
            return true;
        }
        else {
            return false;
        }
    }
}
