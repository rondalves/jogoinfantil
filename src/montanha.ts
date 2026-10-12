/**
 * O relevo do joguinho da moto, fase a fase (y cresce para baixo, como na
 * tela). Cada fase comeca num trecho plano com bandeira, que e onde a moto
 * volta quando perde uma vida, e fica mais dificil que a anterior: morros
 * mais altos e mais ingremes e, a partir da fase 2, buracos com rampa antes.
 *
 * O relevo sai de um sorteio com semente: a mesma semente da sempre a mesma
 * montanha (e o que deixa testar).
 */

export const CHAO = 900;
/** comprimento de cada fase, em px */
export const FASE = 2600;
/** moto: a rampa mais dura que sobe parada e a velocidade maxima (ver MotoMontanha) */
export const VEL_MAX = 720;
export const GRAVIDADE = 1100;

/** Trecho de relevo entre dois pontos: curva macia (morro) ou reta (rampa, plano). */
export interface Trecho {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  reta: boolean;
}

export interface Buraco {
  x0: number;
  x1: number;
}

/** Sorteio com semente (mulberry32). */
export function sorteador(semente: number) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rampa mais inclinada da fase, em graus: cresce e para em 62. */
export const inclinacaoMaxima = (fase: number) => Math.min(62, 30 + 7 * (fase - 1));
/** Altura dos morros da fase, em px. */
const alturaMorro = (fase: number) => Math.min(320, 90 + 45 * (fase - 1));
/** Largura dos buracos da fase, em px (a partir da fase 2). */
export const larguraBuraco = (fase: number) => Math.min(220, 90 + 30 * (fase - 2));

export class Montanha {
  readonly trechos: Trecho[] = [];
  readonly buracos: Buraco[] = [];
  /** x da bandeira de cada fase: bandeiras[0] e a largada */
  readonly bandeiras: number[] = [];
  private x = 0;
  private y = CHAO;
  private fase = 0;
  private sorte: () => number;

  constructor(semente: number) {
    this.sorte = sorteador(semente);
    this.gerarAte(FASE * 2);
  }

  private entre(a: number, b: number) {
    return a + (b - a) * this.sorte();
  }

  private ate(dx: number, dy: number, reta = false) {
    this.trechos.push({ x0: this.x, x1: this.x + dx, y0: this.y, y1: this.y + dy, reta });
    this.x += dx;
    this.y += dy;
  }

  /** Gera fases ate cobrir o x pedido. */
  gerarAte(x: number) {
    while (this.x < x) this.novaFase();
  }

  private novaFase() {
    this.fase += 1;
    const f = this.fase;
    // largada da fase: plano com bandeira
    this.ate(f === 1 ? 520 : 360, 0, true);
    this.bandeiras.push(this.x - (f === 1 ? 420 : 260));
    const fim = this.x + FASE;
    const graus = inclinacaoMaxima(f);
    const altura = alturaMorro(f);
    while (this.x < fim) {
      if (f >= 2 && this.sorte() < 0.3) {
        this.buraco(f);
        continue;
      }
      // morro: sobe e desce um pouco menos, entao a montanha vai subindo
      const sobe = this.entre(0.55, 1) * altura;
      const desce = sobe * this.entre(0.55, 0.95);
      this.ate(this.larguraPara(sobe, graus), -sobe);
      this.ate(this.larguraPara(desce, graus), desce);
      if (this.sorte() < 0.35) this.ate(this.entre(80, 200), 0, true);
    }
  }

  /** Curva macia (cosseno) tem a rampa mais forte no meio: pi/2 * dy/dx. */
  private larguraPara(dy: number, graus: number) {
    const tg = Math.tan((this.entre(0.7, 1) * graus * Math.PI) / 180);
    return Math.max(90, ((Math.PI / 2) * dy) / tg);
  }

  /** Rampa reta, o buraco e um plano para pousar um pouco mais baixo. */
  private buraco(f: number) {
    this.ate(120, 0, true);
    this.ate(170, -Math.min(80, 45 + 8 * f), true);
    const x0 = this.x;
    this.x += larguraBuraco(f);
    this.y += 30;
    this.buracos.push({ x0, x1: this.x });
    this.ate(260, 0, true);
  }

  /** Fase em que o x esta (1 = a primeira). */
  faseEm(x: number) {
    let f = 0;
    for (const b of this.bandeiras) if (x >= b) f += 1;
    return Math.max(1, f);
  }

  /** y do chao em x; Infinity dentro de um buraco. */
  chao(x: number): number {
    this.gerarAte(x + FASE);
    const t = this.trechoEm(x);
    if (!t) return x < 0 ? CHAO : Infinity;
    const k = (x - t.x0) / (t.x1 - t.x0);
    const s = t.reta ? k : (1 - Math.cos(Math.PI * k)) / 2;
    return t.y0 + (t.y1 - t.y0) * s;
  }

  /** Inclinacao (dy/dx) em x; 0 dentro de buraco. */
  inclinacao(x: number, h = 2): number {
    const a = this.chao(x - h);
    const b = this.chao(x + h);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
    return (b - a) / (2 * h);
  }

  private trechoEm(x: number): Trecho | undefined {
    const ts = this.trechos;
    let lo = 0;
    let hi = ts.length - 1;
    while (lo <= hi) {
      const m = (lo + hi) >> 1;
      if (x < ts[m].x0) hi = m - 1;
      else if (x >= ts[m].x1) lo = m + 1;
      else return ts[m];
    }
    return undefined;
  }
}
