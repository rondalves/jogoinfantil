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

type Aba = 'pele' | 'olhos' | 'cabelo' | 'corCabelo' | 'roupa' | 'extras' | 'cadeira';

const ABAS: { id: Aba; icone: string; nome: string }[] = [
  { id: 'pele', icone: '\u{1F91B}', nome: 'Pele' },
  { id: 'olhos', icone: '\u{1F440}', nome: 'Olhos' },
  { id: 'cabelo', icone: '\u{1F487}', nome: 'Cabelo' },
  { id: 'corCabelo', icone: '\u{1F3A8}', nome: 'Cor' },
  { id: 'roupa', icone: '\u{1F455}', nome: 'Roupa' },
  { id: 'extras', icone: '\u{1F453}', nome: 'Extras' },
  { id: 'cadeira', icone: '\u{1F9BD}', nome: 'Rodas' },
];

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

  constructor() {
    super('Criador');
  }

  /** Sem dados = criar novo. Com { editar: true } = mexer no perfil ativo. */
  init(dados?: { editar?: boolean }) {
    const atual = dados?.editar ? ativo() : null;
    this.editando = Boolean(atual);
    this.cfg = atual ? { ...atual.personagem, acessorios: [...atual.personagem.acessorios] } : personagemPadrao();
    this.nome = atual?.nome ?? '';
    this.aba = 'pele';
  }

  create() {
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
  }

  private desenharPreview() {
    this.preview.removeAll(true);
    const boneco = desenharPersonagem(this, this.cfg, 1.15);
    boneco.setPosition(W / 2, 420);
    this.preview.add(boneco);
  }

  private abas() {
    this.pintarAbas = [];
    // aba com uma opcao so nao tem o que escolher: some ate chegar mais arte
    const visiveis = ABAS.filter((a) => a.id !== 'olhos' || OLHOS.length > 1);
    visiveis.forEach((a, i) => {
      const x = 56 + i * Math.min(101, (W - 112) / Math.max(1, visiveis.length - 1));
      const y = 630;
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
        });
      this.pintarAbas.push(pintar);
    });
  }

  private caixa(i: number, total: number) {
    const cols = Math.min(3, total);
    const x = W / 2 + ((i % cols) - (cols - 1) / 2) * 205;
    const y = 800 + Math.floor(i / cols) * 155;
    return { x, y };
  }

  private opcao(i: number, total: number, conteudo: (x: number, y: number) => void, ativa: boolean, onClick: () => void) {
    this.totalOpcoes = total;
    const base = this.pagina * POR_PAGINA;
    if (i < base || i >= base + POR_PAGINA) return; // fora da pagina aberta
    const { x, y } = this.caixa(i - base, Math.min(total - base, POR_PAGINA));
    const g = this.add.graphics();
    g.fillStyle(ativa ? 0x7ddc8a : 0xffffff, 0.95);
    g.fillRoundedRect(x - 90, y - 68, 180, 136, 22);
    this.opcoes.add(g);
    conteudo(x, y);
    const z = this.add
      .zone(x, y, 180, 136)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        onClick();
        this.desenharPreview();
        this.desenharOpcoes();
      });
    this.opcoes.add(z);
  }

  /** Setas ◀ ▶ quando a aba tem mais opcoes do que cabem na tela. */
  private desenharPaginas() {
    const paginas = Math.ceil(this.totalOpcoes / POR_PAGINA);
    if (paginas < 2) return;
    const seta = (x: number, txt: string, passo: number) => {
      const t = this.add
        .text(x, 1065, txt, { fontSize: '56px', color: '#2b3a4a' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.pagina = (this.pagina + passo + paginas) % paginas;
          this.desenharOpcoes();
        });
      this.opcoes.add(t);
    };
    seta(W / 2 - 170, '◀', -1);
    seta(W / 2 + 170, '▶', 1);
    this.opcoes.add(
      this.add
        .text(W / 2, 1065, `${this.pagina + 1}/${paginas}`, { fontSize: '32px', color: '#2b3a4a' })
        .setOrigin(0.5),
    );
  }

  private desenharOpcoes() {
    this.opcoes.removeAll(true);
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

    switch (this.aba) {
      case 'pele':
        PELES.forEach((c, i) =>
          this.opcao(i, PELES.length, cor(c), this.cfg.pele === i, () => (this.cfg.pele = i)),
        );
        break;
      case 'olhos':
        OLHOS.forEach((o, i) =>
          this.opcao(i, OLHOS.length, texto(o.nome, '\u{1F441}\u{FE0F}'), this.cfg.olhos === i, () => (this.cfg.olhos = i)),
        );
        break;
      case 'cabelo':
        CABELOS.forEach((o, i) =>
          this.opcao(i, CABELOS.length, texto(o.nome, '\u{1F487}'), this.cfg.cabelo === i, () => (this.cfg.cabelo = i)),
        );
        break;
      case 'corCabelo':
        CORES_CABELO.forEach((c, i) =>
          this.opcao(i, CORES_CABELO.length, cor(c), this.cfg.corCabelo === i, () => (this.cfg.corCabelo = i)),
        );
        break;
      case 'roupa':
        ROUPAS.forEach((o, i) =>
          this.opcao(i, ROUPAS.length, texto(o.nome, '\u{1F455}'), this.cfg.roupa === i, () => (this.cfg.roupa = i)),
        );
        break;
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
      case 'cadeira':
        this.opcao(0, 2, texto('Em pé', '\u{1F9D2}'), !this.cfg.cadeirante, () => (this.cfg.cadeirante = false));
        this.opcao(1, 2, texto('Cadeira de rodas', '\u{1F9BD}'), this.cfg.cadeirante, () => (this.cfg.cadeirante = true));
        break;
    }
    this.desenharPaginas();
  }

  private pedirNome() {
    teclado(this, this.nome, (nome) => {
      this.nome = nome;
      narrador.setNome(nome);
      fale('ui_nome_bonito');
      this.tituloTxt.setText(`Oi, ${nome}!`);
    });
  }

  private salvarPerfil() {
    if (!this.nome) {
      fale('ui_primeiro_nome');
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
