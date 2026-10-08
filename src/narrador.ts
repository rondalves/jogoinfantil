import { AUDIOS } from './assets';

let nomeCrianca = '';
let ultimo: { texto: string; audio?: string } | null = null;
let tocando: HTMLAudioElement | null = null;

function tts(texto: string) {
  const sintese = window.speechSynthesis;
  if (!sintese) return;
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 0.9;
  fala.pitch = 1.15;
  sintese.speak(fala);
}

export const narrador = {
  setNome(nome: string) {
    nomeCrianca = nome;
  },

  /** Narra a frase. Usa o arquivo de áudio se existir; senão, TTS pt-BR. */
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
