import Phaser from 'phaser';
import { CONFIG } from '../config';
import { TEMA } from '../theme';
import { escovar } from './escovacao';
import { Esfrega } from '../etapasLogica';
import { narrador } from '../narrador';
import { fale } from '../narracoes';
import type { Etapa, Item, Pergunta } from '../types';
import {
  area,
  botao,
  figura,
  lerAoPassar,
  marcaErro,
  nota,
  somCerto,
  somErro,
  textoEmPainel,
  TimerMusical,
  tremer,
  type Fig,
} from '../ui';

const W = CONFIG.LARGURA;

export interface Ctx {
  cena: Phaser.Scene;
  /** tudo que a etapa criar vai aqui: o motor destroi entre etapas */
  camada: Phaser.GameObjects.Container;
  /** errar nunca pune: mostra a consequencia de leve e deixa tentar de novo */
  erro: (consequencia?: string) => void;
  /** nome do audio da frase de consequencia desta etapa */
  chaveErro: string;
  fim: () => void;
}

type Handler = (c: Ctx, e: Etapa) => void;

function certo(c: Ctx, x: number, y: number) {
  nota(880);
  const v = c.cena.add.text(x, y, '\u{2705}', { fontSize: '90px' }).setOrigin(0.5);
  c.camada.add(v);
  c.cena.tweens.add({ targets: v, scale: { from: 0, to: 1 }, duration: 260, ease: 'Back.out' });
  return v;
}

const tocar: Handler = (c, e) => {
  const alvos = e.alvos ?? e.itens ?? [];
  let faltam = alvos.filter((a) => a.correto !== false).length;
  for (const a of alvos) {
    // ladrilho claro: sem ele o objeto se perde no cenario
    const base = c.cena.add.graphics();
    base.fillStyle(0xffffff, 0.97);
    base.fillRoundedRect(a.x - 82, a.y - 82, 164, 164, 26);
    c.camada.add(base);
    const f = figura(c.cena, a.x, a.y, a.img, a.icone, 140);
    c.camada.add(f);
    if (a.texto) c.camada.add(textoEmPainel(c.cena, a.x, a.y + 124, a.texto, 26, 190));
    const zona = area(c.cena, a.x, a.y + 24, 184, 236, undefined, a.fala ?? a.texto);
    c.camada.add(zona);
    zona.on('pointerdown', () => {
      if (a.correto === false) {
        tremer(c.cena, f);
        c.erro(e.consequencia);
        return;
      }
      zona.disableInteractive();
      certo(c, a.x, a.y);
      c.cena.tweens.add({ targets: f, alpha: 0.35, scale: f.scale * 1.15, duration: 260 });
      faltam -= 1;
      if (faltam === 0) c.cena.time.delayedCall(700, c.fim);
    });
  }
};

const arrastar: Handler = (c, e) => {
  const alvo = e.alvo as Item;
  // posicoes fixas e iguais em toda missao: fila em cima, alvo grande embaixo
  const alvoX = W / 2;
  const alvoY = 960;
  const sombra = c.cena.add.graphics();
  sombra.fillStyle(0xffffff, 0.95);
  sombra.fillRoundedRect(alvoX - 190, alvoY - 160, 380, 320, 40);
  c.camada.add(sombra);
  c.camada.add(lerAoPassar(figura(c.cena, alvoX, alvoY, alvo.img, alvo.icone, 300), alvo.fala ?? alvo.texto));
  const itens = e.itens ?? [];
  // item com "correto": false e pegadinha: nao entra, leva X e volta
  let faltam = itens.filter((i) => i.correto !== false).length;
  // ate 4 cabem numa fila; de 5 em diante quebra em duas, senao fica miudo
  const porLinha = itens.length > 4 ? Math.ceil(itens.length / 2) : itens.length;
  const passo = Math.min(190, (W - 120) / Math.max(1, porLinha));
  itens.forEach((it, i) => {
    const linha = Math.floor(i / porLinha);
    const nesta = Math.min(porLinha, itens.length - linha * porLinha);
    const casaX = W / 2 + ((i % porLinha) - (nesta - 1) / 2) * passo;
    const casaY = itens.length > 4 ? 500 + linha * 184 : 600;
    const base = c.cena.add.graphics();
    base.fillStyle(0xffffff, 0.97);
    base.fillRoundedRect(casaX - passo / 2 + 8, casaY - 82, passo - 16, 164, 24);
    c.camada.add(base);
    const f = figura(c.cena, casaX, casaY, it.img, it.icone, Math.min(130, passo - 40));
    c.camada.add(f);
    f.setInteractive({ draggable: true });
    lerAoPassar(f, it.fala ?? it.texto);
    f.on('drag', (_p: Phaser.Input.Pointer, x: number, y: number) => {
      f.x = x;
      f.y = y;
    });
    const voltarParaCasa = () =>
      c.cena.tweens.add({ targets: f, x: casaX, y: casaY, duration: 260, ease: 'Back.out' });
    f.on('dragend', () => {
      if (Phaser.Math.Distance.Between(f.x, f.y, alvoX, alvoY) >= 200) {
        voltarParaCasa();
        return;
      }
      if (it.correto === false) {
        marcaErro(c.cena, f.x, f.y);
        somErro();
        tremer(c.cena, f);
        c.cena.time.delayedCall(360, voltarParaCasa);
        c.erro(e.consequencia);
        return;
      }
      // guardou: some de vez dentro do alvo, que e o que a crianca entende
      f.disableInteractive();
      base.destroy();
      somCerto();
      c.cena.tweens.add({
        targets: f,
        x: alvoX,
        y: alvoY,
        scale: 0,
        alpha: 0,
        duration: 320,
        ease: 'Quad.easeIn',
        onComplete: () => f.destroy(),
      });
      faltam -= 1;
      if (faltam === 0) c.cena.time.delayedCall(600, c.fim);
    });
  });
};

