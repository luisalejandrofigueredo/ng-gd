import { ShapeObject } from "./shape-object";
import { LabelObject } from "./label-object";
import { toRadians, angle, move, rectangle, distance, fillCircle, getNewParallelPoint, rotateText, isPointInsideRectangle, translateLineToNewPosition, getTransformedPoint, moveLineToPoint } from "../trigonometrics";
import { ElementRef } from "@angular/core";
export class ConnectionObject extends ShapeObject {
  override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
    const touch = event.touches[0];
    const rect = canvas.nativeElement.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    const point = getTransformedPoint(ctx, offsetX, offsetY);
    this.move(point.x, point.y);
  }
  moveTouchXY(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
    const touch = event.touches[0];
    const rect = canvas.nativeElement.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;  // get offset of the canvas
    const offsetY = touch.clientY - rect.top;  // get offset of the canvas  
    const point = getTransformedPoint(ctx, offsetX, offsetY);
    if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) { 
      const deltaX = point.x - ShapeObject.lastMove.x;
      const deltaY = point.y - ShapeObject.lastMove.y;
      this.x += deltaX;
      this.y += deltaY;
    }
    ShapeObject.lastMove = point;
  }
  moveTouchToXY(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
    const touch = event.touches[0];
    const rect = canvas.nativeElement.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;  // get offset of the canvas
    const offsetY = touch.clientY - rect.top;  // get offset of the canvas
    const point = getTransformedPoint(ctx, offsetX, offsetY);
    if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
      const deltaX = point.x - ShapeObject.lastMove.x;
      const deltaY = point.y - ShapeObject.lastMove.y;
      this.toX += deltaX;
      this.toY += deltaY;
    }
    ShapeObject.lastMove = point;
  }   
  labelObject= new LabelObject(0,0,"");
  toX: number;
  toY: number;
  mirrorLabel: boolean = false;
  align: number = 0;
  distance: number = 20;
  shape = 0;
  arrow=false;
  constructor(x: number, y: number, toX: number, toY: number, color?: string | CanvasGradient | CanvasPattern, name?: string, shadow?: boolean, zOrder?: number,arrow?:boolean) {
    super()
    this.x = x;
    this.y = y;
    this.type = 'connection';
    if (arrow!==undefined){
      this.arrow=arrow;
    }
    if (color !== undefined) {
      this.color = color;
    } else {
      this.color = this.FgColor;
    }
    this.toX = toX;
    this.toY = toY;
    if (name !== undefined) {
      this.name = name;
    }
    if (shadow) {
      this.shadow = shadow;
    }
    if (zOrder) {
      this.zOrder = zOrder;
    }
  }



  set MirrorLabel(mirror: boolean) {
    this.mirrorLabel = mirror
  }

  get MirrorLabel(): boolean {
    return this.mirrorLabel;
  }

  override moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent) {
    const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
    this.move(point.x, point.y);
  }

  moveMouseXY(ctx: CanvasRenderingContext2D, event: MouseEvent) {
    const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
    if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
      const deltaX = point.x - ShapeObject.lastMove.x;
      const deltaY = point.y - ShapeObject.lastMove.y;
      this.x += deltaX;
      this.y += deltaY;
    }
    ShapeObject.lastMove = point;
  }

  moveMouseToXY(ctx: CanvasRenderingContext2D, event: MouseEvent) {
    const point = getTransformedPoint(ctx, event.offsetX, event.offsetY);
    if (ShapeObject.lastMove.x !== 0 && ShapeObject.lastMove.y !== 0) {
      const deltaX = point.x - ShapeObject.lastMove.x;
      const deltaY = point.y - ShapeObject.lastMove.y;
      this.toX += deltaX;
      this.toY += deltaY;
    }
    ShapeObject.lastMove = point;
  }

  override move(x: number, y: number): void {
    if (!(ShapeObject.lastMove.x === 0 && ShapeObject.lastMove.y === 0)) {
      const deltaX = x - ShapeObject.lastMove.x;
      const deltaY = y - ShapeObject.lastMove.y;
      this.x += deltaX;
      this.y += deltaY;
      this.toX += deltaX;
      this.toY += deltaY;
    }
    ShapeObject.lastMove = { x: x, y: y };
  }

  override inverseShape(ctx: CanvasRenderingContext2D): void {
    if (this.visible === true) {
      ctx.fillStyle = this.BgColor;
      ctx.strokeStyle = this.BgColor;
      const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
      const toNodeAngle = angle(this.toX, this.toY, this.x, this.y);
      let moveNode = move(this.x, this.y, nodeAngle, 30);
      let moveToNode = move(this.toX, this.toY, toNodeAngle, 30);
      const dist = distance(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y);
      const rect = rectangle(moveNode.x, moveNode.y, 2, dist, nodeAngle);
      ctx.beginPath();
      ctx.moveTo(rect.first.x, rect.first.y);
      ctx.lineTo(rect.second.x, rect.second.y);
      ctx.lineTo(rect.third.x, rect.third.y);
      ctx.lineTo(rect.forth.x, rect.forth.y);
      ctx.lineTo(rect.first.x, rect.first.y);
      ctx.fill();
      fillCircle(ctx, moveNode.x, moveNode.y, 4, this.BgColor);
      fillCircle(ctx, moveToNode.x, moveToNode.y, 4, this.BgColor);
      const distPara = distance(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y);
      const angleC = angle(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y);
      let textPosition = { x: 0, y: 0 }
      if (this.mirrorLabel === false) {
        textPosition = getNewParallelPoint(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y, distPara / 2 + this.align, this.distance);
      }
      else {
        textPosition = getNewParallelPoint(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y, distPara / 2 + this.align, - this.distance);
      }
      if (this.mirrorLabel === false) {
        rotateText(ctx, this.name + 'U+1F51D', textPosition.x, textPosition.y, angleC, "#000000", 60);
      } else {
        rotateText(ctx, this.name + 'U+1F51D', textPosition.x, textPosition.y, angleC + Math.PI, "#000000", 16);
      }
    }
  }

  moveTo(x: number, y: number) {
    this.toX = x;
    this.toY = y;
  }

  moveToAngle(angle: number, dist: number) {
    this.toX = this.toX + Math.cos(angle) * dist;
    this.toY = this.toY + Math.sin(angle) * dist;
  }

  inLabel(x:number,y:number){
    return this.labelObject.inPoint(x,y);
  }

  override inPoint(x: number, y: number): boolean {
    const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
    const toNodeAngle = angle(this.toX, this.toY, this.x, this.y);
    let moveNode = move(this.x, this.y, nodeAngle + toRadians(4), 30);
    let moveToNode = move(this.toX, this.toY, toNodeAngle + toRadians(-4), 30);
    if (distance(x, y, moveNode.x, moveNode.y) <= 4) {
      return true;
    }
    if (distance(x, y, moveToNode.x, moveToNode.y) <= 4) {
      return true;
    }
    const rectangleArea = rectangle(moveNode.x, moveNode.y, 2, distance(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y), nodeAngle)
    if (isPointInsideRectangle({ x: x, y: y }, rectangleArea.first, rectangleArea.second, rectangleArea.third, rectangleArea.forth)) {
      return true
    }
    if (this.labelObject.inPoint(x,y)===true){
      return true;
    }
    return false;
  }

  inRectangle(x: number, y: number): boolean {
    const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
    const toNodeAngle = angle(this.toX, this.toY, this.x, this.y);
    let moveNode = move(this.x, this.y, nodeAngle + toRadians(4), 40);
    let moveToNode = move(this.toX, this.toY, toNodeAngle + toRadians(-4), 40);
    const rectangleArea = rectangle(moveNode.x, moveNode.y, 2, distance(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y), nodeAngle)
    if (isPointInsideRectangle({ x: x, y: y }, rectangleArea.first, rectangleArea.second, rectangleArea.third, rectangleArea.forth)) {
      return true;
    }
    return false;
  }

  inPointXY(x: number, y: number): boolean {
    const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
    let moveNode = move(this.x, this.y, nodeAngle + toRadians(4), 30);
    if (distance(x, y, moveNode.x, moveNode.y) <= 4) {
      return true;
    }
    return false;
  }

  inPointToXY(x: number, y: number): boolean {
    const toNodeAngle = angle(this.toX, this.toY, this.x, this.y);
    let moveToNode = move(this.toX, this.toY, toNodeAngle + toRadians(-4), 30);
    if (distance(x, y, moveToNode.x, moveToNode.y) <= 4) {
      return true;
    }
    return false;
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
      ctx.strokeStyle = this.color;
      const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
      const toNodeAngle = angle(this.toX, this.toY, this.x, this.y);
      let moveNode = move(this.x, this.y, nodeAngle + toRadians(4), 30);
      let moveToNode = move(this.toX, this.toY, toNodeAngle + toRadians(-4), 30);
      const dist = distance(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y);
      const rect = rectangle(moveNode.x, moveNode.y, 2, dist, nodeAngle);
      ctx.beginPath();
      ctx.moveTo(rect.first.x, rect.first.y);
      ctx.lineTo(rect.second.x, rect.second.y);
      ctx.lineTo(rect.third.x, rect.third.y);
      ctx.lineTo(rect.forth.x, rect.forth.y);
      ctx.lineTo(rect.first.x, rect.first.y);
      ctx.fill();
      fillCircle(ctx, moveNode.x, moveNode.y, 4, this.color);
      fillCircle(ctx, moveToNode.x, moveToNode.y, 4, this.color);
      const distPara = distance(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y);
      const angleC = angle(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y);
      let textPosition = { x: 0, y: 0 }
      if (this.mirrorLabel === false) {
        textPosition = getNewParallelPoint(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y, distPara / 2 + this.align, this.distance);
      }
      else {
        textPosition = getNewParallelPoint(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y, distPara / 2 + this.align, this.distance);
      }
      if (this.mirrorLabel === false) {
        if (this.arrow===true){
          this.labelObject.text=this.name+"\u2192";
        }
        this.labelObject.x=textPosition.x;
        this.labelObject.y=textPosition.y;
        this.labelObject.angle=angleC;
        this.labelObject.Color=this.color;
        this.labelObject.sizeText=16;
        this.labelObject.drawShape(ctx);
      } else {
        if (this.arrow===true){
          this.labelObject.text="\u2190"+this.name;
        }
        this.labelObject.x=textPosition.x;
        this.labelObject.y=textPosition.y;
        this.labelObject.angle=angleC+Math.PI;
        this.labelObject.Color=this.color;
        this.labelObject.sizeText=16;
        this.labelObject.drawShape(ctx)
      }
    }
  }

}
