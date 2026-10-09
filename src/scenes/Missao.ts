import Phaser from 'phaser';
import { carregar } from '../assets';
import { CONFIG } from '../config';
import { bonusMundo, concluirMissao, gastarFicha, podeJogar } from '../economia';
import { miniGameDoMundo } from '../minigames';
import { jogoCompleto, MISSOES, missaoPorId, missoesDoMundo } from '../missions';
import { narrador } from '../narrador';
import { fale } from '../narracoes';
import { desenharPersonagem } from '../personagem';
import { TEMA } from '../theme';
import { ativo, salvar, type Perfil } from '../storage';
import type { Missao as MissaoDef } from '../types';
import {
  area,
  balao,
  botao,
  botaoOuvir,
  botaoVoltar,
  cobrirTela,
  confete,
  estrelasNaTela,
  figura,
  fundo,
  hud,
  irPara,
  nota,
  somCerto,
  somErro,
  TELA,
  textoEmPainel,
  titulo,
  tremer,
} from '../ui';
import { ETAPAS, type Ctx } from './etapas';

const W = CONFIG.LARGURA;

/**
 * MOTOR GENERICO. Le a missao do JSON e monta: Mostrar -> Fazer -> Pode ou Nao Pode
 * -> estrelas e recompensa. Missao nova = JSON novo, sem mexer aqui.
 */
export class Missao extends Phaser.Scene {
  private def!: MissaoDef;
  private perfil!: Perfil;
  private erros = 0;
  private indice = 0;
  private camada!: Phaser.GameObjects.Container;
  private bg?: Phaser.GameObjects.Image;
  private barra!: Phaser.GameObjects.Container;

  constructor() {
    super('Missao');
  }

  init(dados: { id: string }) {
    this.def = missaoPorId(dados.id) ?? MISSOES[0];
    this.erros = 0;
    this.indice = 0;
  }

  /** Toda arte que esta missao usa, para carregar antes de comecar. */
  private arte(): (string | undefined)[] {
    const d = this.def;
    const das = (itens?: { img?: string }[]) => (itens ?? []).map((i) => i.img);
    // a etapa de escovar usa a arte da boca, que nao esta no JSON
    const boca = d.etapas.some((e) => e.tipo === 'escovar')
      ? ['m01_boca_suja', 'm01_boca_limpa']
      : [];
    return [
      ...boca,
      d.cenario,
      d.pode_ou_nao_pode.cena_certa.img,
      d.pode_ou_nao_pode.cena_errada.img,
      ...d.etapas.flatMap((e) => [
        e.cenario,
        e.alvo?.img,
        ...das(e.alvos),
        ...das(e.itens),
        ...das(e.perguntas),
        ...(e.sujeiras ?? []),
      ]),
    ];
  }

  create() {
    this.perfil = ativo()!;
    narrador.setNome(this.perfil.nome);
    narrador.setVoz(this.perfil.voz ?? 'f');
    fundo(this, TEMA.creme);
    this.barra = hud(this, this.perfil, 96, W / 2, 0.5);
    botaoOuvir(this);
    botaoVoltar(this, 'Mapa');
    this.camada = this.add.container(0, 0);
    const espera = textoEmPainel(this, W / 2, 600, 'Preparando...', 40);
    carregar(this, this.arte(), () => {
      espera.destroy();
      this.cenario();
      this.intro();
    });
  }

  /** Troca o cenario de fundo: o da etapa, ou o da missao. */
  private cenario(nome?: string) {
    const alvo = nome ?? this.def.cenario;
    if (!alvo || !this.textures.exists(alvo)) return;
    this.bg?.destroy();
    const im = this.add.image(W / 2, TELA.meio, alvo).setDepth(-9);
    im.setScale(Math.max(W / im.width, TELA.altura / im.height));
    this.bg = im;
  }

  /** No fim da missao o cenario sai de foco: quem brilha e a estrela. */
  private desfocarCenario() {
    if (this.bg) {
      try {
        this.bg.preFX?.addBlur(0, 2, 2, 1.2);
      } catch {
        // sem WebGL o desfoque nao existe: o veu abaixo ja da o recado
      }
    }
    this.camada.add(
      cobrirTela(this, 0xfbf9f5, 0.72).setDepth(-1),
    );
  }

  private limpar() {
    // so os listeners de cena que as etapas registram
    this.input.off('pointerup');
    this.input.off('pointermove');
    this.camada.destroy();
    this.camada = this.add.container(0, 0);
  }

