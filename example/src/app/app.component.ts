import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Candlestick, GraphViewComponent, GraphViewOptions } from 'ng-gd';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
const SCALE = ['0', '50', '100', '150', '200'];

const CANDLES: Candlestick[] = [
  { timestamp: 1, open: 20, high: 45, low: 10, close: 35 },
  { timestamp: 2, open: 35, high: 55, low: 25, close: 30 },
  { timestamp: 3, open: 30, high: 60, low: 28, close: 52 },
  { timestamp: 4, open: 52, high: 70, low: 40, close: 44 },
  { timestamp: 5, open: 44, high: 75, low: 42, close: 68 },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GraphViewComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  darkMode = false;
  lastClick = 'Click any chart to see the detected object.';

  line: GraphViewOptions = {
    kind: 'line',
    values: [30, 90, 60, 140, 110, 180],
    color: '#2ecc71',
    marks: true,
    showAxisX: true,
    showAxisY: true,
    xLabels: MONTHS,
    yLabels: SCALE,
    width: 640,
    height: 300,
  };

  bars: GraphViewOptions = {
    kind: 'bars',
    values: [60, 120, 90, 150, 110, 80],
    colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'],
    barWidth: 50,
    distance: 20,
    showAxisX: true,
    showAxisY: true,
    xLabels: MONTHS,
    yLabels: SCALE,
    width: 640,
    height: 300,
  };

  pie: GraphViewOptions = {
    kind: 'pie',
    // In ng-gd, pie values are degrees (they must add up to 360).
    values: [120, 90, 80, 70],
    colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'],
    pieLabels: ['A (120°)', 'B (90°)', 'C (80°)', 'D (70°)'],
    size: 80,
    origin: { x: 220, y: 150 },
    width: 640,
    height: 300,
  };

  candles: GraphViewOptions = {
    kind: 'candles',
    candles: CANDLES,
    colors: ['#26a69a'],
    bearColor: '#ef5350',
    barWidth: 30,
    candleHeight: 150,
    distance: 70,
    origin: { x: 60, y: 230 },
    width: 640,
    height: 300,
  };

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    // IMPORTANT: assign a NEW object so ngOnChanges redraws.
    this.line = { ...this.line, darkMode: this.darkMode };
    this.bars = { ...this.bars, darkMode: this.darkMode };
    this.pie = { ...this.pie, darkMode: this.darkMode };
    this.candles = { ...this.candles, darkMode: this.darkMode };
  }

  onGraphClick(clicks: { shape: { type: string }; action: string }[]): void {
    if (clicks.length === 0) {
      this.lastClick = 'Click on an empty area (no objects).';
      return;
    }
    const first = clicks[0];
    this.lastClick = `Hit: type="${first.shape.type}" action="${first.action}" (${clicks.length} object(s) under the cursor).`;
  }
}
