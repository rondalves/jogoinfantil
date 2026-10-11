import { describe, expect, it } from 'vitest';
import { pousar } from './torre';

describe('torre de panquecas', () => {
  it('bem no meio conta como perfeita e encaixa certinho', () => {
    expect(pousar(365, 360)).toEqual({ x: 360, perfeita: true });
  });
  it('um pouco de lado fica onde caiu', () => {
    expect(pousar(440, 360)).toEqual({ x: 440, perfeita: false });
  });
  it('muito de lado escorrega da torre', () => {
    expect(pousar(500, 360)).toBeNull();
  });
});