  private progresso() {
    const t = this.def.etapas.length;
    const txt = `Etapa ${Math.min(this.indice + 1, t)} de ${t}`;
    this.camada.add(textoEmPainel(this, W / 2, 200, txt, 30, 360));
  }

  private intro() {
    this.limpar();
    this.camada.add(titulo(this, `${this.def.icone}  ${this.def.titulo}`, 220));
    const frase = narrador.falar(this.def.narracao_intro, this.def.audio_intro);
    this.camada.add(balao(this, frase, 430));
    const p = desenharPersonagem(this, this.perfil.personagem, 1.1);
    p.setPosition(W / 2, 820);
    this.camada.add(p);
    this.camada.add(botao(this, W / 2, 1120, 'Vamos!', () => this.mostrar(), { icone: '\u{1F680}', cor: 0x7ddc8a }));
  }

  /** 1. Mostrar: o personagem faz a tarefa. */
  private mostrar() {
    this.limpar();
    const m = this.def.mostrar;
    const frase = narrador.falar(m?.narracao ?? 'Olha como se faz!', m?.audio);
    this.camada.add(balao(this, frase, 400));
    const p = desenharPersonagem(this, this.perfil.personagem, 1.2);
    p.setPosition(W / 2, 830);
    this.camada.add(p);
    const obj = figura(this, W / 2 + 150, 760, undefined, m?.icone ?? this.def.icone, 120);
    this.camada.add(obj);
    this.tweens.add({
      targets: obj,
      angle: { from: -18, to: 18 },
      y: 700,
      duration: 500,
      yoyo: true,
      repeat: 3,
    });
    this.camada.add(
      botao(this, W / 2, 1120, 'Minha vez!', () => this.proximaEtapa(), { icone: '\u{1F64B}', cor: 0x7ddc8a }),
    );
  }

  /** 2. Fazer: executa as etapas do JSON, uma por uma. */
  private proximaEtapa() {
    this.limpar();
    if (this.indice >= this.def.etapas.length) {
      this.podeOuNaoPode();
      return;
    }
    const etapa = this.def.etapas[this.indice];
    this.cenario(etapa.cenario);
    this.progresso();
    const frase = narrador.falar(etapa.narracao, etapa.audio);
    this.camada.add(textoEmPainel(this, W / 2, 330, frase, 36, W - 160));

    const chaveErro = `m${this.def.id}_erro${this.indice + 1}`;
    const ctx: Ctx = {
      cena: this,
      camada: this.camada,
      chaveErro,
      erro: (consequencia) => {
        this.erros += 1;
        somErro();
        if (consequencia) narrador.falar(consequencia, chaveErro);
      },
      fim: () => {
        this.indice += 1;
        this.proximaEtapa();
      },
    };
    ETAPAS[etapa.tipo](ctx, etapa);
  }

