import Phaser from 'phaser';
import { CONFIG } from '../config';
import { narrador } from '../narrador';
import { desenharPersonagem } from '../personagem';
import type { PersonagemCfg } from '../storage';
import { figura, nota } from '../ui';
import type { ResultadoMiniGame } from './index';

const W = CONFIG.LARGURA;
const H = CONFIG.ALTURA;
const FAIXAS = [W / 2 - 170, W / 2, W / 2 + 170];
const Y_HEROI = H - 260;

export interface Coletavel {
  arte: string;
  emoji: string;
  pontos: number;
  /** peso no sorteio */
  chance: number;
}

export interface OpcoesFaixas {
  ceu: number;
  chao: number;
  pista: number;
  /** o que a crianca controla: kart, ela mesma correndo... */
  heroi: (cena: Phaser.Scene, personagem: PersonagemCfg) => Phaser.GameObjects.GameObject;
  /** personagem desenhado por cima do heroi (kart) */
  montaria: boolean;
  colecao: Coletavel[];
  obstaculos: { arte: string; emoji: string }[];
  duracao: number;
  velocidade: number;
  /** frase narrada quando bate num obstaculo */
  aviso: string;
  icone: string;
}

interface Item {
  fig: Phaser.GameObjects.Container;
  faixa: number;
  pontos: number;
}

/** Peca que cai: disco atras (vermelho se e para desviar) e a arte em cima. */
function pecaQueCai(
  cena: Phaser.Scene,
  x: number,
  arte: string,
  emoji: string,
  perigo: boolean,
): Phaser.GameObjects.Container {
  const c = cena.add.container(x, -80);
  const disco = cena.add.graphics();
  if (perigo) {
    disco.fillStyle(0xc0392b, 0.92);
    disco.fillCircle(0, 0, 76);
    disco.lineStyle(8, 0xffffff, 0.95);
    disco.strokeCircle(0, 0, 76);
  } else {
    disco.fillStyle(0xffffff, 0.8);
    disco.fillCircle(0, 0, 70);
  }
  c.add(disco);
  const f = figura(cena, 0, 0, arte, emoji, perigo ? 96 : 110);
  c.add(f);
  if (perigo) {
    cena.tweens.add({ targets: c, scale: 1.08, duration: 420, yoyo: true, repeat: -1 });
  }
  return c;
}

/**
 * Corrida em tres faixas, sem derrota: bater num obstaculo so da uma freada.
 * Serve para a corrida de kart e para o corredor, mudando so a arte.
 */
export function correrFaixas(
  cena: Phaser.Scene,
  personagem: PersonagemCfg,
  op: OpcoesFaixas,
  pronto: (r: ResultadoMiniGame) => void,
) {
  cena.add.rectangle(W / 2, H / 2, W, H, op.chao).setDepth(-10);
  cena.add.rectangle(W / 2, 0, W, 300, op.ceu).setOrigin(0.5, 0).setDepth(-10);
  cena.add.rectangle(W / 2, H / 2, 560, H, op.pista).setDepth(-9);

  const listras: Phaser.GameObjects.Rectangle[] = [];
  for (let f = 0; f < 2; f++) {
    for (let i = 0; i < 9; i++) {
      listras.push(
        cena.add.rectangle(W / 2 + (f === 0 ? -85 : 85), i * 160, 14, 90, 0xffffff, 0.8).setDepth(-8),
      );
    }
  }

  let faixa = 1;
  // a crianca entra primeiro, recortada na linha do banco: do banco para
  // baixo quem aparece e o kart, entao ela fica sentada de verdade
  const crianca = op.montaria ? desenharPersonagem(cena, personagem, 0.48) : null;
  if (crianca) {
    crianca.setPosition(FAIXAS[faixa], Y_HEROI - 54);
    const corte = cena.make.graphics({ x: 0, y: 0 });
    corte.fillStyle(0xffffff);
    corte.fillRect(0, 0, W, Y_HEROI - 6);
    crianca.setMask(corte.createGeometryMask());
  }
  const heroi = op.heroi(cena, personagem) as Phaser.GameObjects.Image;
  heroi.setPosition(FAIXAS[faixa], Y_HEROI);
  const seguem: Phaser.GameObjects.GameObject[] = crianca ? [heroi, crianca] : [heroi];

  const irPara = (nova: number) => {
    const destino = Phaser.Math.Clamp(nova, 0, 2);
    if (destino === faixa) return;
    faixa = destino;
    nota(620);
    cena.tweens.add({ targets: seguem, x: FAIXAS[faixa], duration: 150 });
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
  placar.add(figura(cena, 30, 0, op.colecao[0].arte, op.icone, 62));
  const texto = cena.add.text(72, 0, '0', { fontSize: '44px', fontStyle: 'bold' }).setOrigin(0, 0.5);
  placar.add(texto);

  const barra = cena.add.graphics().setDepth(40);
  const itens: Item[] = [];
  let velocidade = op.velocidade;
  let freada = 0;
  let passado = 0;
  let acabou = false;

  const pesoTotal = op.colecao.reduce((a, c) => a + c.chance, 0) + op.obstaculos.length;
  const nascer = () => {
    const f = Phaser.Math.Between(0, 2);
    let sorte = Math.random() * pesoTotal;
    for (const c of op.colecao) {
      sorte -= c.chance;
      if (sorte <= 0) {
        itens.push({ fig: pecaQueCai(cena, FAIXAS[f], c.arte, c.emoji, false), faixa: f, pontos: c.pontos });
        return;
      }
    }
    const o = Phaser.Utils.Array.GetRandom(op.obstaculos);
    itens.push({ fig: pecaQueCai(cena, FAIXAS[f], o.arte, o.emoji, true), faixa: f, pontos: 0 });
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
    const tamanho = bandeira.scale;
    bandeira.setScale(0);
    cena.tweens.add({ targets: bandeira, scale: tamanho, duration: 400, ease: 'Back.out' });
    cena.tweens.add({ targets: heroi, y: Y_HEROI - 60, duration: 600, yoyo: true });
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
      velocidade = Math.min(op.velocidade + 14, op.velocidade + passado / 8);

      for (const l of listras) {
        l.y += andar;
        if (l.y > H + 60) l.y = -60;
      }
      for (let i = itens.length - 1; i >= 0; i--) {
        const it = itens[i];
        it.fig.y += andar;
        if (it.faixa === faixa && Math.abs(it.fig.y - Y_HEROI) < 80) {
          if (it.pontos === 0) {
            freada = 1.2;
            nota(200);
            narrador.falar(op.aviso);
            cena.tweens.add({ targets: heroi, angle: { from: -10, to: 10 }, duration: 90, yoyo: true, repeat: 2 });
          } else {
            pontos += it.pontos;
            texto.setText(String(pontos));
            nota(it.pontos > 1 ? 1047 : 880);
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
      barra.fillStyle(0x9cbfa6, 1);
      barra.fillRoundedRect(W - 250, 176, 220 * Math.min(1, passado / op.duracao), 28, 14);

      if (passado >= op.duracao) terminar();
    },
  });
}
