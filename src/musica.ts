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

/** Sobe ou desce o volume aos poucos; no fim de uma descida, pausa o som. */
function esmaecer(som: HTMLAudioElement, ate: number, ms: number) {
  const de = som.volume;
  const passo = 50;
  let passados = 0;
  const t = setInterval(() => {
    passados += passo;
    const q = Math.min(1, passados / ms);
    som.volume = Math.max(0, Math.min(1, de + (ate - de) * q));
    if (q < 1) return;
    clearInterval(t);
    if (ate === 0) som.pause();
  }, passo);
}

/**
 * Troca a faixa de fundo. A mesma chave duas vezes nao reinicia a musica.
 *
 * A troca e esmaecida nos dois lados: cortar no seco da um clique audivel e,
 * pior, chama a atencao da crianca para a troca de tela.
 */
export function musica(chave: string) {
  if (chave === chaveAtual) return;
  chaveAtual = chave;
  const antiga = tocando;
  if (antiga) esmaecer(antiga, 0, 400);
  tocando = null;
  const url = ligada ? AUDIOS[chave] : undefined;
  if (!url) return;
  const som = new Audio(url);
  som.loop = true;
  som.volume = 0;
  tocando = som;
  tocar(som);
  esmaecer(som, volumeBase, 600);
}

/** Abaixa a musica enquanto outra coisa toca por cima (o timer musical). */
export function abafarMusica(abafar: boolean) {
  volumeBase = abafar ? 0.12 : 0.35;
  if (tocando) esmaecer(tocando, volumeBase, 300);
}

/** Liga/desliga pelo painel dos pais. Desligada, para na hora. */
export function setMusicaLigada(valor: boolean) {
  ligada = valor;
  if (valor) {
    const chave = chaveAtual;
    chaveAtual = '';
    musica(chave);
  } else if (tocando) {
    esmaecer(tocando, 0, 300);
    tocando = null;
  }
}

export const musicaLigada = () => ligada;

/** Faixa do mundo, com o menu como padrao fora das missoes. */
export const musicaDoMundo = (mundo?: number) =>
  musica(mundo ? `musica_mundo${mundo}` : 'musica_menu');
