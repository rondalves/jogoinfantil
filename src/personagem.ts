import Phaser from 'phaser';
import CABECAS from './cabecas.json';
import type { PersonagemCfg } from './storage';

/**
 * Personagem montado com a arte de /assets/img, em camadas na mesma posicao:
 * corpo (ja com a roupa e o tom de pele) + olhos + cabelo + acessorios.
 *
 * As variacoes de pele e de cor de cabelo sao arquivos prontos, gerados por
 * tools/preparar_assets.py. Opcao sem arte simplesmente nao aparece no criador.
 */

/** Altura do personagem em unidades locais (escala 1). */
const ALT = 512;

/**
 * Onde vai o rosto, tirado de fotos de criancas de 2 a 6 anos: a testa e
 * grande, o olho fica no meio da cabeca (alto do cranio ao queixo) e a boca
 * perto do queixo. Rosto de adulto e que tem o olho mais para cima.
 */
const LINHA_OLHOS = 0.55;
const LINHA_BOCA = 0.8;
/** largura da peca dos olhos (de sobrancelha a sobrancelha) sobre a do cranio */
const LARGURA_OLHOS = 0.74;

interface Cabeca {
  topo: number;
  queixo: number;
  largura: number;
  cx: number;
}

/**
 * A cabeca de cada corpo, medida pelo preparar_assets (src/cabecas.json) em
 * fracao da altura da arte. Volta em unidades do personagem, com 0 no meio.
 */
function cabecaDe(sufixo: string) {
  const tabela = CABECAS as Record<string, Cabeca>;
  const c = tabela[sufixo] ?? tabela[''] ?? { topo: 0.037, queixo: 0.396, largura: 0.361, cx: 0 };
  return { topo: (c.topo - 0.5) * ALT, queixo: (c.queixo - 0.5) * ALT, largura: c.largura * ALT, cx: c.cx * ALT };
}

/** Cores só para os botões do criador — a arte já vem recolorida. */
export const PELES = [0xffe0bd, 0xefc9ab, 0xf3c893, 0xe0ac69, 0xc68642, 0x8d5524, 0x5c3317];
export const CORES_CABELO = [
  0x2b1b17, 0x6b4423, 0xd9a95b, 0xb33a2b, 0xc3c3c8, 0x7d4fa0, 0xf7e2b0, 0xe8699f, 0x4a90d9,
];

/** Todo penteado que o jogo sabe mostrar. So aparece no criador o que tem arte. */
const CATALOGO_CABELOS = [
  { id: 'cacheado', nome: 'Cacheado' },
  { id: 'crespo', nome: 'Crespo' },
  { id: 'ondulado', nome: 'Ondulado' },
  { id: 'enrolado', nome: 'Enrolado' },
  { id: 'liso_longo', nome: 'Liso longo' },
  { id: 'liso_curto', nome: 'Liso curto' },
  { id: 'trancas', nome: 'Tranças' },
  { id: 'tranca_unica', nome: 'Trança' },
  { id: 'coque', nome: 'Coque' },
  { id: 'maria_chiquinha', nome: 'Chiquinhas' },
  { id: 'box_braids', nome: 'Box braids' },
  { id: 'dreads', nome: 'Dreads' },
  { id: 'menino_curto', nome: 'Curto' },
  { id: 'menino_cacheado', nome: 'Cacheado curto' },
  { id: 'menino_crespo', nome: 'Crespo baixo' },
  { id: 'menino_black_power', nome: 'Black power' },
  { id: 'menino_espetado', nome: 'Espetado' },
  { id: 'menino_tigelinha', nome: 'Tigelinha' },
  { id: 'menino_raspado', nome: 'Raspadinho' },
  { id: 'menino_degrade', nome: 'Degradê' },
  { id: 'menino_risco', nome: 'Risquinho' },
  { id: 'menino_moicano', nome: 'Moicano' },
];

const CATALOGO_OLHOS = [
  { id: 'redondos', nome: 'Redondos' },
  { id: 'alegres', nome: 'Alegres' },
  { id: 'grandes', nome: 'Grandes' },
  { id: 'sorriso', nome: 'Sorrisão' },
];

