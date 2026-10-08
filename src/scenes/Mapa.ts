import Phaser from 'phaser';
import { CONFIG, MUNDOS } from '../config';
import { gastarFicha, partidasHoje, podeJogar } from '../economia';
import { liberados, type MiniGame } from '../minigames';
import { missoesBonus, missoesDoMundo, mundoCompleto } from '../missions';
import { narrador } from '../narrador';
import { fale } from '../narracoes';
import { desenharPersonagem } from '../personagem';
import { ativo, salvar, type Perfil } from '../storage';
import { balao, botao, botaoOuvir, figura, fundo, hud, irPara, textoEmPainel, titulo, toque } from '../ui';
import type { Missao as MissaoDef } from '../types';

const W = CONFIG.LARGURA;
const TOPO = 330;
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
      irPara(this, 'Perfis');
      return;
    }
    narrador.setNome(this.p.nome);
    if (!this.p.viuTutorial) {
      this.scene.start('Tutorial');
      return;
    }
    fundo(this, 0xbde8ff, 'bg_mapa_mundos');
    // veu claro: o cenario do mapa e bonito, mas briga com os cartoes
    this.add.rectangle(W / 2, CONFIG.ALTURA / 2, W, CONFIG.ALTURA, 0xffffff, 0.34).setDepth(-8);
    // faixa do cabecalho: a lista rola por baixo e nao embola com o saldo
    this.add.rectangle(W / 2, 140, W, 280, 0xffffff, 0.82).setDepth(45);
    hud(this, this.p, 96);
    botaoOuvir(this, W - 76, 214);

    toque(
      figura(this, W - 76, 96, 'botao_pais', '\u{2699}\u{FE0F}', 92).setDepth(50),
      () => irPara(this, 'Pais'),
    );
    toque(
      figura(this, W - 196, 96, 'botao_casa', '\u{1F504}', 92).setDepth(50),
      () => irPara(this, 'Perfis'),
    );

    desenharPersonagem(this, this.p.personagem, 0.34).setPosition(84, 214).setDepth(50);
    textoEmPainel(this, 230, 214, this.p.nome, 36, 300).setDepth(50);
    this.add
      .zone(84, 214, 150, 180)
      .setInteractive({ useHandCursor: true })
      .setDepth(51)
      .on('pointerup', () => irPara(this, 'Criador', { editar: true }));

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
      this.lista.add(figura(this, 108, y + 52, aberto ? `mundo${m.id}` : 'mundo_bloqueado', m.icone, 76));
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
        if (!aberto) {
          y += 30;
          continue;
        }
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
    g.fillRoundedRect(56, y, W - 112, 96, 24);
    this.lista.add(g);
    this.lista.add(figura(this, 112, y + 48, `icone_${missao.id}`, missao.icone, 62));
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
      .zone(W / 2, y + 48, W - 112, 96)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        if (this.arrastou) return;
        irPara(this, 'Missao', { id: missao.id });
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
    botao(this, W / 2, 1200, `Jogar  (${this.p.fichas})`, () => this.abrirJogos(jogos), {
      icone: '\u{1F3AE}',
      largura: 460,
      cor: 0x7ddc8a,
    }).setDepth(41);
  }

  private abrirJogos(jogos: MiniGame[]) {
    const motivo = podeJogar(this.p);
    if (jogos.length === 0) {
      fale('mapa_termine_mundo');
      this.aviso('Termine um mundo para abrir um jogo!');
      return;
    }
    if (motivo === 'limite') {
      fale('mapa_limite');
      this.aviso(`Hoje já foram ${partidasHoje(this.p)} partidas. Amanhã tem mais!`);
      return;
    }
    if (motivo === 'sem_fichas') {
      fale('mapa_sem_fichas');
      this.aviso('Sem fichas. Faça uma missão para ganhar mais!');
      return;
    }
    if (jogos.length === 1) {
      this.jogar(jogos[0].id);
      return;
    }
    this.escolherJogo(jogos);
  }

  /** Com mais de um jogo aberto, a crianca escolhe qual quer. */
  private escolherJogo(jogos: MiniGame[]) {
    const capa = this.add.container(0, 0).setDepth(80);
    capa.add(this.add.rectangle(W / 2, CONFIG.ALTURA / 2, W, CONFIG.ALTURA, 0x12263a, 0.9));
    capa.add(titulo(this, 'Qual jogo?', 260));
    jogos.forEach((j, i) => {
      capa.add(
        botao(this, W / 2, 480 + i * 170, j.nome, () => this.jogar(j.id), {
          icone: j.icone,
          largura: 560,
          cor: 0x7ddc8a,
        }),
      );
    });
    capa.add(
      botao(this, W / 2, 480 + jogos.length * 170, 'Agora não', () => capa.destroy(), { largura: 560 }),
    );
  }

  private jogar(id: string) {
    gastarFicha(this.p);
    salvar(this.p);
    irPara(this, 'MiniGame', { id });
  }

  private aviso(texto: string) {
    const b = balao(this, texto, 1000).setDepth(60);
    this.time.delayedCall(3200, () => b.destroy());
  }
}
