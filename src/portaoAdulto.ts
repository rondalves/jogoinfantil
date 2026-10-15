import Phaser from 'phaser';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { CONFIG } from './config';
import { botao, cobrirTela } from './ui';

interface Trava {
  confirmar(): Promise<{ ok: boolean; semBloqueio?: boolean }>;
  abrirAjustes(): Promise<void>;
}
const Trava = registerPlugin<Trava>('Trava');

/**
 * A porta da area dos adultos (painel dos pais e "liberar mais joguinho"):
 * abre com o bloqueio de tela do proprio celular, pela digital, rosto, PIN,
 * padrao ou senha. Quem confere e o Android (TravaPlugin.java), entao a
 * crianca nao tem como criar nem trocar essa trava dentro do jogo.
 */
export function portaoAdulto(cena: Phaser.Scene, entrou: () => void, sair: () => void) {
  // no navegador nao existe o bloqueio do celular: la o jogo so roda em
  // desenvolvimento e nos testes, nunca para a crianca
  if (!Capacitor.isPluginAvailable('Trava')) {
    entrou();
    return;
  }
  const W = CONFIG.LARGURA;
  const capa = cena.add.container(0, 0).setDepth(100);
  capa.add(cobrirTela(cena, 0xf7f5f1, 0.99));
  capa.add(cena.add.text(W / 2, 300, '\u{1F512}', { fontSize: '120px' }).setOrigin(0.5));
  capa.add(
    cena.add
      .text(W / 2, 450, 'Área dos adultos', { fontSize: '48px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(0.5),
  );
  // cresce para baixo: o aviso de "sem bloqueio" tem varias linhas e subia em cima do titulo
  const recado = cena.add
    .text(W / 2, 520, 'Use a digital ou o bloqueio deste celular.', {
      fontSize: '32px',
      color: '#2b3a4a',
      align: 'center',
      wordWrap: { width: W - 120 },
    })
    .setOrigin(0.5, 0);
  capa.add(recado);

  let ajustes: Phaser.GameObjects.Container | undefined;
  const tentar = async () => {
    const r = await Trava.confirmar().catch(() => ({ ok: false, semBloqueio: false }));
    if (r.ok) {
      capa.destroy();
      entrou();
      return;
    }
    if (!r.semBloqueio) return;
    // celular sem bloqueio de tela: a area fica fechada, e o adulto ve como resolver
    recado.setText(
      'Este celular não tem bloqueio de tela. Para proteger a área dos adultos, crie um PIN, padrão ou digital nas configurações do Android e volte aqui.',
    );
    if (!ajustes) {
      ajustes = botao(cena, W / 2, 1000, 'Abrir configurações', () => void Trava.abrirAjustes(), {
        icone: '\u{2699}\u{FE0F}',
        largura: 520,
        cor: 0xbfd4e8,
      });
      capa.add(ajustes);
    }
  };

  capa.add(
    botao(cena, W / 2, 820, 'Desbloquear', () => void tentar(), { icone: '\u{1F513}', largura: 460, cor: 0x9cbfa6 }),
  );
  capa.add(
    botao(cena, W / 2, 1140, 'Voltar', () => {
      capa.destroy();
      sair();
    }, { largura: 320, cor: 0xbfd4e8 }),
  );
  // o pedido do Android abre na hora: o adulto so toca em "Desbloquear" se cancelar
  void tentar();
}