export let CABELOS = [{ id: 'cacheado', nome: 'Cacheado' }, { id: 'careca', nome: 'Sem cabelo' }];
export let OLHOS = [{ id: 'redondos', nome: 'Redondos' }];

/** Le o que existe em assets/img e monta as listas do criador. */
export function montarOpcoes(cena: Phaser.Scene) {
  const comArte = CATALOGO_CABELOS.filter((c) => cena.textures.exists(`cabelo_${c.id}_1`));
  CABELOS = [...comArte, { id: 'careca', nome: 'Sem cabelo' }];
  const olhos = CATALOGO_OLHOS.filter((o) => cena.textures.exists(`olhos_${o.id}`));
  if (olhos.length > 0) OLHOS = olhos;
  const roupas = CATALOGO_ROUPAS.filter((r) => cena.textures.exists(`corpo${r.id}_pele1`));
  if (roupas.length > 0) ROUPAS = roupas;
}
/** So entra no criador a roupa que tem arte (ver ROUPAS no preparar_assets). */
const CATALOGO_ROUPAS = [
  { id: '', nome: 'Camiseta' },
  { id: '_macacao', nome: 'Macacão' },
  { id: '_vestido_rosa', nome: 'Vestido rosa' },
  { id: '_roxo', nome: 'Conjunto roxo' },
  { id: '_azul', nome: 'Camiseta azul' },
  { id: '_vermelho', nome: 'Moletom' },
];
export let ROUPAS = [{ id: '', nome: 'Camiseta' }];

export interface Acessorio {
  id: string;
  nome: string;
  icone: string;
  /** posicao em fracao da altura do personagem, a partir do centro */
  x: number;
  y: number;
  tamanho: number;
  /** estrelas necessarias (0 = sempre disponivel) */
  estrelas?: number;
  /** broche de mundo necessario */
  broche?: number;
  /** entra atras do corpo (a capa de heroi) */
  atras?: boolean;
  /** vai na linha dos olhos e cresce com a cabeca: tamanho e fracao da largura dela */
  rosto?: boolean;
}

/**
 * So entra aqui o acessorio que encaixa bem em todas as cabecas.
 *
 * Oculos e aparelho auditivo sairam por enquanto: a arte nao bate com o
 * rosto (o oculos flutua acima dos olhos, o aparelho descola da orelha), e
 * acessorio torto e pior que nenhum. Voltam assim que chegar arte na
 * moldura certa -- prompt em PROMPTS_PENDENTES.md, e e so descomentar.
 */
export const ACESSORIOS: Acessorio[] = [
  // medido na arte do corpo: olhos em -0.30, orelha em x 0.155 e y -0.235
  { id: 'oculos', nome: 'Óculos', icone: '\u{1F453}', x: 0, y: 0, tamanho: 0.55, rosto: true },
  // { id: 'aparelho_auditivo', nome: 'Aparelho auditivo', icone: '\u{1F9BB}', x: 0.155, y: -0.235, tamanho: 0.075 },
  { id: 'bone', nome: 'Boné', icone: '\u{1F9E2}', x: 0, y: -0.45, tamanho: 0.22, estrelas: 3 },
  { id: 'laco', nome: 'Laço', icone: '\u{1F380}', x: -0.15, y: -0.44, tamanho: 0.15, estrelas: 3 },
  { id: 'capa', nome: 'Capa de herói', icone: '\u{1F9E3}', x: 0, y: 0.02, tamanho: 0.42, broche: 1, atras: true },
  { id: 'medalha', nome: 'Medalha', icone: '\u{1F3C5}', x: 0, y: -0.015, tamanho: 0.13, broche: 2 },
];

export function acessorioLiberado(a: Acessorio, estrelas: number, broches: number[]) {
  if (a.broche && !broches.includes(a.broche)) return false;
  return estrelas >= (a.estrelas ?? 0);
}

export const temArte = (cena: Phaser.Scene) => cena.textures.exists('corpo_pele1');

const sufixoCorpo = (cfg: PersonagemCfg) => (cfg.cadeirante ? '_sentado' : ROUPAS[cfg.roupa % ROUPAS.length].id);

function corpoChave(cfg: PersonagemCfg) {
  return `corpo${sufixoCorpo(cfg)}_pele${(cfg.pele % PELES.length) + 1}`;
}

