export type TipoEtapa =
  | 'tocar'
  | 'arrastar_para_alvo'
  | 'segurar_com_timer'
  | 'esfregar'
  | 'escolher_entre_opcoes'
  | 'sequencia_ordenada'
  | 'respirar'
  | 'escovar'
  | 'sim_ou_nao';

/** Um pedaco da boca na escovacao guiada. */
export interface Regiao {
  texto: string;
  /** nome do arquivo em /assets/audio, sem extensao */
  audio?: string;
}

export interface Item {
  id?: string;
  icone: string;
  img?: string;
  texto?: string;
  /** o que o narrador diz quando o dedo passa por cima; cai no texto se faltar */
  fala?: string;
  x: number;
  y: number;
  /** false = pegadinha (não deve ser tocado); true = resposta certa */
  correto?: boolean;
  /** como entra no alvo que muda de arte: 'puxar' (lençol cobrindo a cama) ou 'cair' (travesseiro) */
  efeito?: 'puxar' | 'cair';
}

/** Uma situacao do "precisa ou nao precisa?". */
export interface Pergunta {
  texto: string;
  icone: string;
  img?: string;
  /** true = precisa mesmo; false = e a hora de dizer que nao */
  resposta: boolean;
  /** frase curta que explica o porque, dita acertando ou errando */
  explica: string;
  audio?: string;
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
  /** pedacos da boca, na ordem, para a etapa de escovar */
  regioes?: Regiao[];
  repeticoes?: number;
  /** situacoes da etapa sim_ou_nao */
  perguntas?: Pergunta[];
  /** frase leve narrada quando a criança erra */
  consequencia?: string;
  /**
   * arrastar_para_alvo: arte do alvo depois de cada item certo, na ordem dos
   * itens certos ("" = nao muda). A cama vai se arrumando a cada peca. Arte que
   * ainda nao existe e pulada. A ultima que existir fecha com o antes e depois.
   * esfregar: a primeira e a arte limpa que aparece no fim (maos limpas).
   */
  estados?: string[];
  /** arte do "antes" no fim (padrao: a do alvo) */
  antes?: string;
  /** os itens ficam em cima do alvo, em vez de sumir dentro (prato, mesa) */
  empilha?: boolean;
  /** os itens certos tem ordem: o primeiro da lista vem primeiro (lencol antes do cobertor) */
  emOrdem?: boolean;
  /** esfregar: lava o rosto do personagem da propria crianca, em vez da arte do alvo */
  rosto?: boolean;
}

export interface Cena {
  icone: string;
  img?: string;
  /** cena inteira (crianca + lugar); entra sozinha quando a arte chegar */
  imgCena?: string;
  /**
   * o cartao mostra o personagem da propria crianca com esta cara (normal,
   * feliz, contente, surpreso, triste), no lugar de um desenho de menino ou
   * menina; o icone vira um selinho ao lado (o balao do grito)
   */
  crianca?: string;
  texto: string;
}

export interface Missao {
  id: string;
  mundo: number;
  /** posicao no dia quando o numero nao basta (5.5 = logo depois da missao 05) */
  ordem?: number;
  titulo: string;
  icone: string;
  narracao_intro: string;
  audio_intro?: string;
  /** cenario de fundo da missao (nome do arquivo em /assets/img) */
  cenario?: string;
  /** `img` opcional: sem ela o cartao do 'olha como se faz' mostra o emoji */
  mostrar?: { narracao: string; audio?: string; icone?: string; img?: string };
  etapas: Etapa[];
  pode_ou_nao_pode: {
    cena_certa: Cena;
    cena_errada: Cena;
    explicacao: string;
    audio?: string;
    pergunta?: string;
    /** cena curta de premio depois da resposta certa (ver animacoes.ts) */
    animacao?: string;
  };
  frase_reforco: string;
  audio_reforco?: string;
  recompensa: { moedas: number };
  estrelas_max: number;
  /** faixa de assets/audio tocada em loop durante a missão (sem arquivo, fica a música do mundo) */
  musica?: string;
  /** missão bônus: só libera quando os 5 mundos estiverem completos */
  bonus?: boolean;
}
