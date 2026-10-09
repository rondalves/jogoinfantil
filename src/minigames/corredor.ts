import { CONFIG } from '../config';
import { fale } from '../narracoes';
import { desenharPersonagem } from '../personagem';
import { correrFaixas } from './faixas';
import type { MiniGame, ResultadoMiniGame } from './index';

const W = CONFIG.LARGURA;
const H = CONFIG.DESENHO;

/**
 * Corredor em tres faixas (mundo 3): a crianca corre, pega estrelas e desvia
 * de cones e pocas. Mesmo motor da corrida de kart, sem o kart.
 */
export const corredor: MiniGame = {
  id: 'corredor',
  mundo: 3,
  nome: 'Corredor',
  icone: '\u{1F3C3}',
  tituloFim: 'Que corrida boa!',
  fraseFim: 'mg3_fim',
  iconePonto: 'mg3_estrela',
  arte: ['mg3_estrela', 'mg3_cone', 'mg3_poca', 'mg3_caixa', 'mg3_balao', 'mg1_chegada', 'bg_corredor'],
  iniciar(cena, personagem) {
    return new Promise<ResultadoMiniGame>((resolve) => {
      if (cena.textures.exists('bg_corredor')) {
        const bg = cena.add.image(W / 2, H / 2, 'bg_corredor').setDepth(-11);
        bg.setScale(Math.max(W / bg.width, H / bg.height)).setAlpha(0.6);
      }
      fale('mg3_como_jogar');
      correrFaixas(
        cena,
        personagem,
        {
          ceu: 0xe2e9ee,
          chao: 0xb9cdaa,
          pista: 0xc9bfae,
          heroi: (c, p) => desenharPersonagem(c, p, 0.46),
          montaria: false,
          colecao: [
            { arte: 'mg3_estrela', emoji: '\u{2B50}', pontos: 1, chance: 6 },
            { arte: 'mg3_balao', emoji: '\u{1F388}', pontos: 3, chance: 1.5 },
          ],
          obstaculos: [
            { arte: 'mg3_cone', emoji: '\u{1F6A7}' },
            { arte: 'mg3_poca', emoji: '\u{1F4A7}' },
            { arte: 'mg3_caixa', emoji: '\u{1F4E6}' },
          ],
          duracao: 70,
          velocidade: 22,
          aviso: 'Opa! Desvia dessa!',
          icone: '\u{2B50}',
        },
        resolve,
      );
    });
  },
};
