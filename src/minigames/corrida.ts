import Phaser from 'phaser';
import { CONFIG } from '../config';
import { narrador } from '../narrador';
import { desenharPersonagem } from '../personagem';
import type { PersonagemCfg } from '../storage';
import { figura, nota, titulo } from '../ui';
import type { MiniGame, ResultadoMiniGame } from './index';

const W = CONFIG.LARGURA;
const H = CONFIG.ALTURA;
const FAIXAS = [W / 2 - 170, W / 2, W / 2 + 170];
const Y_KART = H - 260;
const DURACAO = 75;

interface Pista {
  id: string;
  nome: string;
  ceu: number;
  chao: number;
  pista: number;
}

const PISTAS: Pista[] = [
  { id: 'pista_quintal', nome: 'Quintal', ceu: 0xbfe3ff, chao: 0x8ccf6f, pista: 0xa9763f },
  { id: 'pista_parque', nome: 'Parque', ceu: 0xcdeaff, chao: 0x7fc96b, pista: 0x6f7a86 },
  { id: 'pista_praia', nome: 'Praia', ceu: 0xbdeaf7, chao: 0xf2d9a0, pista: 0xe0b878 },
];

/** Nada de perder: obstaculo so faz o kart dar uma freada. */
interface Item {
  fig: Phaser.GameObjects.Image | Phaser.GameObjects.Text;
  faixa: number;
  tipo: 'moeda' | 'presente' | 'obstaculo';
}

