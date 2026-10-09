import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rotininha.missoesdodia',
  appName: 'Missões do Dia',
  webDir: 'dist',
  // o jogo e inteiro offline: nada de servidor nem de rede
  server: { androidScheme: 'https' },
  android: {
    allowMixedContent: false,
  },
};

export default config;
