import Phaser from 'phaser';
import { CONFIG } from '../config';
import { estrelasTotais } from '../economia';
import { narrador } from '../narrador';
import { fale } from '../narracoes';
import { desenharPersonagem } from '../personagem';
import { listar, setAtivo } from '../storage';
import { balao, botao, botaoOuvir, fundo, irPara, titulo } from '../ui';

const W = CONFIG.LARGURA;
const MAX_PERFIS = 4;

export class Perfis extends Phaser.Scene {
  constructor() {
    super('Perfis');
  }

  create() {
    fundo(this, 0xbde8ff, 'bg_menu_inicial');
    botaoOuvir(this);
    titulo(this, 'Quem vai jogar?');
    const perfis = listar();

    perfis.slice(0, MAX_PERFIS).forEach((p, i) => {
      const x = W / 2 + (i % 2 ? 175 : -175);
      const y = 430 + Math.floor(i / 2) * 370;
      const card = this.add.container(x, y);
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.95);
      g.fillRoundedRect(-160, -170, 320, 340, 34);
      card.add(g);
      const boneco = desenharPersonagem(this, p.personagem, 0.5);
      boneco.setPosition(0, -40);
      card.add(boneco);
      card.add(this.add.text(0, 100, p.nome, { fontSize: '42px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0.5));
      card.add(
        this.add
          .text(0, 146, `\u{2B50} ${estrelasTotais(p)}   \u{1F39F}\u{FE0F} ${p.fichas}`, {
            fontSize: '32px',
            color: '#6b7a8a',
          })
          .setOrigin(0.5),
      );
      card.setSize(320, 340).setInteractive({ useHandCursor: true });
      card.on('pointerdown', () => {
        setAtivo(p.id);
        narrador.setNome(p.nome);
        irPara(this, 'Mapa');
      });
    });

    if (perfis.length < MAX_PERFIS) {
      botao(this, W / 2, 1120, 'Novo personagem', () => irPara(this, 'Criador'), {
        icone: '\u{2795}',
        cor: 0x7ddc8a,
      });
    } else {
      balao(this, 'Tem quatro personagens aqui. Apague um no painel dos pais.', 1060, false);
    }

    fale('ui_quem_joga');
  }
}
