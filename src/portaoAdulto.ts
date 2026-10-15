import Phaser from 'phaser';
import { CONFIG } from './config';
import { gravarSenha, MAXIMO, MINIMO, senhaCerta, senhaValida, temSenha } from './senha';
import { botao, cobrirTela, nota } from './ui';

interface Teclado {
  fechar: () => void;
  titulo: (t: string) => void;
  recado: (t: string) => void;
  limpar: () => void;
}

/** Teclado de numeros por cima da cena. `pronto` recebe o que foi digitado, ja validado. */
function teclado(
  cena: Phaser.Scene,
  titulo: string,
  pronto: (s: string, t: Teclado) => Promise<void>,
  sair: () => void,
  esqueci?: (t: Teclado) => void,
): Teclado {
  const W = CONFIG.LARGURA;
  const capa = cena.add.container(0, 0).setDepth(100);
  capa.add(cobrirTela(cena, 0xf7f5f1, 0.99));
  const tit = cena.add
    .text(W / 2, 190, titulo, { fontSize: '36px', color: '#2b3a4a', align: 'center', wordWrap: { width: W - 120 } })
    .setOrigin(0.5);
  const visor = cena.add.text(W / 2, 315, '', { fontSize: '64px', color: '#2b3a4a' }).setOrigin(0.5);
  const aviso = cena.add
    .text(W / 2, 410, '', { fontSize: '26px', color: '#b5564a', align: 'center', wordWrap: { width: W - 100 } })
    .setOrigin(0.5);
  capa.add([tit, visor, aviso]);

  let s = '';
  let ocupado = false;
  const mostra = () => visor.setText(s ? '\u{25CF} '.repeat(s.length).trim() : '_ _ _ _');
  const t: Teclado = {
    fechar: () => capa.destroy(),
    titulo: (x) => tit.setText(x),
    recado: (x) => aviso.setText(x),
    limpar: () => {
      s = '';
      mostra();
    },
  };
  mostra();

  const tecla = (rotulo: string, nome: string, x: number, y: number, fn: () => void, cor = 0xfff6e0) => {
    const lado = 132;
    const g = cena.add.graphics();
    g.fillStyle(cor, 1).fillRoundedRect(x - lado / 2, y - lado / 2, lado, lado, 22);
    g.lineStyle(3, 0xd9cbb8, 1).strokeRoundedRect(x - lado / 2, y - lado / 2, lado, lado, 22);
    const r = cena.add.text(x, y, rotulo, { fontSize: '54px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0.5);
    const z = cena.add.zone(x, y, lado, lado).setName(nome).setInteractive({ useHandCursor: true }).on('pointerdown', fn);
    capa.add([g, r, z]);
  };
  const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '\u{232B}', '0', '\u{2714}'];
  teclas.forEach((k, i) => {
    const x = W / 2 + ((i % 3) - 1) * 150;
    const y = 520 + Math.floor(i / 3) * 148;
    if (k === '\u{232B}') {
      tecla(k, 'tecla_apagar', x, y, () => {
        s = s.slice(0, -1);
        mostra();
      }, 0xffd9d2);
    } else if (k === '\u{2714}') {
      tecla(k, 'tecla_ok', x, y, () => {
        if (ocupado) return;
        if (!senhaValida(s)) {
          t.recado(`Use de ${MINIMO} a ${MAXIMO} números.`);
          return;
        }
        ocupado = true;
        t.recado('');
        void pronto(s, t).finally(() => {
          ocupado = false;
        });
      }, 0xcfe9d4);
    } else {
      tecla(k, `tecla_${k}`, x, y, () => {
        if (s.length >= MAXIMO) return;
        s += k;
        nota(620 + Number(k) * 20);
        mostra();
      });
    }
  });

  capa.add(
    botao(cena, W / 2, 1110, 'Voltar', () => {
      capa.destroy();
      sair();
    }, { icone: '\u{2B05}\u{FE0F}', largura: 320, cor: 0xbfd4e8, altura: 90, tamanhoTexto: 32 }),
  );
  if (esqueci) {
    const link = cena.add
      .text(W / 2, 1210, 'Esqueci a senha', { fontSize: '28px', color: '#1f6fb2', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => esqueci(t));
    capa.add(link);
  }
  return t;
}

const CRIAR = `Adulto: crie uma senha de ${MINIMO} a ${MAXIMO} números para a área dos adultos. Anote: sem ela, esta área não abre.`;

/** Cria (ou troca) a senha: digita duas vezes, iguais. */
export function criarSenha(cena: Phaser.Scene, feito: () => void, sair: () => void) {
  let primeira = '';
  teclado(cena, CRIAR, async (s, t) => {
    if (!primeira) {
      primeira = s;
      t.limpar();
      t.titulo('Digite a mesma senha de novo, para confirmar.');
      return;
    }
    if (s !== primeira) {
      primeira = '';
      t.limpar();
      t.titulo(CRIAR);
      t.recado('As duas não ficaram iguais. Comece de novo.');
      return;
    }
    await gravarSenha(s);
    nota(1047);
    t.fechar();
    feito();
  }, sair);
}

/** A porta da area dos adultos: na primeira vez o adulto cria a senha; depois, so com ela. */
export function portaoAdulto(cena: Phaser.Scene, entrou: () => void, sair: () => void) {
  if (!temSenha()) {
    criarSenha(cena, entrou, sair);
    return;
  }
  teclado(
    cena,
    'Senha do adulto',
    async (s, t) => {
      if (await senhaCerta(s)) {
        t.fechar();
        entrou();
        return;
      }
      t.limpar();
      t.recado('Senha errada. Tente de novo.');
    },
    sair,
    // sem servidor nem conta, nao ha como mandar a senha por e-mail
    (t) =>
      t.recado(
        'Sem a senha, esta área só abre de novo apagando os dados do app nas configurações do Android. O progresso se perde; a compra volta em "Já comprei".',
      ),
  );
}
