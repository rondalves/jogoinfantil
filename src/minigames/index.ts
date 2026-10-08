import type Phaser from 'phaser';
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
  iniciar(cena: Phaser.Scene, personagem: PersonagemCfg, dificuldade: number): Promise<ResultadoMiniGame>;
}

// ETAPA 3: escalada (2), corredor (3), quebra-cabeca (4), ceu das estrelas (5).
export const MINIGAMES: MiniGame[] = [corrida];

export const miniGameDoMundo = (mundo: number) => MINIGAMES.find((g) => g.mundo === mundo);

export const liberados = (broches: number[]) => MINIGAMES.filter((g) => broches.includes(g.mundo));
