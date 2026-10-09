import Phaser from 'phaser';
import './estilo.css';
import { CONFIG } from './config';
import { Boot } from './scenes/Boot';
import { Criador } from './scenes/Criador';
import { Mapa } from './scenes/Mapa';
import { Medalha } from './scenes/Medalha';
import { MiniGame } from './scenes/MiniGame';
import { Missao } from './scenes/Missao';
import { Pais } from './scenes/Pais';
import { Perfis } from './scenes/Perfis';
import { Tutorial } from './scenes/Tutorial';
import { aplicarTema, carregarFonte } from './theme';

aplicarTema();

// a fonte precisa estar pronta antes do primeiro texto, senao nasce com a do sistema
carregarFonte().then(() => {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'jogo',
    backgroundColor: '#bde8ff',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: CONFIG.LARGURA,
      height: CONFIG.ALTURA,
    },
    render: { antialias: true, powerPreference: 'low-power', roundPixels: true },
    input: { activePointers: 2 },
    scene: [Boot, Perfis, Criador, Tutorial, Mapa, Missao, MiniGame, Medalha, Pais],
  });
});
