import { ElementRef, Injectable } from '@angular/core';
import { ShapeObject } from "../class/shape-object";
import { Point } from "../interfaces/point";
import { NodeObject } from '../class/node-object';
import { ConnectionObject } from '../class/connection-object';
import { LabelObject } from '../class/label-object';
import { angle, convertArray, distance, getTransformedPoint, map, move, toDegrees, toRadians } from '../trigonometrics';
import { DocumentObject, LineObject } from '../public-api';
import { RectangleObject } from '../class/rectangleObject';
import { ImageObject } from "../class/image-object";
import { CircleObject } from '../class/circleObject';
import { TriangleObject } from '../class/triangleObject';
import { MultiplesSidesObject } from '../class/multiplesSides';
import { ArcObject } from '../class/arcObject'
import { LineChartObject } from '../class/lineChartObject'
import { Candlestick } from "../interfaces/candle-stick ";
import { CandlestickObject } from "../class/Candlestick";
import { CollateralObject } from '../class/collateral';
@Injectable({
  providedIn: 'root'
})
export class NgGdService {
  canvasObjects: any[] = [];
  width = 800;
  height = 600;
  bkColor: string = "#000000";
  frColor: string = "#ffffff";
  clicks: { shape: ShapeObject, action: string }[] = [];
  constructor() { }

  renumberZOrder() {
    const ret = convertArray(this.canvasObjects.sort((a, b) => a.zOrder - b.zOrder) as ShapeObject[]);
    for (let index = 0; index < ret.length; index++) {
      const element = ret[index];
      (this.canvasObjects[index] as ShapeObject).zOrder = element;
    }
  }

  start(width: number, height: number) {
    if (this.canvasObjects.length === 0) {
      this.canvasObjects.push(new DocumentObject(width, height));
    } else {
      (this.getItem(0) as unknown as DocumentObject).setSize(width, height);
    }
  }

  getLabels(): LabelObject[] {
    let labels: LabelObject[] = [];
    this.canvasObjects.forEach(element => {
      if (element instanceof LabelObject) {
        labels.push(element)
      }
    });
    return labels;
  }


  getConnections(): ConnectionObject[] {
    let connections: ConnectionObject[] = [];
    this.canvasObjects.forEach(element => {
      if (element instanceof ConnectionObject) {
        connections.push(element)
      }
    });
    return connections;
  }

  getNodes(): NodeObject[] {
    let nodes: NodeObject[] = [];
    this.canvasObjects.forEach(element => {
      if (element instanceof NodeObject) {
        nodes.push(element)
      }
    });
    return nodes;
  }

