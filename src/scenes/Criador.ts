import Phaser from 'phaser';
import { CONFIG } from '../config';
import { estrelasTotais } from '../economia';
import { narrador } from '../narrador';
import { TEMA } from '../theme';
import { fale } from '../narracoes';
import {
  ACESSORIOS,
  acessorioLiberado,
  CABELOS,
  cabecaDoPersonagem,
  CORES_CABELO,
  desenharPersonagem,
  montarOpcoes,
  OLHOS,
  PELES,
  ROUPAS,
} from '../personagem';
import { ativo, criar, personagemPadrao, salvar, type PersonagemCfg } from '../storage';
import { teclado } from '../teclado';
import { botao, botaoOuvir, botaoVoltar, fundo, irPara, titulo } from '../ui';
import { musicaDoMundo } from '../musica';

const W = CONFIG.LARGURA;
/** Opcoes por pagina: 2 linhas de 3, o que cabe entre o personagem e os botoes. */
const POR_PAGINA = 6;
/** altura das duas linhas de opcoes e da linha das setas: longe dos botoes de baixo (1160) */
const LINHA_1 = 790;
const LINHA_2 = 922;
const SETAS = 1040;

type Aba = 'pele' | 'olhos' | 'cabelo' | 'corCabelo' | 'roupa' | 'extras';

/** O roteiro de quem cria o personagem: uma coisa de cada vez, na ordem. */
type Passo = Aba | 'nome' | 'pronto';
const DICAS: Record<Passo, string> = {
  pele: 'Primeiro, escolha a cor da pele',
  olhos: 'Agora escolha o rosto',
  cabelo: 'Agora escolha o cabelo',
  corCabelo: 'Escolha a cor do cabelo',
  roupa: 'Agora escolha a roupa',
  extras: 'Quer colocar um acessório?',
  nome: 'Agora escreva o seu nome',
  pronto: 'Tudo pronto? Toque em Pronto!',
};

const ABAS: { id: Aba; icone: string; nome: string }[] = [
  { id: 'pele', icone: '\u{1F91B}', nome: 'Pele' },
  { id: 'olhos', icone: '\u{1F440}', nome: 'Olhos' },
  { id: 'cabelo', icone: '\u{1F487}', nome: 'Cabelo' },
  { id: 'corCabelo', icone: '\u{1F3A8}', nome: 'Cor' },
  { id: 'roupa', icone: '\u{1F455}', nome: 'Roupa' },
  { id: 'extras', icone: '\u{1F380}', nome: 'Extras' },
];

/**
 * O pedaco da arte do corpo que e roupa (da gola ao tenis, com os bracos), em
 * px do corpo de 360x512 que sai de tools/personagem.mjs.
 */
const CORTE_ROUPA = { x: 66, y: 180, w: 228, h: 320 };