function escolherPista(cena: Phaser.Scene, aoEscolher: (p: Pista) => void) {
  const capa = cena.add.container(0, 0);
  capa.add(cena.add.rectangle(W / 2, H / 2, W, H, 0x0e2235, 0.9));
  capa.add(titulo(cena, 'Escolha a pista!', 220));
  narrador.falar('Escolha a pista da corrida!', 'mg1_escolha_pista');

  PISTAS.forEach((p, i) => {
    const y = 460 + i * 250;
    const card = cena.add.container(W / 2, y);
    const g = cena.add.graphics();
    g.fillStyle(0xffffff, 0.95);
    g.fillRoundedRect(-300, -105, 600, 210, 28);
    card.add(g);
    const foto = figura(cena, -180, 0, p.id, '\u{1F3C1}', 180);
    card.add(foto);
    card.add(
      cena.add.text(-40, 0, p.nome, { fontSize: '54px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0, 0.5),
    );
    card.setSize(600, 210).setInteractive({ useHandCursor: true });
    card.on('pointerdown', () => {
      nota(880);
      capa.destroy();
      aoEscolher(p);
    });
    capa.add(card);
  });
}

function correr(
  cena: Phaser.Scene,
  personagem: PersonagemCfg,
  pista: Pista,
  dificuldade: number,
  pronto: (r: ResultadoMiniGame) => void,
) {
  cena.add.rectangle(W / 2, H / 2, W, H, pista.chao).setDepth(-10);
  cena.add.rectangle(W / 2, 0, W, 300, pista.ceu).setOrigin(0.5, 0).setDepth(-10);
  cena.add.rectangle(W / 2, H / 2, 560, H, pista.pista).setDepth(-9);

  // listras que correm para dar sensacao de velocidade
  const listras: Phaser.GameObjects.Rectangle[] = [];
  for (let f = 0; f < 2; f++) {
    for (let i = 0; i < 9; i++) {
      const x = W / 2 + (f === 0 ? -85 : 85);
      listras.push(cena.add.rectangle(x, i * 160, 14, 90, 0xffffff, 0.85).setDepth(-8));
    }
  }

  let faixa = 1;
  const kart = figura(cena, FAIXAS[faixa], Y_KART, 'mg1_kart', '\u{1F3CE}\u{FE0F}', 210);
  const crianca = desenharPersonagem(cena, personagem, 0.34);
  crianca.setPosition(FAIXAS[faixa], Y_KART - 110);

  const irPara = (nova: number) => {
    const destino = Phaser.Math.Clamp(nova, 0, 2);
    if (destino === faixa) return;
    faixa = destino;
    nota(620);
    cena.tweens.add({ targets: [kart, crianca], x: FAIXAS[faixa], duration: 150 });
  };

  cena.input.on('pointerdown', (p: Phaser.Input.Pointer) => irPara(p.x < W / 2 ? faixa - 1 : faixa + 1));
  let ultimoGiro = 0;
  const inclinar = (e: DeviceOrientationEvent) => {
    const g = e.gamma ?? 0;
    if (Math.abs(g) < 14 || cena.time.now - ultimoGiro < 320) return;
    ultimoGiro = cena.time.now;
    irPara(faixa + (g > 0 ? 1 : -1));
  };
  window.addEventListener('deviceorientation', inclinar);

  let pontos = 0;
  const placar = cena.add.container(24, 190).setDepth(40);
  const fundoPlacar = cena.add.graphics();
  fundoPlacar.fillStyle(0xffffff, 0.8);
  fundoPlacar.fillRoundedRect(-12, -40, 230, 80, 22);
  placar.add(fundoPlacar);
  placar.add(figura(cena, 30, 0, 'mg1_moeda', '\u{1FA99}', 62));
  const texto = cena.add.text(72, 0, '0', { fontSize: '44px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0, 0.5);
  placar.add(texto);

  const barra = cena.add.graphics().setDepth(40);
  const itens: Item[] = [];
  let velocidade = 22 + dificuldade * 2;
  let freada = 0;
  let passado = 0;
  let acabou = false;

  const nascer = () => {
    const sorte = Math.random();
    const tipo: Item['tipo'] = sorte < 0.58 ? 'moeda' : sorte < 0.72 ? 'presente' : 'obstaculo';
    const f = Phaser.Math.Between(0, 2);
    const arte =
      tipo === 'moeda' ? 'mg1_moeda' : tipo === 'presente' ? 'mg1_presente' : Math.random() < 0.5 ? 'mg1_cone' : 'mg1_poca';
    const emoji = tipo === 'moeda' ? '\u{1FA99}' : tipo === 'presente' ? '\u{1F381}' : '\u{1F6A7}';
    itens.push({ fig: figura(cena, FAIXAS[f], -80, arte, emoji, 110), faixa: f, tipo });
  };
  const semeador = cena.time.addEvent({ delay: 760, loop: true, callback: nascer });

  const terminar = () => {
    if (acabou) return;
    acabou = true;
    semeador.remove();
    relogio.remove();
    cena.input.off('pointerdown');
    window.removeEventListener('deviceorientation', inclinar);
    const bandeira = figura(cena, W / 2, 420, 'mg1_chegada', '\u{1F3C1}', 420).setDepth(45);
    const tamanhoBandeira = bandeira.scale;
    bandeira.setScale(0);
    cena.tweens.add({ targets: bandeira, scale: tamanhoBandeira, duration: 400, ease: 'Back.out' });
    cena.tweens.add({ targets: kart, y: Y_KART - 60, duration: 600, yoyo: true });
    nota(1047);
    cena.time.delayedCall(900, () => pronto({ pontos, concluido: true }));
  };

  const relogio = cena.time.addEvent({
    delay: 100,
    loop: true,
    callback: () => {
      passado += 0.1;
      if (freada > 0) freada -= 0.1;
      const andar = freada > 0 ? velocidade * 0.35 : velocidade;
      velocidade = Math.min(36, 22 + dificuldade * 2 + passado / 8);

      for (const l of listras) {
        l.y += andar;
        if (l.y > H + 60) l.y = -60;
      }
      for (let i = itens.length - 1; i >= 0; i--) {
        const it = itens[i];
        it.fig.y += andar;
        if (it.faixa === faixa && Math.abs(it.fig.y - Y_KART) < 80) {
          if (it.tipo === 'obstaculo') {
            freada = 1.2;
            nota(200);
            narrador.falar('Opa! Devagar nessa curva!');
            cena.tweens.add({ targets: kart, angle: { from: -10, to: 10 }, duration: 90, yoyo: true, repeat: 2 });
          } else {
            pontos += it.tipo === 'presente' ? 3 : 1;
            texto.setText(String(pontos));
            nota(it.tipo === 'presente' ? 1047 : 880);
          }
          it.fig.destroy();
          itens.splice(i, 1);
          continue;
        }
        if (it.fig.y > H + 100) {
          it.fig.destroy();
          itens.splice(i, 1);
        }
      }

      barra.clear();
      barra.fillStyle(0xffffff, 0.6);
      barra.fillRoundedRect(W - 250, 176, 220, 28, 14);
      barra.fillStyle(0x51cf66, 1);
      barra.fillRoundedRect(W - 250, 176, 220 * Math.min(1, passado / DURACAO), 28, 14);

      if (passado >= DURACAO) terminar();
    },
  });

  narrador.falar('Pegue as moedas e desvie dos cones. Pode tocar na tela ou inclinar o celular!', 'mg1_como_jogar');
}

export const corrida: MiniGame = {
  id: 'corrida',
  mundo: 1,
  nome: 'Corrida de Kart',
  icone: '\u{1F3CE}\u{FE0F}',
  iniciar(cena, personagem, dificuldade) {
    return new Promise<ResultadoMiniGame>((resolve) => {
      escolherPista(cena, (pista) => correr(cena, personagem, pista, dificuldade, resolve));
    });
  },
};
