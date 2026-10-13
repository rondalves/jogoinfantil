import type Phaser from 'phaser';
import { hojeISO } from './economia';
import { ativo, salvar } from './storage';

/**
 * Tempo de joguinho por dia.
 *
 * Joguinho nao acaba sozinho (a corrida vai ate acabar as vidas, a memoria
 * tem rodada atras de rodada), entao o limite e de tempo: passou dele, aparece
 * o aviso "ja fez as suas tarefas?" e so um adulto libera mais um pouco. Conta
 * so o tempo dentro do jogo, e zera no dia seguinte.
 */

export interface TempoJogo {
  dia: string;
  /** milissegundos jogados no dia */
  ms: number;
  /** minutos a mais que um adulto ja liberou no dia */
  extra: number;
}

/** Opcoes do painel dos pais, em minutos. */
export const LIMITES_MIN = [10, 15, 20, 30];
export const LIMITE_PADRAO = 15;
/** O que o adulto libera de cada vez. */
export const EXTRA_MIN = 10;

/** Puro: soma tempo ao dia, comecando do zero quando o dia muda. */
export function somar(t: TempoJogo | undefined, dia: string, ms: number): TempoJogo {
  if (!t || t.dia !== dia) return { dia, ms, extra: 0 };
  return { ...t, ms: t.ms + ms };
}

/** Puro: ja passou do limite de hoje (contando o que o adulto liberou)? */
export function estourou(t: TempoJogo | undefined, dia: string, limiteMin: number): boolean {
  if (!t || t.dia !== dia) return false;
  return t.ms >= (limiteMin + t.extra) * 60_000;
}

/** Puro: o adulto liberou mais um pouco hoje. */
export function liberarMais(t: TempoJogo | undefined, dia: string, limiteMin: number): TempoJogo {
  const hoje = t && t.dia === dia ? t : { dia, ms: 0, extra: 0 };
  // libera a partir de agora: se ja tinha passado do limite, nao estoura de
  // novo no segundo seguinte
  const usado = Math.ceil(hoje.ms / 60_000);
  return { ...hoje, extra: Math.max(hoje.extra, usado - limiteMin) + EXTRA_MIN };
}

export const limiteDoPerfil = () => ativo()?.limiteJogoMin ?? LIMITE_PADRAO;

/**
 * Conta o tempo enquanto a cena do joguinho roda. Passou do limite, pausa a
 * cena e abre o aviso por cima; o relogio da cena pausada para junto, entao o
 * tempo do aviso nao conta.
 */
export function vigiarTempo(cena: Phaser.Scene) {
  // o perfil e lido uma vez e os segundos ficam em `pendente` ate gravar: ler
  // e gravar a cada segundo perdia o que nao tinha sido gravado
  let p = ativo();
  let pendente = 0;
  const gravar = () => {
    if (!p || pendente === 0) return;
    p.tempoJogo = somar(p.tempoJogo, hojeISO(), pendente);
    pendente = 0;
    salvar(p);
  };
  const avisar = () => {
    if (cena.scene.isPaused()) return;
    gravar();
    cena.scene.pause();
    cena.scene.launch('AvisoTempo', { volta: cena.scene.key });
    // as cenas desenham na ordem da lista: o aviso precisa ficar por cima
    cena.scene.bringToTop('AvisoTempo');
  };
  const tique = () => {
    if (!p) return;
    pendente += 1000;
    if (pendente >= 10_000) gravar();
    if (estourou(somar(p.tempoJogo, hojeISO(), pendente), hojeISO(), limiteDoPerfil())) avisar();
  };
  cena.time.addEvent({ delay: 1000, loop: true, callback: tique });
  // voltou para o joguinho depois do limite: o aviso aparece de cara
  if (p && estourou(p.tempoJogo, hojeISO(), limiteDoPerfil())) cena.time.delayedCall(300, avisar);
  // o adulto liberou mais tempo pelo aviso: o perfil gravado mudou
  const reler = () => {
    p = ativo();
  };
  cena.events.on('resume', reler);
  // os eventos da cena sobrevivem ao restart ("jogar de novo"): sem o off, acumulavam
  cena.events.once('shutdown', () => {
    gravar();
    cena.events.off('resume', reler);
  });
}
