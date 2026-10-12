import type Phaser from 'phaser';
import type { Chave } from '../narracoes';
import type { PersonagemCfg } from '../storage';
import { corrida } from './corrida';

export interface ResultadoMiniGame {
  /** pontos da partida (nunca ha derrota nem game over) */
  pontos: number;
  concluido: boolean;
}

/** Interface comum a todos os mini games: iniciar(personagem, dificuldade) -> resultado. */
export interface MiniGame {
  id: string;
  mundo: number;
  nome: string;
  icone: string;
  /** titulo da tela de resultado */
  tituloFim: string;
  /** chave da frase narrada no fim (src/narracoes.json) */
  fraseFim: Chave;
  /** arte do que foi colecionado na partida */
  iconePonto: string;
  /** arte que este jogo precisa (carregada na hora de abrir) */
  arte: string[];
  iniciar(
    cena: Phaser.Scene,
    personagem: PersonagemCfg,
    dificuldade: number,
    opcoes?: { infinito?: boolean },
  ): Promise<ResultadoMiniGame>;
}

/** So o kart sobrou daqui: virou o joguinho do mundo 3 (scenes/MiniGame.ts). */
export const MINIGAMES: MiniGame[] = [corrida];


