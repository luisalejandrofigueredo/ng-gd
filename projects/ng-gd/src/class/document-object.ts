import { ElementRef } from "@angular/core";
import { ShapeObject } from "./shape-object";


export class DocumentObject extends ShapeObject {
    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        throw new Error("Method not implemented.");
    }

    constructor(width: number, height: number) {
        super();
        ShapeObject.width = width;
        ShapeObject.height = height;
        this.type = "Document"
        this.zOrder = 0;
    }
    override drawShape(ctx: CanvasRenderingContext2D): void {
    }
    inverseShape(ctx: CanvasRenderingContext2D): void {
    }
    override inPoint(x: number, y: number): boolean {
        return false;
    }
    override move(x: number, y: number): void {
    }
    moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    }
    setSize(width: number, height: number) {
        ShapeObject.width = width;
        ShapeObject.height = height;
    }
}
