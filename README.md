# NgGd

The easy way to manage the canvas.
Support object and clicks with mouse or tablet events to the objects
This library was generated with [Angular CLI](https://github.com/angular/angular-cli) Angular 17
**chat GPT implementation in curse.**
If ChatGPT does not recognize the NG-GD library, you can show it to him and he will integrate it into your environment. For this, you must tell him where the library is. https://www.npmjs.com/package/ng-gd then for it to understand you better you must add code from the demos in stack blitz with this cht gpt will understand its operation for you.
Use Code GPT for better answers.
Claude experimental link:https://claude.ai/share/8f2504d1-e6c4-44ba-902a-b2912f4375b1
## Build

Run `ng build ng-gd` to build the lib. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ng-gd`, go to the dist folder `cd dist/ng-gd` and run `npm publish`.

***Features***

🎨 Manage objects in canvas with event detection (clicks, touch, etc.).

📊 Support for bar charts, line charts, and candlestick charts.

🎭 Light and dark mode support.

📌 Event detection and layer management with ZOrder.

🖥️ Optimized for mouse and tablet interactions.


## Versions

| **Library version** | **Angular** |
| ------------------- | ----------- |
| 4.4.6               | 19.14       |
| 4.4.4               | 19.14       |
| 3.0.4               | 19.1.4      |
| 3.0.2               | 18.2        |
| 3.0.0               | 18          |
| 2.0.8               | 17          |
| 2.0.0               | 15, 15.2    |



*Feature new image object.
*Feature shadow in objects.

## Usage

### install the lib

npm i ng-gd

### declare in a module program

```typescript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { NgGdService } from "ng-gd";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [NgGdService],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
or in th component Angula 17 or more
```typescript
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import {  ConnectionObject, LineObject, NgGdService, NodeObject, Point} from "ng-gd";
@Component({
  selector: 'app-ng-gd-component',
  imports: [],
  providers: [NgGdService],
  templateUrl: './ng-gd-component.component.html',
  styleUrl: './ng-gd-component.component.scss'
})
```
### create a canvas in html

```html
<canvas #canvas width="640" height="480"></canvas>
```

### declare vars in your component class and call the lib;

```typescript
import {
  NgGdService,
  Point,
  NodeObject,
} from 'ng-gd';

export class App implements OnInit {
gd = inject(NgGdService);
private ctx!: CanvasRenderingContext2D;
@ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
}

ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.gd.start(640,480);
    this.gd.setDarkMode();
    this.gd.addNode({ x: 150, y: 150 }, "one", "this is the node one", false, 10, 10);
    this.gd.clear(this.ctx);
    this.gd.draw(this.ctx);
}
```

If you have problems with go another page and return use after view init for refresh.

[Demo objects in stackblitz](https://stackblitz.com/edit/angular-ngdemo?file=src%2Fmain.ts)

[Demo charts in stackblitz](https://stackblitz.com/edit/angular-ng-demo-graphics?file=src%2Fmain.ts)

[Demo chart with map function in stackblitz](https://stackblitz.com/edit/angular-ng-demo-graphics-tz8cjy?file=src%2Fmain.ts)

[Demo ZOrder in GitHub](https://github.com/luisalejandrofigueredo/ZOrderDemo)

[Demo ZOrder in stackblitz](https://stackblitz.com/edit/angular-demozorder?file=src%2Fmain.ts)

## List gd service commands

**start(width: number, height: number)** Start gd lib required for start.

**getLabels():** Get all labels.

**findLabelByText(text: string):LabelObject** Get a label for your text.

**findByName(text: string): ArcObject | CandlestickObject | CircleObject | ConnectionObject | LabelObject | LineChartObject | ShapeObject** Find a object by name assign the name of the object first.

**getConnections()** Get all connections.

**getNodes()** Get all nodes.

**castingMultiplesSides(id: number)** Get a multiples sides object with id number.

**castingLine(id:number)** Get a line Object.

**castingRectangle(id: number)** Get a rectangle object.

**castingCircle(id: number)** Get a circle object.

**castingNode(id:number)** Get a node object.

**castingLabel(id: number)** Get a label object.

**castingConnection(id: number)** Get connection object.

**casting(id)** Get a any object with casting.

**getMousePoint(ctx: CanvasRenderingContext2D, x: number, y: number)** Return a position the mouse.

**setDarkMode()** Change the background color to black and ink white.

**setLightMode()** Change the background color to white and ink black.

**canvasSetSize(width: number, height: number)** Change canvas size for the library not the canvas.

**resetMouse()** Reset last position.

**clear(ctx: CanvasRenderingContext2D)** Clear the canvas.

**clearObjects()** Delete all objects in the library.

**addCandleChart(point: Point, candleStick: Candlestick[], width: number, height: number, bullColor: string | CanvasGradient | CanvasPattern, bearColor: string | CanvasGradient | CanvasPattern, distance: number)** Create a candle chart.

**addPieChart(ctx: CanvasRenderingContext2D, point: Point, size: number, values: number[], color: (string | CanvasGradient | CanvasPattern)[], distance: number, start?: number, labels?: string[])** Create a pie chart.

**addGraphBars(ctx: CanvasRenderingContext2D, point: Point, width: number, values: number[], color: (string | CanvasGradient | CanvasPattern)[], distance: number)** Create graph bars.

**addImage(point: Point, width: number, height: number, angle: number, borderColor?string | CanvasGradient | CanvasPattern, shadow?: boolean,angleLabel?:number,distanceLabel?:number,text?:string): ImageObject**

sample use 
let image:ImageObject=this.gd.addImage({x:100,y:100},100,100,0,'rgba(0, 0, 0,1)',true,0,0,'hola mundo');
await image.loadImageFromUrl('tapachica.png');


**addLineChart(point: Point, values: number[], dist: number, color : string| CanvasGradient | CanvasPattern,marks?:boolean): LineChartObject** Create a line for chart.

**addAxisY(ctx: CanvasRenderingContext2D, point: Point, dist: number, steps: number, labels: string[], fontSize: number, angleGrades?: number, distance?: number,adjustLabel?:Point[])** Create a y axis.

**addAxisX(ctx: CanvasRenderingContext2D, point: Point, dist: number, steps: number, labels: string[], fontSize: number, angleGrades?: number, distance?: number,adjustLabel?:Point[])** Create a x axis.

**addCandleStick(point: Point, candleStick: Candlestick, width: number, height: number, bullColor: string | CanvasGradient | CanvasPattern, bearColor: string | CanvasGradient | CanvasPattern): Candle_stick** Create a candle stick.

**addMultiplesSides(point: Point, sides: number, radius: number, color?: string| CanvasGradient | CanvasPattern, borderColor?: string | CanvasGradient | CanvasPattern)** Create a figure with 5 sides minimum.

**addTriangle(first: Point, second: Point, third: Point, color?: string, borderColor?: string,shadow?:boolean)** Create a triangle.

**addCircle(point: Point, radius: number, color?: string, borderColor?: string,shadow?:boolean)** Create a circle.

**addRectangle(point: Point, width: number, height: number, angle:number,color?: string, borderColor?: string,shadow?:boolean)** Create a rectangle.

**addNode(point: Point, name: string, description?: string, net?: boolean, angleLabel?: number, distanceLabel?: number,shadow?:boolean)** Add node.

**addConnection(point: Point, toPoint: Point, color?: string| CanvasGradient | CanvasPattern, label?: string,shadow?:boolean)** Create a connection.

**addLine(point: Point, toPoint: Point, steps?: number, color?:(string| CanvasGradient | CanvasPattern))** Create a line steps mark the line like rule.

**addLabel(point: Point, text: string, fontSize: number, angle: number,shadow?:boolean)** Create a label.

**addArc(x: number, y: number, size: number, beginGrades: number, endGrades: number, color?: string| CanvasGradient | CanvasPattern, borderColor?: string| CanvasGradient | CanvasPattern,shadow?:boolean): ArcObject** Create a arc object

**click(ctx: CanvasRenderingContext2D, event: MouseEvent):{ shape: ShapeObject, action: string }**
** Return a array all objects are clicked with mouse order for ZOrder. **
Possible events off object.
const clickedObjects = ngGdService.click(ctx, event);
console.log(clickedObjects);


## ShapeObject posibles values in type
**label**

**node**

**connection**

**rectangle**

**circle**

**triangle**

**multiplesSides**

**line**

**arc**

**lineChart**

**candleStick**

## inPoint Object are clicked action returned.

### Line and connection private events action returned

**inPointXY Object clicked in first point.**

**inPointToXY Object clicked in second point.**

**inRectangle Object clicked in the line.**

**getClicks()** Return a list created for click function speed reasons.

**draw(ctx: CanvasRenderingContext2D)** Draw all objects.

**zoomInPoint(ctx: CanvasRenderingContext2D, x: number, y: number, zoom: number)** Zoom in x,y position.

**getItem(id:number)** Return a object with casting to ShapeObject.

## Object properties all object are derived the class ShapeObject.

x:position x.
y:position y.

**color** Object color gd support string,patterns or gradients;

**visible** Toggle object to visible you turn false the object not draw.

**type** Variable with string class of the object the easy way to obtain the type class the one object.

**possibles values are**

**label**

**node**

**connection**

**rectangle**

**circle**

**triangle**

**multiplesSides**

**line**

**arc**

**lineChart**

**candleStick**

## Objects common functions

**drawShape(ctx: CanvasRenderingContext2D)** Draw the object in the canvas.

**inverseShape(ctx: CanvasRenderingContext2D)** Draw the object with background color.

**inPoint(x: number, y: number)** Return true if the object is in position x,y.

**move(x:number,y:number)** Move the object to new position.

**moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent)** Move the object to mouse position.

## Additional functions for LineObject and ConnectionObject

**inPointXY(x: number, y: number): boolean** If the mouse is over the first point the line or connection.

**inPointToXY(x: number, y: number): boolean** If the mouse is over the second point the line or connection.

**inRectangle(x: number, y: number): boolean** If the mouse is over the line.

**moveMouseXY(ctx: CanvasRenderingContext2D, event: MouseEvent)** Mouse move the first point to new position.

**moveMouseToXY(ctx: CanvasRenderingContext2D, event: MouseEvent)** Mouse move the second point to new position.

## Objects level

**toFront()** Move the object to fist plane over all objects.

**toTop()** Move the object to first plane.

**toBack()** Move the object to last plane.

**nextZOrder()** Move the object one plane to front.

**backZOrder()** Move the object one plane to back.

Service renumber is for not let plane withouts objects.
for sample .

**this.gd.renumberZOrder()**

## Auxiliary functions.

**map(number: number, startInput: number, stopInput: number, startOutput: number, stopOutput: number): number** This function is for change range of values for example if you need translate 33 in percentage to grades use this.gd.map(33,0,100,0,360)

**move(point: Point, angle: number, distance: number): Point** Move point angle and distance.

**toRadians(grades: number): number** Return degrees in radians.

**toDegrees(radian: number): number** Return radians in degrees.

**distance(from:Point,to:Point):number** Distance between two points.

**angle(from:Point,to:Point):number** Angle from point to point.

**function for tablest**

tap(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): { shape: ShapeObject, action: string }[] {

use common in  hotlistenner read this sample code

```typescript
  @HostListener('touchstart', ["$event"])
  onTouchStart(event: TouchEvent) {
    if (event.targetTouches.length === 1) {
      this.gd.tap(this.canvas, this.ctx, event);
      if (this.gd.clicks.length === 0) {
        const offSet = this.gd.offSet(this.canvas, event)
        this.dragStartPosition = this.gd.getMousePoint(this.ctx, offSet.offSetX, offSet.offSetY);
        this.isDragging = true;

      } else {
        const element = this.gd.getClicks()[0];
        if (element.shape.type = 'node') {
          if (this.createConnection === false && this.createChildren === false) {
            this.cacheNode = <NodeObject>element.shape;
            this.IsMoving = true;
          }
        }
      }
    }
    if (event.targetTouches.length === 2) {
      const from: Point = { x: event.targetTouches.item(0)!.clientX, y: event.targetTouches.item(0)!.clientY };
      const to: Point = { x: event.targetTouches.item(1)!.clientX, y: event.targetTouches.item(1)!.clientY }
      this.initialDistance = this.gd.distance(from, to)
    }
  }


@HostListener('touchmove', ["$event"]) //zoom sample
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
       if (event.targetTouches.length === 2) {
      const touch = event.targetTouches.item(0);
      const offSet = this.offSet(event);
      const currentTransformedCursor = this.getTransformedPoint(offSet.offSetX, offSet.offSetY);
      const mouseX = currentTransformedCursor.x;
      const mouseY = currentTransformedCursor.y;
      const currentDistance = this.gd.distance({ x: event.targetTouches.item(0)!.clientX, y: event.targetTouches.item(0)!.clientY }, { x: event.targetTouches.item(1)!.clientX, y: event.targetTouches.item(1)!.clientY });
      const zoom = currentDistance > this.initialDistance ? 1.1 : 0.9;
      if (currentDistance>this.initialDistance && this.ctx.getTransform().a<2) {
        this.gd.zoomInPoint(this.ctx, mouseX, mouseY, zoom);
        this.zoomService.setZoom(this.ctx.getTransform());
        this.refresh();
      }
      if (currentDistance<this.initialDistance && this.ctx.getTransform().a>0.25) {
        this.gd.zoomInPoint(this.ctx, mouseX, mouseY, zoom);
        this.zoomService.setZoom(this.ctx.getTransform());
        this.refresh();
      }
    }
  }
  ```
sources:(https://github.com/luisalejandrofigueredo/ng-gd)
For help send email to:**luisalejandrofigueredo@gmail.com**
or:[Likedin](http://www.linkedin.com/in/luis-figueredo-casadei)

Mi web page is:(https://luisalejandrofigueredo.com)
