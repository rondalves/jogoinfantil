import Phaser from 'phaser';
import { CONFIG } from '../config';
import { fale } from '../narracoes';
import type { PersonagemCfg } from '../storage';
import { figura, nota, titulo } from '../ui';
import { correrFaixas } from './faixas';
import type { MiniGame, ResultadoMiniGame } from './index';

const W = CONFIG.LARGURA;
const H = CONFIG.ALTURA;

interface Pista {
  id: string;
  nome: string;
  ceu: number;
  chao: number;
  pista: number;
}

const PISTAS: Pista[] = [
  { id: 'pista_quintal', nome: 'Quintal', ceu: 0xdfe8ec, chao: 0xb9cdaa, pista: 0xbfa184 },
  { id: 'pista_parque', nome: 'Parque', ceu: 0xe2e9ee, chao: 0xaec6a6, pista: 0x9aa3ac },
  { id: 'pista_praia', nome: 'Praia', ceu: 0xe4eef0, chao: 0xe6d8b8, pista: 0xd4bd96 },
];

function escolherPista(cena: Phaser.Scene, aoEscolher: (p: Pista) => void) {
  const capa = cena.add.container(0, 0);
  capa.add(cena.add.rectangle(W / 2, H / 2, W, H, 0x2e3338, 0.9));
  capa.add(titulo(cena, 'Escolha a pista!', 220));
  fale('mg1_escolha_pista');

  PISTAS.forEach((p, i) => {
    const y = 460 + i * 250;
    const card = cena.add.container(W / 2, y);
    const g = cena.add.graphics();
    g.fillStyle(0xffffff, 0.95);
    g.fillRoundedRect(-300, -105, 600, 210, 28);
    card.add(g);
    card.add(figura(cena, -180, 0, p.id, '\u{1F3C1}', 180));
    card.add(cena.add.text(-40, 0, p.nome, { fontSize: '54px', fontStyle: 'bold' }).setOrigin(0, 0.5));
    card.setSize(600, 210).setInteractive({ useHandCursor: true });
    card.on('pointerdown', () => {
      nota(880);
      capa.destroy();
      aoEscolher(p);
    });
    capa.add(card);
  });
}

export const corrida: MiniGame = {
  id: 'corrida',
  mundo: 1,
  nome: 'Corrida de Kart',
  icone: '\u{1F3CE}\u{FE0F}',
  tituloFim: 'Que corrida!',
  fraseFim: 'mg1_fim',
  iconePonto: 'mg1_moeda',
  arte: [
    'mg1_kart',
    'mg1_moeda',
    'mg1_cone',
    'mg1_poca',
    'mg1_presente',
    'mg1_chegada',
    'mg1_rival',
    'pista_quintal',
    'pista_parque',
    'pista_praia',
  ],
  iniciar(cena, personagem: PersonagemCfg) {
    return new Promise<ResultadoMiniGame>((resolve) => {
      escolherPista(cena, (pista) => {
        fale('mg1_como_jogar');
        correrFaixas(
          cena,
          personagem,
          {
            ceu: pista.ceu,
            chao: pista.chao,
            pista: pista.pista,
            heroi: (c) => figura(c, 0, 0, 'mg1_kart', '\u{1F3CE}\u{FE0F}', 272),
            montaria: true,
            colecao: [
              { arte: 'mg1_moeda', emoji: '\u{1FA99}', pontos: 1, chance: 6 },
              { arte: 'mg1_presente', emoji: '\u{1F381}', pontos: 3, chance: 1.5 },
            ],
            obstaculos: [
              { arte: 'mg1_cone', emoji: '\u{1F6A7}' },
              { arte: 'mg1_poca', emoji: '\u{1F4A7}' },
            ],
            duracao: 75,
            velocidade: 24,
            aviso: 'Opa! Devagar nessa curva!',
            icone: '\u{1FA99}',
          },
          resolve,
        );
      });
    });
  },
};
