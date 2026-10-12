/**
 * Desenhos do joguinho de colorir, feitos de formas: cada parte que se pinta
 * e um poligono fechado, para o toque saber onde caiu. Coordenadas numa caixa
 * de 600x600 com o centro no meio; y cresce para baixo.
 */

export type Ponto = [number, number];

export interface Parte {
  nome: string;
  pontos: Ponto[];
}

export type Detalhe =
  | { tipo: 'olho'; x: number; y: number; r: number }
  | { tipo: 'ponto'; x: number; y: number; r: number; cor: number }
  | { tipo: 'risco'; pontos: Ponto[]; largura?: number };

export interface Desenho {
  id: string;
  nome: string;
  /** de tras para a frente: a ultima parte que contem o toque e a pintada */
  partes: Parte[];
  /** olhos, nariz, bigode: desenhados por cima e nao se pintam */
  detalhes: Detalhe[];
}

/** Elipse como poligono, girada `graus`. */
export function elipse(x: number, y: number, rx: number, ry: number, graus = 0, lados = 48): Ponto[] {
  const a = (graus * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return Array.from({ length: lados }, (_, i) => {
    const t = (i / lados) * Math.PI * 2;
    const px = Math.cos(t) * rx;
    const py = Math.sin(t) * ry;
    return [x + px * c - py * s, y + px * s + py * c] as Ponto;
  });
}

/** Curva fechada e macia passando pelos pontos (Catmull-Rom). */
export function suave(pontos: number[], passos = 10): Ponto[] {
  const p: Ponto[] = [];
  for (let i = 0; i < pontos.length; i += 2) p.push([pontos[i], pontos[i + 1]]);
  const n = p.length;
  const fora: Ponto[] = [];
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p[(i - 1 + n) % n], p[i], p[(i + 1) % n], p[(i + 2) % n]];
    for (let k = 0; k < passos; k++) {
      const t = k / passos;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      fora.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return fora;
}

const reto = (pontos: number[]): Ponto[] => {
  const p: Ponto[] = [];
  for (let i = 0; i < pontos.length; i += 2) p.push([pontos[i], pontos[i + 1]]);
  return p;
};

/** Espelha na vertical do meio: o lado direito sai do esquerdo. */
const espelho = (p: Ponto[]): Ponto[] => p.map(([x, y]) => [-x, y] as Ponto).reverse();

/** O pedaco de uma elipse entre x0 e x1: listra que respeita a borda. */
function faixa(cx: number, cy: number, rx: number, ry: number, x0: number, x1: number): Ponto[] {
  const borda = (x: number) => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
  const xs = Array.from({ length: 12 }, (_, i) => x0 + ((x1 - x0) * i) / 11);
  return [...xs.map((x) => [x, cy - borda(x)] as Ponto), ...xs.reverse().map((x) => [x, cy + borda(x)] as Ponto)];
}

const olhos = (x: number, y: number, r = 15): Detalhe[] => [
  { tipo: 'olho', x: -x, y, r },
  { tipo: 'olho', x, y, r },
];

const orelhaRaposa: Ponto[] = reto([-140, -130, -120, -280, -50, -180]);
const orelhaRaposaDentro: Ponto[] = reto([-120, -160, -112, -245, -72, -182]);
const orelhaGato: Ponto[] = reto([-125, -115, -108, -262, -30, -170]);
const orelhaGatoDentro: Ponto[] = reto([-104, -148, -96, -228, -52, -172]);

export const DESENHOS: Desenho[] = [
  {
    id: 'raposinha',
    nome: 'Raposinha',
    partes: [
      { nome: 'rabo', pontos: suave([100, 180, 210, 170, 270, 90, 262, -10, 218, -55, 200, 30, 150, 110, 95, 140]) },
      { nome: 'ponta do rabo', pontos: suave([222, -70, 258, -30, 262, 5, 230, -5, 205, -38]) },
      { nome: 'corpo', pontos: elipse(0, 125, 130, 150) },
      { nome: 'barriga', pontos: elipse(0, 155, 80, 105) },
      { nome: 'pata', pontos: elipse(-58, 262, 46, 28) },
      { nome: 'pata', pontos: elipse(58, 262, 46, 28) },
      { nome: 'orelha', pontos: orelhaRaposa },
      { nome: 'orelha', pontos: espelho(orelhaRaposa) },
      { nome: 'dentro da orelha', pontos: orelhaRaposaDentro },
      { nome: 'dentro da orelha', pontos: espelho(orelhaRaposaDentro) },
      {
        nome: 'cabeça',
        pontos: suave([-150, -110, -90, -185, 0, -200, 90, -185, 150, -110, 120, -30, 50, 20, 0, 30, -50, 20, -120, -30]),
      },
      { nome: 'focinho', pontos: suave([-75, -45, -35, -8, 0, 14, 35, -8, 75, -45, 40, -72, 0, -62, -40, -72]) },
      { nome: 'lenço', pontos: reto([-95, 22, 95, 22, 84, 58, 22, 64, 0, 112, -22, 64, -84, 58]) },
    ],
    detalhes: [
      ...olhos(55, -100),
      { tipo: 'ponto', x: 0, y: -30, r: 13, cor: 0x3a2a24 },
      { tipo: 'risco', pontos: reto([-18, -8, 0, 4, 18, -8]) },
    ],
  },
  {
    id: 'gatinho',
    nome: 'Gatinho',
    partes: [
      { nome: 'rabo', pontos: suave([110, 230, 205, 222, 255, 150, 246, 68, 212, 58, 218, 140, 182, 188, 110, 200]) },
      { nome: 'corpo', pontos: elipse(0, 130, 120, 140) },
      { nome: 'barriga', pontos: elipse(0, 160, 70, 95) },
      { nome: 'pata', pontos: elipse(-50, 262, 42, 26) },
      { nome: 'pata', pontos: elipse(50, 262, 42, 26) },
      { nome: 'orelha', pontos: orelhaGato },
      { nome: 'orelha', pontos: espelho(orelhaGato) },
      { nome: 'dentro da orelha', pontos: orelhaGatoDentro },
      { nome: 'dentro da orelha', pontos: espelho(orelhaGatoDentro) },
      { nome: 'cabeça', pontos: elipse(0, -80, 145, 120) },
      { nome: 'manchinha', pontos: elipse(62, -142, 40, 28, 20) },
      { nome: 'focinho', pontos: elipse(0, -38, 56, 38) },
    ],
    detalhes: [
      ...olhos(55, -92),
      { tipo: 'ponto', x: 0, y: -52, r: 11, cor: 0x3a2a24 },
      { tipo: 'risco', pontos: reto([-16, -30, 0, -20, 16, -30]) },
      { tipo: 'risco', pontos: reto([-62, -42, -150, -60]), largura: 4 },
      { tipo: 'risco', pontos: reto([-62, -30, -150, -26]), largura: 4 },
      { tipo: 'risco', pontos: reto([62, -42, 150, -60]), largura: 4 },
      { tipo: 'risco', pontos: reto([62, -30, 150, -26]), largura: 4 },
    ],
  },
  {
    id: 'cachorrinho',
    nome: 'Cachorrinho',
    partes: [
      { nome: 'rabo', pontos: suave([100, 140, 190, 90, 218, 38, 196, 26, 164, 80, 100, 112]) },
      { nome: 'corpo', pontos: elipse(0, 135, 125, 140) },
      { nome: 'barriga', pontos: elipse(0, 165, 72, 95) },
      { nome: 'pata', pontos: elipse(-55, 265, 45, 26) },
      { nome: 'pata', pontos: elipse(55, 265, 45, 26) },
      { nome: 'coleira', pontos: reto([-88, 36, 88, 36, 82, 62, -82, 62]) },
      { nome: 'medalhinha', pontos: elipse(0, 80, 18, 18) },
      { nome: 'cabeça', pontos: elipse(0, -80, 135, 120) },
      { nome: 'mancha do olho', pontos: elipse(56, -102, 46, 40) },
      { nome: 'focinho', pontos: elipse(0, -24, 66, 46) },
      { nome: 'língua', pontos: elipse(0, 14, 15, 18) },
      { nome: 'orelha', pontos: elipse(-138, -62, 46, 96, 15) },
      { nome: 'orelha', pontos: elipse(138, -62, 46, 96, -15) },
    ],
    detalhes: [
      ...olhos(56, -100),
      { tipo: 'ponto', x: 0, y: -44, r: 17, cor: 0x3a2a24 },
      { tipo: 'risco', pontos: reto([-22, -6, 0, 4, 22, -6]) },
    ],
  },
  {
    id: 'coelhinho',
    nome: 'Coelhinho',
    partes: [
      { nome: 'rabinho', pontos: elipse(126, 175, 40, 40) },
      { nome: 'orelha', pontos: elipse(-56, -205, 36, 88, -10) },
      { nome: 'orelha', pontos: elipse(56, -205, 36, 88, 10) },
      { nome: 'dentro da orelha', pontos: elipse(-56, -200, 17, 60, -10) },
      { nome: 'dentro da orelha', pontos: elipse(56, -200, 17, 60, 10) },
      { nome: 'corpo', pontos: elipse(0, 140, 120, 140) },
      { nome: 'barriga', pontos: elipse(0, 165, 72, 95) },
      { nome: 'pata', pontos: elipse(-62, 266, 56, 28) },
      { nome: 'pata', pontos: elipse(62, 266, 56, 28) },
      { nome: 'cabeça', pontos: elipse(0, -70, 130, 115) },
      { nome: 'bochecha', pontos: elipse(-72, -22, 30, 20) },
      { nome: 'bochecha', pontos: elipse(72, -22, 30, 20) },
    ],
    detalhes: [
      ...olhos(50, -82),
      { tipo: 'ponto', x: 0, y: -40, r: 11, cor: 0xd77a8a },
      { tipo: 'risco', pontos: reto([-16, -22, 0, -12, 16, -22]) },
      { tipo: 'risco', pontos: reto([-9, -12, -9, 4, 9, 4, 9, -12]), largura: 4 },
    ],
  },
  {
    id: 'peixinho',
    nome: 'Peixinho',
    partes: [
      { nome: 'bolha', pontos: elipse(-250, -150, 22, 22) },
      { nome: 'bolha', pontos: elipse(-282, -212, 14, 14) },
      { nome: 'bolha', pontos: elipse(-240, -252, 10, 10) },
      { nome: 'rabo', pontos: reto([150, 0, 272, -112, 250, 0, 272, 112]) },
      { nome: 'barbatana de cima', pontos: suave([-90, -100, -10, -195, 60, -112, 0, -96]) },
      { nome: 'barbatana de baixo', pontos: suave([-40, 102, 12, 172, 52, 108, 8, 112]) },
      { nome: 'corpo', pontos: elipse(-20, 0, 190, 120) },
      { nome: 'listra', pontos: faixa(-20, 0, 190, 120, -10, 30) },
      { nome: 'listra', pontos: faixa(-20, 0, 190, 120, 72, 108) },
      { nome: 'barbatana do lado', pontos: elipse(-30, 34, 46, 25, 30) },
    ],
    detalhes: [
      { tipo: 'olho', x: -138, y: -32, r: 19 },
      { tipo: 'risco', pontos: reto([-208, 14, -196, 24, -184, 16]) },
    ],
  },
  {
    id: 'borboleta',
    nome: 'Borboleta',
    partes: [
      { nome: 'asa de cima', pontos: elipse(-122, -80, 122, 96, -20) },
      { nome: 'asa de cima', pontos: elipse(122, -80, 122, 96, 20) },
      { nome: 'asa de baixo', pontos: elipse(-96, 96, 86, 76, 20) },
      { nome: 'asa de baixo', pontos: elipse(96, 96, 86, 76, -20) },
      { nome: 'bolinha', pontos: elipse(-140, -92, 32, 32) },
      { nome: 'bolinha', pontos: elipse(140, -92, 32, 32) },
      { nome: 'bolinha', pontos: elipse(-98, 104, 24, 24) },
      { nome: 'bolinha', pontos: elipse(98, 104, 24, 24) },
      { nome: 'corpo', pontos: elipse(0, 10, 26, 150) },
      { nome: 'cabeça', pontos: elipse(0, -170, 38, 38) },
    ],
    detalhes: [
      ...olhos(14, -176, 7),
      { tipo: 'risco', pontos: reto([-10, -202, -42, -272]), largura: 5 },
      { tipo: 'risco', pontos: reto([10, -202, 42, -272]), largura: 5 },
      { tipo: 'ponto', x: -42, y: -272, r: 9, cor: 0x3a2a24 },
      { tipo: 'ponto', x: 42, y: -272, r: 9, cor: 0x3a2a24 },
    ],
  },
  {
    id: 'tartaruga',
    nome: 'Tartaruga',
    partes: [
      { nome: 'rabinho', pontos: reto([-20, 175, 20, 175, 0, 225]) },
      { nome: 'pata', pontos: elipse(-150, 140, 50, 34, -30) },
      { nome: 'pata', pontos: elipse(150, 140, 50, 34, 30) },
      { nome: 'pata', pontos: elipse(-160, -10, 46, 32, 25) },
      { nome: 'pata', pontos: elipse(160, -10, 46, 32, -25) },
      { nome: 'cabeça', pontos: elipse(0, -150, 72, 66) },
      { nome: 'casco', pontos: elipse(0, 60, 170, 140) },
      { nome: 'desenho do casco', pontos: elipse(0, 55, 62, 54) },
      { nome: 'desenho do casco', pontos: elipse(-108, 30, 40, 36) },
      { nome: 'desenho do casco', pontos: elipse(108, 30, 40, 36) },
      { nome: 'desenho do casco', pontos: elipse(-70, 140, 40, 34) },
      { nome: 'desenho do casco', pontos: elipse(70, 140, 40, 34) },
      { nome: 'desenho do casco', pontos: elipse(0, -50, 46, 32) },
    ],
    detalhes: [...olhos(26, -160, 12), { tipo: 'risco', pontos: reto([-18, -128, 0, -118, 18, -128]) }],
  },
  {
    id: 'porquinho',
    nome: 'Porquinho',
    partes: [
      { nome: 'rabinho', pontos: suave([118, 130, 160, 104, 172, 132, 150, 150, 124, 148]) },
      { nome: 'corpo', pontos: elipse(0, 150, 128, 112) },
      { nome: 'barriga', pontos: elipse(0, 168, 74, 70) },
      { nome: 'pata', pontos: elipse(-62, 255, 42, 30) },
      { nome: 'pata', pontos: elipse(62, 255, 42, 30) },
      // orelha de porco: larga e caida na ponta, nao pontuda como a do gato
      { nome: 'orelha', pontos: suave([-132, -112, -168, -190, -150, -238, -96, -214, -52, -168]) },
      { nome: 'orelha', pontos: suave([132, -112, 168, -190, 150, -238, 96, -214, 52, -168]) },
      { nome: 'cabeça', pontos: elipse(0, -60, 150, 125) },
      { nome: 'bochecha', pontos: elipse(-92, -20, 30, 20) },
      { nome: 'bochecha', pontos: elipse(92, -20, 30, 20) },
      { nome: 'focinho', pontos: elipse(0, -26, 62, 44) },
    ],
    detalhes: [
      ...olhos(56, -96),
      { tipo: 'ponto', x: -20, y: -26, r: 11, cor: 0x7a4a5a },
      { tipo: 'ponto', x: 20, y: -26, r: 11, cor: 0x7a4a5a },
      { tipo: 'risco', pontos: reto([-22, 34, 0, 44, 22, 34]) },
    ],
  },
  {
    id: 'pintinho',
    nome: 'Pintinho',
    partes: [
      { nome: 'pé', pontos: reto([-70, 240, -40, 240, -30, 285, -55, 268, -80, 285]) },
      { nome: 'pé', pontos: reto([40, 240, 70, 240, 80, 285, 55, 268, 30, 285]) },
      { nome: 'asa', pontos: elipse(-140, 110, 46, 78, 25) },
      { nome: 'asa', pontos: elipse(140, 110, 46, 78, -25) },
      { nome: 'corpo', pontos: elipse(0, 110, 150, 140) },
      { nome: 'topete', pontos: suave([-20, -205, -30, -262, 0, -232, 26, -268, 22, -205]) },
      { nome: 'cabeça', pontos: elipse(0, -110, 108, 100) },
      { nome: 'bico', pontos: reto([-28, -90, 28, -90, 0, -52]) },
      { nome: 'bochecha', pontos: elipse(-66, -82, 22, 15) },
      { nome: 'bochecha', pontos: elipse(66, -82, 22, 15) },
    ],
    detalhes: [...olhos(42, -128, 14)],
  },
  {
    id: 'elefante',
    nome: 'Elefante',
    partes: [
      { nome: 'orelha', pontos: elipse(-150, -50, 100, 120, -10) },
      { nome: 'orelha', pontos: elipse(150, -50, 100, 120, 10) },
      { nome: 'dentro da orelha', pontos: elipse(-150, -46, 62, 82, -10) },
      { nome: 'dentro da orelha', pontos: elipse(150, -46, 62, 82, 10) },
      { nome: 'corpo', pontos: elipse(0, 175, 135, 100) },
      { nome: 'pata', pontos: elipse(-66, 255, 44, 32) },
      { nome: 'pata', pontos: elipse(66, 255, 44, 32) },
      { nome: 'cabeça', pontos: elipse(0, -60, 125, 115) },
      {
        nome: 'tromba',
        pontos: suave([-30, -10, 30, -10, 32, 70, 56, 128, 92, 150, 100, 182, 60, 184, 12, 140, -24, 72]),
      },
    ],
    detalhes: [...olhos(58, -88)],
  },
];

/** Puro, para o teste: o indice da parte tocada (a de cima), ou -1. */
export function parteTocada(d: Desenho, x: number, y: number): number {
  for (let i = d.partes.length - 1; i >= 0; i--) if (dentro(d.partes[i].pontos, x, y)) return i;
  return -1;
}

/** Ponto dentro do poligono (regra par-impar). */
export function dentro(p: Ponto[], x: number, y: number): boolean {
  let sim = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i];
    const [xj, yj] = p[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) sim = !sim;
  }
  return sim;
}
