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

export const AUDIOS = mapear(
  import.meta.glob('/assets/audio/*.{mp3,ogg,m4a,wav}', { eager: true, query: '?url', import: 'default' }),
);
