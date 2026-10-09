import { CONFIG } from './config';

export interface PersonagemCfg {
  pele: number;
  olhos: number;
  cabelo: number;
  corCabelo: number;
  roupa: number;
  acessorios: string[];
  cadeirante: boolean;
}

export interface Perfil {
  id: string;
  nome: string;
  personagem: PersonagemCfg;
  /** moedas ganhas no total (mostrador) */
  moedas: number;
  /** fichas disponíveis para jogar */
  fichas: number;
  fichasGastas: number;
  /** id da missão -> melhor número de estrelas */
  missoes: Record<string, number>;
  /** mundos que já pagaram o bônus */
  bonusMundo: number[];
  /** broches de mundo completo (desbloqueiam roupas/acessórios) */
  broches: number[];
  limiteDiario: number;
  partidas: { dia: string; n: number };
  /** ja viu o tutorial de abertura */
  viuTutorial?: boolean;
  /** voz do narrador adulto: 'f' feminina (padrao) ou 'm' masculina */
  voz?: 'f' | 'm';
}

const CHAVE = 'missoes-do-dia:perfis';
const CHAVE_ATIVO = 'missoes-do-dia:ativo';

export function personagemPadrao(): PersonagemCfg {
  return { pele: 0, olhos: 0, cabelo: 0, corCabelo: 0, roupa: 0, acessorios: [], cadeirante: false };
}

/** Puro: não toca no localStorage (usado também nos testes). */
export function novoPerfil(nome: string, personagem: PersonagemCfg): Perfil {
  return {
    id: `p${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`,
    nome,
    personagem,
    moedas: 0,
    fichas: 0,
    fichasGastas: 0,
    missoes: {},
    bonusMundo: [],
    broches: [],
    limiteDiario: CONFIG.PARTIDAS_POR_DIA,
    partidas: { dia: '', n: 0 },
  };
}

export function listar(): Perfil[] {
  try {
    const cru = localStorage.getItem(CHAVE);
    return cru ? (JSON.parse(cru) as Perfil[]) : [];
  } catch {
    return [];
  }
}

function gravarTodos(perfis: Perfil[]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(perfis));
  } catch {
    // armazenamento cheio ou bloqueado: o jogo continua, só não guarda
  }
}

export function salvar(perfil: Perfil) {
  const perfis = listar();
  const i = perfis.findIndex((p) => p.id === perfil.id);
  if (i >= 0) perfis[i] = perfil;
  else perfis.push(perfil);
  gravarTodos(perfis);
}

export function criar(nome: string, personagem: PersonagemCfg): Perfil {
  const perfil = novoPerfil(nome, personagem);
  salvar(perfil);
  setAtivo(perfil.id);
  return perfil;
}

export function setAtivo(id: string) {
  try {
    localStorage.setItem(CHAVE_ATIVO, id);
  } catch {
    /* ignora */
  }
}

export function ativo(): Perfil | null {
  const id = localStorage.getItem(CHAVE_ATIVO);
  return listar().find((p) => p.id === id) ?? null;
}

export function zerarProgresso(id: string) {
  const perfis = listar();
  const p = perfis.find((x) => x.id === id);
  if (!p) return;
  const limpo = novoPerfil(p.nome, p.personagem);
  Object.assign(p, limpo, { id: p.id, limiteDiario: p.limiteDiario });
  gravarTodos(perfis);
}

export function remover(id: string) {
  gravarTodos(listar().filter((p) => p.id !== id));
}
