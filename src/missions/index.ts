import type { Missao } from '../types';

// Uma missao = um JSON nesta pasta. O motor carrega sozinho, em ordem de nome.
const mods = import.meta.glob('./*.json', { eager: true, import: 'default' }) as Record<string, Missao>;

export const MISSOES: Missao[] = Object.keys(mods)
  .sort()
  .map((k) => mods[k]);

export const missaoPorId = (id: string) => MISSOES.find((m) => m.id === id);

export const missoesDoMundo = (mundo: number) => MISSOES.filter((m) => m.mundo === mundo && !m.bonus);

export const missoesBonus = () => MISSOES.filter((m) => m.bonus);

export const mundoCompleto = (mundo: number, feitas: Record<string, number>) => {
  const ids = missoesDoMundo(mundo).map((m) => m.id);
  return ids.length > 0 && ids.every((id) => feitas[id]);
};