const segurarComTimer: Handler = (c, e) => {
  const alvo = e.alvo ?? { icone: '\u{1FAA5}', x: W / 2, y: 780 };
  // mesmo cartao das outras etapas: sem ele o alvo some no cenario
  const cartao = c.cena.add.graphics();
  cartao.fillStyle(0xffffff, 0.97);
  cartao.fillRoundedRect(alvo.x - 115, alvo.y - 115, 230, 230, 30);
  c.camada.add(cartao);
  const f = figura(c.cena, alvo.x, alvo.y, alvo.img, alvo.icone, 180);
  c.camada.add(f);
  const dica = c.cena.add.text(W / 2, alvo.y + 170, 'Segure o dedinho aqui', { fontSize: '38px' }).setOrigin(0.5);
  const fundoDica = c.cena.add.graphics();
  const pintarDica = () => {
    fundoDica.clear();
    fundoDica.fillStyle(0xffffff, 0.95);
    fundoDica.fillRoundedRect(W / 2 - dica.width / 2 - 20, dica.y - dica.height / 2 - 10, dica.width + 40, dica.height + 20, 18);
  };
  pintarDica();
  c.camada.add([fundoDica, dica]);

  const timer = new TimerMusical(c.cena, W / 2, 520, e.segundos ?? 60, () => {
    timer.destruir();
    certo(c, alvo.x, alvo.y);
    c.cena.time.delayedCall(700, c.fim);
  });
  timer.pausar();
  let avisou = false;

  f.setInteractive({ draggable: true });
  lerAoPassar(f, alvo.fala ?? alvo.texto);
  f.on('pointerdown', () => {
    timer.retomar();
    dica.setText('Isso! Continue...');
    pintarDica();
    c.cena.tweens.add({ targets: f, angle: { from: -12, to: 12 }, duration: 320, yoyo: true, repeat: -1 });
  });
  f.on('drag', (_p: Phaser.Input.Pointer, x: number) => {
    f.x = Phaser.Math.Clamp(x, alvo.x - 90, alvo.x + 90);
  });
  c.cena.input.on('pointerup', () => {
    timer.pausar();
    c.cena.tweens.killTweensOf(f);
    f.setAngle(0);
    dica.setText('Segure o dedinho aqui');
    pintarDica();
    if (!avisou && timer.progresso < 1) {
      avisou = true;
      if (e.consequencia) narrador.falar(e.consequencia, c.chaveErro);
    }
  });
  // o timer vive fora do container: o motor limpa junto ao destruir a camada
  c.camada.once(Phaser.GameObjects.Events.DESTROY, () => timer.destruir());
};

