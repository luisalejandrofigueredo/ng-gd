import { ShapeObject } from "./shape-object";
import { toRadians, isPointInsideRectangle, rectangle, getTransformedPoint, distance, angle, move ,offSet} from "../trigonometrics";
import { Rectangle } from "../interfaces/rectangle";
import { Point } from "../interfaces/point";
import { ElementRef } from "@angular/core";

export class LabelObject extends ShapeObject {

    angle: number = 0;
    fontSize = 16;
    text: string = "select label text";
    sizeText = 0;
    public font="Arial";
    constructor(x: number, y: number, text: string, fontSize?: number, angle?: number,shadow?:boolean) {
        super()
        this.color=this.FgColor;
        this.x = x;
        this.y = y;
        this.type = 'label';
        this.text = text;
        if (fontSize) {
            this.fontSize = fontSize;
        }
        if (angle) {
            this.setAngleInGrades(angle);
        }
        if (shadow) {
            this.shadow=shadow;
        }
    }
    override moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent) {
        const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
        if (ShapeObject.lastMove.x!==0 && ShapeObject.lastMove.y!==0){
            const deltaX=point.x-ShapeObject.lastMove.x;
            const deltaY=point.y-ShapeObject.lastMove.y;
            this.x+=deltaX;
            this.y+=deltaY;
        }
        ShapeObject.lastMove=point;
    }

    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        const varOffSet=offSet(canvas,event);
        const point = getTransformedPoint(ctx, varOffSet.offSetX, varOffSet.offSetY);
        if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
            const deltaX = point.x - ShapeObject.lastMove.x;
            const deltaY = point.y - ShapeObject.lastMove.y;
            this.x += deltaX;
            this.y += deltaY;
        }
        ShapeObject.lastMove = point;
    }
    override inverseShape(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.BgColor;
        ctx.font = Math.abs(this.fontSize).toString() + "px "+this.font
        this.sizeText = ctx.measureText(this.text).actualBoundingBoxRight+ctx.measureText(this.text).actualBoundingBoxLeft;
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }

    override move(x: number, y: number): void {
        this.x=x;
        this.y=y;
    }
    
    override inPoint(x: number, y: number): boolean {
        const rect = rectangle(this.x,this.y, this.fontSize, this.sizeText, this.angle);
        return isPointInsideRectangle({ x: x, y: y }, rect.first, rect.second, rect.third, rect.forth);
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
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = this.color;
            ctx.font = Math.abs(this.fontSize).toString() + "px "+this.font
            this.sizeText = ctx.measureText(this.text).actualBoundingBoxRight+ctx.measureText(this.text).actualBoundingBoxLeft;
            ctx.font
            ctx.fillText(this.text, 0, 0);
            ctx.restore();
        }
    }

    getSizeText(ctx:CanvasRenderingContext2D):number{
        this.sizeText = ctx.measureText(this.text).actualBoundingBoxRight+ctx.measureText(this.text).actualBoundingBoxLeft;
        return this.sizeText;
    }

    setAngleInGrades(grades: number) {
        this.angle = toRadians(grades);
    }

    set Font(font:string) {
        this.font = font;
      }
    
    get Font(): string {
        return this.font;
      }
    
}
