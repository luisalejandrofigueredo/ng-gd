import { ElementRef } from "@angular/core";
import { Candlestick } from "../interfaces/candle-stick ";
import { Point } from "../interfaces/point";
import { getTransformedPoint, isPointInsideRectangle, rectangle } from "../trigonometrics";
import { ShapeObject } from "./shape-object";
export class CandlestickObject extends ShapeObject {
    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        const touch = event.touches[0];
        const rect = canvas.nativeElement.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        const point = getTransformedPoint(ctx, offsetX, offsetY);
        this.move(point.x, point.y);
    }
    private stick: Candlestick = { timestamp: 0, open: 0, close: 0, high: 0, low: 0 }
    bullColor: string | CanvasGradient | CanvasPattern = "#ff0000";
    bearColor: string | CanvasGradient | CanvasPattern = "#0000ff";
    candleWidth: number = 0;
    candleHeight: number = 0;
    constructor(position: Point, candleStick: Candlestick, width: number, height: number, bullColor: string | CanvasGradient | CanvasPattern, bearColor: string | CanvasGradient | CanvasPattern,shadow?:boolean) {
        super();
        this.stick = candleStick;
        this.x = position.x;
        this.y = position.y;
        this.candleWidth = width;
        this.candleHeight = height;
        this.type = "candleStick";
        this.bullColor = bullColor;
        this.bearColor = bearColor;
        if (this.stick.open > this.stick.close) {
            this.color = this.bullColor
        } else {
            this.color = this.bearColor;
        }
        if (this.stick.open < this.stick.close) {
            [this.stick.open, this.stick.close] = this.swap(this.stick.open, this.stick.close);
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
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            const wickDownStart = this.getCanvasPosition(this.candleWidth / 2, this.stick.close, this.x, this.y, this.candleWidth, this.candleHeight);
            const wickDownEnd = this.getCanvasPosition(this.candleWidth / 2, this.stick.low, this.x, this.y, this.candleWidth, this.candleHeight);
            ctx.moveTo(wickDownStart.x, wickDownStart.y);
            ctx.lineTo(wickDownEnd.x, wickDownEnd.y);
            ctx.stroke();
            const point = this.getCanvasPosition(0, this.stick.close, this.x, this.y, this.candleWidth, this.candleHeight);
            const point2 = this.getCanvasPosition(this.candleWidth, this.stick.open, this.x, this.y, this.candleWidth, this.candleHeight);
            ctx.rect(point.x, point.y, point2.x - point.x, point2.y - point.y);
            ctx.stroke();
            ctx.fill();
            const wickUpStart = this.getCanvasPosition(this.candleWidth / 2, this.stick.open, this.x, this.y, this.candleWidth, this.candleHeight);
            const wickUpEnd = this.getCanvasPosition(this.candleWidth / 2, this.stick.high, this.x, this.y, this.candleWidth, this.candleHeight);
            ctx.moveTo(wickUpStart.x, wickUpStart.y);
            ctx.lineTo(wickUpEnd.x, wickUpEnd.y);
            ctx.stroke();
        }
    }

    override inverseShape(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.fillStyle = this.BgColor;
        ctx.strokeStyle = this.BgColor;
        const wickDownStart = this.getCanvasPosition(this.candleWidth / 2, this.stick.close, this.x, this.y, this.candleWidth, this.candleHeight);
        const wickDownEnd = this.getCanvasPosition(this.candleWidth / 2, this.stick.low, this.x, this.y, this.candleWidth, this.candleHeight);
        ctx.moveTo(wickDownStart.x, wickDownStart.y);
        ctx.lineTo(wickDownEnd.x, wickDownEnd.y);
        ctx.stroke();
        const point = this.getCanvasPosition(0, this.stick.close, this.x, this.y, this.candleWidth, this.candleHeight);
        const point2 = this.getCanvasPosition(this.candleWidth, this.stick.open, this.x, this.y, this.candleWidth, this.candleHeight);
        ctx.rect(point.x, point.y, point2.x - point.x, point2.y - point.y);
        ctx.stroke();
        ctx.fill();
        const wickUpStart = this.getCanvasPosition(this.candleWidth / 2, this.stick.open, this.x, this.y, this.candleWidth, this.candleHeight);
        const wickUpEnd = this.getCanvasPosition(this.candleWidth / 2, this.stick.high, this.x, this.y, this.candleWidth, this.candleHeight);
        ctx.moveTo(wickUpStart.x, wickUpStart.y);
        ctx.lineTo(wickUpEnd.x, wickUpEnd.y);
        ctx.stroke();
    }

    override inPoint(x: number, y: number): boolean {
        const point = this.getCanvasPosition(0, this.stick.low, this.x, this.y, this.candleWidth, this.candleHeight);
        const point2 = this.getCanvasPosition(this.candleWidth, this.stick.high, this.x, this.y, this.candleWidth, this.candleHeight);
        const rect = rectangle(point.x, point.y, point.y - point2.y, point2.x - point.x, 0);
        if (isPointInsideRectangle({ x: x, y: y }, rect.first, rect.second, rect.third, rect.forth)) {
            return true
        }
        return false
    }
    override move(x: number, y: number): void {
        this.x = x,
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

    swap(a: number, b: number): [number, number] {
        const c = b;
        b = a;
        a = c;
        return [a, b]
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

    set candleStick(candleStick: Candlestick) {
        this.stick = candleStick;
        if (this.stick.open > this.stick.close) {
            this.color = this.bullColor
        } else {
            this.color = this.bearColor;
        }
        if (this.stick.open < this.stick.close) {
            [this.stick.open, this.stick.close] = this.swap(this.stick.open, this.stick.close);
        }
    }
}

