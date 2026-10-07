import { describe, expect, it } from 'vitest';
import { NgGdService } from './ng-gd.service';

describe('NgGdService.start con ids globales consumidos', () => {
  it('re-renderiza aunque otra instancia haya consumido el id 0', () => {
    // Simula el grafo contable: crea shapes antes que la vista de gráfica.
    const previa = new NgGdService();
    previa.addNode({ x: 1, y: 1 }, 'previo', '');
    const gd = new NgGdService();
    gd.start(640, 480);
    gd.addNode({ x: 2, y: 2 }, 'nodo', '');
    // Antes reventaba: getItem(0) no encontraba el Document y .setSize
    // se invocaba sobre otra cosa (TypeError).
    expect(() => gd.start(800, 600)).not.toThrow();
    expect(gd.width).toBe(800);
    expect(gd.height).toBe(600);
  });

  it('setDarkMode/setLightMode sin Document no revientan', () => {
    const gd = new NgGdService();
    expect(() => gd.setDarkMode()).not.toThrow();
    expect(() => gd.setLightMode()).not.toThrow();
    gd.start(100, 100);
    gd.setDarkMode();
    expect(gd.bkColor).toBe('#000000');
  });
});
