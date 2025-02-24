import { ElementRef } from "@angular/core";
import { CommonProperties } from "../interfaces/common-properties";
import { Point } from "../interfaces/point";
export abstract class ShapeObject implements CommonProperties {
  private static maxId: number = -1;
  private static maxZOrder: number = 0;
  private static bgColor:string| CanvasGradient | CanvasPattern = "#ffffff";
  private static fgColor:string | CanvasGradient | CanvasPattern = "#000000";
  public static width = 0;
  public static height = 0;
  public static lastMove:Point={x:0,y:0};
  public static shadowColor:string="#ffffff";
  id: number = 0;
  x = 0;
  y = 0;
  name = '';
  zOrder = 0;
  visible = true;
  dataBaseId="";
  type = '';
  shadowBlur=20;
  shadowOffsetX=20;
  shadowOffsetY=20;
  shadow:boolean=false;
  color: string| CanvasGradient | CanvasPattern="";
  constructor() {
    ShapeObject.maxId++;
    this.id = ShapeObject.maxId;
  }
  abstract drawShape(ctx: CanvasRenderingContext2D): void;
  abstract inverseShape(ctx: CanvasRenderingContext2D): void;
  abstract inPoint(x: number, y: number): boolean;
  abstract move(x:number,y:number):void ;
  abstract moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent):void;
  abstract moveTouch(canvas:ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent):void;
  moveAngle(angle: number, dist: number) {
    this.x = this.x + Math.cos(angle) * dist;
    this.y = this.y + Math.sin(angle) * dist;
  }

  toFront() {
    ShapeObject.maxZOrder++;
    this.zOrder = ShapeObject.maxZOrder;
  }

  toTop() {
    this.zOrder = ShapeObject.maxZOrder;
  }

  toBack() {
    this.zOrder = 0
  }

  nextZOrder() {
    if (this.zOrder < ShapeObject.maxZOrder) {
      this.zOrder++;
    }
  }

  backZOrder() {
    if (this.zOrder > 0) {
      this.zOrder--;
    }
  }

  set Visible(visible: boolean) {
    this.visible = visible;
  }

  get Visible() {
    return this.visible;
  }

  set Color(color: string| CanvasGradient | CanvasPattern) {
    this.color = color;
  }

  get Color() {
    return this.color;
  }

  get Name() {
    return this.name;
  }

  set Name(name: string) {
    this.name = name;
  }

  get BgColor() {
    return ShapeObject.bgColor;
  }

  set BgColor(color: string| CanvasGradient | CanvasPattern) {
    ShapeObject.bgColor = color;
  }

  get FgColor() {
    return ShapeObject.fgColor;
  }

  set FgColor(color: string| CanvasGradient | CanvasPattern) {
    ShapeObject.fgColor = color;
  }

  get shadowColor() {
    return ShapeObject.shadowColor;
  }

  set shadowColor(color: string) {
    ShapeObject.shadowColor = color;
  }

  resetMouse(){
    ShapeObject.lastMove={x:0,y:0};
  }
}
