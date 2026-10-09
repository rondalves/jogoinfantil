import Phaser from 'phaser';
import './estilo.css';
import { CONFIG } from './config';
import { Boot } from './scenes/Boot';
import { Criador } from './scenes/Criador';
import { Bolhas } from './scenes/Bolhas';
import { Cantinho } from './scenes/Cantinho';
import { Historia } from './scenes/Historia';
import { Historinhas } from './scenes/Historinhas';
import { Joguinhos } from './scenes/Joguinhos';
import { Mapa } from './scenes/Mapa';
import { Medalha } from './scenes/Medalha';
import { MiniGame } from './scenes/MiniGame';
import { Missao } from './scenes/Missao';
import { Pais } from './scenes/Pais';
import { Perfis } from './scenes/Perfis';
import { Tutorial } from './scenes/Tutorial';
import { migrar } from './migracao';
import { aplicarTema, carregarFonte } from './theme';

aplicarTema();
// progresso de quem jogou antes dos seis mundos: estrela vai para o id novo
migrar();

// a fonte precisa estar pronta antes do primeiro texto, senao nasce com a do sistema
carregarFonte().then(() => {
  const jogo = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'jogo',
    backgroundColor: '#f3f1ec',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: CONFIG.LARGURA,
      height: CONFIG.ALTURA,
    },
    render: { antialias: true, powerPreference: 'low-power', roundPixels: true },
    input: { activePointers: 2 },
    scene: [
      Boot, Perfis, Criador, Tutorial, Mapa, Missao, MiniGame, Medalha, Pais,
      Historinhas, Historia, Joguinhos, Bolhas, Cantinho,
    ],
  });
  // tools/capturas.mjs espera a cena ficar pronta por aqui
  (window as unknown as { __jogo: Phaser.Game }).__jogo = jogo;
});
