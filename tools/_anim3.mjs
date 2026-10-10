import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const U = 'http://localhost:4173/';
const P = {
  id: 'pa', nome: 'Ana',
  personagem: { pele: 2, olhos: 0, cabelo: 0, corCabelo: 1, roupa: 1, acessorios: [], cadeirante: false },
  moedas: 30, fichas: 90, fichasGastas: 0, missoes: {},
  bonusMundo: [1,2,3,4,5,6], broches: [1,2,3,4,5,6], limiteDiario: 99,
  partidas: { dia: '', n: 0 }, viuTutorial: true,
};
mkdirSync('tools/_anim3', { recursive: true });
const nav = await chromium.launch({ args: ['--mute-audio'] });
const page = await nav.newPage({ viewport: { width: 540, height: 960 } });
await page.goto(U);
await page.evaluate((p) => {
  localStorage.setItem('missoes-do-dia:perfis', JSON.stringify([p]));
  localStorage.setItem('missoes-do-dia:ativo', p.id);
}, P);
await page.goto(U);
await page.waitForFunction(() => window.__jogo?.scene.scenes.some((s) => s.scene.isActive() && s.scene.key !== 'Boot'), { timeout: 60000 });
await page.evaluate(async () => {
  const j = window.__jogo;
  j.scene.scenes.forEach((s) => s.scene.key !== 'Boot' && j.scene.stop(s.scene.key));
  j.scene.start('Missao', { id: '06' });
  await new Promise((r) => setTimeout(r, 2600));
});
await page.evaluate(async () => {
  const c = window.__jogo.scene.getScene('Missao');
  c.podeOuNaoPode();
  await new Promise((r) => setTimeout(r, 1200));
});
const zonas = await page.evaluate(() => {
  const c = window.__jogo.scene.getScene('Missao');
  return c.camada.list.filter((o) => o.type === 'Zone').map((o) => ({ x: o.x, y: o.y }));
});
const k = 540 / 720;
for (const z of zonas) {
  await page.mouse.click(z.x * k, z.y * k);
  await page.waitForTimeout(450);
  const ok = await page.evaluate(() => {
    const c = window.__jogo.scene.getScene('Missao');
    return c.camada.list.some((o) => o.type === 'Graphics' && o.depth === 61);
  });
  if (ok) break;
}
for (const [i, ms] of [700, 600, 600, 600, 700].entries()) {
  await page.waitForTimeout(ms);
  await page.screenshot({ path: `tools/_anim3/a${i}.png` });
}
await page.evaluate(async () => {
  const j = window.__jogo;
  j.scene.scenes.forEach((s) => s.scene.key !== 'Boot' && j.scene.stop(s.scene.key));
  j.scene.start('Medalha');
  await new Promise((r) => setTimeout(r, 1000));
});
for (const i of [0, 1, 2]) {
  await page.waitForTimeout(170);
  await page.screenshot({ path: `tools/_anim3/m${i}.png`, clip: { x: 20, y: 700, width: 240, height: 250 } });
}
await nav.close();
console.log('ok');
