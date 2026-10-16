import Phaser from 'phaser';
import { comemorar, expressao, piscar } from '../animacoes';
import { CONFIG } from '../config';
import { cabecaDoPersonagem, desenharPersonagem } from '../personagem';
import { ativo, personagemPadrao } from '../storage';
import { TEMA } from '../theme';
import { escovar } from './escovacao';
import { Esfrega, vagaNaFila, vagaNoAlvo } from '../etapasLogica';
import { narrador } from '../narrador';
import { fale } from '../narracoes';
import type { Etapa, Item, Pergunta } from '../types';
import {
  area,
  arteExistente,
  botao,
  brilhinho,
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
    // ladrilho claro: sem ele o objeto se perde no cenario. Figura e nome no
    // mesmo cartao, senao viram dois retangulos brancos em degrau
    const rotulo = a.texto
      ? c.cena.add
          .text(a.x, a.y + 92, a.texto, { fontSize: '26px', align: 'center', wordWrap: { width: 148 } })
          .setOrigin(0.5, 0)
      : null;
    const base = c.cena.add.graphics();
    base.fillStyle(0xffffff, 0.97);
    const alturaA = 164 + (rotulo ? rotulo.height + 24 : 0);
    base.fillRoundedRect(a.x - 82, a.y - 82, 164, alturaA, 26);
    // borda: em cenario claro (banheiro, cozinha) o cartao branco sumia no fundo
    base.lineStyle(4, 0xc9b8a8, 1);
    base.strokeRoundedRect(a.x - 82, a.y - 82, 164, alturaA, 26);
    c.camada.add(base);
    const f = figura(c.cena, a.x, a.y, a.img, a.icone, 140);
    c.camada.add(f);
    if (rotulo) c.camada.add(rotulo);
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
  // enquanto a arte do comeco (cama sem nada) nao existe, comeca pela do "antes"
  const inicio = arteExistente(c.cena, alvo.img, alvo.reserva, e.antes) ?? alvo.img;
  let figAlvo = lerAoPassar(figura(c.cena, alvoX, alvoY, inicio, alvo.icone, 300), alvo.fala ?? alvo.texto);
  c.camada.add(figAlvo);
  const itens = e.itens ?? [];
  // item com "correto": false e pegadinha: nao entra, leva X e volta
  const certos = itens.filter((i) => i.correto !== false);
  let feitos = 0;
  /** ultima arte de estado que entrou: e o "depois" do fim */
  let depois: string | undefined;
  const pousados: Fig[] = [];

  /** O alvo troca de arte: o lencol cobre a cama, o travesseiro cai no lugar. */
  const mudarAlvo = (nova: string, f: Fig, efeito?: 'puxar' | 'cair') => {
    const velho = figAlvo;
    const novo = figura(c.cena, alvoX, alvoY, nova, alvo.icone, 300);
    c.camada.add(novo);
    figAlvo = novo;
    c.camada.bringToTop(f);
    const pronto = () => {
      velho.destroy();
      brilhar(c, alvoX, alvoY - 80);
    };
    if (!efeito) {
      // sem efeito proprio: o item entra no alvo e a arte nova aparece por cima
      novo.setAlpha(0);
      c.cena.tweens.add({ targets: f, x: alvoX, y: alvoY, scale: 0, alpha: 0, duration: 320, ease: 'Quad.easeIn' });
      c.cena.tweens.add({ targets: novo, alpha: 1, duration: 360, onComplete: pronto });
      c.cena.tweens.add({ targets: novo, scale: novo.scale * 1.06, duration: 180, delay: 360, yoyo: true });
      return;
    }
    if (efeito === 'cair') {
      // o travesseiro sobe e cai na cabeceira; a cama aparece arrumada por baixo
      novo.setAlpha(0);
      c.cena.tweens.chain({
        targets: f,
        tweens: [
          { x: alvoX - 70, y: alvoY - 230, scale: f.scale * 0.8, duration: 260, ease: 'Quad.easeOut' },
          { y: alvoY - 70, duration: 340, ease: 'Bounce.easeOut' },
          { alpha: 0, duration: 200 },
        ],
      });
      c.cena.tweens.add({ targets: novo, alpha: 1, delay: 560, duration: 260, onComplete: pronto });
      return;
    }
    // puxar: a arte nova entra varrendo da esquerda para a direita, com o
    // item indo na frente, como quem estica o lencol
    const largura = 380;
    const esq = alvoX - largura / 2;
    const corte = c.cena.make.graphics({}, false);
    novo.setMask(corte.createGeometryMask());
    const varre = { w: 0 };
    f.setPosition(esq, alvoY);
    c.cena.tweens.add({
      targets: varre,
      w: largura,
      duration: 700,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        corte.clear().fillStyle(0xffffff).fillRect(esq, alvoY - 170, varre.w, 340);
        f.x = esq + varre.w;
      },
      onComplete: () => {
        novo.clearMask(true);
        corte.destroy();
        pronto();
      },
    });
    c.cena.tweens.add({ targets: f, alpha: 0, scale: f.scale * 0.7, delay: 450, duration: 250 });
  };

  /** Antes e depois lado a lado: a crianca ve o que ela mesma mudou. */
  const antesDepois = (antes: string, final: string) => {
    const capa = c.cena.add.container(0, 0);
    c.camada.add(capa);
    capa.add(c.cena.add.rectangle(W / 2, 640, W, 2400, 0xf7f5f1, 0.94));
    const cartao = (x: number, rotulo: string, arte: string, atraso: number) => {
      const g = c.cena.add.graphics();
      g.fillStyle(0xffffff, 1).fillRoundedRect(x - 140, 600, 280, 300, 30);
      g.lineStyle(4, 0xc9b8a8, 1).strokeRoundedRect(x - 140, 600, 280, 300, 30);
      const t = c.cena.add
        .text(x, 560, rotulo, { fontSize: '40px', color: '#2b3a4a', fontStyle: 'bold' })
        .setOrigin(0.5);
      const fig = figura(c.cena, x, 750, arte, alvo.icone, 240);
      const parte = c.cena.add.container(0, 0, [g, t, fig]).setAlpha(0);
      capa.add(parte);
      c.cena.tweens.add({ targets: parte, alpha: 1, delay: atraso, duration: 300 });
      return fig;
    };
    cartao(185, 'Antes', antes, 0);
    capa.add(c.cena.add.text(W / 2, 750, '\u{27A1}\u{FE0F}', { fontSize: '52px' }).setOrigin(0.5));
    const fig = cartao(535, 'Depois', final, 600);
    c.cena.time.delayedCall(700, () => {
      somCerto();
      c.cena.tweens.add({ targets: fig, scale: fig.scale * 1.08, duration: 260, yoyo: true });
      for (const [dx, dy] of [[-100, -90], [100, -70], [-80, 100], [110, 90]]) brilhar(c, 535 + dx, 750 + dy, capa);
    });
    c.cena.time.delayedCall(2800, c.fim);
  };

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
    f.on('dragstart', () => c.camada.bringToTop(f));
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
      const vez = certos[feitos];
      if (e.emOrdem && vez !== it) {
        // fora de ordem nao e erro: so mostra quem vem primeiro e devolve
        const frase = `Primeiro: ${vez.fala ?? vez.texto ?? ''}`;
        tremer(c.cena, f);
        c.cena.time.delayedCall(300, voltarParaCasa);
        const dica = textoEmPainel(c.cena, alvoX, alvoY - 230, frase, 34);
        c.camada.add(dica);
        c.cena.time.delayedCall(1600, () => dica.destroy());
        narrador.falar(frase);
        return;
      }
      f.disableInteractive();
      base.destroy();
      somCerto();
      feitos += 1;
      const estado = e.estados?.[feitos - 1];
      const muda = estado && c.cena.textures.exists(estado) ? estado : undefined;
      if (muda) {
        depois = muda;
        // o prato montado ja traz desenhado o que estava pousado em cima
        for (const p of pousados) c.cena.tweens.add({ targets: p, alpha: 0, duration: 300 });
        mudarAlvo(muda, f, it.efeito);
      } else if (e.empilha) {
        // fica em cima do alvo: o prato vai enchendo
        const fila = e.empilha === 'fila';
        const v = (fila ? vagaNaFila : vagaNoAlvo)(feitos - 1, certos.length);
        pousados.push(f);
        c.cena.tweens.add({
          targets: f,
          x: alvoX + v.x,
          y: alvoY + v.y,
          scale: f.scale * (fila ? 0.62 : 0.75),
          angle: fila ? (feitos % 2 ? -8 : 8) : 0,
          duration: 300,
          ease: 'Back.out',
        });
      } else {
        // guardou: some de vez dentro do alvo, que e o que a crianca entende
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
      }
      if (feitos < certos.length) return;
      const antes = e.antes ?? alvo.img;
      if (depois && antes && c.cena.textures.exists(antes)) {
        const final = depois;
        c.cena.time.delayedCall(1100, () => antesDepois(antes, final));
      } else {
        c.cena.time.delayedCall(muda ? 1000 : 600, c.fim);
      }
    });
  });
};