  /** 3. Pode ou Nao Pode: duas cenas, a crianca escolhe a certa. */
  private podeOuNaoPode() {
    this.limpar();
    const pnp = this.def.pode_ou_nao_pode;
    this.camada.add(titulo(this, pnp.pergunta ?? 'O que pode?', 300));
    narrador.falar(pnp.pergunta ?? 'O que pode fazer?', pnp.audio);

    const cenas = Phaser.Utils.Array.Shuffle([
      { ...pnp.cena_certa, ok: true },
      { ...pnp.cena_errada, ok: false },
    ]);

    cenas.forEach((cena, i) => {
      const y = 560 + i * 340;
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.95);
      g.fillRoundedRect(70, y - 140, W - 140, 280, 32);
      this.camada.add(g);
      const f = figura(this, 200, y, cena.img, cena.icone, 150);
      this.camada.add(f);
      this.camada.add(
        this.add
          .text(400, y, cena.texto, {
            fontSize: '40px',
            color: '#2b3a4a',
            align: 'center',
            wordWrap: { width: 260 },
          })
          .setOrigin(0.5),
      );
      // cartao inteiro clicavel: o dedo da crianca nao mira na figurinha
      const zona = area(this, W / 2, y, W - 140, 280, undefined, cena.texto);
      this.camada.add(zona);
      zona.on('pointerdown', () => {
        if (!cena.ok) {
          tremer(this, f);
          this.erros += 1;
          somErro();
          narrador.falar(pnp.explicacao, `m${this.def.id}_pnp_explica`);
          return;
        }
        zona.disableInteractive();
        somCerto();
        narrador.falar(pnp.explicacao, `m${this.def.id}_pnp_explica`);
        this.time.delayedCall(1400, () => this.final());
      });
    });
  }

  /** Estrelas, recompensa e frase de reforco. */
  private final() {
    this.limpar();
    const estrelas = concluirMissao(this.perfil, this.def.id, this.erros, this.def.estrelas_max);
    const ids = missoesDoMundo(this.def.mundo).map((m) => m.id);
    const bonus = bonusMundo(this.perfil, this.def.mundo, ids);
    salvar(this.perfil);
    this.barra.destroy();
    this.barra = hud(this, this.perfil, 96, W / 2, 0.5);

    this.desfocarCenario();
    this.camada.add(titulo(this, 'Missão cumprida!', 280));
    this.camada.add(estrelasNaTela(this, estrelas, this.def.estrelas_max, 430));
    confete(this, bonus > 0 ? 100 : 45);
    this.animarMoeda(bonus > 0);

    this.time.delayedCall(1800, () => {
      const frase = narrador.falar(this.def.frase_reforco, this.def.audio_reforco);
      this.camada.add(balao(this, frase, 800));
      this.botoesFinais();
    });
  }

  /** A moeda vira 3 fichas, com som e narracao. Maior no fim do mundo. */
  private animarMoeda(fimDeMundo: boolean) {
    const y = 600;
    const moeda = this.add.text(W / 2, y, '\u{1FA99}', { fontSize: '110px' }).setOrigin(0.5);
    this.camada.add(moeda);
    nota(784);
    fale(fimDeMundo ? 'missao_mundo_completo' : 'missao_moeda');
    this.tweens.add({
      targets: moeda,
      scale: { from: 0, to: 1 },
      angle: 360,
      duration: 700,
      ease: 'Back.out',
      onComplete: () => {
        this.tweens.add({ targets: moeda, alpha: 0, scale: 0.4, duration: 300 });
        for (let i = 0; i < CONFIG.FICHAS_POR_MOEDA; i++) {
          const ficha = this.add.text(W / 2, y, '\u{1F39F}\u{FE0F}', { fontSize: '80px' }).setOrigin(0.5);
          this.camada.add(ficha);
          nota(660 + i * 110);
          this.tweens.add({
            targets: ficha,
            x: W / 2 + (i - 1) * 150,
            y: y + 90,
            duration: 500,
            delay: i * 120,
            ease: 'Cubic.out',
            onComplete: () => {
              this.tweens.add({ targets: ficha, x: 150, y: 96, scale: 0.4, alpha: 0.2, duration: 600, delay: 700 });
            },
          });
        }
        if (fimDeMundo) {
          const broche = this.add.text(W / 2, y - 140, '\u{1F396}\u{FE0F}', { fontSize: '140px' }).setOrigin(0.5);
          this.camada.add(broche);
          this.tweens.add({ targets: broche, scale: { from: 0, to: 1 }, angle: 360, duration: 900, ease: 'Back.out' });
        }
      },
    });
  }

  private botoesFinais() {
    if (jogoCompleto(this.perfil.missoes)) {
      this.camada.add(
        botao(this, W / 2, 1120, 'Minha medalha!', () => irPara(this, 'Medalha'), {
          icone: '\u{1F3C5}',
          cor: 0x9cbfa6,
          largura: 460,
        }),
      );
      return;
    }
    const jogo = miniGameDoMundo(this.def.mundo);
    const liberado = jogo && this.perfil.broches.includes(this.def.mundo);
    if (!liberado) {
      this.camada.add(
        botao(this, W / 2, 1120, 'Voltar ao mapa', () => irPara(this, 'Mapa'), { icone: '\u{1F5FA}\u{FE0F}' }),
      );
      return;
    }
    // O mini game nunca abre sozinho: a crianca escolhe.
    this.camada.add(
      botao(
        this,
        W / 2,
        1060,
        'Jogar agora',
        () => {
          const motivo = podeJogar(this.perfil);
          if (motivo !== 'ok') {
            fale(motivo === 'limite' ? 'missao_limite' : 'missao_sem_fichas');
            return;
          }
          gastarFicha(this.perfil);
          salvar(this.perfil);
          irPara(this, 'MiniGame', { id: jogo!.id });
        },
        { icone: '\u{1F3AE}', cor: 0x7ddc8a, largura: 420 },
      ),
    );
    this.camada.add(
      botao(this, W / 2, 1200, 'Guardar fichas', () => irPara(this, 'Mapa'), {
        icone: '\u{1F39F}\u{FE0F}',
        largura: 420,
      }),
    );
  }
}
