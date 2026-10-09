import type Phaser from 'phaser';

// Descobre em tempo de build o que existe em /assets. Nada de 404: só carrega
// os arquivos que o usuário realmente colocou na pasta (ver ASSETS.md).
const mapear = (mods: Record<string, unknown>) => {
  const fora: Record<string, string> = {};
  for (const [caminho, url] of Object.entries(mods)) {
    const nome = caminho.split('/').pop()!.replace(/\.\w+$/, '');
    fora[nome] = url as string;
  }
  return fora;
};

export const IMAGENS = mapear(
  import.meta.glob('/assets/img/*.{png,webp,jpg,jpeg}', { eager: true, query: '?url', import: 'default' }),
);

/**
 * So a arte que aparece em qualquer tela entra no carregamento inicial.
 * O resto (objetos de missao, cenarios, mini games) chega sob demanda, senao
 * a abertura leva uma eternidade no celular.
 */
const ESSENCIAL =
  /^(botao_|mundo|broche|estrela|ficha$|moeda$|medalha_final$|mascote_|corpo_|cabelo_|olhos_|acessorio_|cadeira_de_rodas$|icone_|bg_(menu_inicial|criador_personagem|mapa_mundos)$)/;

export const IMAGENS_BASE = Object.fromEntries(
  Object.entries(IMAGENS).filter(([chave]) => ESSENCIAL.test(chave)),
);

/** Carrega sob demanda as artes que faltam e chama `pronto` quando terminar. */
export function carregar(
  cena: { textures: { exists: (k: string) => boolean }; load: Phaser.Loader.LoaderPlugin },
  chaves: (string | undefined)[],
  pronto: () => void,
) {
  const faltam = [...new Set(chaves)].filter(
    (k): k is string => !!k && !!IMAGENS[k] && !cena.textures.exists(k),
  );
  if (faltam.length === 0) {
    pronto();
    return;
  }
  for (const k of faltam) cena.load.image(k, IMAGENS[k]);
  cena.load.once('complete', pronto);
  cena.load.start();
}

export const AUDIOS = mapear(
  import.meta.glob('/assets/audio/*.{mp3,ogg,m4a,wav}', { eager: true, query: '?url', import: 'default' }),
);

/**
 * As historinhas ficam numa subpasta e sao longas: entram por caminho
 * ("historias/01-nome"), nao pelo nome solto, para nao se misturarem com as
 * frases narradas.
 */
export const AUDIOS_HISTORIA: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob('/assets/audio/historias/*.{mp3,ogg,m4a,wav}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  ).map(([caminho, url]) => [
    'historias/' + caminho.split('/').pop()!.replace(/\.\w+$/, ''),
    url as string,
  ]),
);
