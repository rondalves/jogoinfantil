/**
 * Os joguinhos livres da biblioteca.
 *
 * Diferentes dos mini games de ficha: estes sao premio de mundo fechado, nao
 * gastam nada, nao tem derrota, nao tem erro que pune e nao dao estrela. A
 * crianca volta a jogar quantas vezes quiser.
 *
 * O catalogo e JSON (src/minigames/NN-nome.json); quem desenha cada tipo e o
 * `tipo`, lido pela tela do joguinho.
 */
export interface Joguinho {
  id: string;
  titulo: string;
  icone: string;
  /** qual brincadeira desenhar: bolhas, memoria, cores, encaixe, montar, constelacao */
  tipo: string;
  /** mundo que precisa estar fechado para abrir este joguinho */
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
