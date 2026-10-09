import { AUDIOS } from './assets';

/**
 * Musica de fundo em loop, uma faixa por mundo (ver GRAVAR_VOZES.md).
 *
 * Sem o arquivo em /assets/audio, fica em silencio: da para publicar o jogo
 * antes de todas as faixas existirem. O navegador so deixa tocar depois do
 * primeiro toque na tela, entao a primeira tentativa fica agendada.
 */

let tocando: HTMLAudioElement | null = null;
let chaveAtual = '';
let ligada = true;
let volumeBase = 0.35;
let esperandoToque = false;

const tocar = (som: HTMLAudioElement) =>
  som.play().catch(() => {
    if (esperandoToque) return;
    esperandoToque = true;
    const retomar = () => {
      esperandoToque = false;
      if (tocando === som) som.play().catch(() => undefined);
    };
    window.addEventListener('pointerdown', retomar, { once: true });
  });

/** Troca a faixa de fundo. A mesma chave duas vezes nao reinicia a musica. */
export function musica(chave: string) {
  if (chave === chaveAtual) return;
  chaveAtual = chave;
  tocando?.pause();
  tocando = null;
  const url = ligada ? AUDIOS[chave] : undefined;
  if (!url) return;
  const som = new Audio(url);
  som.loop = true;
  som.volume = volumeBase;
  tocando = som;
  tocar(som);
}

/** Abaixa a musica enquanto outra coisa toca por cima (o timer musical). */
export function abafarMusica(abafar: boolean) {
  volumeBase = abafar ? 0.12 : 0.35;
  if (tocando) tocando.volume = volumeBase;
}

/** Liga/desliga pelo painel dos pais. Desligada, para na hora. */
export function setMusicaLigada(valor: boolean) {
  ligada = valor;
  if (valor) {
    const chave = chaveAtual;
    chaveAtual = '';
    musica(chave);
  } else {
    tocando?.pause();
    tocando = null;
  }
}

export const musicaLigada = () => ligada;

/** Faixa do mundo, com o menu como padrao fora das missoes. */
export const musicaDoMundo = (mundo?: number) =>
  musica(mundo ? `musica_mundo${mundo}` : 'musica_menu');
