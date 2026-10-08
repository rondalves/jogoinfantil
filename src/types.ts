export type TipoEtapa =
  | 'tocar'
  | 'arrastar_para_alvo'
  | 'segurar_com_timer'
  | 'esfregar'
  | 'escolher_entre_opcoes'
  | 'sequencia_ordenada'
  | 'respirar';

export interface Item {
  id?: string;
  icone: string;
  img?: string;
  texto?: string;
  x: number;
  y: number;
  /** false = pegadinha (não deve ser tocado); true = resposta certa */
  correto?: boolean;
}

export interface Etapa {
  tipo: TipoEtapa;
  narracao: string;
  /** cenario de fundo so desta etapa (nome do arquivo em /assets/img) */
  cenario?: string;
  /** nome do arquivo em /assets/audio, sem extensão */
  audio?: string;
  itens?: Item[];
  alvo?: Item;
  alvos?: Item[];
  segundos?: number;
  passos?: number;
  /** arte de cada sujeira/germe que some ao esfregar */
  sujeiras?: string[];
  repeticoes?: number;
  /** frase leve narrada quando a criança erra */
  consequencia?: string;
}

export interface Cena {
  icone: string;
  img?: string;
  texto: string;
}

export interface Missao {
  id: string;
  mundo: number;
  titulo: string;
  icone: string;
  narracao_intro: string;
  audio_intro?: string;
  /** cenario de fundo da missao (nome do arquivo em /assets/img) */
  cenario?: string;
  mostrar?: { narracao: string; audio?: string; icone?: string };
  etapas: Etapa[];
  pode_ou_nao_pode: {
    cena_certa: Cena;
    cena_errada: Cena;
    explicacao: string;
    audio?: string;
    pergunta?: string;
  };
  frase_reforco: string;
  audio_reforco?: string;
  recompensa: { moedas: number };
  estrelas_max: number;
  /** missão bônus: só libera quando os 5 mundos estiverem completos */
  bonus?: boolean;
}
