import Phaser from 'phaser';
import { CONFIG } from '../config';
import { narrador } from '../narrador';
import { fale } from '../narracoes';
import type { Etapa, Item } from '../types';
import { figura, nota, textoEmPainel, TimerMusical, toque, tremer, type Fig } from '../ui';

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
}

const tocar: Handler = (c, e) => {
  const alvos = e.alvos ?? e.itens ?? [];
  let faltam = alvos.filter((a) => a.correto !== false).length;
  for (const a of alvos) {
    // ladrilho claro: sem ele o objeto se perde no cenario
    const base = c.cena.add.graphics();
    base.fillStyle(0xffffff, 0.86);
    base.fillRoundedRect(a.x - 82, a.y - 82, 164, 164, 26);
    c.camada.add(base);
    const f = figura(c.cena, a.x, a.y, a.img, a.icone, 140);
    c.camada.add(f);
    if (a.texto) {
      c.camada.add(
        c.cena.add.text(a.x, a.y + 100, a.texto, { fontSize: '34px', color: '#2b3a4a' }).setOrigin(0.5),
      );
    }
    toque(f, () => {
      if (a.correto === false) {
        tremer(c.cena, f);
        c.erro(e.consequencia);
        return;
      }
      f.disableInteractive();
      certo(c, a.x, a.y);
      c.cena.tweens.add({ targets: f, alpha: 0.35, scale: f.scale * 1.15, duration: 260 });
      faltam -= 1;
      if (faltam === 0) c.cena.time.delayedCall(700, c.fim);
    });
  }
};

const arrastar: Handler = (c, e) => {
  const alvo = e.alvo as Item;
  c.camada.add(figura(c.cena, alvo.x, alvo.y, alvo.img, alvo.icone, 200));
  const itens = e.itens ?? [];
  let faltam = itens.length;
  itens.forEach((it, i) => {
    const f = figura(c.cena, it.x, it.y, it.img, it.icone, 130);
    c.camada.add(f);
    f.setInteractive({ draggable: true });
    f.on('drag', (_p: Phaser.Input.Pointer, x: number, y: number) => {
      f.x = x;
      f.y = y;
    });
    f.on('dragend', () => {
      if (Phaser.Math.Distance.Between(f.x, f.y, alvo.x, alvo.y) < 150) {
        f.disableInteractive();
        const destX = alvo.x + (i - (itens.length - 1) / 2) * 56;
        c.cena.tweens.add({ targets: f, x: destX, y: alvo.y - 20, scale: 0.7, duration: 220 });
        nota(784);
        faltam -= 1;
        if (faltam === 0) c.cena.time.delayedCall(600, c.fim);
      } else {
        c.cena.tweens.add({ targets: f, x: it.x, y: it.y, duration: 260, ease: 'Back.out' });
      }
    });
  });
};

const segurarComTimer: Handler = (c, e) => {
  const alvo = e.alvo ?? { icone: '\u{1FAA5}', x: W / 2, y: 780 };
  const f = figura(c.cena, alvo.x, alvo.y, alvo.img, alvo.icone, 180);
  c.camada.add(f);
  const dica = c.cena.add.text(W / 2, alvo.y + 170, 'Segure o dedinho aqui', { fontSize: '38px' }).setOrigin(0.5);
  const fundoDica = c.cena.add.graphics();
  const pintarDica = () => {
    fundoDica.clear();
    fundoDica.fillStyle(0xffffff, 0.88);
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

  let distancia = 0;
  let limpos = 0;
  const concluir = () => {
    timer.destruir();
    certo(c, alvo.x, alvo.y);
    c.cena.time.delayedCall(700, c.fim);
  };
  const timer = new TimerMusical(c.cena, W / 2, 520, e.segundos ?? 20, concluir);
  c.camada.once(Phaser.GameObjects.Events.DESTROY, () => timer.destruir());

  c.cena.input.on('pointermove', (p: Phaser.Input.Pointer) => {
    if (!p.isDown) return;
    distancia += Phaser.Math.Distance.Between(p.x, p.y, p.prevPosition.x, p.prevPosition.y);
    if (distancia < 140 || limpos >= total) return;
    distancia = 0;
    const s = sujeiras[limpos];
    limpos += 1;
    nota(660 + limpos * 40);
    c.cena.tweens.add({ targets: s, alpha: 0, scale: 0.2, duration: 260 });
    contador.setText(limpos >= total ? 'Limpinho!' : `Esfregue! Faltam ${total - limpos}`);
    if (limpos >= total) concluir();
  });
};

const escolher: Handler = (c, e) => {
  const opcoes = e.itens ?? [];
  for (const o of opcoes) {
    const g = c.cena.add.graphics();
    g.fillStyle(0xffffff, 0.92);
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
    toque(f, () => {
      if (!o.correto) {
        tremer(c.cena, f);
        c.erro(e.consequencia);
        return;
      }
      certo(c, o.x, o.y - 30);
      c.cena.time.delayedCall(800, c.fim);
    });
  }
};

const sequencia: Handler = (c, e) => {
  const itens = e.itens ?? [];
  let proximo = 0;
  itens.forEach((it, i) => {
    const f = figura(c.cena, it.x, it.y, it.img, it.icone, 130);
    c.camada.add(f);
    const num = c.cena.add.text(it.x, it.y + 95, '', { fontSize: '44px', color: '#2b8a3e' }).setOrigin(0.5);
    c.camada.add(num);
    if (it.texto) {
      c.camada.add(
        c.cena.add.text(it.x, it.y - 100, it.texto, { fontSize: '32px', color: '#2b3a4a' }).setOrigin(0.5),
      );
    }
    toque(f, () => {
      if (i !== proximo) {
        tremer(c.cena, f);
        c.erro(e.consequencia);
        return;
      }
      proximo += 1;
      num.setText(String(proximo));
      nota(600 + proximo * 60);
      f.disableInteractive();
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

export const ETAPAS: Record<Etapa['tipo'], Handler> = {
  tocar,
  arrastar_para_alvo: arrastar,
  segurar_com_timer: segurarComTimer,
  esfregar,
  escolher_entre_opcoes: escolher,
  sequencia_ordenada: sequencia,
  respirar,
};
