import type { Missao } from '../types';

// Uma missao = um JSON nesta pasta. O motor carrega sozinho, em ordem de nome.
const mods = import.meta.glob('./*.json', { eager: true, import: 'default' }) as Record<string, Missao>;

// a ordem e a do numero, a nao ser que a missao diga outra ("ordem": 5.5 entra
// logo depois da 05): missao nova cai no lugar certo do dia sem renumerar as outras
export const MISSOES: Missao[] = Object.keys(mods)
  .map((k) => mods[k])
  .sort((a, b) => (a.ordem ?? Number(a.id)) - (b.ordem ?? Number(b.id)));

export const missaoPorId = (id: string) => MISSOES.find((m) => m.id === id);

export const missoesDoMundo = (mundo: number) => MISSOES.filter((m) => m.mundo === mundo && !m.bonus);

export const missoesBonus = () => MISSOES.filter((m) => m.bonus);

/** Terminou tudo: os cinco mundos e as missoes bonus. */
export const jogoCompleto = (feitas: Record<string, number>) =>
  MISSOES.length > 0 && MISSOES.every((m) => feitas[m.id]);

export const mundoCompleto = (mundo: number, feitas: Record<string, number>) => {
  const ids = missoesDoMundo(mundo).map((m) => m.id);
  return ids.length > 0 && ids.every((id) => feitas[id]);
};
