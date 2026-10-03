import { ShapeObject } from "./shape-object";
import { LabelObject } from "./label-object";
import { Point } from "../interfaces/point";
import { toRadians, angle, move, rectangle, distance, fillCircle, getNewParallelPoint, rotateText, isPointInsideRectangle, translateLineToNewPosition, getTransformedPoint, moveLineToPoint } from "../trigonometrics";
import { ElementRef } from "@angular/core";
/**
 * Desvío en grados de los extremos recortados respecto al eje entre nodos
 * (origen +4°, destino −4°): la línea dibujada, sus puntos de agarre y su
 * área de selección no quedan exactamente sobre el eje, con un poco de aire.
 */
const ENDPOINT_SKEW_GRADES = 4;
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
  /**
   * Recorte en px desde el centro de cada nodo hasta donde arranca/termina
   * la línea (por defecto 30, como en versiones anteriores). Permite que la
   * conexión apoye en el borde cuando los nodos cambian de tamaño.
   */
  fromTrim: number = 30;
  toTrim: number = 30;
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

  /**
   * Extremos recortados de la línea, medidos con fromTrim/toTrim desde el
   * centro de cada nodo. Con `skewed` se aplica el desvío de
   * ENDPOINT_SKEW_GRADES (dibujo y testeo); sin él van sobre el eje.
   */
  getTrimmedEndpoints(skewed: boolean): { from: Point; to: Point } {
    const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
    const toNodeAngle = angle(this.toX, this.toY, this.x, this.y);
    const skew = skewed ? ENDPOINT_SKEW_GRADES : 0;
    return {
      from: move(this.x, this.y, nodeAngle + toRadians(skew), this.fromTrim),
      to: move(this.toX, this.toY, toNodeAngle + toRadians(-skew), this.toTrim),
    };
  }

  /**
   * Posición de la etiqueta sobre el segmento visible: punto medio más
   * `align`, al costado `distance` (lado opuesto si está espejada).
   */
  getLabelPosition(): Point {
    const ends = this.getTrimmedEndpoints(true);
    const distPara = distance(ends.from.x, ends.from.y, ends.to.x, ends.to.y);
    const parallel = this.mirrorLabel === false ? this.distance : -this.distance;
    return getNewParallelPoint(ends.from.x, ends.from.y, ends.to.x, ends.to.y, distPara / 2 + this.align, parallel);
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
      const ends = this.getTrimmedEndpoints(true);
      const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
      const dist = distance(ends.from.x, ends.from.y, ends.to.x, ends.to.y);
      const rect = rectangle(ends.from.x, ends.from.y, 2, dist, nodeAngle);
      ctx.beginPath();
      ctx.moveTo(rect.first.x, rect.first.y);
      ctx.lineTo(rect.second.x, rect.second.y);
      ctx.lineTo(rect.third.x, rect.third.y);
      ctx.lineTo(rect.forth.x, rect.forth.y);
      ctx.lineTo(rect.first.x, rect.first.y);
      ctx.fill();
      fillCircle(ctx, ends.from.x, ends.from.y, 4, this.BgColor);
      fillCircle(ctx, ends.to.x, ends.to.y, 4, this.BgColor);
      const textPosition = this.getLabelPosition();
      const angleC = angle(ends.from.x, ends.from.y, ends.to.x, ends.to.y);
      if (this.mirrorLabel === false) {
        rotateText(ctx, this.name + 'U+1F51D', textPosition.x, textPosition.y, angleC, this.BgColor, 16);
      } else {
        rotateText(ctx, this.name + 'U+1F51D', textPosition.x, textPosition.y, angleC + Math.PI, this.BgColor, 16);
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
    const ends = this.getTrimmedEndpoints(true);
    if (distance(x, y, ends.from.x, ends.from.y) <= 4) {
      return true;
    }
    if (distance(x, y, ends.to.x, ends.to.y) <= 4) {
      return true;
    }
    const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
    const rectangleArea = rectangle(ends.from.x, ends.from.y, 2, distance(ends.from.x, ends.from.y, ends.to.x, ends.to.y), nodeAngle)
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
    let moveNode = move(this.x, this.y, nodeAngle + toRadians(ENDPOINT_SKEW_GRADES), this.fromTrim);
    let moveToNode = move(this.toX, this.toY, toNodeAngle + toRadians(-ENDPOINT_SKEW_GRADES), this.toTrim);
    const rectangleArea = rectangle(moveNode.x, moveNode.y, 2, distance(moveNode.x, moveNode.y, moveToNode.x, moveToNode.y), nodeAngle)
    if (isPointInsideRectangle({ x: x, y: y }, rectangleArea.first, rectangleArea.second, rectangleArea.third, rectangleArea.forth)) {
      return true;
    }
    return false;
  }

  inPointXY(x: number, y: number): boolean {
    const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
    let moveNode = move(this.x, this.y, nodeAngle + toRadians(ENDPOINT_SKEW_GRADES), this.fromTrim);
    if (distance(x, y, moveNode.x, moveNode.y) <= 4) {
      return true;
    }
    return false;
  }

  inPointToXY(x: number, y: number): boolean {
    const toNodeAngle = angle(this.toX, this.toY, this.x, this.y);
    let moveToNode = move(this.toX, this.toY, toNodeAngle + toRadians(-ENDPOINT_SKEW_GRADES), this.toTrim);
    if (distance(x, y, moveToNode.x, moveToNode.y) <= 4) {
      return true;
    }
    return false;
  }

  override drawShape(ctx: CanvasRenderingContext2D): void {
    if (this.visible === true) {
      this.applyShadow(ctx);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      const ends = this.getTrimmedEndpoints(true);
      const nodeAngle = angle(this.x, this.y, this.toX, this.toY);
      const dist = distance(ends.from.x, ends.from.y, ends.to.x, ends.to.y);
      const rect = rectangle(ends.from.x, ends.from.y, 2, dist, nodeAngle);
      ctx.beginPath();
      ctx.moveTo(rect.first.x, rect.first.y);
      ctx.lineTo(rect.second.x, rect.second.y);
      ctx.lineTo(rect.third.x, rect.third.y);
      ctx.lineTo(rect.forth.x, rect.forth.y);
      ctx.lineTo(rect.first.x, rect.first.y);
      ctx.fill();
      fillCircle(ctx, ends.from.x, ends.from.y, 4, this.color);
      fillCircle(ctx, ends.to.x, ends.to.y, 4, this.color);
      const angleC = angle(ends.from.x, ends.from.y, ends.to.x, ends.to.y);
      const textPosition = this.getLabelPosition();
      if (this.mirrorLabel === false) {
        if (this.arrow===true){
          this.labelObject.text=this.name+"\u2192";
        } else {
          this.labelObject.text=this.name;
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
        } else {
          this.labelObject.text=this.name;
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
