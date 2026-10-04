import { describe, expect, it } from 'vitest';
import { resolveGraphViewOptions } from './graph-view-options';

describe('resolveGraphViewOptions', () => {
  it('applies viewport and origin defaults', () => {
    const o = resolveGraphViewOptions({ kind: 'line', values: [10, 20] });
    expect(o.width).toBe(640);
    expect(o.height).toBe(480);
    expect(o.origin).toEqual({ x: 50, y: 430 });
    expect(o.distance).toBe(50);
    expect(o.values).toEqual([10, 20]);
  });

  it('does not mutate the input object', () => {
    const values = [10, 20];
    const input = { kind: 'bars' as const, values };
    resolveGraphViewOptions(input);
    expect(values).toEqual([10, 20]);
  });

  it('completes the palette to cover all values', () => {
    const o = resolveGraphViewOptions({ kind: 'pie', values: [90, 90, 90, 90], colors: ['#111111'] });
    expect(o.colors.length).toBe(4);
    expect(o.colors[0]).toBe('#111111');
  });

  it('uses the single color as palette fallback', () => {
    const o = resolveGraphViewOptions({ kind: 'line', values: [1, 2], color: '#123456' });
    expect(o.color).toBe('#123456');
    expect(o.colors[0]).toBe('#123456');
  });

  it('keeps darkMode undefined so service colors stay untouched', () => {
    expect(resolveGraphViewOptions({ kind: 'line' }).darkMode).toBeUndefined();
    expect(resolveGraphViewOptions({ kind: 'line', darkMode: false }).darkMode).toBe(false);
  });

  it('normalizes candles and keeps their data', () => {
    const candles = [{ timestamp: 1, open: 10, high: 15, low: 8, close: 12 }];
    const o = resolveGraphViewOptions({ kind: 'candles', candles });
    expect(o.candles).toEqual(candles);
    expect(o.candleHeight).toBe(100);
    expect(o.bearColor).toBe('#0000ff');
  });
});
