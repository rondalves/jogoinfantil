/**
 * Inclinar o celular para trocar de faixa, sem puxar sozinho para um lado.
 *
 * Antes, passar de 14 graus ja virava, e repetia a cada 0,3 s: celular que a
 * crianca segura meio torto ia faixa por faixa ate a borda e la ficava. Aqui o
 * "reto" e o jeito que o celular estava no comeco (e vai se ajustando devagar
 * enquanto esta parado); cada inclinada anda uma faixa so, e para andar de
 * novo e preciso voltar perto do reto.
 */
export class Volante {
  private reto: number | null = null;
  private armado = true;

  constructor(
    private readonly zona = 7,
    private readonly gatilho = 16,
  ) {}

  /** Le a inclinacao (gamma, em graus) e diz para onde andar: -1, 0 ou 1. */
  ler(gamma: number): -1 | 0 | 1 {
    if (this.reto === null) {
      this.reto = gamma;
      return 0;
    }
    const d = gamma - this.reto;
    if (Math.abs(d) < this.zona) {
      this.armado = true;
      this.reto = this.reto * 0.97 + gamma * 0.03;
      return 0;
    }
    if (!this.armado || Math.abs(d) < this.gatilho) return 0;
    this.armado = false;
    return d > 0 ? 1 : -1;
  }
}
