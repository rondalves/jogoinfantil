import Phaser from 'phaser';
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

/** Onde fica a cabeca dentro da arte do corpo, em fracao da altura. */
const CABECA = {
  topo: -ALT / 2 + 0.055 * ALT,
  altura: 0.275 * ALT,
  largura: 0.357 * ALT,
};
const CENTRO_CABECA = CABECA.topo + CABECA.altura / 2;

/** Cores só para os botões do criador — a arte já vem recolorida. */
export const PELES = [0xffe0bd, 0xefc9ab, 0xf3c893, 0xe0ac69, 0xc68642, 0x8d5524, 0x5c3317];
export const CORES_CABELO = [
  0x2b1b17, 0x6b4423, 0xd9a95b, 0xb33a2b, 0x4a4a4a, 0x7d4fa0, 0xebd49c, 0xe8699f, 0x4a90d9,
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
}

export const ACESSORIOS: Acessorio[] = [
  { id: 'oculos', nome: 'Óculos', icone: '\u{1F453}', x: 0, y: -0.31, tamanho: 0.2 },
  { id: 'aparelho_auditivo', nome: 'Aparelho auditivo', icone: '\u{1F9BB}', x: 0.14, y: -0.3, tamanho: 0.13 },
  { id: 'bone', nome: 'Boné', icone: '\u{1F9E2}', x: 0, y: -0.45, tamanho: 0.22, estrelas: 3 },
  { id: 'laco', nome: 'Laço', icone: '\u{1F380}', x: -0.15, y: -0.44, tamanho: 0.15, estrelas: 3 },
  { id: 'capa', nome: 'Capa de herói', icone: '\u{1F9E3}', x: 0, y: 0.05, tamanho: 0.3, broche: 1 },
  { id: 'medalha', nome: 'Medalha', icone: '\u{1F3C5}', x: 0, y: -0.05, tamanho: 0.18, broche: 2 },
];

export function acessorioLiberado(a: Acessorio, estrelas: number, broches: number[]) {
  if (a.broche && !broches.includes(a.broche)) return false;
  return estrelas >= (a.estrelas ?? 0);
}

export const temArte = (cena: Phaser.Scene) => cena.textures.exists('corpo_pele1');

function corpoChave(cfg: PersonagemCfg) {
  const pele = (cfg.pele % PELES.length) + 1;
  if (cfg.cadeirante) return `corpo_sentado_pele${pele}`;
  const roupa = ROUPAS[cfg.roupa % ROUPAS.length].id;
  return `corpo${roupa}_pele${pele}`;
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
  const corpo = cena.add.image(0, 0, cena.textures.exists(chave) ? chave : 'corpo_pele1');
  corpo.setOrigin(0.5).setScale(ALT / corpo.height);
  c.add(corpo);

  const chaveOlhos = `olhos_${OLHOS[cfg.olhos % OLHOS.length].id}`;
  if (cena.textures.exists(chaveOlhos)) {
    const olhos = porLargura(cena, chaveOlhos, CABECA.largura * 0.78);
    olhos.setY(CENTRO_CABECA - CABECA.altura * 0.06);
    c.add(olhos);
  }

  const cabelo = CABELOS[cfg.cabelo % CABELOS.length].id;
  const chaveCabelo = `cabelo_${cabelo}_${(cfg.corCabelo % CORES_CABELO.length) + 1}`;
  if (cabelo !== 'careca' && cena.textures.exists(chaveCabelo)) {
    // a arte do cabelo ja sai no quadro do corpo, com o vao do rosto no lugar:
    // so entra por cima, na mesma escala (ver encaixar_cabelo no preparar_assets)
    const im = cena.add.image(0, 0, chaveCabelo).setOrigin(0.5).setScale(ALT / 512);
    c.add(im);
  }

  for (const id of cfg.acessorios) {
    const a = ACESSORIOS.find((x) => x.id === id);
    if (!a) continue;
    const chave = `acessorio_${a.id}`;
    const im = cena.textures.exists(chave)
      ? porLargura(cena, chave, a.tamanho * ALT)
      : cena.add.text(0, 0, a.icone, { fontSize: `${Math.round(a.tamanho * ALT)}px` }).setOrigin(0.5);
    im.setPosition(a.x * ALT, a.y * ALT);
    c.add(im);
  }

  c.setScale(escala);
  return c;
}
