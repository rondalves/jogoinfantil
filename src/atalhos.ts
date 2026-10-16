import Phaser from 'phaser';
import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core';
import { cabecaDoPersonagem, desenharPersonagem } from './personagem';
import { listar, setAtivo, type Perfil, type PersonagemCfg } from './storage';

interface Atalho {
  atualizar(o: { perfis: { id: string; nome: string; icone: string }[] }): Promise<void>;
  fixar(o: { id: string; nome: string; icone: string }): Promise<{ ok: boolean }>;
  pedido(): Promise<{ id?: string }>;
  addListener(evento: 'perfil', fn: (d: { id: string }) => void): Promise<PluginListenerHandle>;
}
const Atalho = registerPlugin<Atalho>('Atalho');

/**
 * Atalhos com o rosto de cada crianca (AtalhoPlugin.java): no menu de segurar
 * o icone e, se o adulto aceitar, na tela inicial. Tocar abre o jogo direto
 * no perfil daquela crianca. No navegador nao existe: tudo vira nada.
 */
export const temAtalhos = () => Capacitor.isPluginAvailable('Atalho');

/** Mesmo azul do fundo do icone do app. */
const AZUL = 0xc5e2f3;
/** O icone adaptavel: 108 dp em 4x. O Android mostra so o miolo de 72 dp. */
const LADO = 432;

/** O rosto do personagem num quadrado azul, como PNG em base64. */
function rosto(cena: Phaser.Scene, cfg: PersonagemCfg): Promise<string> {
  const rt = cena.make.renderTexture({ width: LADO, height: LADO }, false);
  rt.fill(AZUL);
  const cab = cabecaDoPersonagem(cena, cfg);
  // cabeca grande no meio, os ombros aparecendo embaixo: igual ao icone do app
  const k = (LADO * 0.4) / (cab.queixo - cab.topo);
  const boneco = desenharPersonagem(cena, cfg, k);
  boneco.setPosition(LADO / 2 - cab.cx * k, LADO * 0.47 - ((cab.topo + cab.queixo) / 2) * k);
  rt.draw(boneco);
  boneco.destroy();
  return new Promise((ok) => {
    // se a captura nao voltar, segue sem rosto: o atalho daquela vez fica de fora
    const prazo = setTimeout(() => ok(''), 2000);
    rt.snapshot((img) => {
      clearTimeout(prazo);
      ok((img as HTMLImageElement).src.split(',')[1] ?? '');
      rt.destroy();
    });
  });
}

/** Refaz o atalho de cada crianca: chamar quando cria, muda ou apaga personagem. */
export async function atualizarAtalhos(cena: Phaser.Scene) {
  if (!temAtalhos()) return;
  const perfis = [];
  for (const p of listar()) {
    const icone = await rosto(cena, p.personagem);
    if (icone) perfis.push({ id: p.id, nome: p.nome, icone });
  }
  await Atalho.atualizar({ perfis }).catch(() => undefined);
}

/** Pede para por o rosto da crianca na tela inicial. Devolve se o Android aceitou o pedido. */
export async function fixarAtalho(cena: Phaser.Scene, p: Perfil) {
  if (!temAtalhos()) return false;
  const icone = await rosto(cena, p.personagem);
  if (!icone) return false;
  const r = await Atalho.fixar({ id: p.id, nome: p.nome, icone }).catch(() => ({ ok: false }));
  return r.ok;
}

/** O app abriu por um atalho: deixa aquela crianca como ativa e diz quem e. */
export async function perfilDoAtalho(): Promise<string | undefined> {
  if (!temAtalhos()) return undefined;
  const { id } = await Atalho.pedido().catch(() => ({ id: undefined }));
  if (!id || !listar().some((p) => p.id === id)) return undefined;
  setAtivo(id);
  return id;
}

/** Com o app ja aberto, outra crianca tocou no rosto dela. */
export function ouvirAtalhos(trocou: () => void) {
  if (!temAtalhos()) return;
  void Atalho.addListener('perfil', ({ id }) => {
    if (!listar().some((p) => p.id === id)) return;
    setAtivo(id);
    trocou();
  });
}
