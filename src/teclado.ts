import Phaser from 'phaser';
import { CONFIG } from './config';
import { narrador } from './narrador';
import { fale } from './narracoes';
import { botao, cobrirTela } from './ui';

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MAX = 10;

/** Teclado grande na tela: letras, apagar e confirmar. Narra cada letra. */
export function teclado(
  cena: Phaser.Scene,
  inicial: string,
  onPronto: (nome: string) => void,
): Phaser.GameObjects.Container {
  const W = CONFIG.LARGURA;
  const capa = cena.add.container(0, 0).setDepth(100);
  capa.add(cobrirTela(cena, 0x12263a, 0.98));

  let nome = inicial.toUpperCase().slice(0, MAX);
  const visor = cena.add
    .text(W / 2, 250, nome || '_', { fontSize: '96px', color: '#ffffff', fontStyle: 'bold' })
    .setOrigin(0.5);
  capa.add(cena.add.text(W / 2, 140, 'Escreva seu nome', { fontSize: '48px', color: '#ffe8b0' }).setOrigin(0.5));
  capa.add(visor);

  const mostra = () => visor.setText(nome || '_');

  const colunas = 6;
  const lado = 104;
  const esq = W / 2 - ((colunas - 1) * (lado + 10)) / 2;
  LETRAS.split('').forEach((letra, i) => {
    const x = esq + (i % colunas) * (lado + 10);
    const y = 400 + Math.floor(i / colunas) * (lado + 12);
    const g = cena.add.graphics();
    g.fillStyle(0xfff6e0, 1);
    g.fillRoundedRect(x - lado / 2, y - lado / 2, lado, lado, 18);
    const t = cena.add.text(x, y, letra, { fontSize: '56px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0.5);
    const zona = cena.add
      .zone(x, y, lado, lado)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        if (nome.length >= MAX) return;
        nome += letra;
        mostra();
        narrador.falar(letra, `letra_${letra.toLowerCase()}`);
      });
    capa.add([g, t, zona]);
  });

  capa.add(
    botao(cena, W / 2 - 170, 1120, 'Apagar', () => {
      nome = nome.slice(0, -1);
      mostra();
    }, { icone: '\u{232B}', largura: 300, cor: 0xff9a8b }),
  );
  capa.add(
    botao(cena, W / 2 + 170, 1120, 'Pronto', () => {
      if (!nome) {
        fale('ui_escreva_nome');
        return;
      }
      capa.destroy();
      onPronto(nome);
    }, { icone: '\u{2705}', largura: 300, cor: 0x7ddc8a }),
  );

  fale('ui_escreva_nome');
  return capa;
}
