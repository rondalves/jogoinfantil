/**
 * Desenha o personagem inteiro por codigo e grava em assets/img.
 *
 *   npm run personagem
 *
 * Corpo (6 roupas, 7 tons de pele), rostos (olhos e boca
 * separados) e os 22 cabelos em 9 cores saem todos da mesma cabeca, entao
 * encaixam por construcao. Os nomes sao os que o jogo ja usa; a geometria da
 * cabeca vai para src/cabecas.json.
 *
 * Quadros (os mesmos que src/personagem.ts espera):
 *   corpo       360 x 512, a crianca centralizada
 *   cabelo      768 x 768, o centro e o centro do corpo, 1 px = 1 px do corpo
 *   olhos/boca  4x, a linha dos olhos no meio da peca; o jogo escala pela largura
 */
import { chromium } from 'playwright';
import { writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(RAIZ, 'assets', 'img');

// iguais a PELES e CORES_CABELO de src/personagem.ts
const PELES = ['#ffe0bd', '#efc9ab', '#f3c893', '#e0ac69', '#c68642', '#8d5524', '#5c3317'];
const CORES = ['#2b1b17', '#6b4423', '#d9a95b', '#b33a2b', '#c3c3c8', '#7d4fa0', '#f7e2b0', '#e8699f', '#4a90d9'];
const TRACO = '#4a3428';
const LW = 2.4;

// ---------------------------------------------------------------- cores
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const escuro = (h, f) => hex(rgb(h).map((v) => v * f));
const claro = (h, f) => hex(rgb(h).map((v) => v + (255 - v) * f));
const luz = (h) => rgb(h).reduce((s, v, i) => s + v * [0.299, 0.587, 0.114][i], 0) / 255;

// ---------------------------------------------------------------- formas
/** Varias formas com um contorno so em volta de todas (sem risco entre elas). */
const grupo = (formas, cor, traco = TRACO, lw = LW) =>
  `<g fill="${traco}" stroke="${traco}" stroke-width="${lw * 2}" stroke-linejoin="round">${formas}</g>` +
  `<g fill="${cor}">${formas}</g>`;

/** Bastao de ponta redonda de (x1,y1) a (x2,y2): braco, perna, manga, mecha. */
function tubo(x1, y1, x2, y2, w) {
  const dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1;
  const px = (-dy / n) * (w / 2), py = (dx / n) * (w / 2);
  const pts = [[x1 + px, y1 + py], [x2 + px, y2 + py], [x2 - px, y2 - py], [x1 - px, y1 - py]];
  return `<polygon points="${pts.map((p) => p.join(',')).join(' ')}"/>` +
    `<circle cx="${x1}" cy="${y1}" r="${w / 2}"/><circle cx="${x2}" cy="${y2}" r="${w / 2}"/>`;
}

const elipse = (cx, cy, rx, ry, extra = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${extra}/>`;
const caminho = (d, extra = '') => `<path d="${d}" ${extra}/>`;
const risco = (d, cor, w, extra = '') =>
  `<path d="${d}" fill="none" stroke="${cor}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

/** Espelha um desenho na vertical do meio do quadro de largura w. */
const espelho = (w, s) => `<g transform="translate(${w},0) scale(-1,1)">${s}</g>`;

/** Bolinhas em volta de uma elipse: borda de cacho e de nuvem. */
function bolinhas(cx, cy, rx, ry, r, de = 0, ate = 360, passo = null) {
  const n = passo ?? Math.max(6, Math.round((Math.PI * (rx + ry)) / (r * 1.25)));
  let s = '';
  const a0 = (de * Math.PI) / 180, a1 = (ate * Math.PI) / 180;
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    s += `<circle cx="${(cx + rx * Math.cos(a)).toFixed(1)}" cy="${(cy + ry * Math.sin(a)).toFixed(1)}" r="${r}"/>`;
  }
  return s;
}

let ids = 0;
/** Pinta `sombra` so por dentro de `formas` (sombra que nao vaza). */
function sombra(formas, conteudo) {
  const id = `c${ids++}`;
  return `<clipPath id="${id}">${formas}</clipPath><g clip-path="url(#${id})">${conteudo}</g>`;
}

const svg = (w, h, corpo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${corpo}</svg>`;

// ---------------------------------------------------------------- corpo
const W = 360, H = 512, C = W / 2;

/** A cabeca: um ovo macio, mais largo no cranio e nas bochechas, queixo curto. */
const CABECA = { topo: 12, queixo: 168, larg: 132 };
const cabecaD = (dy) =>
  `M180,${12 + dy} C220,${12 + dy} 246,${40 + dy} 246,${82 + dy} C246,${112 + dy} 242,${134 + dy} 226,${150 + dy} ` +
  `C212,${163 + dy} 197,${168 + dy} 180,${168 + dy} C163,${168 + dy} 148,${163 + dy} 134,${150 + dy} ` +
  `C118,${134 + dy} 114,${112 + dy} 114,${82 + dy} C114,${40 + dy} 140,${12 + dy} 180,${12 + dy} Z`;

function cabecaEPescoco(pele, dy) {
  const sombraPele = escuro(pele, 0.86);
  const pescoco = `<rect x="163" y="${146 + dy}" width="34" height="${52}" rx="6"/>`;
  const orelhas = elipse(113, 106 + dy, 9, 14) + elipse(247, 106 + dy, 9, 14);
  let s = grupo(pescoco, pele);
  s += sombra(pescoco, elipse(180, 166 + dy, 24, 12, `fill="${sombraPele}"`));
  s += grupo(orelhas, pele);
  s += risco(`M110,${99 + dy} Q106,${106 + dy} 112,${114 + dy}`, sombraPele, 2.2);
  s += risco(`M250,${99 + dy} Q254,${106 + dy} 248,${114 + dy}`, sombraPele, 2.2);
  s += grupo(caminho(cabecaD(dy)), pele);
  // nariz pequeno e bochecha: o que faz rosto de crianca, nao de boneco liso
  s += risco(`M175,${117 + dy} Q180,${122 + dy} 185,${117 + dy}`, escuro(pele, 0.68), 2.4);
  s += elipse(138, 123 + dy, 11, 6.5, 'fill="#ff7a7a" opacity="0.2"') + elipse(222, 123 + dy, 11, 6.5, 'fill="#ff7a7a" opacity="0.2"');
  return s;
}

/** Braco do ombro ate a mao, com mao redondinha e polegar. */
function braco(x1, y1, x2, y2, pele) {
  const lado = Math.sign(x2 - x1);
  return grupo(tubo(x1, y1, x2, y2, 22) + `<circle cx="${x2}" cy="${y2 + 4}" r="14"/>` +
    elipse(x2 - lado * 9, y2 - 6, 6, 8, `transform="rotate(${lado * 30} ${x2 - lado * 9} ${y2 - 6})"`), pele);
}

function sapato(x, y, cor) {
  // o bico abre um pouco para fora, como pe de crianca parada
  const d = `M${x - 2},${y + 14} Q${x - 2},${y} ${x + 14},${y} L${x + 42},${y} Q${x + 52},${y} ${x + 52},${y + 10} ` +
    `L${x + 52},${y + 26} Q${x + 52},${y + 34} ${x + 42},${y + 34} L${x - 8},${y + 34} Q${x - 18},${y + 34} ${x - 16},${y + 25} Q${x - 14},${y + 17} ${x - 2},${y + 14} Z`;
  return grupo(caminho(d), cor) + risco(`M${x - 14},${y + 27} L${x + 51},${y + 27}`, escuro(cor, 0.78), 2.4);
}

const ROUPAS = {
  '': { camisa: '#f7f5f0', calca: '#ecebe6', meia: '#ffffff', tenis: '#ffffff' },
  _azul: { camisa: '#8fc3e8', calca: '#34507f', meia: '#ffffff', tenis: '#ffffff' },
  _roxo: { camisa: '#b996d9', calca: '#7a55a8', meia: '#ffffff', tenis: '#ffffff' },
  _macacao: { camisa: '#f4cf6a', calca: '#5d83bd', meia: '#ffffff', tenis: '#ffffff', macacao: true },
  _vestido_rosa: { camisa: '#f3b4c7', calca: '#f3b4c7', meia: '#ffffff', tenis: '#ffffff', vestido: '#e07c9d' },
  _vermelho: { camisa: '#d95a52', calca: '#8e949d', meia: '#ffffff', tenis: '#ffffff', moletom: true },
};

function corpoEmPe(roupa, pele) {
  const r = ROUPAS[roupa];
  let s = '';
  // pernas, meia e tenis
  const pernas = r.moletom
    ? ''
    : tubo(156, 322, 155, 458, 30) + tubo(204, 322, 205, 458, 30);
  if (pernas) s += grupo(pernas, pele);
  // meia e uma faixa reta, nao uma bolinha em cima do tenis
  s += grupo(`<rect x="140" y="444" width="31" height="22" rx="3"/><rect x="189" y="444" width="31" height="22" rx="3"/>`, r.meia);
  s += sapato(132, 458, r.tenis) + espelho(W, sapato(132, 458, r.tenis));
  // parte de baixo
  if (r.moletom) {
    s += grupo(caminho('M126,280 L234,280 L232,456 L190,456 L182,318 L178,318 L170,456 L128,456 Z'), r.calca);
  } else if (!r.vestido) {
    s += grupo(caminho('M124,280 L236,280 L242,336 L184,338 L180,318 L176,338 L118,336 Z'), r.calca);
  }
  // bracos (a manga vem por cima)
  s += braco(136, 210, 84, 300, pele) + braco(224, 210, 276, 300, pele);
  // camisa, vestido ou moletom
  const tronco = 'M128,200 C142,191 152,188 162,188 Q180,202 198,188 C208,188 218,191 232,200 L240,290 Q180,296 120,290 Z';
  const mangas = r.moletom
    ? tubo(138, 206, 92, 284, 32) + tubo(222, 206, 268, 284, 32)
    : tubo(138, 206, 117, 244, 34) + tubo(222, 206, 243, 244, 34);
  if (r.vestido) {
    const saia = 'M132,262 L228,262 L254,350 Q180,362 106,350 Z';
    s += grupo(caminho(tronco) + mangas, r.camisa);
    s += grupo(caminho(saia), r.camisa);
    s += sombra(caminho(saia), risco('M150,280 L136,352 M180,282 L180,358 M210,280 L224,352', escuro(r.camisa, 0.9), 3));
    s += grupo(`<rect x="130" y="254" width="100" height="14" rx="6"/>`, r.vestido);
  } else {
    s += grupo(caminho(tronco) + mangas, r.camisa);
  }
  if (r.moletom) {
    // punho, bolso canguru e o capuz caido nas costas, em volta da gola
    s += grupo(tubo(92, 284, 88, 292, 30) + tubo(268, 284, 272, 292, 30), escuro(r.camisa, 0.85));
    s += grupo(caminho('M146,250 L214,250 L222,284 L138,284 Z'), escuro(r.camisa, 0.9));
    s += grupo(caminho('M140,196 Q180,170 220,196 Q200,214 180,212 Q160,214 140,196 Z'), escuro(r.camisa, 0.88));
    s += risco('M172,206 L170,236 M188,206 L190,236', '#f4f1ec', 2.6);
  }
  if (r.macacao) {
    const peito = 'M146,236 L214,236 L218,284 L142,284 Z';
    s += grupo(caminho(peito) + tubo(150, 238, 140, 200, 12) + tubo(210, 238, 220, 200, 12), r.calca);
    s += grupo(caminho('M162,250 L198,250 L196,272 L164,272 Z'), '#d9534f');
    s += grupo(`<circle cx="152" cy="242" r="4"/><circle cx="208" cy="242" r="4"/>`, '#f0c24b');
  }
  // gola: o recorte da camisa em volta do pescoco
  return s;
}

function corpo(roupa, pele) {
  return svg(W, H, corpoEmPe(roupa, pele) + cabecaEPescoco(pele, 0));
}

// ---------------------------------------------------------------- rosto
const R = 4; // olhos e boca saem em 4x: o jogo escala pela largura
const LARGURA_OLHOS = 0.74 * CABECA.larg; // igual a LARGURA_OLHOS do jogo
const OLHO_DX = 24;
const CORES_ROSTO = { olho: '#2a1c17', sobrancelha: '#5a3d2e', boca: '#6b3a32', dentro: '#7b3434' };

const OLHOS = {
  redondos: { olho: () => elipse(0, 0, 8.5, 10.5), brilho: [[-2.8, -3.8, 3], [3, 3.6, 1.3]], sobr: 'M-8.5,-17.5 Q0,-21.5 8.5,-18' },
  grandes: { olho: () => elipse(0, 0, 10, 12.5), brilho: [[-3.2, -4.4, 3.6], [3.4, 4.2, 1.6]], sobr: 'M-8.5,-23 Q0,-27.5 8.5,-23' },
  // olhinho fechado de alegria: um arco grosso e redondo. A meia-lua cheia de antes
  // parecia olho quase fechado de sono
  alegres: { olho: () => risco('M-8.5,3 Q0,-9.5 8.5,3', CORES_ROSTO.olho, 3.4), brilho: [], sobr: 'M-8.5,-17 Q0,-21 8.5,-17' },
  // sorrisao: olho aberto e brilhante, um pouco maior, com tres brilhos e a
  // sobrancelha levantada. Quem sorri o faz com a boca grande, nao fechando o olho
  sorriso: {
    olho: () => elipse(0, 0, 9.4, 11.4),
    brilho: [[-3, -4.4, 3.4], [3.4, 4, 1.7], [3.6, -5.6, 1.1]],
    sobr: 'M-8.5,-22 Q0,-26.5 8.5,-22',
  },
  triste: { olho: () => elipse(0, 1.2, 8, 9.8), brilho: [[-2.4, -1.2, 2.5]], sobr: 'M-8.5,-13.5 Q-1,-15.5 7.5,-20.5' },
};

function olhos(id) {
  const o = OLHOS[id];
  const w = LARGURA_OLHOS, h = 64, cy = h / 2;
  let s = '';
  for (const lado of [-1, 1]) {
    const x = w / 2 + lado * OLHO_DX;
    s += `<g transform="translate(${x},${cy})" fill="${CORES_ROSTO.olho}">${o.olho(lado)}</g>`;
    // o brilho fica do mesmo lado nos dois olhos: a luz vem de um lugar so
    s += o.brilho.map(([bx, by, br]) => `<circle cx="${x + bx}" cy="${cy + by}" r="${br}" fill="#ffffff"/>`).join('');
    // a sobrancelha espelha: no triste as duas sobem para o meio
    s += `<g transform="translate(${x},${cy}) scale(${-lado},1)">${risco(o.sobr, CORES_ROSTO.sobrancelha, 2.6)}</g>`;
  }
  return svg(Math.round(w * R), h * R, `<g transform="scale(${R})">${s}</g>`);
}

const BOCAS = {
  redondos: () => risco('M-6.5,-1.5 Q0,4 6.5,-1.5', CORES_ROSTO.boca, 2.4),
  alegres: () => risco('M-9,-2.8 Q0,7 9,-2.8', CORES_ROSTO.boca, 2.8),
  grandes: () => elipse(0, 0.5, 3.8, 4.6, `fill="${CORES_ROSTO.dentro}" stroke="${CORES_ROSTO.boca}" stroke-width="1.4"`),
  // sorrisao: boca larga e redonda, dentinhos em cima, lingua rosada e os
  // cantinhos subindo, como bochecha empurrando
  sorriso: () => {
    const d = 'M-12.4,-4.2 Q0,-1.8 12.4,-4.2 Q12,10.4 0,12 Q-12,10.4 -12.4,-4.2 Z';
    return caminho(d, `fill="${CORES_ROSTO.dentro}"`) +
      sombra(caminho(d), caminho('M-12,-4.1 Q0,-1.8 12,-4.1 L11.1,1 Q0,2.8 -11.1,1 Z', 'fill="#ffffff"') +
        elipse(0, 9.2, 7, 4, 'fill="#ee8a92"')) +
      caminho(d, `fill="none" stroke="${CORES_ROSTO.boca}" stroke-width="1.7" stroke-linejoin="round"`) +
      risco('M-12.6,-4 Q-14.4,-5 -14.8,-7.2', CORES_ROSTO.boca, 1.8) +
      risco('M12.6,-4 Q14.4,-5 14.8,-7.2', CORES_ROSTO.boca, 1.8);
  },
  triste: () => risco('M-6,3 Q0,-2.5 6,3', CORES_ROSTO.boca, 2.4),
};

function boca(id) {
  const w = 44, h = 30; // alto o bastante para o sorrisao nao encostar na borda
  return svg(w * R, h * R, `<g transform="scale(${R}) translate(${w / 2},${h / 2})">${BOCAS[id]()}</g>`);
}

// ---------------------------------------------------------------- cabelo
// No quadro do cabelo (768): o corpo de 360x512 fica em (204,128)
const Q = 768, OX = (Q - W) / 2, OY = (Q - H) / 2;
const X = 384, TOPO = CABECA.topo + OY; // 140
const CY = TOPO + 70, RX = 66, RY = 70; // o cranio, quase uma elipse

/** A testa da ultima capa: o vao que o cabelo de volume nao pode tapar. */
let testa = '';

/** A capa do cabelo por cima do cranio, da linha do cabelo ate a altura `yb`. */
function capa(t, yb, linha = 'normal', franja = 198) {
  const rx = RX + t, ry = RY + t;
  const hw = rx * Math.sqrt(Math.max(0, 1 - ((yb - CY) / ry) ** 2));
  const linhas = {
    normal: `C${X + 66},196 ${X + 46},174 ${X},172 C${X - 46},174 ${X - 66},196 ${X - 63},${yb}`,
    alta: `C${X + 66},190 ${X + 44},166 ${X},164 C${X - 44},166 ${X - 66},190 ${X - 63},${yb}`,
    parte: `C${X + 68},194 ${X + 36},168 ${X - 16},170 C${X - 42},173 ${X - 64},192 ${X - 63},${yb}`,
    franja: `L${X + 66},${franja} Q${X},${franja + 6} ${X - 66},${franja} L${X - 63},${yb}`,
  };
  // abaixo do meio do cranio o arco por cima e o maior dos dois: large-arc = 1
  const grande = yb > CY ? 1 : 0;
  // o vao da testa desce ate abaixo do corte, senao sobra uma faixa no rosto
  const fundo = Math.max(yb, CORTE) + 4;
  testa = `M${X + 63},${yb} ${linhas[linha]} L${X - 68},${yb} L${X - 68},${fundo} L${X + 68},${fundo} L${X + 68},${yb} Z`;
  return caminho(`M${X - hw},${yb} A${rx},${ry} 0 ${grande} 1 ${X + hw},${yb} L${X + 63},${yb} ${linhas[linha]} Z`);
}

const parteMeio = (c) => risco(`M${X},${TOPO - 6} Q${X + 2},${TOPO + 14} ${X},${TOPO + 32}`, c, 2.6);

/** Mechas desenhadas: algumas linhas curvas por cima da capa. */
const mechas = (c, ds) => ds.map((d) => risco(d, c, 2.2)).join('');

/** Tranca: uma corrente de gomos do alto ate a ponta, com elastico. */
function tranca(x1, y1, x2, y2, gomos, elastico) {
  let s = '';
  for (let i = 0; i < gomos; i++) {
    const t = i / (gomos - 1);
    const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    s += elipse(x.toFixed(1), y.toFixed(1), 11 - t * 2, 13);
  }
  const ponta = `<path d="M${x2 - 8},${y2 + 12} Q${x2},${y2 + 34} ${x2 + 8},${y2 + 12} Z"/>`;
  return { gomos: s + ponta, elastico: elipse(x2, y2 + 9, 8, 4.5, `fill="${elastico}"`) };
}

const ROSA = '#ef6f8f';
const contornoDe = (cor) => escuro(cor, luz(cor) < 0.2 ? 0.45 : 0.42);

/** Marquinhas de cacho espalhadas, so por dentro das `formas` do cabelo. */
function cachinhos(cor, cx, cy, rx, ry, passo, formas) {
  let s = '';
  for (let y = cy - ry; y <= cy + ry; y += passo) {
    for (let x = cx - rx; x <= cx + rx; x += passo) {
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 > 1) continue;
      // tremido fixo (nao aleatorio): a mesma arte sai igual toda vez
      const jx = ((x * 7 + y * 13) % 9) - 4, jy = ((x * 11 + y * 5) % 7) - 3;
      s += `<path d="M${x + jx - 4},${y + jy} a${passo * 0.3},${passo * 0.3} 0 1 1 ${passo * 0.34},${passo * 0.26}"/>`;
    }
  }
  return sombra(formas, `<g fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round">${s}</g>`);
}

/**
 * Cachos em espiral, como no icone do app: colunas de ondinhas que descem,
 * desenhadas so por dentro do cabelo.
 */
function espirais(cor, colunas, formas) {
  let s = '';
  for (const [x, y0, y1] of colunas) {
    let d = `M${x},${y0}`;
    for (let y = y0, i = 0; y < y1; y += 14, i++) d += ` q${i % 2 ? -9 : 9},7 0,14`;
    s += `<path d="${d}"/>`;
  }
  return sombra(formas, `<g fill="none" stroke="${cor}" stroke-width="2.4" stroke-linecap="round">${s}</g>`);
}

/** Mecha que cai do lado do rosto, ondulando ate a ponta. */
function mechaLateral(lado, y0, y1, largura) {
  let s = '';
  const passos = 6;
  let xa = X + lado * 62, ya = y0;
  for (let i = 1; i <= passos; i++) {
    const t = i / passos;
    const x = X + lado * (64 + 12 * Math.sin(t * Math.PI * 1.6)), y = y0 + (y1 - y0) * t;
    s += tubo(xa, ya, x, y, largura * (1 - t * 0.35));
    xa = x; ya = y;
  }
  return s;
}

/** Pontinhas de mecha descendo da linha do cabelo: cabelo, nao chapeu. */
function pontas(de, ate, passo, largura, comprimento, yb = 0) {
  let s = '';
  for (let x = de; x <= ate; x += passo) {
    const y = 172 + 24 * ((x - X) / 63) ** 2 + yb;
    s += `<path d="M${x - largura / 2},${y - 6} L${x + largura * 0.2},${y + comprimento} L${x + largura / 2},${y - 6} Z"/>`;
  }
  return s;
}
/**
 * Acima desta altura o volume do cabelo vem para a frente; abaixo, fica atras
 * do corpo. Fica abaixo de toda capa, senao a borda dela marca a tempora.
 */
const CORTE = 238;

/**
 * Cada penteado: `tras` vai atras do corpo (volume, cabelo comprido) e
 * `frente` por cima da cabeca. `det` sao os riscos de mecha, por cima.
 */
function penteado(id, cor) {
  const fio = luz(cor) < 0.2 ? claro(cor, 0.2) : escuro(cor, 0.72);
  const brilho = claro(cor, 0.35);
  let tras = '', frente = '', det = '', solto = '';
  let textura = null; // (formas) => riscos so por dentro delas
  const cachos = (cx, cy, rx, ry, r, de, ate) => bolinhas(cx, cy, rx, ry, r, de, ate);
  switch (id) {
    case 'menino_curto':
    case 'menino_risco':
      frente = capa(9, 226, 'parte') + pontas(X - 44, X + 52, 16, 14, 10) +
        caminho(`M${X - 56},188 C${X - 34},164 ${X + 22},160 ${X + 64},186 C${X + 30},180 ${X - 6},186 ${X - 30},198 C${X - 42},202 ${X - 52},198 ${X - 56},188 Z`);
      det = mechas(fio, [`M${X - 30},150 Q${X},146 ${X + 34},158`, `M${X - 48},170 Q${X - 10},160 ${X + 30},170`]);
      if (id === 'menino_risco') det += risco(`M${X - 38},${TOPO - 2} Q${X - 32},${TOPO + 20} ${X - 34},${TOPO + 34}`, claro(cor, 0.55), 2.6);
      break;
    case 'menino_raspado':
      frente = capa(3, 224, 'alta');
      det = mechas(fio, [`M${X - 40},162 Q${X},152 ${X + 40},162`]);
      break;
    case 'menino_degrade':
      frente = `<g opacity="0.6">${capa(2, 228, 'alta')}</g>` + capa(12, 200, 'alta') + pontas(X - 40, X + 40, 16, 14, 8, -8);
      det = mechas(fio, [`M${X - 40},150 Q${X},128 ${X + 40},150`]);
      break;
    case 'menino_moicano':
      frente = `<g opacity="0.55">${capa(2, 228, 'alta')}</g>` +
        caminho(`M${X - 20},176 L${X - 26},140 L${X - 14},146 L${X - 16},110 L${X - 2},124 L${X + 6},96 L${X + 14},124 L${X + 24},112 L${X + 22},146 L${X + 30},142 L${X + 22},176 Z`);
      break;
    case 'menino_espetado': {
      let pontas = `M${X - 72},200 `;
      const xs = [-72, -58, -46, -30, -14, 2, 18, 34, 50, 62, 74];
      xs.forEach((dx, i) => { if (i) pontas += `L${X + dx - 8},${126 - (i % 2 ? 0 : 0) + Math.abs(dx) * 0.6} L${X + dx},${(i % 2 ? 112 : 140) + Math.abs(dx) * 0.55} `; });
      frente = capa(8, 226, 'normal') + caminho(pontas + `L${X + 74},200 Z`);
      break;
    }
    case 'menino_social':
      // social classico: repartido de lado, penteado para o lado, testa aberta
      frente = capa(13, 226, 'parte') +
        caminho(`M${X - 18},${TOPO - 10} C${X + 30},${TOPO - 16} ${X + 70},${TOPO + 10} ${X + 76},${TOPO + 52} L${X + 60},${TOPO + 40} C${X + 40},${TOPO + 16} ${X + 10},${TOPO + 6} ${X - 18},${TOPO + 8} Z`);
      det = risco(`M${X - 18},${TOPO - 8} L${X - 16},${TOPO + 30}`, claro(cor, 0.4), 2.2) +
        mechas(fio, [`M${X - 6},${TOPO + 4} Q${X + 34},${TOPO} ${X + 60},${TOPO + 30}`, `M${X - 10},${TOPO + 18} Q${X + 30},${TOPO + 14} ${X + 54},${TOPO + 44}`]);
      break;
    case 'menino_topete':
      // topete: o cabelo da frente sobe numa onda
      frente = capa(8, 226, 'alta') +
        caminho(`M${X - 46},${TOPO + 34} C${X - 46},${TOPO + 6} ${X - 20},${TOPO - 14} ${X + 14},${TOPO - 12} C${X + 44},${TOPO - 10} ${X + 54},${TOPO + 8} ${X + 44},${TOPO + 26} ` +
          `C${X + 28},${TOPO + 16} ${X},${TOPO + 16} ${X - 24},${TOPO + 38} Z`);
      det = mechas(fio, [`M${X - 30},${TOPO + 20} C${X - 26},${TOPO - 8} ${X},${TOPO - 20} ${X + 30},${TOPO - 14}`, `M${X - 12},${TOPO + 22} C${X - 4},${TOPO} ${X + 20},${TOPO - 6} ${X + 40},${TOPO + 4}`]);
      break;
    case 'menino_militar':
      // corte militar: curtinho e reto em cima, lados bem baixos
      frente = `<g opacity="0.6">${capa(2, 228, 'alta')}</g>` + capa(7, 210, 'alta') + pontas(X - 40, X + 40, 13, 10, 5, -6);
      det = mechas(fio, [`M${X - 44},${TOPO + 4} L${X + 44},${TOPO + 4}`]);
      break;
    case 'menino_franjinha':
      // franjinha reta e curta, estilo cesar
      frente = capa(8, 226, 'franja', 184) +
        Array.from({ length: 8 }, (_, i) => `<path d="M${X - 60 + i * 16},182 L${X - 54 + i * 16},190 L${X - 48 + i * 16},182 Z"/>`).join('');
      det = mechas(fio, [`M${X - 30},184 L${X - 34},${TOPO + 8}`, `M${X},186 L${X},${TOPO + 4}`, `M${X + 30},184 L${X + 34},${TOPO + 8}`]);
      break;
    case 'menino_para_tras':
      // penteado para tras: testa toda aberta, mechas correndo para a nuca
      frente = capa(10, 226, 'alta');
      det = mechas(fio, [`M${X - 46},172 C${X - 40},${TOPO + 4} ${X - 20},${TOPO - 4} ${X},${TOPO - 6}`, `M${X},168 C${X + 2},${TOPO + 6} ${X + 4},${TOPO - 2} ${X + 8},${TOPO - 8}`,
        `M${X + 46},172 C${X + 40},${TOPO + 4} ${X + 26},${TOPO - 2} ${X + 14},${TOPO - 6}`]) +
        risco(`M${X - 30},${TOPO + 2} Q${X - 16},${TOPO - 6} ${X - 2},${TOPO - 6}`, claro(cor, 0.45), 3, 'opacity="0.8"');
      break;
    case 'menino_ondulado':
      // ondulado curto: ondas grandes em cima e uma mecha caindo na testa
      frente = capa(12, 226, 'parte') + cachos(X, CY - 6, RX + 12, RY + 12, 15, 200, 340, 7) +
        caminho(`M${X - 36},176 C${X - 20},164 ${X + 10},170 ${X + 16},184 C${X + 2},180 ${X - 14},186 ${X - 20},196 C${X - 30},192 ${X - 38},186 ${X - 36},176 Z`);
      det = mechas(fio, [`M${X - 40},${TOPO + 8} q16,-12 32,0 q16,12 32,0`, `M${X - 30},${TOPO + 26} q14,-10 28,0 q14,10 28,0`]);
      break;
    case 'menino_nago': {
      // tranca nago: carreiras de trancinha da testa para a nuca
      // sem capa: entre uma carreira e outra aparece a pele, e e isso que le
      // como nago; cada carreira tem o proprio contorno
      frente = '';
      for (const dx of [-60, -36, -12, 12, 36, 60]) {
        let carreira = '';
        // a carreira nasce na linha do cabelo e sobe pela curva da cabeca
        const y0 = 176 + 22 * (dx / 63) ** 2;
        for (let i = 0; i < 9; i++) {
          const t = i / 8;
          const x = X + dx * (1 - 0.45 * t), y = y0 - (y0 - (TOPO + 2)) * t;
          carreira += elipse(x.toFixed(1), y.toFixed(1), 6.5, 6.5);
        }
        solto += grupo(carreira, cor, contornoDe(cor), 1.8);
      }
      break;
    }
    case 'menino_tigelinha':
      frente = capa(10, 236, 'franja', 198) + Array.from({ length: 9 }, (_, i) => `<path d="M${X - 64 + i * 16},196 L${X - 58 + i * 16},206 L${X - 52 + i * 16},196 Z"/>`).join('');
      det = mechas(fio, [`M${X - 40},198 L${X - 42},184`, `M${X},202 L${X},186`, `M${X + 40},198 L${X + 42},184`]);
      break;
    case 'menino_cacheado':
      frente = capa(10, 226, 'normal') + cachos(X, CY, RX + 9, RY + 9, 13, 192, 348) + cachos(X, 182, 52, 12, 9, 180, 360);
      textura = (f) => cachinhos(fio, X, 180, 90, 60, 14, f);
      break;
    case 'menino_crespo':
      frente = capa(16, 226, 'normal') + cachos(X, CY - 4, RX + 13, RY + 13, 10, 190, 350);
      textura = (f) => cachinhos(fio, X, 176, 90, 56, 11, f);
      break;
    case 'menino_black_power':
      tras = elipse(X, 206, 106, 100) + cachos(X, 206, 106, 100, 16);
      frente = capa(18, 230, 'normal') + cachos(X, CY, RX + 14, RY + 14, 12, 190, 350);
      textura = (f) => cachinhos(fio, X, 206, 110, 104, 15, f);
      break;
    case 'crespo':
      tras = elipse(X, 214, 116, 110) + cachos(X, 214, 116, 110, 18);
      frente = capa(18, 230, 'normal') + cachos(X, CY, RX + 14, RY + 14, 12, 190, 350) + cachos(X, 180, 50, 10, 8, 180, 360);
      textura = (f) => cachinhos(fio, X, 214, 120, 114, 16, f);
      break;
    case 'cacheado': {
      // referencia: o cabelo do icone do app. Cacho em espiral, volume largo
      // na altura das bochechas, ate o ombro, e mechas caindo do lado do rosto
      tras = caminho(`M${X - 80},172 C${X - 116},206 ${X - 118},272 ${X - 104},322 C${X - 96},342 ${X - 66},346 ${X - 36},338 ` +
        `L${X + 36},338 C${X + 66},346 ${X + 96},342 ${X + 104},322 C${X + 118},272 ${X + 116},206 ${X + 80},172 C${X + 66},118 ${X - 66},118 ${X - 80},172 Z`) +
        cachos(X, 236, 106, 104, 16, 110, 430);
      frente = capa(12, 222, 'normal') + cachos(X, CY, RX + 10, RY + 10, 14, 196, 344) +
        mechaLateral(-1, 196, 296, 32) + mechaLateral(1, 196, 296, 32);
      textura = (f) =>
        espirais(fio, [
          [X - 96, 200, 320], [X - 80, 214, 330], [X + 80, 214, 330], [X + 96, 200, 320],
          [X - 66, 202, 300], [X + 66, 202, 300], [X - 104, 230, 300], [X + 104, 230, 300],
        ], f) + cachinhos(fio, X, 160, 70, 34, 14, f);
      // cachinhos soltos saindo do contorno, como no icone
      det = risco(`M${X - 40},${TOPO - 12} q-8,-10 2,-16`, contornoDe(cor), 2.4) +
        risco(`M${X + 34},${TOPO - 10} q10,-8 2,-17`, contornoDe(cor), 2.4) +
        risco(`M${X - 104},196 q-12,-2 -10,-14`, contornoDe(cor), 2.4);
      break;
    }
    case 'enrolado': {
      const g = 1.12;
      const fundo = caminho(`M${X - 84 * g},180 C${X - 104 * g},250 ${X - 104 * g},310 ${X - 92 * g},${340 * g} L${X + 92 * g},${340 * g} C${X + 104 * g},310 ${X + 104 * g},250 ${X + 84 * g},180 C${X + 70},126 ${X - 70},126 ${X - 84 * g},180 Z`);
      tras = fundo + cachos(X, 250, 96 * g, 96 * g, 17 * g, 130, 410);
      frente = capa(12, 226, 'normal') + cachos(X, CY, RX + 10, RY + 10, 13, 190, 350);
      textura = (f) => cachinhos(fio, X, 250, 110 * g, 130 * g, 17, f);
      break;
    }
    case 'ondulado':
      tras = caminho(`M${X - 82},180 C${X - 104},230 ${X - 86},270 ${X - 102},310 C${X - 92},336 ${X - 60},340 ${X},336 C${X + 60},340 ${X + 92},336 ${X + 102},310 C${X + 86},270 ${X + 104},230 ${X + 82},180 C${X + 70},126 ${X - 70},126 ${X - 82},180 Z`);
      frente = capa(10, 222, 'parte') +
        caminho(`M${X - 64},196 C${X - 78},232 ${X - 66},262 ${X - 82},298 L${X - 92},292 C${X - 80},258 ${X - 90},230 ${X - 76},196 Z`) +
        caminho(`M${X + 64},196 C${X + 78},232 ${X + 66},262 ${X + 82},298 L${X + 92},292 C${X + 80},258 ${X + 90},230 ${X + 76},196 Z`);
      det = mechas(fio, [`M${X - 20},158 Q${X + 20},150 ${X + 50},170`, `M${X - 50},176 Q${X - 30},160 ${X - 4},160`]);
      break;
    case 'liso_longo':
      tras = caminho(`M${X - 80},190 L${X - 90},430 Q${X},444 ${X + 90},430 L${X + 80},190 C${X + 70},128 ${X - 70},128 ${X - 80},190 Z`);
      frente = capa(9, 222, 'normal') +
        caminho(`M${X - 64},194 L${X - 70},360 L${X - 92},356 L${X - 78},194 Z`) +
        caminho(`M${X + 64},194 L${X + 70},360 L${X + 92},356 L${X + 78},194 Z`);
      det = parteMeio(fio) + mechas(fio, [`M${X - 74},230 L${X - 80},340`, `M${X + 74},230 L${X + 80},340`]);
      break;
    case 'liso_curto':
      tras = caminho(`M${X - 82},190 L${X - 86},296 Q${X},308 ${X + 86},296 L${X + 82},190 C${X + 70},128 ${X - 70},128 ${X - 82},190 Z`);
      frente = capa(10, 226, 'franja', 196) +
        caminho(`M${X - 64},196 L${X - 66},298 L${X - 88},294 L${X - 80},196 Z`) +
        caminho(`M${X + 64},196 L${X + 66},298 L${X + 88},294 L${X + 80},196 Z`);
      det = mechas(fio, [`M${X - 30},196 L${X - 32},180`, `M${X + 10},198 L${X + 10},182`, `M${X + 44},196 L${X + 46},180`]);
      break;
    case 'trancas':
    case 'tranca_unica': {
      frente = capa(8, 226, 'normal');
      det = id === 'trancas' ? parteMeio(fio) : '';
      const lados = id === 'trancas' ? [-1, 1] : [1];
      for (const l of lados) {
        const t = tranca(X + l * 70, 236, X + l * 84, 352, 6, ROSA);
        frente += t.gomos;
        solto += t.elastico;
      }
      break;
    }
    case 'coque':
      frente = capa(8, 226, 'normal') + `<circle cx="${X}" cy="${TOPO - 14}" r="30"/>`;
      solto = elipse(X, TOPO + 12, 18, 5, `fill="${ROSA}"`);
      det = mechas(fio, [`M${X - 50},190 Q${X - 30},150 ${X - 8},140`, `M${X + 50},190 Q${X + 30},150 ${X + 8},140`]);
      break;
    case 'maria_chiquinha':
      tras = elipse(X - 92, 240, 26, 38, `transform="rotate(18 ${X - 92} 240)"`) + elipse(X + 92, 240, 26, 38, `transform="rotate(-18 ${X + 92} 240)"`);
      frente = capa(8, 226, 'normal');
      solto = `<circle cx="${X - 72}" cy="226" r="7" fill="${ROSA}"/><circle cx="${X + 72}" cy="226" r="7" fill="${ROSA}"/>`;
      det = parteMeio(fio);
      break;
    case 'box_braids':
    case 'dreads': {
      const grosso = id === 'dreads' ? 15 : 9;
      tras = caminho(`M${X - 82},190 L${X - 92},380 Q${X},392 ${X + 92},380 L${X + 82},190 C${X + 70},128 ${X - 70},128 ${X - 82},190 Z`);
      frente = capa(9, 222, 'normal');
      for (const l of [-1, 1]) {
        const n = id === 'dreads' ? 2 : 3;
        for (let i = 0; i < n; i++) frente += tubo(X + l * (66 + i * grosso * 0.9), 200, X + l * (70 + i * grosso), 350 - i * 12, grosso);
      }
      det = parteMeio(fio) + mechas(fio, [`M${X - 60},150 L${X - 30},144`, `M${X + 60},150 L${X + 30},144`]);
      break;
    }
    default:
      throw new Error(`penteado sem desenho: ${id}`);
  }
  const contorno = escuro(cor, luz(cor) < 0.2 ? 0.45 : 0.42);
  const tex = (formas) => (textura ? textura(formas) : '');
  let corpoFrente = grupo(frente, cor, contorno) + tex(frente);
  if (tras) {
    // Acima da orelha o volume e a capa sao um cabelo so, com um contorno so:
    // desenhar separado deixa um risco em volta do alto e vira capacete. Abaixo
    // dali o volume fica atras do corpo, e a emenda nao aparece porque o
    // contorno e a cor sao os mesmos dos dois lados do corte.
    const a = `c${ids++}`, b = `c${ids++}`, c = `c${ids++}`;
    corpoFrente =
      `<clipPath id="${a}"><rect x="0" y="0" width="${Q}" height="${CORTE}"/></clipPath>` +
      `<clipPath id="${c}"><path clip-rule="evenodd" d="M0,0 H${Q} V${Q} H0 Z ${testa}"/></clipPath>` +
      `<clipPath id="${b}"><rect x="0" y="${CORTE}" width="${Q}" height="${Q}"/></clipPath>` +
      // o vao do rosto corta so o volume de tras; capa e mechas da frente ficam inteiras
      `<g clip-path="url(#${a})">` +
      `<g fill="${contorno}" stroke="${contorno}" stroke-width="${LW * 2}" stroke-linejoin="round"><g clip-path="url(#${c})">${tras}</g>${frente}</g>` +
      `<g fill="${cor}"><g clip-path="url(#${c})">${tras}</g>${frente}</g>` +
      `<g clip-path="url(#${c})">${tex(frente + tras)}</g></g>` +
      `<g clip-path="url(#${b})">${grupo(frente, cor, contorno)}${tex(frente)}</g>`;
  }
  const frenteSvg = corpoFrente + det +
    risco(`M${X - 44},${TOPO + 4} Q${X - 30},${TOPO - 6} ${X - 12},${TOPO - 8}`, brilho, 3, 'opacity="0.7"') + solto;
  // atras do pescoco o cabelo fica na sombra
  const trasSvg = tras
    ? grupo(tras, cor, contorno) + sombra(tras, elipse(X, 316, 70, 50, `fill="${escuro(cor, 0.8)}"`)) + tex(tras)
    : '';
  return { frente: svg(Q, Q, frenteSvg), tras: trasSvg && svg(Q, Q, trasSvg) };
}

// iguais a CATALOGO_CABELOS e CATALOGO_ROUPAS de src/personagem.ts
const CABELOS = [
  'cacheado', 'crespo', 'ondulado', 'enrolado', 'liso_longo', 'liso_curto', 'trancas', 'tranca_unica',
  'coque', 'maria_chiquinha', 'box_braids', 'dreads', 'menino_curto', 'menino_cacheado', 'menino_crespo',
  'menino_black_power', 'menino_espetado', 'menino_tigelinha', 'menino_raspado', 'menino_degrade',
  'menino_risco', 'menino_moicano', 'menino_social', 'menino_topete', 'menino_militar', 'menino_franjinha',
  'menino_para_tras', 'menino_ondulado', 'menino_nago',
];
const CORPOS = ['', '_macacao', '_vestido_rosa', '_roxo', '_azul', '_vermelho'];

// ---------------------------------------------------------------- saida
async function main() {
  const so = process.argv[2]; // npm run personagem -- previa  -> so desenha, nao grava
  const navegador = await chromium.launch();
  const page = await navegador.newPage({ deviceScaleFactor: 1 });
  const feitos = [];

  async function gravar(nome, codigo) {
    const w = Number(/width="(\d+)"/.exec(codigo)[1]), h = Number(/height="(\d+)"/.exec(codigo)[1]);
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${codigo}</body></html>`);
    const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
    const caminhoPng = join(so ? so : IMG, `${nome}.png`);
    writeFileSync(caminhoPng, png);
    feitos.push(caminhoPng);
  }

  for (const c of CORPOS) for (let i = 0; i < PELES.length; i++) await gravar(`corpo${c}_pele${i + 1}`, corpo(c, PELES[i]));
  for (const id of Object.keys(OLHOS)) {
    await gravar(`olhos_${id}`, olhos(id));
    await gravar(`boca_${id}`, boca(id));
  }
  for (const id of CABELOS) {
    for (let i = 0; i < CORES.length; i++) {
      const { frente, tras } = penteado(id, CORES[i]);
      await gravar(`cabelo_${id}_${i + 1}`, frente);
      if (tras) await gravar(`cabelofundo_${id}_${i + 1}`, tras);
    }
  }
  await navegador.close();

  if (!so) {
    // o fundo de cabelo antigo era um so por penteado, branco para tingir
    for (const f of readdirSync(IMG)) if (/^cabelofundo_[a-z_]+?\.png$/.test(f) && !/_\d\.png$/.test(f)) unlinkSync(join(IMG, f));
    const cab = (dy) => ({ topo: (CABECA.topo + dy) / H, queixo: (CABECA.queixo + dy) / H, largura: CABECA.larg / H, cx: 0 });
    const cabecas = Object.fromEntries(CORPOS.map((c) => [c, cab(0)]));
    writeFileSync(join(RAIZ, 'src', 'cabecas.json'), JSON.stringify(cabecas, null, 2) + '\n');
  }
  // PNG de paleta: arte chapada fica varias vezes menor sem diferenca visivel
  const py = spawnSync('python', ['-I', '-c',
    'import sys\nfrom PIL import Image\nfor f in sys.stdin.read().split("\\n"):\n    if f: Image.open(f).quantize(colors=128, method=Image.Quantize.FASTOCTREE).save(f, optimize=True)'],
  { input: feitos.join('\n'), encoding: 'utf8' });
  if (py.status !== 0) throw new Error(py.stderr);
  console.log(`${feitos.length} pecas do personagem -> ${so || IMG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
