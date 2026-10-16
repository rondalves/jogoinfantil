/**
 * Melodias de dominio publico tocadas como caixinha de musica, sem arquivo de
 * audio. Transcritas das partituras do Mutopia Project (dominio publico).
 *
 * Cada nota e o nome com a oitava (A4 = 440 Hz) e, depois do '-', quantos
 * tempos (seminimas) ela dura; sem '-', dura 1 tempo.
 */
export interface Nota {
  freq: number;
  tempos: number;
}

const SEMITOM: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };

/** 'F#5 A4-3' -> notas. */
export function notas(texto: string): Nota[] {
  return texto
    .trim()
    .split(/\s+/)
    .map((s) => {
      const m = /^([A-G])(#|b)?(\d)(?:-([\d.]+))?$/.exec(s);
      if (!m) throw new Error(`nota invalida: ${s}`);
      const acidente = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
      const semitons = SEMITOM[m[1]] + acidente + 12 * (Number(m[3]) - 4);
      return { freq: 440 * 2 ** (semitons / 12), tempos: Number(m[4] ?? 1) };
    });
}

/**
 * Gymnopedie n. 1 (Erik Satie, 1888): a melodia da mao direita, compassos 5
 * a 39, em frases curtas. No jipe, cada frase vira um grupo de notinhas.
 */
export const GYMNOPEDIE: Nota[][] = [
  'F#5 A5 G5 F#5 C#5',
  'B4 C#5 D5 A4-3 F#4-12',
  'F#5 A5 G5 F#5 C#5',
  'B4 C#5 D5 A4-3',
  'C#5-3 F#5-3 E4-9',
  'A4 B4 C5 E5 D5 B4',
  'D5 C5 B4 D5-5 D5',
  'E5 F5 G5 A5 C5 D5',
  'E5 D5 B4 D5-5 D5',
  'G5-3 F#5-3 B4 A4 B4',
  'C#5 D5 E5 C#5 D5 E5',
  'F#4-3 C5-3 D5-3',
].map(notas);

/**
 * Cancao de ninar (Johannes Brahms, Wiegenlied op. 49 n. 4, 1868), em sol
 * maior, com a anacruse. As pausas ficam somadas na nota de antes.
 */
export const CANCAO_DE_NINAR: Nota[] = notas(`
  B4-.5 B4-.5
  D5-1.5 B4-.5 B4  D5-2 B4-.5 D5-.5  G5 F#5-1.5 E5-.5  E5 D5 A4-.5 B4-.5
  C5 A4 A4-.5 B4-.5  C5-2 A4-.5 C5-.5  F#5-.5 E5-.5 D5 F#5  G5-2 G4-.5 G4-.5
  G5-2 E5-.5 C5-.5  D5-2 B4-.5 G4-.5  C5 D5 E5  B4-.5 D5-1.5 G4-.5 G4-.5
  G5-2 E5-.5 C5-.5  D5-2 B4-.5 G4-.5  C5-.5 D5-.25 C5-.25 B4 A4  G4-2
`);
