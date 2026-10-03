import { describe, it, expect } from 'vitest';
import {
  angle,
  distance,
  getNewParallelPoint,
  isPointInsideRectangle,
  isPointInTriangle,
  move,
  rectangle,
  toDegrees,
  toRadians,
} from './trigonometrics';

describe('trigonometrics', () => {
  it('mueve en la dirección indicada', () => {
    expect(move(0, 0, 0, 10)).toEqual({ x: 10, y: 0 });
    const p = move(5, 5, Math.PI / 2, 10);
    expect(p.x).toBeCloseTo(5, 6);
    expect(p.y).toBeCloseTo(15, 6);
  });

  it('ángulo y distancia consistentes', () => {
    expect(angle(0, 0, 10, 0)).toBeCloseTo(0, 6);
    expect(angle(0, 0, 0, 10)).toBeCloseTo(Math.PI / 2, 6);
    expect(distance(0, 0, 3, 4)).toBeCloseTo(5, 6);
  });

  it('convierte grados y radianes', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI, 6);
    expect(toDegrees(Math.PI)).toBeCloseTo(180, 6);
  });

  it('rectángulo con 4 vértices y punto interior/exterior', () => {
    const rect = rectangle(0, 0, 10, 100, 0);
    expect(rect.first).toEqual({ x: 0, y: 0 });
    expect(isPointInsideRectangle({ x: 50, y: -5 }, rect.first, rect.second, rect.third, rect.forth)).toBe(true);
    expect(isPointInsideRectangle({ x: 50, y: 5 }, rect.first, rect.second, rect.third, rect.forth)).toBe(false);
  });

  it('punto paralelo a mitad del segmento sin desvío', () => {
    const p = getNewParallelPoint(0, 0, 100, 0, 50, 0);
    expect(p.x).toBeCloseTo(50, 6);
    expect(p.y).toBeCloseTo(0, 6);
  });

  it('punto paralelo con desvío documentado a +60°', () => {
    const p = getNewParallelPoint(0, 0, 100, 0, 50, 10);
    expect(p.x).toBeCloseTo(50 + 10 * Math.cos(Math.PI / 3), 6);
    expect(p.y).toBeCloseTo(10 * Math.sin(Math.PI / 3), 6);
  });

  it('punto en triángulo', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 10, y: 0 };
    const p3 = { x: 0, y: 10 };
    expect(isPointInTriangle(p1, p2, p3, { x: 2, y: 2 })).toBe(true);
    expect(isPointInTriangle(p1, p2, p3, { x: 9, y: 9 })).toBe(false);
  });
});
