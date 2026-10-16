import Phaser from 'phaser';
import './estilo.css';
import { ouvirAtalhos } from './atalhos';
import { CONFIG } from './config';
import { Boot } from './scenes/Boot';
import { Criador } from './scenes/Criador';
import { QuebraCabeca } from './scenes/QuebraCabeca';
import { Cantinho } from './scenes/Cantinho';
import { Historia } from './scenes/Historia';
import { Historinhas } from './scenes/Historinhas';
import { Joguinhos } from './scenes/Joguinhos';
import { Mapa } from './scenes/Mapa';
import { Medalha } from './scenes/Medalha';
import { AvisoTempo } from './scenes/AvisoTempo';
import { Colorir } from './scenes/Colorir';
import { JogoMemoria } from './scenes/JogoMemoria';
import { MotoMontanha } from './scenes/MotoMontanha';
import { Encaixe } from './scenes/Encaixe';
import { MiniGame } from './scenes/MiniGame';
import { Missao } from './scenes/Missao';
import { Pais } from './scenes/Pais';
import { Perfis } from './scenes/Perfis';
import { Tutorial } from './scenes/Tutorial';
import { migrar } from './migracao';
import { aplicarTema, carregarFonte } from './theme';
import { destinoDoVoltar, irPara } from './ui';

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
      Historinhas, Historia, Joguinhos, QuebraCabeca, Cantinho, JogoMemoria, Colorir, AvisoTempo,
      Encaixe, MotoMontanha,
    ],
  });
  // tools/capturas.mjs espera a cena ficar pronta por aqui
  (window as unknown as { __jogo: Phaser.Game }).__jogo = jogo;

  // o voltar do celular (MainActivity manda o evento): faz o que o botao de
  // voltar da tela faz; nas abas volta para o mapa; no resto nao faz nada
  // app ja aberto e outra crianca tocou no atalho com o rosto dela: vai para o mapa dela
  ouvirAtalhos(() => {
    const ativas = jogo.scene.getScenes(true);
    const cena = ativas[ativas.length - 1];
    if (cena) irPara(cena, 'Mapa');
  });
  window.addEventListener('voltar', () => {
    const ativas = jogo.scene.getScenes(true);
    const cena = ativas[ativas.length - 1];
    if (!cena) return;
    const volta = destinoDoVoltar(cena);
    if (volta) irPara(cena, volta[0], volta[1]);
    else if (['Historinhas', 'Joguinhos', 'Cantinho'].includes(cena.scene.key)) irPara(cena, 'Mapa');
  });
});
