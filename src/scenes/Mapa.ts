import Phaser from 'phaser';
import { CONFIG, MUNDOS } from '../config';
import { partidasHoje, podeJogar } from '../economia';
import { liberados } from '../minigames';
import { missoesBonus, missoesDoMundo, mundoCompleto } from '../missions';
import { narrador } from '../narrador';
import { desenharPersonagem } from '../personagem';
import { ativo, type Perfil } from '../storage';
import { balao, botao, botaoOuvir, figura, fundo, hud, toque } from '../ui';
import type { Missao as MissaoDef } from '../types';

const W = CONFIG.LARGURA;
const TOPO = 300;
const BASE = 1080;

export class Mapa extends Phaser.Scene {
  private p!: Perfil;
  private lista!: Phaser.GameObjects.Container;
  private altura = 0;

  constructor() {
    super('Mapa');
  }

  create() {
    this.p = ativo()!;
    if (!this.p) {
      this.scene.start('Perfis');
      return;
    }
    narrador.setNome(this.p.nome);
    fundo(this, 0xbde8ff, 'bg_mapa_mundos');
    hud(this, this.p, 96);
    botaoOuvir(this, W - 76, 200);

    toque(
      figura(this, W - 76, 96, 'botao_pais', '\u{2699}\u{FE0F}', 92).setDepth(50),
      () => this.scene.start('Pais'),
    );
    toque(
      figura(this, W - 196, 96, 'botao_casa', '\u{1F504}', 92).setDepth(50),
      () => this.scene.start('Perfis'),
    );

    desenharPersonagem(this, this.p.personagem, 0.4).setPosition(90, 200).setDepth(50);
    this.add
      .text(172, 200, this.p.nome, { fontSize: '38px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(0, 0.5)
      .setDepth(50);
    this.add
      .zone(90, 200, 150, 170)
      .setInteractive({ useHandCursor: true })
      .setDepth(51)
      .on('pointerup', () => this.scene.start('Criador', { editar: true }));

    this.lista = this.add.container(0, TOPO);
    this.montarLista();
    this.scroll();
    this.barraInferior();
  }

  private montarLista() {
    let y = 0;
    const liberadoAnterior = (mundo: number) => mundo === 1 || mundoCompleto(mundo - 1, this.p.missoes);

    for (const m of MUNDOS) {
      const missoes = missoesDoMundo(m.id);
      const aberto = liberadoAnterior(m.id);
      const temBroche = this.p.broches.includes(m.id);
      const estrelas = missoes.reduce((a, x) => a + (this.p.missoes[x.id] ?? 0), 0);
      const maximo = missoes.reduce((a, x) => a + x.estrelas_max, 0);

      const g = this.add.graphics();
      g.fillStyle(m.cor, aberto ? 0.95 : 0.4);
      g.fillRoundedRect(40, y, W - 80, 104, 26);
      this.lista.add(g);
      this.lista.add(figura(this, 108, y + 52, `mundo${m.id}`, m.icone, 76));
      this.lista.add(
        this.add
          .text(160, y + 36, `Mundo ${m.id} - ${m.nome}`, { fontSize: '32px', color: '#2b3a4a', fontStyle: 'bold' })
          .setOrigin(0, 0.5),
      );
      this.lista.add(
        this.add
          .text(160, y + 74, aberto ? `\u{2B50} ${estrelas}/${maximo}` : '\u{1F512} Termine o mundo anterior', {
            fontSize: '28px',
            color: '#5b6a7a',
          })
          .setOrigin(0, 0.5),
      );
      if (temBroche) this.lista.add(figura(this, W - 110, y + 52, `broche${m.id}`, '\u{1F396}\u{FE0F}', 76));
      y += 124;

      if (missoes.length === 0) {
        this.lista.add(
          this.add.text(W / 2, y + 30, 'Missões chegando em breve', { fontSize: '30px', color: '#6b7a8a' }).setOrigin(0.5),
        );
        y += 90;
        continue;
      }

      for (const missao of missoes) {
        this.cardMissao(missao, y, aberto);
        y += 112;
      }
      y += 26;
    }

    const bonus = missoesBonus();
    if (bonus.length > 0) {
      const tudo = MUNDOS.every((m) => mundoCompleto(m.id, this.p.missoes));
      this.lista.add(
        this.add
          .text(W / 2, y + 20, tudo ? 'Missão bônus liberada!' : 'Missão bônus: feche os 5 mundos', {
            fontSize: '32px',
            color: '#2b3a4a',
            fontStyle: 'bold',
          })
          .setOrigin(0.5),
      );
      y += 70;
      for (const missao of bonus) {
        this.cardMissao(missao, y, tudo);
        y += 112;
      }
    }

    this.altura = y;
  }

  private cardMissao(missao: MissaoDef, y: number, aberto: boolean) {
    const estrelas = this.p.missoes[missao.id] ?? 0;
    const g = this.add.graphics();
    g.fillStyle(0xffffff, aberto ? 0.95 : 0.45);
    g.fillRoundedRect(70, y, W - 140, 96, 24);
    this.lista.add(g);
    this.lista.add(this.add.text(118, y + 48, missao.icone, { fontSize: '50px' }).setOrigin(0.5));
    this.lista.add(
      this.add
        .text(170, y + 48, missao.titulo, { fontSize: '34px', color: '#2b3a4a', wordWrap: { width: 330 } })
        .setOrigin(0, 0.5),
    );
    this.lista.add(
      this.add
        .text(W - 110, y + 48, aberto ? '\u{2B50}'.repeat(estrelas) : '\u{1F512}', { fontSize: '34px' })
        .setOrigin(1, 0.5),
    );
    if (!aberto) return;
    if (estrelas === 0) this.lista.add(figura(this, W - 130, y + 48, 'botao_play', '\u{25B6}\u{FE0F}', 66));
    const z = this.add
      .zone(W / 2, y + 48, W - 140, 96)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        if (this.arrastou) return;
        this.scene.start('Missao', { id: missao.id });
      });
    this.lista.add(z);
  }