/** Brilhinho que aparece, gira e some. */
function brilhar(c: Ctx, x: number, y: number, dentro: Phaser.GameObjects.Container = c.camada) {
  const b = brilhinho(c.cena, x, y, 26).setScale(0);
  dentro.add(b);
  c.cena.tweens.add({
    targets: b,
    scale: 1,
    angle: 90,
    duration: 380,
    yoyo: true,
    hold: 200,
    onComplete: () => b.destroy(),
  });
}

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
  const soltou = () => {
    timer.pausar();
    c.cena.tweens.killTweensOf(f);
    f.setAngle(0);
    dica.setText('Segure o dedinho aqui');
    pintarDica();
    if (!avisou && timer.progresso < 1) {
      avisou = true;
      if (e.consequencia) narrador.falar(e.consequencia, c.chaveErro);
    }
  };
  c.cena.input.on('pointerup', soltou);
  // o timer e o ouvinte vivem fora do container: o motor limpa junto ao destruir a camada
  c.camada.once(Phaser.GameObjects.Events.DESTROY, () => {
    timer.destruir();
    c.cena.input.off('pointerup', soltou);
  });
};

const esfregar: Handler = (c, e) => {
  const alvo = e.alvo ?? { icone: '\u{1F9FC}', x: W / 2, y: 780 };
  const total = e.passos ?? 5;
  // lavar o rosto: o rosto e o do personagem da propria crianca, com as
  // sujeirinhas em cima dele; no resto, a arte do alvo com as sujeiras em roda
  const crianca = e.rosto ? rostoSujo(c, total) : undefined;
  const sujo = crianca?.boneco ?? figura(c.cena, alvo.x, alvo.y, alvo.img, alvo.icone, 220);
  c.camada.add(sujo);
  const sujeiras: Phaser.GameObjects.GameObject[] = crianca?.manchas ?? [];
  for (let i = 0; !crianca && i < total; i++) {
    const ang = (i / total) * Math.PI * 2 - Math.PI / 2;
    const arte = e.sujeiras?.[i % (e.sujeiras.length || 1)];
    const s = figura(c.cena, alvo.x + Math.cos(ang) * 150, alvo.y + Math.sin(ang) * 150, arte, '\u{1F7E4}', 96);
    c.cena.tweens.add({ targets: s, y: s.y - 10, duration: 900 + i * 120, yoyo: true, repeat: -1 });
    sujeiras.push(s);
  }
  c.camada.add(sujeiras);
  const painelContador = textoEmPainel(c.cena, W / 2, alvo.y + 230, `Esfregue! Faltam ${total}`, 36, 420);
  const contador = painelContador.list[1] as Phaser.GameObjects.Text;
  c.camada.add(painelContador);

  const esfrega = new Esfrega(total);
  let acabou = false;
  const concluir = () => {
    // o ouvinte de pointermove fica na cena: sem isto, esfregar na etapa
    // seguinte (quando o tempo acabou antes) chamava o fim de novo e pulava etapa
    if (acabou) return;
    acabou = true;
    timer.destruir();
    if (crianca) {
      rostoLimpo(c, crianca.boneco, espumas);
      return;
    }
    const limpo = e.estados?.[0];
    if (!limpo || !c.cena.textures.exists(limpo)) {
      certo(c, alvo.x, alvo.y);
      c.cena.time.delayedCall(700, c.fim);
      return;
    }
    // a mao suja vira a mao limpa, com brilho: a crianca ve o resultado
    const novo = figura(c.cena, alvo.x, alvo.y, limpo, alvo.icone, 220).setAlpha(0);
    c.camada.add(novo);
    c.cena.tweens.add({ targets: sujo, alpha: 0, duration: 450 });
    c.cena.tweens.add({ targets: novo, alpha: 1, duration: 450 });
    c.cena.tweens.add({ targets: novo, scale: novo.scale * 1.08, duration: 220, delay: 450, yoyo: true });
    somCerto();
    for (const [dx, dy] of [[-110, -80], [110, -60], [0, 120]]) brilhar(c, alvo.x + dx, alvo.y + dy);
    c.cena.time.delayedCall(1500, c.fim);
  };
  const timer = new TimerMusical(c.cena, W / 2, 520, e.segundos ?? 20, concluir);
  // espuma onde o dedo passa: e o que mostra para a crianca que esfregar faz efeito
  const espumas = c.cena.add.container(0, 0);
  c.camada.add(espumas);
  let ultimaEspuma = 0;
  const mover = (p: Phaser.Input.Pointer) => {
    if (!p.isDown || acabou) return;
    if (p.time - ultimaEspuma > 45) {
      ultimaEspuma = p.time;
      espuma(c, espumas, p.worldX, p.worldY);
    }
    // de olhos fechados, sorrindo: ninguem lava o rosto de olho aberto
    if (crianca && esfrega.limpos === 0) expressao(crianca.boneco, 'feliz');
    const anterior = esfrega.limpos;
    if (!esfrega.mover(p.x - p.prevPosition.x, p.y - p.prevPosition.y)) return;
    const s = sujeiras[anterior];
    nota(660 + esfrega.limpos * 40);
    c.cena.tweens.add({ targets: s, alpha: 0, scale: 0.2, duration: 260 });
    contador.setText(esfrega.completo ? 'Limpinho!' : `Esfregue! Faltam ${esfrega.faltam}`);
    if (esfrega.completo) concluir();
  };
  c.cena.input.on('pointermove', mover);
  c.camada.once(Phaser.GameObjects.Events.DESTROY, () => {
    timer.destruir();
    c.cena.input.off('pointermove', mover);
  });
};

