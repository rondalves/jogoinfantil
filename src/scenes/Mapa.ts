import Phaser from 'phaser';
import { darVida } from '../animacoes';
import { abas, TOPO_ABAS } from '../abas';
import { comAdulto, quemJoga } from '../adulto';
import { mundoPago } from '../compras';
import { CONFIG, MUNDOS } from '../config';
import { jogoCompleto, missoesBonus, missoesDoMundo, mundoCompleto } from '../missions';
import { narrador } from '../narrador';
import { TEMA } from '../theme';
import { desenharPersonagem } from '../personagem';
import { hojeISO } from '../economia';
import { fale } from '../narracoes';
import { confirmarReal } from '../ponte';
import { ativo, salvar, type Perfil } from '../storage';
import { balao, botao, botaoOuvir, cobrirTela, figura, fundo, hud, irPara, rolagem, textoEmPainel, toque } from '../ui';
import type { Missao as MissaoDef } from '../types';
import { musicaDoMundo } from '../musica';

const W = CONFIG.LARGURA;
const TOPO = 330;
/** onde a lista de missoes acaba: logo acima das abas */
const BASE = TOPO_ABAS - 20;

export class Mapa extends Phaser.Scene {
  private p!: Perfil;
  private lista!: Phaser.GameObjects.Container;
  private altura = 0;
  /** y (na lista) da primeira missao aberta ainda sem estrela: onde a crianca parou */
  private parou?: number;
  private arrastou = () => false;

  constructor() {
    super('Mapa');
  }

  create() {
    this.p = ativo()!;
    musicaDoMundo();
    if (!this.p) {
      irPara(this, 'Perfis');
      return;
    }
    narrador.setNome(this.p.nome);
    narrador.setVoz(this.p.voz ?? 'f');
    if (!this.p.viuApresentacao) {
      this.scene.start('Tutorial');
      return;
    }
    fundo(this, TEMA.ceu, 'bg_mapa_mundos', true);
    // veu claro: o cenario do mapa e bonito, mas briga com os cartoes
    
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

    darVida(this, desenharPersonagem(this, this.p.personagem, 0.34).setPosition(84, 214).setDepth(50));
    textoEmPainel(this, 230, 214, this.p.nome, 36, 300).setDepth(50);
    this.add
      .zone(84, 214, 150, 180)
      .setInteractive({ useHandCursor: true })
      .setDepth(51)
      .on('pointerup', () => irPara(this, 'Criador', { editar: true }));

    // 'rola' avisa o smoke que esta lista passa da tela de proposito
    this.lista = this.add.container(0, TOPO).setName('rola');
    this.parou = undefined;
    this.montarLista();
    // abre ja rolado ate a missao em que a crianca parou, com um pouco do que vem antes
    if (this.parou !== undefined)
      this.lista.y = Phaser.Math.Clamp(TOPO - (this.parou - 140), Math.min(TOPO, BASE - this.altura), TOPO);
    this.arrastou = rolagem(this, this.lista, TOPO, BASE, this.altura);
    abas(this, 'Mapa');
  }

  private montarLista() {
    let y = 0;
    const liberadoAnterior = (mundo: number) =>
      CONFIG.BETA_TUDO_ABERTO || mundo === 1 || mundoCompleto(mundo - 1, this.p.missoes);

    for (const m of MUNDOS) {
      const missoes = missoesDoMundo(m.id);
      // mundo de cima so abre com a compra, feita pelo adulto na area dele
      const pago = mundoPago(m.id);
      const aberto = liberadoAnterior(m.id) && !pago;
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
          .text(160, y + 34, `Mundo ${m.id} - ${m.nome}`, { fontSize: '26px', fontStyle: 'bold', wordWrap: { width: 450 } })
          .setOrigin(0, 0.5),
      );
      this.lista.add(
        this.add
          .text(
            160,
            y + 82,
            aberto
              ? `\u{2B50} ${estrelas}/${maximo}`
              : pago
                ? comAdulto('\u{1F512} Peça para um adulto abrir', quemJoga())
                : '\u{1F512} Termine o mundo anterior',
            { fontSize: '28px', color: '#5b6a7a' },
          )
          .setOrigin(0, 0.5),
      );
      if (temBroche) this.lista.add(figura(this, W - 84, y + 52, `broche${m.id}`, '\u{1F396}\u{FE0F}', 62));
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

    if (jogoCompleto(this.p.missoes)) {
      const g = this.add.graphics();
      g.fillStyle(0xe3b23c, 0.95);
      g.fillRoundedRect(40, y, W - 80, 120, 26);
      this.lista.add(g);
      this.lista.add(figura(this, 112, y + 60, 'medalha_final', '\u{1F3C5}', 86));
      this.lista.add(
        this.add
          .text(190, y + 60, 'Super Ajudante do Dia', { fontSize: '34px', fontStyle: 'bold' })
          .setOrigin(0, 0.5),
      );
      const z = this.add
        .zone(W / 2, y + 60, W - 80, 120)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', () => {
          if (!this.arrastou()) irPara(this, 'Medalha');
        });
      this.lista.add(z);
      y += 150;
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
        .text(168, y + 48, missao.titulo, { fontSize: '32px', wordWrap: { width: 290 } })
        .setOrigin(0, 0.5),
    );
    this.lista.add(
      this.add
        .text(W - 86, y + 48, aberto ? '\u{2B50}'.repeat(estrelas) : '\u{1F512}', { fontSize: '28px' })
        .setOrigin(1, 0.5),
    );
    if (!aberto) return;
    if (estrelas === 0 && this.parou === undefined) this.parou = y;
    if (estrelas === 0) this.lista.add(figura(this, W - 130, y + 48, 'botao_play', '\u{25B6}\u{FE0F}', 66));
    const pendente = this.p.pendentes?.includes(missao.id) ?? false;
    if (pendente) this.lista.add(this.add.text(490, y + 48, '\u{1F463}', { fontSize: '36px' }).setOrigin(0.5));
    const z = this.add
      .zone(W / 2, y + 48, W - 112, 96)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => narrador.nomear(missao.titulo))
      .on('pointerup', () => {
        if (this.arrastou()) return;
        if (pendente) this.perguntaReal(missao);
        else irPara(this, 'Missao', { id: missao.id });
      });
    this.lista.add(z);
  }

  /** A missao ficou esperando a tarefa de verdade: ja fez? */
  private perguntaReal(missao: MissaoDef) {
    const capa = this.add.container(0, 0).setDepth(100);
    capa.add(cobrirTela(this, 0x000000, 0.45).setInteractive());
    capa.add(balao(this, fale('missao_ja_fez'), 520));
    const fiz = () => {
      confirmarReal(this.p, missao.id, hojeISO());
      salvar(this.p);
      irPara(this, 'Mapa');
    };
    capa.add(botao(this, W / 2, 860, 'Fiz!', fiz, { icone: '\u{2705}', cor: 0x7ddc8a, largura: 520 }));
    capa.add(botao(this, W / 2, 1000, 'Jogar de novo', () => irPara(this, 'Missao', { id: missao.id }), { largura: 520 }));
    capa.add(botao(this, W / 2, 1140, 'Agora não', () => capa.destroy(), { largura: 520 }));
  }
}
