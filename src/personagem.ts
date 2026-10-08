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
export const PELES = [0xffe0bd, 0xf3c893, 0xe0ac69, 0xc68642, 0x8d5524, 0x5c3317];
export const CORES_CABELO = [0x2b1b17, 0x6b4423, 0xd9a95b, 0xb33a2b, 0x4a4a4a, 0x7d4fa0];

export const CABELOS = [
  { id: 'cacheado', nome: 'Cacheado' },
  { id: 'careca', nome: 'Sem cabelo' },
];
export const OLHOS = [{ id: 'redondos', nome: 'Redondos' }];
export const ROUPAS = [
  { id: '', nome: 'Camiseta' },
  { id: '_macacao', nome: 'Macacão' },
];

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

  if (cena.textures.exists('olhos_redondos')) {
    const olhos = porLargura(cena, 'olhos_redondos', CABECA.largura * 0.78);
    olhos.setY(CENTRO_CABECA - CABECA.altura * 0.06);
    c.add(olhos);
  }

  const cabelo = CABELOS[cfg.cabelo % CABELOS.length].id;
  const chaveCabelo = `cabelo_${cabelo}_${(cfg.corCabelo % CORES_CABELO.length) + 1}`;
  if (cabelo !== 'careca' && cena.textures.exists(chaveCabelo)) {
    const im = porLargura(cena, chaveCabelo, CABECA.largura * 1.14);
    im.setY(CABECA.topo - CABECA.altura * 0.1 + im.displayHeight / 2);
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