export class Criador extends Phaser.Scene {
  private cfg!: PersonagemCfg;
  private nome = '';
  private aba: Aba = 'pele';
  private preview!: Phaser.GameObjects.Container;
  private tituloTxt!: Phaser.GameObjects.Text;
  private pintarAbas: (() => void)[] = [];
  private opcoes!: Phaser.GameObjects.Container;
  private pagina = 0;
  private totalOpcoes = 0;
  private editando = false;
  /** criando um personagem novo: o titulo vira a instrucao e a maozinha aponta o proximo passo */
  private passos: Passo[] = [];
  private passo = 0;
  private mao?: Phaser.GameObjects.Text;
  private xAba: Partial<Record<Aba, number>> = {};
  /** recortes das cabecinhas dos botoes: nao ficam na tela, entao saem a mao */
  private recortes: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super('Criador');
  }

  /** Sem dados = criar novo. Com { editar: true } = mexer no perfil ativo. */
  init(dados?: { editar?: boolean }) {
    const atual = dados?.editar ? ativo() : null;
    this.editando = Boolean(atual);
    // personagem novo comeca careca e so de camiseta: a crianca monta do zero
    this.cfg = atual
      ? { ...atual.personagem, acessorios: [...atual.personagem.acessorios] }
      : { ...personagemPadrao(), cabelo: Math.max(0, CABELOS.findIndex((c) => c.id === 'careca')) };
    this.nome = atual?.nome ?? '';
    this.aba = 'pele';
    this.passo = 0;
    this.mao = undefined;
    this.xAba = {};
  }

  create() {
    this.events.once('shutdown', () => this.recortes.forEach((g) => g.destroy()));
    musicaDoMundo();
    montarOpcoes(this);
    fundo(this, TEMA.rosa, 'bg_criador_personagem');
    botaoOuvir(this);
    if (this.editando) botaoVoltar(this, 'Mapa');
    this.tituloTxt = titulo(this, this.nome ? `Oi, ${this.nome}!` : 'Monte seu personagem', 120);

    this.preview = this.add.container(0, 0);
    this.opcoes = this.add.container(0, 0);
    this.desenharPreview();
    this.abas();
    this.passos = this.editando
      ? []
      : (['pele', 'olhos', 'cabelo', 'corCabelo', 'roupa', 'extras', 'nome', 'pronto'] as Passo[]).filter(
          (p) => p in this.xAba || p === 'nome' || p === 'pronto',
        );
    this.desenharOpcoes();

    botao(this, W / 2 - 180, 1160, 'Meu nome', () => this.pedirNome(), {
      icone: '\u{1F58D}\u{FE0F}',
      largura: 330,
    });
    botao(this, W / 2 + 180, 1160, 'Pronto', () => this.salvarPerfil(), {
      icone: '\u{2705}',
      largura: 330,
      cor: 0x7ddc8a,
    });

    fale('ui_monte_personagem');
    this.guiar();
  }

  /** Avanca o roteiro quando a crianca faz o passo da vez. */
  private fez(p: Passo) {
    if (this.passos[this.passo] !== p) return;
    this.passo += 1;
    // sem cabelo nao tem cor de cabelo; nome ja escrito antes nao precisa de novo
    while (
      (this.passos[this.passo] === 'corCabelo' && CABELOS[this.cfg.cabelo]?.id === 'careca') ||
      (this.passos[this.passo] === 'nome' && this.nome)
    ) {
      this.passo += 1;
    }
    this.guiar();
  }

  /** Titulo com a instrucao da vez e a maozinha em cima do que fazer agora. */
  private guiar() {
    const p = this.passos[this.passo];
    if (!p) return;
    this.tituloTxt.setText(p === 'pronto' && this.nome ? `Oi, ${this.nome}! Tudo pronto?` : DICAS[p]);
    if (!this.mao) this.mao = this.add.text(0, 0, '', { fontSize: '56px' }).setOrigin(0.5).setDepth(60);
    const mao = this.mao;
    this.tweens.killTweensOf(mao);
    const baixo = '\u{1F447}';
    const lado = '\u{1F448}';
    const cima = '\u{1F446}';
    // no passo da aba aberta aponta as opcoes; senao, a aba ou o botao da vez
    const [x, y, icone, eixo]: [number, number, string, 'x' | 'y'] =
      p === 'nome'
        ? [W / 2 - 180, 1250, cima, 'y']
        : p === 'pronto'
          ? [W / 2 + 180, 1250, cima, 'y']
          : p === this.aba
            ? [672, LINHA_1, lado, 'x']
            : [this.xAba[p] ?? W / 2, 546, baixo, 'y'];
    mao.setText(icone).setPosition(x, y);
    this.tweens.add({
      targets: mao,
      // vai e volta na direcao do que aponta
      [eixo]: (eixo === 'y' ? y : x) + (icone === baixo ? 12 : -12),
      duration: 420,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private desenharPreview() {
    this.preview.removeAll(true);
    // cabe entre o titulo (120) e a faixa de abas (630): com cabelo volumoso
    // a 1.15 a crianca passava por cima dos dois
    // um pouco menor e mais baixo: o titulo de duas linhas nao encosta no cabelo
    // e os pes continuam no mesmo lugar, acima das abas
    const boneco = desenharPersonagem(this, this.cfg, 0.74);
    boneco.setPosition(W / 2, 396);
    this.preview.add(boneco);
  }

  private abas() {
    this.pintarAbas = [];
    // aba com uma opcao so nao tem o que escolher: some ate chegar mais arte
    const visiveis = ABAS.filter((a) => a.id !== 'olhos' || OLHOS.length > 1);
    visiveis.forEach((a, i) => {
      const x = 56 + i * Math.min(101, (W - 112) / Math.max(1, visiveis.length - 1));
      const y = 630;
      this.xAba[a.id] = x;
      const g = this.add.graphics();
      const sel = () => this.aba === a.id;
      const pintar = () => {
        g.clear();
        g.fillStyle(sel() ? 0xffb43d : 0xffffff, 0.95);
        g.fillRoundedRect(x - 48, y - 52, 96, 104, 20);
      };
      pintar();
      this.add.text(x, y - 16, a.icone, { fontSize: '48px' }).setOrigin(0.5);
      this.add.text(x, y + 32, a.nome, { fontSize: '22px', color: '#2b3a4a' }).setOrigin(0.5);
      this.add
        .zone(x, y, 96, 104)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.aba = a.id;
          this.pagina = 0;
          this.pintarAbas.forEach((f) => f());
          this.desenharOpcoes();
          // acessorio e opcional (e no comeco ainda vem trancado): abrir a aba ja conta
          if (a.id === 'extras') this.fez('extras');
          else this.guiar();
        });
      this.pintarAbas.push(pintar);
    });
  }

  private caixa(i: number, total: number) {
    const cols = Math.min(3, total);
    const x = W / 2 + ((i % cols) - (cols - 1) / 2) * 205;
    const y = LINHA_1 + Math.floor(i / cols) * (LINHA_2 - LINHA_1);
    return { x, y };
  }

  private opcao(i: number, total: number, conteudo: (x: number, y: number) => void, ativa: boolean, onClick: () => void) {
    this.totalOpcoes = total;
    const base = this.pagina * POR_PAGINA;
    if (i < base || i >= base + POR_PAGINA) return; // fora da pagina aberta
    const { x, y } = this.caixa(i - base, Math.min(total - base, POR_PAGINA));
    const g = this.add.graphics();
    g.fillStyle(ativa ? 0x7ddc8a : 0xffffff, 0.95);
    g.fillRoundedRect(x - 90, y - 60, 180, 120, 22);
    this.opcoes.add(g);
    conteudo(x, y);
    const z = this.add
      .zone(x, y, 180, 120)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        onClick();
        this.desenharPreview();
        this.desenharOpcoes();
        this.fez(this.aba);
      });
    this.opcoes.add(z);
  }

  /** Setas ◀ ▶ quando a aba tem mais opcoes do que cabem na tela. */
  private desenharPaginas() {
    const paginas = Math.ceil(this.totalOpcoes / POR_PAGINA);
    if (paginas < 2) return;
    const seta = (x: number, txt: string, passo: number) => {
      const t = this.add
        .text(x, SETAS, txt, { fontSize: '52px', color: '#2b3a4a' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.pagina = (this.pagina + passo + paginas) % paginas;
          this.desenharOpcoes();
        });
      this.opcoes.add(t);
    };
    seta(W / 2 - 170, '◀', -1);
    // tem mais para o lado: bolinha laranja pulsando atras do ▶ e a maozinha apontando para ela
    if (this.pagina < paginas - 1) {
      const bola = this.add.circle(W / 2 + 170, SETAS, 34, 0xffb43d, 0.9);
      this.opcoes.add(bola);
      this.tweens.add({ targets: bola, scale: 1.18, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      const mao = this.add.text(W / 2 + 96, SETAS, '\u{1F449}', { fontSize: '40px' }).setOrigin(0.5);
      this.opcoes.add(mao);
      this.tweens.add({ targets: mao, x: mao.x + 12, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    seta(W / 2 + 170, '▶', 1);
    this.opcoes.add(
      this.add
        .text(W / 2 - 40, SETAS, `${this.pagina + 1}/${paginas}`, { fontSize: '30px', color: '#2b3a4a' })
        .setOrigin(0.5),
    );
  }

  private desenharOpcoes() {
    this.opcoes.removeAll(true);
    this.recortes.forEach((g) => g.destroy());
    this.recortes = [];
    this.totalOpcoes = 0;
    const cor = (c: number) => (x: number, y: number) => {
      const r = this.add.rectangle(x, y, 120, 84, c).setStrokeStyle(4, 0xffffff);
      this.opcoes.add(r);
    };
    const texto = (t: string, icone: string) => (x: number, y: number) => {
      this.opcoes.add(this.add.text(x, y - 22, icone, { fontSize: '48px' }).setOrigin(0.5));
      this.opcoes.add(
        this.add.text(x, y + 38, t, { fontSize: '24px', color: '#2b3a4a', align: 'center' }).setOrigin(0.5),
      );
    };

    // o botao mostra a cabecinha do proprio personagem com aquele cabelo ou rosto:
    // quem tem 4 anos escolhe pelo desenho, nao pelo nome escrito
    const cabecinha = (variante: Partial<PersonagemCfg>, nome: string) => (x: number, y: number) => {
      const cfg = { ...this.cfg, ...variante };
      const cab = cabecaDoPersonagem(this, cfg);
      const k = 62 / (cab.queixo - cab.topo);
      const b = desenharPersonagem(this, cfg, k);
      b.setPosition(x - cab.cx * k, y - 14 - ((cab.topo + cab.queixo) / 2) * k);
      const corte = this.make.graphics({}, false).fillRect(x - 88, y - 58, 176, 84);
      b.setMask(corte.createGeometryMask());
      this.recortes.push(corte);
      this.opcoes.add(b);
      this.opcoes.add(
        this.add.text(x, y + 40, nome, { fontSize: '21px', color: '#2b3a4a', align: 'center' }).setOrigin(0.5),
      );
    };

    switch (this.aba) {
      case 'pele':
        PELES.forEach((c, i) =>
          this.opcao(i, PELES.length, cor(c), this.cfg.pele === i, () => (this.cfg.pele = i)),
        );
        break;
      case 'olhos':
        OLHOS.forEach((o, i) =>
          this.opcao(i, OLHOS.length, cabecinha({ olhos: i }, o.nome), this.cfg.olhos === i, () => (this.cfg.olhos = i)),
        );
        break;
      case 'cabelo': {
        // linha de cima, cabelo de menino; de baixo, de menina: as duas andam juntas nas setas
        const indices = CABELOS.map((_, i) => i);
        const menino = (i: number) => CABELOS[i].id.startsWith('menino_') || CABELOS[i].id === 'careca';
        const linhas = [indices.filter(menino), indices.filter((i) => !menino(i))];
        const total = Math.ceil(Math.max(...linhas.map((l) => l.length)) / 3) * POR_PAGINA;
        linhas.forEach((lista, linha) =>
          lista.forEach((i, n) => {
            const vaga = Math.floor(n / 3) * POR_PAGINA + linha * 3 + (n % 3);
            this.opcao(vaga, total, cabecinha({ cabelo: i }, CABELOS[i].nome), this.cfg.cabelo === i, () => (this.cfg.cabelo = i));
          }),
        );
        for (const [y, icone] of [[LINHA_1, '\u{1F466}'], [LINHA_2, '\u{1F467}']] as const) {
          this.opcoes.add(this.add.text(30, y, icone, { fontSize: '38px' }).setOrigin(0.5));
        }
        break;
      }
      case 'corCabelo':
        CORES_CABELO.forEach((c, i) =>
          this.opcao(i, CORES_CABELO.length, cor(c), this.cfg.corCabelo === i, () => (this.cfg.corCabelo = i)),
        );
        break;
      case 'roupa': {
        // cada botao mostra a propria roupa, no tom de pele escolhido: com o
        // mesmo emoji em todas, so dava para ver a roupa depois de aplicar
        const pele = (this.cfg.pele % PELES.length) + 1;
        const roupa = (id: string, nome: string) => (x: number, y: number) => {
          const chave = `corpo${id}_pele${pele}`;
          if (!this.textures.exists(chave)) return texto(nome, '\u{1F455}')(x, y);
          const { x: cx, y: cy, w, h } = CORTE_ROUPA;
          const im = this.add.image(0, 0, chave).setCrop(cx, cy, w, h);
          const s = 86 / h;
          // o recorte nao muda o centro da imagem: desloca para o meio da roupa
          // cair no meio do botao
          im.setScale(s).setPosition(x + (im.width / 2 - (cx + w / 2)) * s, y - 22 + (im.height / 2 - (cy + h / 2)) * s);
          this.opcoes.add(im);
          this.opcoes.add(
            this.add.text(x, y + 38, nome, { fontSize: '24px', color: '#2b3a4a', align: 'center' }).setOrigin(0.5),
          );
        };
        ROUPAS.forEach((o, i) =>
          this.opcao(i, ROUPAS.length, roupa(o.id, o.nome), this.cfg.roupa === i, () => (this.cfg.roupa = i)),
        );
        break;
      }
      case 'extras': {
        const p = ativo();
        const estrelas = p ? estrelasTotais(p) : 0;
        const broches = p?.broches ?? [];
        ACESSORIOS.forEach((a, i) => {
          const liberado = acessorioLiberado(a, estrelas, broches);
          this.opcao(
            i,
            ACESSORIOS.length,
            texto(liberado ? a.nome : `\u{1F512} ${a.estrelas ?? ''}\u{2B50}`, a.icone),
            this.cfg.acessorios.includes(a.id),
            () => {
              if (!liberado) {
                fale('ui_item_guardado');
                return;
              }
              this.cfg.acessorios = this.cfg.acessorios.includes(a.id)
                ? this.cfg.acessorios.filter((x) => x !== a.id)
                : [...this.cfg.acessorios, a.id];
            },
          );
        });
        break;
      }
    }
    this.desenharPaginas();
  }

  private pedirNome() {
    teclado(this, this.nome, (nome) => {
      this.nome = nome;
      narrador.setNome(nome);
      fale('ui_nome_bonito');
      this.tituloTxt.setText(`Oi, ${nome}!`);
      if (this.passos.length) {
        this.fez('nome');
        this.guiar();
      }
    });
  }

  private salvarPerfil() {
    if (!this.nome) {
      fale('ui_primeiro_nome');
      // sem nome nao salva: o roteiro pula direto para o nome
      if (this.passos.length) {
        this.passo = this.passos.indexOf('nome');
        this.guiar();
      }
      return;
    }
    const atual = this.editando ? ativo() : null;
    if (atual) {
      atual.nome = this.nome;
      atual.personagem = this.cfg;
      salvar(atual);
    } else {
      criar(this.nome, this.cfg);
    }
    narrador.setNome(this.nome);
    irPara(this, 'Mapa');
  }
}