  private arrastou = false;

  /** Arraste vertical simples, com limite. */
  private scroll() {
    const limite = Math.min(0, BASE - TOPO - this.altura);
    let inicioY = 0;
    let inicioPonteiro = 0;
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      inicioY = this.lista.y;
      inicioPonteiro = p.y;
      this.arrastou = false;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!p.isDown || limite === 0) return;
      const d = p.y - inicioPonteiro;
      if (Math.abs(d) > 12) this.arrastou = true;
      this.lista.y = Phaser.Math.Clamp(inicioY + d, TOPO + limite, TOPO);
    });
  }

  private barraInferior() {
    this.add.rectangle(W / 2, 1200, W, 160, 0xffffff, 0.92).setDepth(40);
    const jogos = liberados(this.p.broches);
    botao(
      this,
      W / 2 - 170,
      1200,
      'Jogar',
      () => this.abrirJogos(jogos.length),
      { icone: '\u{1F3AE}', largura: 320, cor: 0x7ddc8a },
    ).setDepth(41);
    botao(this, W / 2 + 170, 1200, 'Missões', () => this.lista.setY(TOPO), {
      icone: '\u{1F5FA}\u{FE0F}',
      largura: 320,
    }).setDepth(41);
  }

  private abrirJogos(quantos: number) {
    const motivo = podeJogar(this.p);
    if (quantos === 0) {
      narrador.falar('Termine um mundo inteiro para abrir um jogo novo!');
      this.aviso('Termine um mundo para abrir um jogo!');
      return;
    }
    if (motivo === 'limite') {
      narrador.falar('As partidas de hoje acabaram. Vamos desenhar ou brincar lá fora?');
      this.aviso(`Hoje já foram ${partidasHoje(this.p)} partidas. Amanhã tem mais!`);
      return;
    }
    if (motivo === 'sem_fichas') {
      narrador.falar('Suas fichas acabaram. Faça uma missão para ganhar mais!');
      this.aviso('Sem fichas. Faça uma missão para ganhar mais!');
      return;
    }
    // ponytail: a cena MiniGame entra na ETAPA 2, com o primeiro mini game.
    this.scene.start('MiniGame');
  }

  private aviso(texto: string) {
    const b = balao(this, texto, 1000).setDepth(60);
    this.time.delayedCall(3200, () => b.destroy());
  }
}
