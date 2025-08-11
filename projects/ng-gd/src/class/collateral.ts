import { ElementRef } from "@angular/core";
import { ShapeObject } from "./shape-object";
import { Point } from "../interfaces/point";
import { angle, rectangle, distance, fillCircle, getNewParallelPoint, move } from "../trigonometrics";
export class CollateralObject extends ShapeObject {
    private from: Point = { x: 0, y: 0 };
    private to: Point = { x: 0, y: 0 };
    private node: Point = { x: 0, y: 0 };
    constructor(from: Point, to: Point, node: Point,color: string) {
        super();
        this.type = 'collateral';
        this.from = from;
        this.to = to;
        this.node = node
        this.color = color;
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
            
            const distPara = distance(this.from.x, this.from.y, this.to.x, this.to.y);
            const collateralPosition = getNewParallelPoint(this.from.x, this.from.y, this.to.x, this.to.y, distPara / 2, 10);
            const collateralAngle = angle(collateralPosition.x, collateralPosition.y, this.node.x, this.node.y);
            let moveNode = move(this.node.x, this.node.y, collateralAngle, -30);

            const nodeAngle = angle(collateralPosition.x, collateralPosition.y, moveNode.x, moveNode.y);
            const dist = distance(collateralPosition.x, collateralPosition.y, moveNode.x, moveNode.y);

            const rect = rectangle(collateralPosition.x, collateralPosition.y, 2, dist, nodeAngle);
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.moveTo(rect.first.x, rect.first.y);
            ctx.lineTo(rect.second.x, rect.second.y);
            ctx.lineTo(rect.third.x, rect.third.y);
            ctx.lineTo(rect.forth.x, rect.forth.y);
            ctx.lineTo(rect.first.x, rect.first.y);
            ctx.fill();
            fillCircle(ctx, collateralPosition.x, collateralPosition.y, 4, this.color);
            fillCircle(ctx, moveNode.x, moveNode.y, 4, this.color);
        }
    }

    override inverseShape(ctx: CanvasRenderingContext2D): void {
       
    }
    override inPoint(x: number, y: number): boolean {
       return false;
    }
    override move(x: number, y: number): void {
       
    }
    override moveMouse(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        
    }
    override moveTouch(canvas: ElementRef, ctx: CanvasRenderingContext2D, event: TouchEvent): void {
        
    }
}