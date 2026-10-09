import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rotininha.missoesdodia',
  appName: 'Rotininha',
  webDir: 'dist',
  // o jogo e inteiro offline: nada de servidor nem de rede
  server: { androidScheme: 'https' },
  android: {
    allowMixedContent: false,
  },
};

export default config;
