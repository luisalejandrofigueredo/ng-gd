import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Solo specs puras (sin TestBed): las .spec con Angular siguen en karma.
    include: ['projects/ng-gd/src/trigonometrics.spec.ts'],
    environment: 'node',
  },
});
