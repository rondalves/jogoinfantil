/**
 * Miolo das etapas que dependem de tempo e de movimento do dedo, sem Phaser.
 * Fica separado para poder ser testado sem abrir o jogo.
 */

/** Conta o tempo so enquanto esta rodando (a crianca soltou o dedo, para). */
export class Cronometro {
  private passados = 0;
  private rodando = false;

  constructor(readonly segundos: number) {}

  pausar() {
    this.rodando = false;
  }

  retomar() {
    this.rodando = true;
  }

  get ativo() {
    return this.rodando;
  }

  /** Avanca dt segundos. Devolve true quando o tempo fecha. */
  avancar(dt: number) {
    if (this.rodando && !this.terminou) this.passados += dt;
    return this.terminou;
  }

  get progresso() {
    return this.segundos <= 0 ? 1 : Math.min(1, this.passados / this.segundos);
  }

  get terminou() {
    return this.passados >= this.segundos;
  }

  /** Segundos que faltam, arredondados para cima (o que aparece no relogio). */
  get faltam() {
    return Math.max(0, Math.ceil(this.segundos - this.passados));
  }
}

/** Soma o caminho do dedo e limpa um pedaco a cada tanto de distancia. */
export class Esfrega {
  private distancia = 0;
  private feitos = 0;

  constructor(
    readonly total: number,
    readonly limiar = 140,
  ) {}

  /** Devolve true quando esse movimento limpou mais um pedaco. */
  mover(dx: number, dy: number) {
    if (this.completo) return false;
    this.distancia += Math.hypot(dx, dy);
    if (this.distancia < this.limiar) return false;
    this.distancia -= this.limiar;
    this.feitos += 1;
    return true;
  }

  get limpos() {
    return this.feitos;
  }

  get faltam() {
    return Math.max(0, this.total - this.feitos);
  }

  get completo() {
    return this.feitos >= this.total;
  }
}