/** Altura do meio do rosto na tela: abaixo do relogio, acima do contador. */
const ROSTO_Y = 800;

/** Onde ficam as sujeirinhas, em fracao da cabeca (0,0 no alto a esquerda): bochechas, nariz, queixo e testa. */
const MANCHAS: [number, number][] = [
  [0.27, 0.71],
  [0.75, 0.69],
  [0.52, 0.94],
  [0.44, 0.64],
  [0.6, 0.4],
];

/** O personagem da crianca grande, com a cabeca no meio da tela e as sujeirinhas no rosto. */
function rostoSujo(c: Ctx, total: number) {
  const cfg = ativo()?.personagem ?? personagemPadrao();
  const cab = cabecaDoPersonagem(c.cena, cfg);
  const altura = cab.queixo - cab.topo;
  // a cabeca com 320 px: o rosto inteiro aparece, o corpo some embaixo
  const k = 320 / altura;
  const meioY = ROSTO_Y;
  const boneco = desenharPersonagem(c.cena, cfg, k);
  boneco.setPosition(W / 2 - cab.cx * k, meioY - ((cab.topo + cab.queixo) / 2) * k);
  piscar(c.cena, boneco);
  const manchas: Phaser.GameObjects.Graphics[] = [];
  for (let i = 0; i < total; i++) {
    const [fx, fy] = MANCHAS[i % MANCHAS.length];
    const x = boneco.x + (cab.cx + (fx - 0.5) * cab.largura) * k;
    const y = boneco.y + (cab.topo + fy * altura) * k;
    const g = c.cena.add.graphics({ x, y });
    // mancha de terra: tres bolinhas juntas, meio transparentes, para parecer sujeira e nao botao
    g.fillStyle(0x8a6a4a, 0.5);
    g.fillCircle(0, 0, 15).fillCircle(11, 5, 11).fillCircle(-9, 7, 9);
    manchas.push(g);
  }
  return { boneco, manchas };
}

