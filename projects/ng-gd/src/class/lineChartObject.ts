import { ElementRef } from '@angular/core';
import { Point } from '../interfaces/point'
import { angle, distance, drawRectangle, getTransformedPoint, isPointInsideRectangle, move, rectangle } from '../trigonometrics';
import { ShapeObject } from "./shape-object";

export class LineChartObject extends ShapeObject {
    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        throw new Error('Method not implemented.');
    }
    values: number[] = [];
    pointValues: Point[] = [];
    dist: number = 0;
    marks=false;
    constructor(point: Point, values: number[], dist: number, color: string | CanvasGradient | CanvasPattern,marks?:boolean,shadow?:boolean) {
        super();
        this.x = point.x;
        this.y = point.y;
        this.color = color;
        this.values = values;
        this.dist = dist;
        this.type="lineChart"
        this.values.forEach((element, index) => {
            const point = this.getCanvasPosition(this.dist * index, element, this.x, this.y, ShapeObject.width, ShapeObject.height);
            this.pointValues.push(point);
        })
        if (marks){
            this.marks=marks;
        }
        if (shadow) {
            this.shadow=shadow;
        }
    }

    override drawShape(ctx: CanvasRenderingContext2D): void {
        if (this.visible){
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
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.fillStyle=this.color;
            const point = this.pointValues[0];
            ctx.moveTo(point.x, point.y);
            for (let index = 1; index < this.pointValues.length; index++) {
                const pointTo = this.pointValues[index]
                ctx.lineTo(pointTo.x, pointTo.y);
            }
            ctx.stroke();
            if (this.marks===true){
                this.pointValues.forEach((element)=>{
                    const movePoint=move(element.x,element.y,Math.PI/2,1)
                    const rect=rectangle(movePoint.x,movePoint.y,2,2,0);
                    drawRectangle(ctx,rect);
                });
            }
        }
    }

    override inverseShape(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = this.BgColor;
        const point = this.pointValues[0];
        ctx.moveTo(point.x, point.y);
        for (let index = 1; index < this.pointValues.length; index++) {
            const pointTo = this.pointValues[index]
            ctx.lineTo(pointTo.x, pointTo.y);
        }
        ctx.stroke();
        if (this.marks===true){
            this.pointValues.forEach((element)=>{
                const movePoint=move(element.x,element.y,Math.PI/2,1)
                const rect=rectangle(movePoint.x,movePoint.y,2,2,0);
                drawRectangle(ctx,rect);
            });
        }
    }

    override inPoint(x: number, y: number): boolean {
        let point = this.pointValues[0];
        for (let index = 1; index < this.pointValues.length; index++) {
            const pointTo = this.pointValues[index];
            const dist = distance(point.x, point.y, pointTo.x, pointTo.y);
            const ang = angle(point.x, point.y, pointTo.x, pointTo.y)
            const rect = rectangle(point.x, point.y, 2,dist,ang);
            if (isPointInsideRectangle({ x: x, y: y }, rect.first, rect.second, rect.third, rect.forth)) {
                return true;
            }
            point=this.pointValues[index];
        }
        return (false);
    }

    override move(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.pointValues=[];
        this.values.forEach((element, index) => {
            const point = this.getCanvasPosition(this.dist * index, element, this.x, this.y, ShapeObject.width, ShapeObject.height);
            this.pointValues.push(point);
        })
    }

    override moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
        if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
            const deltaX = point.x - ShapeObject.lastMove.x;
            const deltaY = point.y - ShapeObject.lastMove.y;
            this.x += deltaX;
            this.y += deltaY;
            this.pointValues.forEach(element => {
                element.x += deltaX;
                element.y += deltaY;
            });
        }
        ShapeObject.lastMove = point;
    }

    getCanvasPosition(cartesianX: number, cartesianY: number, startX: number, startY: number, width: number, height: number): Point {
        if (cartesianX >= 0 && cartesianX <= width && cartesianY >= 0 && cartesianY <= height) {
            return { x: startX + cartesianX, y: startY - cartesianY }
        } else {
            const scaleX: number = width / (2 * Math.abs(cartesianX));
            const scaleY: number = height / (2 * Math.abs(cartesianY));
            const canvasX: number = startX + (cartesianX * scaleX);
            const canvasY: number = startY - (cartesianY * scaleY);
            return { x: canvasX, y: canvasY };
        }
    }
}