const esfregar: Handler = (c, e) => {
  const alvo = e.alvo ?? { icone: '\u{1F9FC}', x: W / 2, y: 780 };
  c.camada.add(figura(c.cena, alvo.x, alvo.y, alvo.img, alvo.icone, 220));
  const total = e.passos ?? 5;
  const sujeiras: Fig[] = [];
  for (let i = 0; i < total; i++) {
    const ang = (i / total) * Math.PI * 2 - Math.PI / 2;
    const arte = e.sujeiras?.[i % (e.sujeiras.length || 1)];
    const s = figura(c.cena, alvo.x + Math.cos(ang) * 150, alvo.y + Math.sin(ang) * 150, arte, '\u{1F7E4}', 96);
    c.cena.tweens.add({ targets: s, y: s.y - 10, duration: 900 + i * 120, yoyo: true, repeat: -1 });
    sujeiras.push(s);
    c.camada.add(s);
  }
  const painelContador = textoEmPainel(c.cena, W / 2, alvo.y + 230, `Esfregue! Faltam ${total}`, 36, 420);
  const contador = painelContador.list[1] as Phaser.GameObjects.Text;
  c.camada.add(painelContador);

  const esfrega = new Esfrega(total);
  const concluir = () => {
    timer.destruir();
    certo(c, alvo.x, alvo.y);
    c.cena.time.delayedCall(700, c.fim);
  };
  const timer = new TimerMusical(c.cena, W / 2, 520, e.segundos ?? 20, concluir);
  c.camada.once(Phaser.GameObjects.Events.DESTROY, () => timer.destruir());

  c.cena.input.on('pointermove', (p: Phaser.Input.Pointer) => {
    if (!p.isDown) return;
    const anterior = esfrega.limpos;
    if (!esfrega.mover(p.x - p.prevPosition.x, p.y - p.prevPosition.y)) return;
    const s = sujeiras[anterior];
    nota(660 + esfrega.limpos * 40);
    c.cena.tweens.add({ targets: s, alpha: 0, scale: 0.2, duration: 260 });
    contador.setText(esfrega.completo ? 'Limpinho!' : `Esfregue! Faltam ${esfrega.faltam}`);
    if (esfrega.completo) concluir();
  });
};

const escolher: Handler = (c, e) => {
  const opcoes = e.itens ?? [];
  for (const o of opcoes) {
    const g = c.cena.add.graphics();
    g.fillStyle(0xffffff, 0.97);
    g.fillRoundedRect(o.x - 150, o.y - 150, 300, 300, 30);
    c.camada.add(g);
    const f = figura(c.cena, o.x, o.y - 30, o.img, o.icone, 150);
    c.camada.add(f);
    if (o.texto) {
      c.camada.add(
        c.cena.add
          .text(o.x, o.y + 100, o.texto, {
            fontSize: '36px',
            color: '#2b3a4a',
            align: 'center',
            wordWrap: { width: 280 },
          })
          .setOrigin(0.5),
      );
    }
    // o dedo pode cair em qualquer canto do cartao, nao so na figurinha
    const zona = area(c.cena, o.x, o.y, 300, 300, undefined, o.fala ?? o.texto);
    c.camada.add(zona);
    zona.on('pointerdown', () => {
      if (!o.correto) {
        tremer(c.cena, f);
        c.erro(e.consequencia);
        return;
      }
      zona.disableInteractive();
      certo(c, o.x, o.y - 30);
      c.cena.time.delayedCall(800, c.fim);
    });
  }
};