/** Imagem ajustada pela LARGURA, mantendo a proporcao. */
function porLargura(cena: Phaser.Scene, chave: string, largura: number) {
  const im = cena.add.image(0, 0, chave).setOrigin(0.5);
  im.setScale(largura / im.width);
  return im;
}

/** Container com o personagem completo, pronto para entrar em qualquer cena. */
export function desenharPersonagem(
  cena: Phaser.Scene,
  cfg: PersonagemCfg,
  escala = 1,
): Phaser.GameObjects.Container {
  const c = cena.add.container(0, 0);

  const chave = corpoChave(cfg);
  const temCorpo = cena.textures.exists(chave);
  const corpo = cena.add.image(0, 0, temCorpo ? chave : 'corpo_pele1');
  corpo.setOrigin(0.5).setScale(ALT / corpo.height);
  c.add(corpo);

  const cab = cabecaDe(temCorpo ? sufixoCorpo(cfg) : '');
  const altura = cab.queixo - cab.topo;
  const linhaOlhos = cab.topo + LINHA_OLHOS * altura;
  const chaveOlhos = `olhos_${OLHOS[cfg.olhos % OLHOS.length].id}`;
  if (cena.textures.exists(chaveOlhos)) {
    // a peca dos olhos sai do preparar_assets com a linha dos olhos no meio
    const olhos = porLargura(cena, chaveOlhos, LARGURA_OLHOS * cab.largura).setPosition(cab.cx, linhaOlhos);
    c.add(olhos);
    const chaveBoca = chaveOlhos.replace('olhos_', 'boca_');
    if (cena.textures.exists(chaveBoca)) {
      c.add(cena.add.image(cab.cx, cab.topo + LINHA_BOCA * altura, chaveBoca).setScale(olhos.scaleX));
    }
  }

  const cabelo = CABELOS[cfg.cabelo % CABELOS.length].id;
  const chaveCabelo = `cabelo_${cabelo}_${(cfg.corCabelo % CORES_CABELO.length) + 1}`;
  if (cabelo !== 'careca' && cena.textures.exists(chaveCabelo)) {
    // a arte do cabelo sai no quadro do corpo base; em outro corpo (a cadeira
    // de rodas tem a cabeca menor) acompanha a cabeca dele: mesmo alto do
    // cranio, mesma largura
    const base = cabecaDe('');
    const k = cab.largura / base.largura;
    const x = cab.cx - k * base.cx;
    const y = cab.topo - k * base.topo;
    const fundo = `cabelofundo_${cabelo}`;
    if (cena.textures.exists(fundo)) {
      // o cabelo de tras da cabeca, mais escuro: preenche o vao entre o
      // cabelo e o rosto e fica atras do pescoco, como no cabelo de verdade
      const cor = Phaser.Display.Color.IntegerToColor(CORES_CABELO[cfg.corCabelo % CORES_CABELO.length]);
      const escuro = Phaser.Display.Color.GetColor(cor.red * 0.45, cor.green * 0.45, cor.blue * 0.45);
      c.addAt(cena.add.image(x, y, fundo).setScale((k * ALT) / 512).setTint(escuro), 0);
    }
    c.add(cena.add.image(x, y, chaveCabelo).setScale((k * ALT) / 512));
  }

  for (const id of cfg.acessorios) {
    const a = ACESSORIOS.find((x) => x.id === id);
    if (!a) continue;
    const chave = `acessorio_${a.id}`;
    const largura = a.rosto ? a.tamanho * cab.largura : a.tamanho * ALT;
    const im = cena.textures.exists(chave)
      ? porLargura(cena, chave, largura)
      : cena.add.text(0, 0, a.icone, { fontSize: `${Math.round(largura)}px` }).setOrigin(0.5);
    if (a.rosto) im.setPosition(cab.cx + a.x * cab.largura, linhaOlhos + a.y * cab.largura);
    else im.setPosition(a.x * ALT, a.y * ALT);
    c.add(im);
    // a capa cai nas costas: vai para tras do corpo
    if (a.atras) c.sendToBack(im);
  }

  c.setScale(escala);
  return c;
}
