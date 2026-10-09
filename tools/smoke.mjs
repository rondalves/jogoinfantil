/**
 * Abre todas as missoes e todos os mini games num navegador de verdade e
 * avisa se algum quebrar. Pega JSON errado, arte com nome trocado e erro de
 * runtime que o compilador nao ve.
 *
 *   npm run preview     (num terminal)
 *   npm run smoke       (noutro)
 */
import { chromium } from 'playwright';

const URL_JOGO = process.env.URL_JOGO ?? 'http://localhost:4173/';

const PERFIL = {
  id: 'psmoke',
  nome: 'Teste',
  personagem: { pele: 2, olhos: 0, cabelo: 0, corCabelo: 1, roupa: 1, acessorios: ['oculos'], cadeirante: false },
  moedas: 30,
  fichas: 90,
  fichasGastas: 0,
  missoes: {},
  bonusMundo: [1, 2, 3, 4, 5],
  broches: [1, 2, 3, 4, 5],
  limiteDiario: 99,
  partidas: { dia: '', n: 0 },
  viuTutorial: true,
};

const problemas = [];

const main = async () => {
  const navegador = await chromium.launch();
  const page = await navegador.newPage({ viewport: { width: 540, height: 960 } });

  let atual = 'carregando';
  page.on('pageerror', (e) => problemas.push(`${atual}: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().includes('favicon')) problemas.push(`${atual}: ${m.text()}`);
  });

  await page.goto(URL_JOGO);
  await page.evaluate((p) => {
    localStorage.setItem('missoes-do-dia:perfis', JSON.stringify([p]));
    localStorage.setItem('missoes-do-dia:ativo', p.id);
  }, PERFIL);
  await page.goto(URL_JOGO);
  await page.waitForFunction(
    () => window.__jogo?.scene.scenes.some((s) => s.scene.isActive() && s.scene.key !== 'Boot'),
    { timeout: 60000 },
  );

  const ids = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, '0'));

  for (const id of ids) {
    atual = `missao ${id}`;
    const ok = await page.evaluate(async (missao) => {
      const j = window.__jogo;
      j.scene.scenes.forEach((s) => s.scene.key !== 'Boot' && j.scene.stop(s.scene.key));
      j.scene.start('Missao', { id: missao });
      await new Promise((r) => setTimeout(r, 1800));
      const cena = j.scene.getScene('Missao');
      return cena.scene.isActive() && cena.children.list.length > 3;
    }, id);
    if (!ok) problemas.push(`missao ${id}: nao montou a tela`);

    // passa pelo "Vamos!" e pelo "Minha vez!" para a primeira etapa desenhar
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => {
        const j = window.__jogo;
        const c = j.scene.getScene('Missao');
        const r = j.canvas.getBoundingClientRect();
        const k = r.width / 720;
        c.input.emit('pointerdown', { x: 360, y: 1120, worldX: 360, worldY: 1120 });
        void k;
      });
      await page.mouse.click(270, 840);
      await page.waitForTimeout(900);
    }
    await page.waitForTimeout(600);
  }

  const jogos = ['corrida', 'escalada', 'corredor', 'memoria', 'estrelas'];
  for (const id of jogos) {
    atual = `mini game ${id}`;
    const ok = await page.evaluate(async (jogo) => {
      const j = window.__jogo;
      j.scene.scenes.forEach((s) => s.scene.key !== 'Boot' && j.scene.stop(s.scene.key));
      j.scene.start('MiniGame', { id: jogo });
      await new Promise((r) => setTimeout(r, 3000));
      const cena = j.scene.getScene('MiniGame');
      return cena.scene.isActive() && cena.children.list.length > 3;
    }, id);
    if (!ok) problemas.push(`mini game ${id}: nao montou a tela`);
    await page.waitForTimeout(500);
  }

  atual = 'medalha';
  await page.evaluate(async () => {
    const j = window.__jogo;
    const feitas = {};
    for (let i = 1; i <= 20; i++) feitas[String(i).padStart(2, '0')] = 3;
    const perfis = JSON.parse(localStorage.getItem('missoes-do-dia:perfis'));
    perfis[0].missoes = feitas;
    localStorage.setItem('missoes-do-dia:perfis', JSON.stringify(perfis));
    j.scene.scenes.forEach((s) => s.scene.key !== 'Boot' && j.scene.stop(s.scene.key));
    j.scene.start('Medalha');
    await new Promise((r) => setTimeout(r, 2000));
  });

  for (const tela of ['Perfis', 'Criador', 'Mapa', 'Pais', 'Tutorial']) {
    atual = `tela ${tela}`;
    await page.evaluate(async (chave) => {
      const j = window.__jogo;
      j.scene.scenes.forEach((s) => s.scene.key !== 'Boot' && j.scene.stop(s.scene.key));
      j.scene.start(chave);
      await new Promise((r) => setTimeout(r, 1500));
    }, tela);
  }

  await navegador.close();

  if (problemas.length === 0) {
    console.log(`tudo certo: ${ids.length} missoes, ${jogos.length} mini games e 6 telas sem erro`);
    return;
  }
  console.error(`${problemas.length} problema(s):`);
  for (const p of problemas) console.error(' -', p);
  process.exit(1);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
