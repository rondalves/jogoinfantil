import { AUDIOS } from './assets';

let nomeCrianca = '';
let ultimo: { texto: string; audio?: string } | null = null;
let tocando: HTMLAudioElement | null = null;
let nomeado = '';
let vozAdulto: 'f' | 'm' = 'f';

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

/**
 * Voz so de gravacao de verdade, nada sintetico: frase sem arquivo fica muda
 * e o texto continua na tela. Musica nao conta como fala gravada.
 */
export const temGravacoes = Object.keys(AUDIOS).some((k) => !k.startsWith('musica'));

export const narrador = {
  setNome(nome: string) {
    nomeCrianca = nome;
  },

  /** 'f' ou 'm': qual gravacao do narrador adulto tocar. */
  setVoz(v: 'f' | 'm') {
    vozAdulto = v;
  },

  /** Toca a gravacao da frase, se existir. Devolve o texto ja com o nome da crianca. */
  falar(texto: string, audio?: string) {
    const frase = texto.replace(/\{nome\}/g, nomeCrianca || 'amiguinho');
    ultimo = { texto, audio };
    this.parar();
    // com a voz masculina escolhida, <chave>_m.mp3 vem na frente
    const url = audio ? (vozAdulto === 'm' ? AUDIOS[`${audio}_m`] : undefined) ?? AUDIOS[audio] : undefined;
    if (url) {
      const som = new Audio(url);
      tocando = som;
      som.play().catch(() => undefined);
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
  },
};
