/**
 * Capturas da loja: abre o jogo num navegador de verdade, navega ate cada tela
 * e grava PNG 1080x1920 em store/screenshots, com a faixa de texto no topo.
 *
 *   npm run capturas          (precisa do npm run preview rodando)
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = resolve(RAIZ, 'store', 'screenshots');
const URL_JOGO = process.env.URL_JOGO ?? 'http://localhost:4173/';

const PERFIL = {
  id: 'pcapt',
  nome: 'Ana',
  personagem: { pele: 2, olhos: 0, cabelo: 0, corCabelo: 1, roupa: 1, acessorios: [], cadeirante: false },
  moedas: 12,
  fichas: 24,
  fichasGastas: 3,
  missoes: { '01': 3, '02': 3, '03': 3, '04': 3 },
  bonusMundo: [1],
  broches: [1],
  limiteDiario: 20,
  partidas: { dia: '', n: 0 },
  viuTutorial: true,
};

const FAIXAS = {
  '01-criador': 'Crie seu personagem',
  '02-mapa': 'Uma aventura para cada hora do dia',
  '03-escova': 'Aprender fazendo',
  '04-pode-ou-nao': 'Pode ou Não Pode?',
  '05-corrida': 'Jogue e se divirta',
  '06-moedas': 'Ganhe moedas e fichas',
};

/** Posicao de tela (CSS) a partir das coordenadas do jogo (720x1280). */
async function ponto(page, x, y) {
  return page.evaluate(
    ([gx, gy]) => {
      const c = document.querySelector('canvas');
      const r = c.getBoundingClientRect();
      const k = r.width / 720;
      return { x: r.x + gx * k, y: r.y + gy * k };
    },
    [x, y],
  );
}

async function toca(page, x, y, espera = 1200) {
  const p = await ponto(page, x, y);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(espera);
}

async function pronto(page) {
  // espera o Boot terminar e a primeira tela aparecer
  await page.waitForFunction(() => {
    const j = window.__jogo;
    return j && j.scene.scenes.some((s) => s.scene.isActive() && s.scene.key !== 'Boot');
  }, { timeout: 60000 });
  await page.waitForTimeout(800);
}

async function grava(page, nome) {
  const bruta = resolve(SAIDA, `${nome}.png`);
  await page.screenshot({ path: bruta });
  return bruta;
}

const main = async () => {
  mkdirSync(SAIDA, { recursive: true });
  const navegador = await chromium.launch({ args: ['--mute-audio'] });
  const page = await navegador.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });

  await page.goto(URL_JOGO);
  await page.evaluate((p) => {
    localStorage.setItem('missoes-do-dia:perfis', JSON.stringify([p]));
    localStorage.setItem('missoes-do-dia:ativo', p.id);
  }, PERFIL);

  // 01 criador de personagem
  await page.goto(URL_JOGO);
  await pronto(page);
  await toca(page, 185, 430, 1500); // perfil -> mapa
  await toca(page, 90, 214, 2000); // avatar -> criador
  await grava(page, '01-criador');

  // 02 mapa de mundos
  await page.goto(URL_JOGO);
  await pronto(page);
  await toca(page, 185, 430, 2000);
  await grava(page, '02-mapa');

  // 03 missao da escova (etapa de escovar)
  await toca(page, 360, 502, 2500); // missao 01
  await toca(page, 360, 1120, 1500); // Vamos!
  await toca(page, 360, 1120, 2500); // Minha vez!
  await grava(page, '03-escova');

  // 04 Pode ou Nao Pode: usa a missao 04, que e so de toque
  await page.goto(URL_JOGO);
  await pronto(page);
  await toca(page, 185, 430, 2000);
  await toca(page, 360, 838, 2500); // missao 04
  await toca(page, 360, 1120, 1500);
  await toca(page, 360, 1120, 1500);
  for (const [x, y] of [[170, 580], [360, 580], [550, 580], [170, 760], [360, 760], [550, 760]]) {
    await toca(page, x, y, 250);
  }
  await page.waitForTimeout(1200);
  await toca(page, 520, 730, 2500); // chamar um adulto
  await grava(page, '04-pode-ou-nao');

  // 05 corrida de kart
  await page.goto(URL_JOGO);
  await pronto(page);
  await toca(page, 185, 430, 2000);
  await toca(page, 360, 1200, 2000); // Jogar
  await toca(page, 360, 710, 3500); // pista do quintal
  await page.waitForTimeout(2500);
  await grava(page, '05-corrida');

  // 06 a medalha do fim: o mapa ja aparece na 02, repetir nao vende nada
  await page.goto(URL_JOGO);
  await pronto(page);
  await page.evaluate(async () => {
    const j = window.__jogo;
    const perfis = JSON.parse(localStorage.getItem('missoes-do-dia:perfis'));
    for (let i = 1; i <= 20; i++) perfis[0].missoes[String(i).padStart(2, '0')] = 3;
    localStorage.setItem('missoes-do-dia:perfis', JSON.stringify(perfis));
    j.scene.scenes.forEach((s) => s.scene.key !== 'Boot' && j.scene.stop(s.scene.key));
    j.scene.start('Medalha');
    // o confete cai por ~4s e tapa o resumo: espera ele passar
    await new Promise((r) => setTimeout(r, 4800));
  });
  await grava(page, '06-medalha');

  await navegador.close();
  console.log('capturas brutas em', SAIDA);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
