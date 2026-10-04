import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { NgGdService } from './ng-gd.service';
import { ShapeObject } from '../class/shape-object';
import {
  GraphViewOptions,
  resolveGraphViewOptions,
} from '../interfaces/graph-view-options';

/**
 * Declarative chart view on top of `NgGdService`.
 *
 * @beta This API is experimental and may change in future releases
 * outside the stable API breaking-change cycle.
 * The imperative `NgGdService` API remains the stable one.
 *
 * Usage:
 * ```html
 * <graph-view [options]="{ kind: 'line', values: [10, 40, 25] }"></graph-view>
 * ```
 *
 * Thin, compatible adapter: it draws nothing by itself, it delegates 1:1 to
 * the service imperative methods (`addLineChart`, `addGraphBars`,
 * `addPieChart`, `addCandleChart`, `addAxisX`/`addAxisY`). The existing
 * service is untouched; both styles can coexist. It uses its own
 * `NgGdService` instance so it never pollutes other canvases.
 */
@Component({
  selector: 'gd-graph-view, graph-view',
  standalone: true,
  imports: [],
  providers: [NgGdService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<canvas #canvas [width]="canvasWidth" [height]="canvasHeight" (click)="onClick($event)"></canvas>',
})
export class GraphViewComponent implements AfterViewInit, OnChanges {
  /** Single input: all configuration goes into this object. */
  @Input({ required: true }) options!: GraphViewOptions;
  /** Emits the `NgGdService.click()` result when the canvas is clicked. */
  @Output() graphClick = new EventEmitter<{ shape: ShapeObject; action: string }[]>();

  @ViewChild('canvas') private canvas?: ElementRef<HTMLCanvasElement>;

  private readonly gd = inject(NgGdService);
  private ctx?: CanvasRenderingContext2D;
  private viewReady = false;

  /** Imperative escape hatch (e.g. zoom/move) on the owned instance. */
  get api(): NgGdService {
    return this.gd;
  }

  get canvasWidth(): number {
    return this.options?.width ?? 640;
  }

  get canvasHeight(): number {
    return this.options?.height ?? 480;
  }

  ngAfterViewInit(): void {
    const canvas = this.canvas?.nativeElement;
    this.ctx = canvas?.getContext('2d') ?? undefined;
    this.viewReady = true;
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewReady && changes['options']) {
      this.render();
    }
  }

  onClick(event: MouseEvent): void {
    if (!this.ctx) {
      return;
    }
    this.graphClick.emit(this.gd.click(this.ctx, event));
  }

  /** Redraws from scratch with the current `options`. */
  render(): void {
    if (!this.ctx || !this.options) {
      return;
    }
    const o = resolveGraphViewOptions(this.options);
    this.gd.start(o.width, o.height);
    if (o.darkMode === true) {
      this.gd.setDarkMode();
    } else if (o.darkMode === false) {
      this.gd.setLightMode();
    }
    this.gd.clearObjects();
    const ctx = this.ctx;
    switch (o.kind) {
      case 'line':
        this.gd.addLineChart(o.origin, o.values, o.distance, o.color, o.marks, o.shadow);
        break;
      case 'bars':
        // The service types bars as `string[]`, but the canvas accepts
        // any `GraphColor` at runtime: the value is preserved.
        this.gd.addGraphBars(ctx, o.origin, o.barWidth, o.values, o.colors as string[], o.distance);
        break;
      case 'pie':
        this.gd.addPieChart(ctx, o.origin, o.size, o.values, o.colors, o.pieDistance, o.pieStart, o.pieLabels);
        break;
      case 'candles':
        this.gd.addCandleChart(o.origin, o.candles, o.barWidth, o.candleHeight, o.colors[0], o.bearColor, o.distance, o.shadow);
        break;
      default:
        break;
    }
    if (o.showAxisY) {
      this.gd.addAxisY(ctx, o.origin, o.axisLength, this.axisSteps(o.yLabels.length, o.values.length), o.yLabels, o.fontSize);
    }
    if (o.showAxisX) {
      this.gd.addAxisX(ctx, o.origin, o.axisLength, this.axisSteps(o.xLabels.length, o.values.length), o.xLabels, o.fontSize);
    }
    this.gd.clear(ctx);
    this.gd.draw(ctx);
  }

  private axisSteps(labelCount: number, valueCount: number): number {
    return Math.max(1, labelCount || valueCount);
  }
}
