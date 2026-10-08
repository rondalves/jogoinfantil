import frases from './narracoes.json';
import { narrador } from './narrador';

/**
 * Todas as frases da interface num lugar so. A chave e tambem o nome do
 * arquivo de audio (assets/audio/<chave>.mp3) e a linha do narracao.csv.
 * Sem o arquivo, a frase e lida pela voz do navegador em pt-BR.
 */
export const FRASES: Record<string, { texto: string; local: string }> = frases;

export type Chave = keyof typeof frases;

/** Narra a frase da chave e devolve o texto ja com o nome da crianca. */
export function fale(chave: Chave) {
  return narrador.falar(FRASES[chave].texto, chave);
}