/** Uma bolha de espuma que sobe um pouquinho e some. */
function espuma(c: Ctx, dentro: Phaser.GameObjects.Container, x: number, y: number) {
  const b = c.cena.add
    .circle(x + Phaser.Math.Between(-16, 16), y + Phaser.Math.Between(-16, 16), Phaser.Math.Between(7, 18), 0xffffff, 0.92)
    .setStrokeStyle(2, 0xbfe0f2);
  dentro.add(b);
  c.cena.tweens.add({ targets: b, y: b.y - 24, scale: 1.4, alpha: 0, duration: 1100, onComplete: () => b.destroy() });
}

/** Fim de lavar o rosto: a agua cai, a espuma vai embora e o rosto limpinho sorri e comemora. */
function rostoLimpo(c: Ctx, boneco: Phaser.GameObjects.Container, espumas: Phaser.GameObjects.Container) {
  const meioY = ROSTO_Y;
  for (let i = 0; i < 18; i++) {
    const gota = c.cena.add.ellipse(W / 2 + Phaser.Math.Between(-150, 150), meioY - 260, 14, 22, 0x7fc8f0, 0.85);
    c.camada.add(gota);
    c.cena.tweens.add({
      targets: gota,
      y: meioY + 220,
      alpha: 0,
      delay: i * 40,
      duration: 600,
      ease: 'Quad.easeIn',
      onComplete: () => gota.destroy(),
    });
  }
  c.cena.tweens.add({ targets: espumas, alpha: 0, duration: 500, delay: 300 });
  c.cena.time.delayedCall(700, () => {
    somCerto();
    expressao(boneco, 'feliz');
    comemorar(c.cena, boneco);
    for (const [dx, dy] of [[-170, -120], [170, -90], [-150, 120], [160, 140]]) brilhar(c, W / 2 + dx, meioY + dy);
  });
  c.cena.time.delayedCall(2200, c.fim);
}

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
    // figura e nome no mesmo cartao: dois paineis brancos empilhados viravam
    // um degrau feio quando o nome tinha duas ou tres linhas
    const rotulo = it.texto
      ? c.cena.add
          .text(it.x, it.y + 92, it.texto, { fontSize: '26px', align: 'center', wordWrap: { width: 148 } })
          .setOrigin(0.5, 0)
      : null;
    const base = c.cena.add.graphics();
    base.fillStyle(0xffffff, 0.97);
    const alturaI = 164 + (rotulo ? rotulo.height + 24 : 0);
    base.fillRoundedRect(it.x - 82, it.y - 82, 164, alturaI, 26);
    base.lineStyle(4, 0xc9b8a8, 1);
    base.strokeRoundedRect(it.x - 82, it.y - 82, 164, alturaI, 26);
    c.camada.add(base);
    const f = figura(c.cena, it.x, it.y, it.img, it.icone, 130);
    c.camada.add(f);
    const num = c.cena.add
      .text(it.x + 66, it.y - 66, '', { fontSize: '44px', color: '#2b8a3e', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setStroke('#ffffff', 8);
    c.camada.add(num);
    if (rotulo) c.camada.add(rotulo);
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
    .text(W / 2, 980, `Segure e sopre! Faltam ${total}`, { fontSize: '40px', color: '#2b3a4a' })
    .setOrigin(0.5);
  // sem painel branco a frase sumia no cenario, como em toda outra etapa
  const fundo = c.cena.add.graphics();
  const pintar = () => {
    fundo.clear();
    fundo.fillStyle(0xffffff, 0.96);
    fundo.fillRoundedRect(W / 2 - rotulo.width / 2 - 24, rotulo.y - rotulo.height / 2 - 12, rotulo.width + 48, rotulo.height + 24, 20);
  };
  pintar();
  c.camada.add([bola, fundo, rotulo]);
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
    pintar();
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
