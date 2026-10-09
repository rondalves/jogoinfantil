/**
 * As historinhas da biblioteca.
 *
 * Uma historinha = um JSON nesta pasta. So ouvir: nao tem estrela, nao tem
 * erro e nao gasta ficha. Enquanto o audio nao existe, o cartao aparece como
 * "em breve" em vez de sumir — a crianca ve que ainda vai chegar.
 */
export interface Historia {
  id: string;
  titulo: string;
  icone: string;
  /** arte da capa em assets/img; cai no icone se nao existir */
  capa: string;
  /** caminho em assets/audio, sem extensao */
  audio: string;
  /** segundos; 0 enquanto o audio nao foi gravado */
  duracao: number;
  /** mundo que precisa estar fechado para abrir esta historinha */
  mundo: number;
}

const mods = import.meta.glob('./*.json', { eager: true, import: 'default' }) as Record<string, Historia>;

export const HISTORIAS: Historia[] = Object.keys(mods)
  .sort()
  .map((k) => mods[k]);

export const historiaDoMundo = (mundo: number) => HISTORIAS.find((h) => h.mundo === mundo);
