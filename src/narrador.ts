import { AUDIOS } from './assets';

let nomeCrianca = '';
let ultimo: { texto: string; audio?: string } | null = null;
let tocando: HTMLAudioElement | null = null;
let voz: SpeechSynthesisVoice | null = null;

const FEMININAS = /maria|francisca|luciana|fernanda|vit[oó]ria|camila|in[eê]s|joana|helena|female|mulher|zira/i;
const MASCULINAS = /ricardo|daniel|felipe|jo[aã]o|paulo|male|homem|david/i;

/** Procura uma voz feminina em portugues do Brasil entre as do aparelho. */
function escolherVoz() {
  const vozes = window.speechSynthesis?.getVoices?.() ?? [];
  if (vozes.length === 0) return;
  const pt = vozes.filter((v) => /pt[-_]?br/i.test(v.lang) || /portugu/i.test(v.name));
  const candidatas = pt.length > 0 ? pt : vozes.filter((v) => /^pt/i.test(v.lang));
  voz =
    candidatas.find((v) => FEMININAS.test(v.name)) ??
    candidatas.find((v) => !MASCULINAS.test(v.name)) ??
    candidatas[0] ??
    null;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  escolherVoz();
  // a lista de vozes costuma chegar depois do primeiro carregamento
  window.speechSynthesis.addEventListener?.('voiceschanged', escolherVoz);
}

function tts(texto: string) {
  const sintese = window.speechSynthesis;
  if (!sintese) return;
  if (!voz) escolherVoz();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 0.92;
  fala.pitch = 1.2;
  if (voz) fala.voice = voz;
  sintese.speak(fala);
}

export const narrador = {
  setNome(nome: string) {
    nomeCrianca = nome;
  },

  /** Narra a frase. Usa o arquivo de audio se existir; senao, TTS pt-BR. */
  falar(texto: string, audio?: string) {
    const frase = texto.replace(/\{nome\}/g, nomeCrianca || 'amiguinho');
    ultimo = { texto, audio };
    this.parar();
    const url = audio ? AUDIOS[audio] : undefined;
    if (url) {
      const som = new Audio(url);
      tocando = som;
      som.onerror = () => tts(frase);
      som.play().catch(() => tts(frase));
    } else {
      tts(frase);
    }
    return frase;
  },

  repetir() {
    if (ultimo) this.falar(ultimo.texto, ultimo.audio);
  },

  parar() {
    tocando?.pause();
    tocando = null;
    window.speechSynthesis?.cancel();
  },
};
