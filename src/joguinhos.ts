/**
 * Os joguinhos: um por mundo, liberado quando a crianca fecha o mundo.
 *
 * Sao o premio do mundo (nao existe mais mini game de ficha). Nao gastam
 * nada; a crianca volta a jogar quantas vezes quiser, ate o tempo do dia
 * (tempoDeJogo.ts).
 *
 * O catalogo e JSON (src/minigames/NN-nome.json); quem desenha cada tipo e o
 * `tipo`, lido pela tela do joguinho.
 */
export interface Joguinho {
  id: string;
  titulo: string;
  icone: string;
  /** qual brincadeira abrir: colorir, memoria, corrida, encaixe, moto, quebra (ver ABRIR em scenes/Joguinhos.ts) */
  tipo: string;
  /** mundo que, fechado, libera este joguinho */
  mundo: number;
}

const mods = import.meta.glob('./minigames/*.json', { eager: true, import: 'default' }) as Record<
  string,
  Joguinho
>;

export const JOGUINHOS: Joguinho[] = Object.keys(mods)
  .sort()
  .map((k) => mods[k]);

export const joguinhoDoMundo = (mundo: number) => JOGUINHOS.find((j) => j.mundo === mundo);
