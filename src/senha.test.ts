import { describe, expect, it } from 'vitest';
import { resumo, senhaValida } from './senha';

describe('senha do adulto', () => {
  it('aceita so de 4 a 8 numeros', () => {
    expect(senhaValida('1234')).toBe(true);
    expect(senhaValida('12345678')).toBe(true);
    expect(senhaValida('123')).toBe(false);
    expect(senhaValida('123456789')).toBe(false);
    expect(senhaValida('12a4')).toBe(false);
  });

  it('guarda o resumo, nunca a senha', async () => {
    const r = await resumo('2580');
    expect(r).toMatch(/^[0-9a-f]{64}$/);
    expect(r).not.toContain('2580');
    expect(await resumo('2580')).toBe(r);
    expect(await resumo('2581')).not.toBe(r);
  });
});