const sequencia: Handler = (c, e) => {
  const itens = e.itens ?? [];
  let proximo = 0;
  itens.forEach((it, i) => {
    const base = c.cena.add.graphics();
    base.fillStyle(0xffffff, 0.97);
    base.fillRoundedRect(it.x - 82, it.y - 82, 164, 164, 26);
    c.camada.add(base);
    const f = figura(c.cena, it.x, it.y, it.img, it.icone, 130);
    c.camada.add(f);
    const num = c.cena.add
      .text(it.x + 66, it.y - 66, '', { fontSize: '44px', color: '#2b8a3e', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setStroke('#ffffff', 8);
    c.camada.add(num);
    if (it.texto) c.camada.add(textoEmPainel(c.cena, it.x, it.y + 124, it.texto, 26, 190));
    const zona = area(c.cena, it.x, it.y + 24, 184, 236, undefined, it.fala ?? it.texto);
    c.camada.add(zona);
    zona.on('pointerdown', () => {
      if (i !== proximo) {
        tremer(c.cena, f);
        c.erro(e.consequencia);
        return;
      }
      proximo += 1;
      num.setText(String(proximo));
      nota(600 + proximo * 60);
      zona.disableInteractive();
      c.cena.tweens.add({ targets: f, scale: f.scale * 1.12, duration: 200, yoyo: true });
      if (proximo === itens.length) c.cena.time.delayedCall(700, c.fim);
    });
  });
};

const respirar: Handler = (c, e) => {
  const total = e.repeticoes ?? 3;
  let feitas = 0;
  const bola = c.cena.add.circle(W / 2, 760, 70, 0x8fd6ff, 0.9);
  const rotulo = c.cena.add
    .text(W / 2, 1000, `Segure e sopre! Faltam ${total}`, { fontSize: '40px', color: '#2b3a4a' })
    .setOrigin(0.5);
  c.camada.add([bola, rotulo]);
  let tween: Phaser.Tweens.Tween | null = null;

  const zona = c.cena.add.zone(W / 2, 760, 420, 420).setInteractive({ useHandCursor: true });
  c.camada.add(zona);
  zona.on('pointerdown', () => {
    nota(523);
    tween = c.cena.tweens.add({ targets: bola, scale: 2.4, duration: 3000, ease: 'Sine.easeInOut' });
  });
  c.cena.input.on('pointerup', () => {
    if (!tween) return;
    const grande = bola.scale > 1.8;
    tween.stop();
    tween = null;
    c.cena.tweens.add({ targets: bola, scale: 1, duration: 900, ease: 'Sine.easeInOut' });
    if (!grande) {
      fale('etapa_sopre');
      return;
    }
    feitas += 1;
    nota(880);
    rotulo.setText(feitas >= total ? 'Que calma boa!' : `Segure e sopre! Faltam ${total - feitas}`);
    if (feitas >= total) c.cena.time.delayedCall(900, c.fim);
  });
};

/**
 * Precisa ou nao precisa? Uma situacao por vez, com Sim e Nao bem grandes.
 * E aqui que a crianca aprende que a regra tem hora: lavar a mao antes de
 * comer sim, antes de ir brincar na terra nao.
 */
const simOuNao: Handler = (c, e) => {
  const perguntas = e.perguntas ?? [];
  let atual = 0;
  const palco = c.cena.add.container(0, 0);
  c.camada.add(palco);

  const bolinhas = c.cena.add.graphics();
  c.camada.add(bolinhas);
  const pintarBolinhas = () => {
    bolinhas.clear();
    perguntas.forEach((_, i) => {
      const x = W / 2 + (i - (perguntas.length - 1) / 2) * 44;
      bolinhas.fillStyle(i < atual ? TEMA.sim : 0xffffff, i < atual ? 1 : 0.8);
      bolinhas.fillCircle(x, 1130, 13);
    });
  };

  const mostrar = () => {
    palco.removeAll(true);
    pintarBolinhas();
    if (atual >= perguntas.length) {
      c.cena.time.delayedCall(500, c.fim);
      return;
    }
    const p: Pergunta = perguntas[atual];
    narrador.esquecerNome();

    const cartao = c.cena.add.graphics();
    cartao.fillStyle(0xffffff, 0.97);
    cartao.fillRoundedRect(W / 2 - 230, 480, 460, 400, 36);
    palco.add(cartao);
    const fig = figura(c.cena, W / 2, 640, p.img, p.icone, 220);
    palco.add(fig);
    palco.add(textoEmPainel(c.cena, W / 2, 810, p.texto, 36, 420));
    lerAoPassar(fig, p.texto, p.audio);
    narrador.falar(p.texto, p.audio);

    const responder = (dito: boolean, alvo: Phaser.GameObjects.Container) => {
      if (dito !== p.resposta) {
        tremer(c.cena, alvo);
        c.erro(p.explica);
        return;
      }
      nota(880);
      narrador.falar(p.explica);
      atual += 1;
      // dentro do palco: a proxima pergunta limpa o visto junto
      palco.add(certo(c, W / 2, 640));
      c.cena.time.delayedCall(2600, mostrar);
    };

    const sim = botao(c.cena, W / 2 - 170, 990, 'Sim', () => responder(true, sim), {
      icone: '\u{1F44D}',
      cor: TEMA.sim,
      largura: 300,
    });
    const nao = botao(c.cena, W / 2 + 170, 990, 'Não', () => responder(false, nao), {
      icone: '\u{1F44E}',
      cor: TEMA.nao,
      largura: 300,
    });
    palco.add([sim, nao]);
  };

  mostrar();
};

export const ETAPAS: Record<Etapa['tipo'], Handler> = {
  escovar,
  tocar,
  arrastar_para_alvo: arrastar,
  segurar_com_timer: segurarComTimer,
  esfregar,
  escolher_entre_opcoes: escolher,
  sequencia_ordenada: sequencia,
  respirar,
  sim_ou_nao: simOuNao,
};
