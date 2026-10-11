# Prompts do que ainda falta

> **Antes de ler: rode `npm run faltando`.** Ele varre os JSONs e a pasta e
> diz o que falta hoje e o que existe mas precisa ser refeito. Esta lista
> envelhece; o comando não.

Conferido em 10 de outubro de 2026, depois da segunda leva: **nenhuma arte
faltando, 7 para refazer**, mais o som. Tudo tem substituto automático no jogo.

Já entraram e não precisam de mais nada: `m24_chuveiro`, `m01_espuma`,
`mg1_kart_tras`, `olhos_triste`, `capa_historia5`, `olhos_grandes`,
`olhos_alegres`, `acessorio_oculos` (voltou ao criador) e o
`corpo_base_pele_clara` de rosto redondo.

Salve com o **nome exato** na pasta `C:\Users\rondj\Downloads\Imagens para jogo
infantil` e rode `npm run assets`. Gere no Gem de [GEM_ESTILO.md](GEM_ESTILO.md).

## As três regras que valem para tudo

1. **Nenhum texto na imagem.** O narrador lê tudo em voz alta.
2. **Cores suaves e pouco saturadas**, contorno escuro fino, estilo de livro
   infantil. O jogo lava a cor de novo na preparação.
3. **Peça solta vai em fundo verde #00FF00 chapado**; cena inteira vai sem verde.

---

# 1. As 5 roupas e a cadeira de rodas (6)

O corpo base novo já está no jogo, então hoje só a camiseta branca tem rosto
redondo. As outras 5 roupas e a cadeira de rodas ainda mostram a cabeça oval
antiga, porque cada uma é uma criança inteira desenhada, não só a roupa.

> **Anexe o `corpo_base_pele_clara.jpg` novo em todas.** A camiseta azul de
> 10/10 veio sem a base: o corpo saiu com outra proporção e, quando o jogo
> encaixou pela cabeça, os pés ficaram fora do quadro. Voltei a antiga.

Mesmo começo para todas; troque só o trecho **[ROUPA]**. Regra da pele: **nada
de roupa amarela, laranja ou bege** (o script confunde com pele e repinta).

```
Use a imagem anexada como base e mude apenas a roupa, mantendo exatamente a mesma criança, a mesma pose de frente com os braços abertos, o mesmo tamanho e a mesma posição da cabeça redonda, a mesma careca sem cabelo, o mesmo rosto vazio sem olhos nem boca, a pele exatamente da mesma cor e as pernas com a mesma grossura da imagem anexada, os pés inteiros dentro do quadro, e o mesmo enquadramento. [ROUPA] Sem estampa e sem texto na roupa, nada de verde em nenhuma parte. Ilustração 2D cartoon, contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.
```

| arquivo | **[ROUPA]** |
|---|---|
| `roupa_macacao_jeans` | Vista a criança com um macacão jeans azul de alças sobre uma camiseta branca de manga curta, com tênis branco. |
| `roupa_vestido_rosa` | Vista a criança com um vestido infantil rosa-claro de manga curta, faixa rosa mais escura na cintura e saia um pouco rodada até acima do joelho, meias brancas e tênis branco. |
| `roupa_conjunto_roxo` | Vista a criança com uma blusa roxa de manga curta e um short roxo mais escuro, com tênis branco. |
| `roupa_camiseta_azul` | Vista a criança com uma camiseta azul-clara de manga curta e uma bermuda azul-marinho, com tênis branco. |
| `roupa_moletom_vermelho` | Vista a criança com um moletom vermelho de manga comprida com capuz e uma calça comprida cinza, com tênis branco. |
| `corpo_cadeira_pele_clara` | Em vez de trocar a roupa, mantenha a camiseta e o shorts brancos e **sente a criança numa cadeira de rodas infantil** vista de frente, mãos nos aros das rodas, pés no apoio; a cabeça continua no mesmo lugar e do mesmo tamanho. |

Antes de salvar, confira duas coisas na imagem: a cabeça está do mesmo tamanho
da base e os pés aparecem inteiros.

---

# 2. O aparelho auditivo com moldura (1)

O óculos novo voltou ao criador. O aparelho auditivo continua fora: a peça
antiga vinha recortada rente e flutuava longe da orelha. Precisa vir **na
mesma moldura 2048x2048 do corpo, já no lugar**. **Anexe o
`corpo_base_pele_clara.jpg` novo.** Quando chegar, é só descomentar uma linha
em `src/personagem.ts`.

### `acessorio_aparelho_auditivo`

```
Na mesma moldura da imagem anexada, desenhe apenas um aparelho auditivo infantil retroauricular, visto de lado, com o gancho voltado para a esquerda, posicionado onde ficaria a orelha direita da criança anexada: a 38% da altura a partir do topo e a 65% da largura a partir da esquerda, ocupando 8% da largura do quadro. Não desenhe a criança, nem orelha, nem cabeça, nem pele: só o aparelho. Corpo bege-claro com um detalhe colorido. Contorno escuro fino e limpo. Fundo verde chapado #00FF00, uma cor só. Imagem quadrada 2048x2048.
```

---

# 3. O som

| falta | quantos | onde está o roteiro |
|---|---|---|
| música de fundo | 7 faixas em loop + 1 de 30 s para o timer | [MUSICA.md](MUSICA.md), um prompt de Suno/Udio por faixa |
| falas do jogo | 450 frases: 364 de adulto (feminina e masculina) e 86 do mascote | `assets/audio/narracao.csv`, com as 28 missões |
| historinhas | 6 mp3 de 2 a 3 min | [HISTORIAS.md](HISTORIAS.md), roteiro com marcas de pausa |

Como gravar as falas: [GRAVAR_VOZES.md](GRAVAR_VOZES.md).

---

# O que **não** é pendência

- `icone_01` a `icone_28`: o mapa usa o emoji da missão de propósito.
- Os 5 joguinhos ainda não programados (memória, corredor, escalada, estrelas,
  corrida): a arte vem junto com o código de cada um.
- `_sem_nome/floresta_noite_amigos.jpg` e `_sem_nome/mundo5_regerado.jpg`:
  chegaram sem pedido; ficam guardados até alguém decidir onde entram.

# Ordem

1. As 5 roupas e a cadeira de rodas, todas com a base nova anexada
2. `acessorio_aparelho_auditivo`
3. música, depois as falas, depois as historinhas