  castingMultiplesSides(id: number): MultiplesSidesObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.id === id) {
        if (!(element instanceof MultiplesSidesObject)) {
          console.log('Error type in casting rectangle id:%s as type:%s', id, element.type)
        }
        return element as MultiplesSidesObject;
      }
    }
    return <MultiplesSidesObject>{}
  }

  castingLine(id: number): LineObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.id === id) {
        if (!(element instanceof LineObject)) {
          console.log('Error type in casting rectangle id:%d as type %s', id, element.type)
        }
        return element as LineObject;
      }
    }
    return <LineObject>{}
  }


  castingRectangle(id: number): RectangleObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.id === id) {
        if (!(element instanceof RectangleObject)) {
          console.log('Error type in casting rectangle id:%d as type %s', id, element.type)
        }
        return element as RectangleObject;
      }
    }
    return <RectangleObject>{}
  }

  castingCircle(id: number): CircleObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.id === id) {
        if (!(element instanceof CircleObject)) {
          console.log('Error type in casting circle id:&d as type %s', id, element.type)
        }
        return element as CircleObject;
      }
    }
    return <CircleObject>{}
  }

  castingNode(id: number): NodeObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.id === id) {
        if (!(element instanceof NodeObject)) {
          console.log('Error type in casting node id:%d as type:%s', id, element.type)
        }
        return element as NodeObject;
      }
    }
    return <NodeObject>{}
  }

  castingLabel(id: number): LabelObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.id === id) {
        if (!(element instanceof LabelObject)) {
          console.log('Error type in casting label id:%d as type:%s', id, element.type);
        }
        return element as LabelObject;
      }
    }
    return <LabelObject>{}
  }

  castingConnection(id: number): ConnectionObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.id === id) {
        if (!(element instanceof ConnectionObject)) {
          console.log('Error type in casting connection id:%d, as type:%s ', id, element.type);
        }
        return element as ConnectionObject;
      }
    }
    return <ConnectionObject>{}
  }

  casting(id: number): ConnectionObject | NodeObject | LabelObject | ShapeObject | RectangleObject | CircleObject | TriangleObject | MultiplesSidesObject | LineObject | undefined {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      if (this.canvasObjects[index].id === id) {
        return this.canvasObjects[index];
      }
    }
    return undefined;
  }

  getMousePoint(ctx: CanvasRenderingContext2D, x: number, y: number): Point {
    return getTransformedPoint(ctx, x, y);
  }

  setDarkMode() {
    this.bkColor = "#000000";
    this.frColor = "#ffffff";
    this.getItem(0).BgColor = this.bkColor;
    this.getItem(0).FgColor = this.frColor;
    this.getItem(0).shadowColor = this.frColor;
  }

  setLightMode() {
    this.bkColor = "#ffffff";
    this.frColor = "#000000";
    this.getItem(0).BgColor = this.bkColor;
    this.getItem(0).FgColor = this.frColor;
    this.getItem(0).shadowColor = this.frColor;
  }

  canvasSetSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  resetMouse() {
    (this.canvasObjects[0] as ShapeObject).resetMouse();
  }

  clear(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = this.bkColor;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  findDocument(item: any) {
    return item.type === "Document"
  }

  clearObjects() {
    const document = this.canvasObjects.find(this.findDocument);
    this.canvasObjects = [];
    ShapeObject.resetIds();
    if (document !== undefined) {
      this.canvasObjects.push(document);
    }
  }

  addCollateral(from: Point, to: Point, node: Point) {
    const newCollateral = new CollateralObject(from, to, node);
    this.canvasObjects.push(<ShapeObject>newCollateral);
    return newCollateral;
  }

  addLineChart(point: Point, values: number[], dist: number, color: string | CanvasGradient | CanvasPattern, marks?: boolean, shadow?: boolean): LineChartObject {
    const newLineChart = new LineChartObject(point, values, dist, color, marks, shadow);
    this.canvasObjects.push(<ShapeObject>newLineChart);
    return newLineChart;
  }

  addPieChart(ctx: CanvasRenderingContext2D, point: Point, size: number, values: number[], color: (string | CanvasGradient | CanvasPattern)[], distance: number, start?: number, labels?: string[]) {
    let beginGrade = 0;
    if (start) {
      beginGrade += start;
    }
    for (let index = 0; index < values.length; index++) {
      const newPoint = move(point.x, point.y, toRadians(beginGrade + values[index] / 2), distance)
      this.addArc(newPoint.x, newPoint.y, size, beginGrade, beginGrade + values[index], color[index]);
      beginGrade += values[index];
    }
    if (labels) {
      beginGrade = 0;
      if (start) {
        beginGrade += start;
      }
      for (let index = 0; index < labels.length; index++) {
        const newPoint = move(point.x, point.y, toRadians(beginGrade + values[index] / 2), distance + size + size / 2)
        this.addLabel(newPoint, labels[index], size / 2, 0);
        beginGrade += values[index];
      }
    }
  }

  addGraphBars(ctx: CanvasRenderingContext2D, point: Point, width: number, values: number[], color: string[], distance: number) {
    let pos = 0;
    for (let index = 0; index < values.length; index++) {
      const element = values[index];
      this.addRectangle({ x: point.x + pos, y: point.y }, width, element, 0, color[index], color[index]);
      pos = width * (index + 1) + distance * (index + 1);
    }

  }

  addAxisY(ctx: CanvasRenderingContext2D, point: Point, dist: number, steps: number, labels: string[], fontSize: number, angleGrades?: number, distance?: number, adjustLabel?: Point[], color?: string | CanvasGradient | CanvasPattern, shadow?: boolean) {
    let ang = 0;
    let distance2 = 0;
    let adjust = { x: 0, y: 0 };
    if (angleGrades) {
      ang = angleGrades;
    }
    if (distance) {
      distance2 = distance;
    }
    this.addLine(point, { x: point.x, y: point.y - dist }, steps, color, shadow);
    const increment = dist / steps;
    labels.forEach((element, index) => {
      if (adjustLabel && adjustLabel[index]) {
        adjust = adjustLabel[index];
      }
      else {
        adjust = { x: 0, y: 0 };
      }
      let label = this.addLabel({ x: point.x + adjust.x, y: point.y + fontSize / 2 - increment * index + distance2 + adjust.y }, element, fontSize, ang, shadow);
      const size = label.getSizeText(ctx);
      label.x -= label.getSizeText(ctx) + fontSize;
    });
  }

  addAxisX(ctx: CanvasRenderingContext2D, point: Point, dist: number, steps: number, labels: string[], fontSize: number, angleGrades?: number, distance?: number, adjustLabel?: Point[], color?: string | CanvasGradient | CanvasPattern, shadow?: boolean) {
    let distance2 = 0;
    let ang = 0;
    let adjust = { x: 0, y: 0 };
    if (distance) {
      distance2 = distance;
    }
    if (angleGrades) {
      ang = angleGrades;
    }
    this.addLine(point, { x: point.x + dist, y: point.y }, steps, color, shadow);
    const increment = dist / steps;
    labels.forEach((element, index) => {
      if (adjustLabel && adjustLabel[index]) {
        adjust = adjustLabel[index];
      }
      else {
        adjust = { x: 0, y: 0 };
      }
      let label = this.addLabel({ x: point.x + increment * index + adjust.x, y: point.y + fontSize + distance2 + adjust.y }, element, fontSize, ang, shadow);
      const size = label.getSizeText(ctx);
      label.x += increment / 2 - size;
    });
  }

  addCandleChart(point: Point, candleStick: Candlestick[], width: number, height: number, bullColor: string | CanvasGradient | CanvasPattern, bearColor: string | CanvasGradient | CanvasPattern, distance: number, shadow?: boolean) {
    candleStick.forEach((element, index) => {
      const cPoint: Point = { x: point.x + distance * index, y: point.y };
      const newCandleStick = new CandlestickObject(cPoint, element, width, height, bullColor, bearColor, shadow);
      this.canvasObjects.push(<ShapeObject>newCandleStick);
    });
  }

  addCandleStick(point: Point, candleStick: Candlestick, width: number, height: number, bullColor: string | CanvasGradient | CanvasPattern, bearColor: string | CanvasGradient | CanvasPattern, shadow?: boolean): CandlestickObject {
    const newCandleStick = new CandlestickObject(point, candleStick, width, height, bullColor, bearColor, shadow);
    this.canvasObjects.push(<ShapeObject>newCandleStick);
    return newCandleStick;
  }

  addArc(x: number, y: number, size: number, beginGrades: number, endGrades: number, color?: string | CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern, shadow?: boolean): ArcObject {
    const newArc = new ArcObject(x, y, size, beginGrades, endGrades, color, borderColor, shadow);
    this.canvasObjects.push(<ShapeObject>newArc);
    return newArc;
  }

  addMultiplesSides(point: Point, sides: number, radius: number, color?: string | CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern, angle?: number, shadow?: boolean): MultiplesSidesObject {
    const newMultiplesSides = new MultiplesSidesObject(point.x, point.y, sides, radius, color, borderColor, angle, shadow);
    this.canvasObjects.push(<ShapeObject>newMultiplesSides);
    return newMultiplesSides;
  }

  addTriangle(first: Point, second: Point, third: Point, color?: string | CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern, shadow?: boolean): TriangleObject {
    const newTriangle = new TriangleObject(first, second, third, color, borderColor, shadow);
    this.canvasObjects.push(<ShapeObject>newTriangle);
    return newTriangle;
  }

  addCircle(point: Point, radius: number, color?: string | CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern, shadow?: boolean): CircleObject {
    const newCircle = new CircleObject(point.x, point.y, radius, color, borderColor, shadow);
    this.canvasObjects.push((<ShapeObject>newCircle));
    return newCircle;
  }

  addRectangle(point: Point, width: number, height: number, angle: number, color?: string | CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern, shadow?: boolean): RectangleObject {
    const newRectangle = new RectangleObject(point.x, point.y, width, height, angle, color, borderColor, shadow);
    this.canvasObjects.push((<ShapeObject>newRectangle));
    return newRectangle
  }

  addImage(point: Point, width: number, height: number, borderColor?: string | CanvasGradient | CanvasPattern, shadow?: boolean,angleLabel?:number,distanceLabel?:number,text?:string): ImageObject {
    const newImage = new ImageObject(point.x, point.y, width, height,  borderColor, shadow,angleLabel,distanceLabel,text);
    this.canvasObjects.push((<ShapeObject>newImage));
    return newImage
  }

  addNode(point: Point, name: string, description?: string, net?: boolean, angleLabel?: number, distanceLabel?: number, shadow?: boolean, color?: string | CanvasGradient | CanvasPattern): NodeObject {
    const newNode = new NodeObject(point.x, point.y, name, 20, description, net, angleLabel, distanceLabel, shadow, color);
    this.canvasObjects.push((<ShapeObject>newNode));
    return newNode;
  }

  addConnection(point: Point, toPoint: Point, color?: string | CanvasGradient | CanvasPattern, label?: string, shadow?: boolean, zOrder?: number): ConnectionObject {
    let newConnection = new ConnectionObject(point.x, point.y, toPoint.x, toPoint.y, color, label, shadow, zOrder);
    newConnection.BgColor = this.bkColor;
    newConnection.FgColor = this.frColor
    this.canvasObjects.push((<ShapeObject>newConnection));
    return newConnection;
  }

  addLine(point: Point, toPoint: Point, steps?: number, color?: string | CanvasGradient | CanvasPattern, shadow?: boolean): LineObject {
    const newLine = new LineObject(point.x, point.y, toPoint.x, toPoint.y, steps, color, shadow);
    this.canvasObjects.push((<ShapeObject>newLine));
    return newLine;
  }

  addLabel(point: Point, text: string, fontSize: number, angle: number, shadow?: boolean): LabelObject {
    const newLabel = new LabelObject(point.x, point.y, text, fontSize, angle, shadow);
    this.canvasObjects.push(newLabel)
    return newLabel;
  }

  click(ctx: CanvasRenderingContext2D, event: MouseEvent): { shape: ShapeObject, action: string }[] {
    const currentTransformedCursor = getTransformedPoint(ctx, event.offsetX, event.offsetY);
    this.clicks = this.touch(currentTransformedCursor, ctx);
    return this.clicks;
  }

  tap(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): { shape: ShapeObject, action: string }[] {
    const offSet = this.offSet(canvas, event);
    const currentTransformedCursor = getTransformedPoint(ctx, offSet.offSetX, offSet.offSetY);
    this.clicks = this.touch(currentTransformedCursor, ctx);
    return this.clicks;
  }

  offSet(canvas: ElementRef, event: TouchEvent): { offSetX: number, offSetY: number } {
    const rect = canvas.nativeElement.getBoundingClientRect(); // Obtén la posición del canvas en la ventana
    const touch = event.touches.item(0)!;
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    return { offSetX: offsetX, offSetY: offsetY }
  }

  getClicks() {
    return this.clicks;
  }

  touch(position: Point, ctx?: CanvasRenderingContext2D): { shape: ShapeObject, action: string }[] {
    let onclick: { shape: ShapeObject, action: string }[] = []
    this.canvasObjects.forEach((element) => {
      if (element.type !== 'connection' && element.type !== 'line') {
        if (element.inPoint(position.x, position.y)) {
          onclick.push({ shape: element, action: 'inPoint' });
        }
        if (element.type === 'node') {
          if ((element as NodeObject).inPointLabel(position.x, position.y) === true) {
            onclick.push({ shape: element, action: 'inPointLabel' });
          }
        }
        if (element.type === 'image') {
          if ((element as NodeObject).inPointLabel(position.x, position.y) === true) {
            onclick.push({ shape: element, action: 'inPointLabel' });
          }
        }
      }
      if (element.type === 'connection') {
        if ((element as ConnectionObject).inPointXY(position.x, position.y)) {
          onclick.push({ shape: element, action: 'inPointXY' });
        }
        if ((element as ConnectionObject).inPointToXY(position.x, position.y)) {
          onclick.push({ shape: element, action: 'inPointToXY' });
        }
        if ((element as ConnectionObject).inRectangle(position.x, position.y)) {
          onclick.push({ shape: element, action: 'inRectangle' });
        }
        if ((element as ConnectionObject).inLabel(position.x, position.y)) {
          onclick.push({ shape: element, action: 'inLabel' });
        }
      }
      if (element.type === 'line') {
        if ((element as LineObject).inPointXY(position.x, position.y)) {
          onclick.push({ shape: element, action: 'inPointXY' });
        }
        if ((element as LineObject).inPointToXY(position.x, position.y)) {
          onclick.push({ shape: element, action: 'inPointToXY' });
        }
        if ((element as LineObject).inRectangle(position.x, position.y)) {
          onclick.push({ shape: element, action: 'inRectangle' });
        }
      }
    });
    onclick.sort((a, b) => b.shape.zOrder - a.shape.zOrder);
    return onclick;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.canvasObjects.sort((a, b) => a.zOrder - b.zOrder)
    this.canvasObjects.forEach((element) => {
      element.drawShape(ctx);
    })
  };

  zoomInPoint(ctx: CanvasRenderingContext2D, x: number, y: number, zoom: number) {
    ctx.translate(x, y);
    ctx.scale(zoom, zoom);
    ctx.translate(-x, -y);
  }

  getItem(id: number): ShapeObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.id === id) {
        return element;
      }
    }
    console.log('Error item not found id', id);
    return <ShapeObject>{ id: 0, color: "", name: "error" };
  }

  findLabelByText(text: string): LabelObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.type === 'label' && element.text === text) {
        return element as LabelObject
      }
    }
    console.log('Error no find label:', text);
    return <LabelObject>{}
  }

  findByName(text: string): ArcObject | CandlestickObject | CircleObject | ConnectionObject | LabelObject | LineChartObject | ShapeObject {
    for (let index = 0; index < this.canvasObjects.length; index++) {
      const element = this.canvasObjects[index];
      if (element.name === text) {
        return element
      }
    }
    console.log('Error no find element by name:', text);
    return <ShapeObject>{}
  }

  map(number: number, startInput: number, stopInput: number, startOutput: number, stopOutput: number): number {
    return map(number, startInput, stopInput, startOutput, stopOutput);
  }

  move(point: Point, angle: number, distance: number): Point {
    return move(point.x, point.y, angle, distance);
  }

  toRadians(grades: number): number {
    return toRadians(grades);
  }

  toDegrees(radian: number): number {
    return toDegrees(radian);
  }

  distance(from: Point, to: Point): number {
    return distance(from.x, from.y, to.x, to.y);
  }

  angle(from: Point, to: Point): number {
    return angle(from.x, from.y, to.x, to.y);
  }

}
