import { ElementRef } from '@angular/core';
import { ShapeObject } from './shape-object'
import { angle, distance, getTransformedPoint, isPointInsideRectangle, move, offSet, rectangle, toDegrees, toRadians } from "../trigonometrics";
import { LabelObject } from "../class/label-object";
export class ImageObject extends ShapeObject {
    angle = 0;
    borderColor: string | CanvasGradient | CanvasPattern = "#ffffff";
    height = 10;
    width = 10;
    image: string = '';
    labelObject = new LabelObject(0, 0, "");
    angleLabel: number = 0;
    distanceLabel: number = 10
    imageBuffer: HTMLImageElement = new Image();
    
    constructor(x: number, y: number, width: number, height: number, borderColor?: string | CanvasGradient | CanvasPattern, shadow?: boolean, angleLabel?: number, distanceLabel?: number, text?: string) {
        super();
        this.type = 'image';
        this.color = "rgba(0,0,0,1)";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        if (typeof angle === "number") {
            this.angle = angle;
        }
        if (borderColor) {
            this.borderColor = borderColor;
        }
        if (shadow) {
            this.shadow = shadow;
        }
        if (typeof angleLabel === "number") {
            this.angleLabel = angleLabel;
        }
        if (typeof distanceLabel === "number") {
            this.distanceLabel = distanceLabel;
        }
        if (text) {
            this.labelObject.text = text;
        }
    }

    async loadImageFromUrl(url: string): Promise<HTMLImageElement> {
        try {
            const img = await this.loadImage(url);
             this.imageBuffer = img;
            return this.imageBuffer;
        } catch (error: any) {
            console.error(`Error loading image: ${error.message}`);
            return new Image(); // Devuelve una imagen vacía en caso de error
        }
    }

   loadImage(url:string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src= url;
        img.onload = () => resolve(img); // Resuelve la Promise con el objeto Image cuando carga
        img.onerror = (error) => reject(new Error(`Failed to load image at ${url}:`)); // Rechaza si hay un error
    });
}

    override drawShape(ctx: CanvasRenderingContext2D): void {
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
        const imageAngle = toRadians(this.angle);
        const centerX = rect.forth.x;
        const centerY = rect.forth.y;
        ctx.rotate(imageAngle);
        ctx.drawImage(this.imageBuffer, centerX, centerY, this.width, this.height);
        ctx.rotate(-imageAngle);
        const movePos = move(this.x, this.y, toRadians(this.angleLabel), this.distanceLabel);
        this.labelObject.x = movePos.x;
        this.labelObject.y = movePos.y;
        this.labelObject.drawShape(ctx);
    }

    moveMouseText(ctx: CanvasRenderingContext2D, event: MouseEvent) {
        const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
        this.labelObject.moveMouse(ctx, event)
        this.distanceLabel = distance( this.x, this.y,this.labelObject.x, this.labelObject.y,);
        this.angleLabel = toDegrees(angle( this.x, this.y,this.labelObject.x, this.labelObject.y));
        ShapeObject.lastMove = point;
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
    
    inPointLabel(x: number, y: number): boolean {
        if (this.labelObject.inPoint(x, y) === true) {
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

    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        const touch = event.touches[0];
        const rect = canvas.nativeElement.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        const point = getTransformedPoint(ctx, offsetX, offsetY);
        this.move(point.x, point.y);
    }
    
    moveTouchText(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent) {
        const varOffSet = offSet(canvas, event);
        const point = getTransformedPoint(ctx, varOffSet.offSetX, varOffSet.offSetY);
        this.labelObject.moveTouch(canvas, ctx, event)
        this.distanceLabel = distance(this.x, this.y, this.labelObject.x, this.labelObject.y,);
        this.angleLabel = toDegrees(angle(this.x, this.y, this.labelObject.x, this.labelObject.y));
        ShapeObject.lastMove = point;
    }
}
