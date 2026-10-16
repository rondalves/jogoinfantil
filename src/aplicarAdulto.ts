import type Phaser from 'phaser';
import { comAdulto, quemJoga, type QuemJoga } from './adulto';
import { CABELOS, desenharPersonagem, ROUPAS } from './personagem';
import { figura } from './ui';
import { IMAGENS } from './assets';
import { MISSOES } from './missions';
import { FRASES } from './narracoes';

/** Campos de texto das missoes e das falas: so neles o adulto vira mamae ou papai. */
const TEXTOS = new Set([
  'narracao_intro',
  'narracao',
  'texto',
  'fala',
  'explica',
  'explicacao',
  'pergunta',
  'frase_reforco',
  'consequencia',
]);
/** o texto original de cada objeto, para dar para trocar de mamae para papai e voltar */
const ORIGINAIS = new WeakMap<object, Record<string, string>>();

/** Arte de cada um; sem a arte da mamae ainda, nada (cai no emoji, nunca no papai). */
export function arteDe(q: QuemJoga) {
  if (q === 'mae') return IMAGENS.adulto_mae ? 'adulto_mae' : undefined;
  return IMAGENS.adulto_pai ? 'adulto_pai' : 'adulto';
}
export const emojiDe = (q: QuemJoga) => (q === 'mae' ? '\u{1F469}' : '\u{1F468}');
/** Arte e emoji de quem joga junto (sem escolha ainda, o papai que ja existia). */
export const arteAdulto = () => arteDe(quemJoga() ?? 'pai');
export const emojiAdulto = () => emojiDe(quemJoga() ?? 'pai');

function trocar(o: unknown) {
  if (Array.isArray(o)) return o.forEach(trocar);
  if (!o || typeof o !== 'object') return;
  const obj = o as Record<string, unknown>;
  let orig = ORIGINAIS.get(obj);
  if (!orig) {
    orig = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && (TEXTOS.has(k) || (k === 'img' && v === 'adulto'))) orig[k] = v;
    }
    ORIGINAIS.set(obj, orig);
  }
  for (const [k, v] of Object.entries(orig)) {
    // a figura de "chamar um adulto" vira o rosto de quem joga junto; sem a
    // arte da mamae ainda, uma chave que nao existe: cai no emoji, nunca no papai
    obj[k] = k === 'img' ? arteAdulto() ?? 'adulto_mae' : comAdulto(v, quemJoga());
  }
  for (const v of Object.values(obj)) if (v && typeof v === 'object') trocar(v);
}

/** Aplica a escolha nas missoes e nas falas. Chamar ao abrir e quando a escolha muda. */
export function aplicarAdulto() {
  trocar(MISSOES);
  trocar(Object.values(FRASES));
}

/**
 * O adulto desenhado na cena, com `altura` px. O papai e a arte do jogo; a
 * mamae, enquanto a arte dela nao chega, sai do mesmo gerador do personagem
 * da crianca: cabelo longo castanho, conjunto roxo, maior que a crianca.
 */
export function desenharAdultoDe(cena: Phaser.Scene, q: QuemJoga, altura: number): Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Transform {
  const arte = arteDe(q);
  if (arte && cena.textures.exists(arte)) return figura(cena, 0, 0, arte, emojiDe(q), altura);
  const cabelo = Math.max(0, CABELOS.findIndex((c) => c.id === 'liso_longo'));
  const roupa = Math.max(0, ROUPAS.findIndex((r) => r.id === '_roxo'));
  return desenharPersonagem(cena, { pele: 1, olhos: 0, cabelo, corCabelo: 1, roupa, acessorios: [] }, altura / 512);
}
export const desenharAdulto = (cena: Phaser.Scene, altura: number) => desenharAdultoDe(cena, quemJoga() ?? 'pai', altura);
