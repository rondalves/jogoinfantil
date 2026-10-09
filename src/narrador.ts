import { AUDIOS } from './assets';

let nomeCrianca = '';
let ultimo: { texto: string; audio?: string } | null = null;
let tocando: HTMLAudioElement | null = null;
let voz: SpeechSynthesisVoice | null = null;
let nomeado = '';
let vozAdulto: 'f' | 'm' = 'f';

const FEMININAS = /maria|francisca|luciana|fernanda|vit[oó]ria|camila|in[eê]s|joana|helena|female|mulher|zira/i;
const MASCULINAS = /ricardo|daniel|felipe|jo[aã]o|paulo|male|homem|david/i;

/** Procura uma voz em portugues do Brasil do genero escolhido. */
function escolherVoz() {
  const vozes = window.speechSynthesis?.getVoices?.() ?? [];
  if (vozes.length === 0) return;
  const pt = vozes.filter((v) => /pt[-_]?br/i.test(v.lang) || /portugu/i.test(v.name));
  const candidatas = pt.length > 0 ? pt : vozes.filter((v) => /^pt/i.test(v.lang));
  const quero = vozAdulto === 'm' ? MASCULINAS : FEMININAS;
  const evito = vozAdulto === 'm' ? FEMININAS : MASCULINAS;
  voz =
    candidatas.find((v) => quero.test(v.name)) ??
    candidatas.find((v) => !evito.test(v.name)) ??
    candidatas[0] ??
    null;
}

const ACENTOS: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', é: 'e', ê: 'e', í: 'i',
  ó: 'o', ô: 'o', õ: 'o', ú: 'u', ü: 'u', ç: 'c',
};

/** Mesma regra do tools/gerar_narracao.py: frase -> nome de arquivo. */
export function chaveDeFala(texto: string) {
  return texto
    .toLowerCase()
    .replace(/[áàâãéêíóôõúüç]/g, (c) => ACENTOS[c] ?? c)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
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

  /** 'f' ou 'm': troca a gravacao e a voz do navegador do narrador adulto. */
  setVoz(v: 'f' | 'm') {
    if (v === vozAdulto) return;
    vozAdulto = v;
    escolherVoz();
  },

  /** Narra a frase. Usa o arquivo de audio se existir; senao, TTS pt-BR. */
  falar(texto: string, audio?: string) {
    const frase = texto.replace(/\{nome\}/g, nomeCrianca || 'amiguinho');
    ultimo = { texto, audio };
    this.parar();
    // com a voz masculina escolhida, <chave>_m.mp3 vem na frente
    const url = audio ? (vozAdulto === 'm' ? AUDIOS[`${audio}_m`] : undefined) ?? AUDIOS[audio] : undefined;
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

  /**
   * Diz o nome do que o dedo esta encostando. Nao entra no "ouvir de novo":
   * o botao continua repetindo a instrucao da etapa, nao o ultimo objeto.
   */
  nomear(texto: string, audio?: string) {
    if (!texto || texto === nomeado) return;
    nomeado = texto;
    const guardado = ultimo;
    this.falar(texto, audio ?? `nome_${chaveDeFala(texto)}`);
    ultimo = guardado;
  },

  /** Comeco de etapa: o proximo dedo que passar pode repetir o mesmo nome. */
  esquecerNome() {
    nomeado = '';
  },

  repetir() {
    nomeado = '';
    if (ultimo) this.falar(ultimo.texto, ultimo.audio);
  },

  parar() {
    tocando?.pause();
    tocando = null;
    window.speechSynthesis?.cancel();
  },
};
