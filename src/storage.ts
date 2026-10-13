import type { TempoJogo } from './tempoDeJogo';

export interface PersonagemCfg {
  pele: number;
  olhos: number;
  cabelo: number;
  corCabelo: number;
  roupa: number;
  acessorios: string[];
}

export interface Perfil {
  id: string;
  nome: string;
  personagem: PersonagemCfg;
  /** moedas ganhas no total (mostrador) */
  moedas: number;
  /** id da missão -> melhor número de estrelas */
  missoes: Record<string, number>;
  /** mundos que já pagaram o bônus */
  bonusMundo: number[];
  /** broches de mundo completo (desbloqueiam roupas/acessórios) */
  broches: number[];
  /** ja viu a raposinha explicar o jogo (a apresentacao nova: quem so viu a antiga ve de novo) */
  viuApresentacao?: boolean;
  /** voz do narrador adulto: 'f' feminina (padrao) ou 'm' masculina */
  voz?: 'f' | 'm';
  /** musica de fundo (padrao ligada) */
  musica?: boolean;
  /** tempo de joguinho de hoje (ver tempoDeJogo.ts) */
  tempoJogo?: TempoJogo;
  /** minutos de joguinho por dia antes do aviso; padrao em tempoDeJogo.ts */
  limiteJogoMin?: number;
  /** niveis do quebra-cabeca ja montados (o proximo e o que abre) */
  quebraCabeca?: number;
  /** joguinhos que a crianca ja abriu (o resto dos liberados ganha selo de novo) */
  joguinhosVistos?: string[];
}

const CHAVE = 'missoes-do-dia:perfis';
const CHAVE_ATIVO = 'missoes-do-dia:ativo';

export function personagemPadrao(): PersonagemCfg {
  return { pele: 0, olhos: 0, cabelo: 0, corCabelo: 0, roupa: 0, acessorios: [] };
}

/** Puro: não toca no localStorage (usado também nos testes). */
export function novoPerfil(nome: string, personagem: PersonagemCfg): Perfil {
  return {
    id: `p${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`,
    nome,
    personagem,
    moedas: 0,
    missoes: {},
    bonusMundo: [],
    broches: [],
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
  // os ajustes dos pais (voz, musica, limite de joguinho) ficam
  Object.assign(p, limpo, { id: p.id, voz: p.voz, musica: p.musica, limiteJogoMin: p.limiteJogoMin });
  gravarTodos(perfis);
}

export function remover(id: string) {
  gravarTodos(listar().filter((p) => p.id !== id));
}
