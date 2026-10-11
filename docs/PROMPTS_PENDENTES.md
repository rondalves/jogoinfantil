# Prompts do que ainda falta

> **Antes de ler: rode `npm run faltando`.** Ele varre os JSONs e a pasta e
> diz o que falta hoje e o que existe mas precisa ser refeito. Esta lista
> envelhece; o comando não.

Conferido em 10 de outubro de 2026: **5 artes faltando, 5 para refazer**, mais
o som. Tudo o que está aqui tem substituto automático no jogo (emoji, cor
chapada, silêncio), então nada quebra enquanto não chega.

Salve com o **nome exato** na pasta `C:\Users\rondj\Downloads\Imagens para jogo
infantil` e rode `npm run assets`. Gere no Gem de [GEM_ESTILO.md](GEM_ESTILO.md).

## As três regras que valem para tudo

1. **Nenhum texto na imagem.** O narrador lê tudo em voz alta.
2. **Cores suaves e pouco saturadas**, contorno escuro fino, estilo de livro
   infantil. O jogo lava a cor de novo na preparação.
3. **Peça solta vai em fundo verde #00FF00 chapado**; cena inteira vai sem verde.

> Nunca ponha verde dentro de uma peça de fundo verde: o recorte come junto.
> Se a peça precisa de verde, peça fundo **magenta #FF00FF** e me avise.

---

# 1. O que falta (5)

### `m24_chuveiro` — missão 24, Hora do banho

Entra na sequência do banho e na cena certa do "pode ou não pode".

```
Ilustração 2D cartoon infantil de um chuveiro de parede ligado, visto de frente: o cano saindo da parede, o crivo redondo e um leque de gotas de água azul-clara caindo logo abaixo. Sem mãos, sem pessoa, sem box, sem chão e sem sombra projetada. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem textura e sem sombra no fundo. Imagem quadrada 2048x2048, objeto centralizado ocupando quase todo o quadro.
```

### `m01_espuma` — escovação

A espuma que nasce onde a escova passa e some no enxágue. Com ela a escovação
fecha o ciclo (sujo → espuma → limpo); é só código depois que o arquivo existir.

```
Ilustração 2D cartoon infantil de um tufo de espuma branca de pasta de dente, formato de nuvem irregular e macia, com algumas bolhinhas pequenas na borda, visto de frente. Sem boca, sem escova, sem mãos. Branco levemente azulado, com sombra chapada azul bem clara, contorno escuro fino e limpo. Fundo verde chapado #00FF00, uma cor só. Imagem quadrada 2048x2048, a espuma centralizada ocupando dois terços do quadro.
```

### `mg1_kart_tras` — corrida de kart

Hoje a criança aparece recortada na cintura dentro do kart de frente. Com o
kart visto de trás ela senta de verdade no vão do banco. **Anexe
`mg1_kart.jpg`** da pasta crua: é o mesmo kart azul-claro, só muda o ângulo.

```
Use o kart da imagem anexada, com as mesmas cores (azul-claro e branco) e o mesmo traço, e desenhe ele visto exatamente de trás: o encosto do banco baixo e vazio no meio, sem ninguém sentado, duas rodas grandes atrás, um aerofólio pequeno e o aro do volante aparecendo por cima do banco. Sem número, sem texto, sem logotipo. Ilustração 2D cartoon infantil, contorno escuro fino e limpo, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem chão e sem sombra projetada. Imagem quadrada 2048x2048, o kart centralizado ocupando quase toda a largura.
```

### `olhos_triste_castanhos` — a cara de desanimado

Salve com esse nome (o script gera o `olhos_triste`). Não vira opção no criador:
é a cara que o personagem faz quando a criança erra, e volta ao normal sozinha
em dois segundos. **Anexe `olhos_sorriso_castanhos.jpg`** para sair no mesmo
tamanho e na mesma posição.

```
Apenas os olhos, as sobrancelhas e a boca de uma criança de desenho animado, sem rosto, sem cabeça, sem pele em volta, no mesmo tamanho e na mesma posição da imagem anexada. Olhos abertos olhando um pouco para baixo, íris castanha com um brilho pequeno, sobrancelhas finas inclinadas para cima no meio (cara de desanimado, não de bravo), boca pequena em arco virado para baixo, suave. Nada de lágrima. Contorno escuro fino e limpo, cores suaves. Fundo verde chapado #00FF00, uma cor só. Imagem quadrada 2048x2048.
```

### `capa_historia5` — A sopa de estrelas (mundo 5, Janta)

Cena inteira, sem verde. **Anexe `capa_historia1.jpg`** e peça a mesma
raposinha e o mesmo traço. Na história, a vovó raposa faz sopa com macarrão em
forma de estrela e a raposinha ajuda, subida num banquinho.

```
Ilustração 2D cartoon infantil, capa de historinha, com a mesma raposinha e o mesmo traço da imagem anexada: numa cozinha aconchegante à noite, uma vovó raposa de avental mexe uma panela grande de sopa no fogão, e a raposinha pequena, de pé num banquinho ao lado, espia dentro da panela com os olhos arregalados. Do vapor da sopa sobem estrelinhas amarelas pequenas. Luz quente e amarela, clima calmo e acolhedor. Estilo de livro infantil, contorno escuro fino e limpo, cores suaves e pouco saturadas. Sem nenhum texto, letra ou número. Imagem quadrada 1024x1024, a cena preenchendo o quadro inteiro.
```

---

# 2. O que existe mas precisa ser refeito (5)

## Os dois olhos

| hoje | problema |
|---|---|
| `olhos_grandes` | olho grande demais, fica assustado |
| `olhos_alegres` | olho fechado em arco + boca aberta lê como bichinho |
| `olhos_sorriso` | **ficou bom** — é a referência |

**Anexe `olhos_sorriso_castanhos.jpg`** nos dois e salve com o nome cru
(`olhos_grandes_castanhos`, `olhos_alegres_castanhos`), por cima do antigo.

### `olhos_grandes_castanhos`

```
Apenas os olhos, as sobrancelhas e a boca de uma criança de desenho animado, sem rosto, sem cabeça, sem pele em volta, no mesmo tamanho e na mesma posição da imagem anexada. Olhos redondos e médios, um pouco maiores que o normal mas sem exagero, ainda cabem num rosto de criança; abertos, íris castanha com um brilho pequeno, sobrancelha fina e suave, boca pequena sorrindo de canto. Contorno escuro fino e limpo, cores suaves. Fundo verde chapado #00FF00, uma cor só. Imagem quadrada 2048x2048.
```

### `olhos_alegres_castanhos`

```
Apenas os olhos, as sobrancelhas e a boca de uma criança de desenho animado, sem rosto, sem cabeça, sem pele em volta, no mesmo tamanho e na mesma posição da imagem anexada. Olhos abertos em formato de amêndoa, com os cantos levemente curvados para cima, cara de quem está contente; íris castanha com um brilho pequeno, sobrancelha fina e suave, boca pequena sorrindo. Contorno escuro fino e limpo, cores suaves. Fundo verde chapado #00FF00, uma cor só. Imagem quadrada 2048x2048.
```

## O corpo de rosto redondo (1 base + 6 que vão junto)

A cabeça da arte atual é um ovo em pé. Criança de 4 anos lê melhor rosto
**redondo, bochecha larga, queixo curto**. Trocar o corpo base obriga a
regerar **o corpo sentado e as 5 roupas a partir da base nova**, porque o
script encaixa cada roupa pela cabeça da base. É também o que conserta a perna
que some: nas roupas atuais a pele veio mais clara e mais fina que na base.

Cabelos e olhos ficam como estão; confira no criador depois e só refaça se
não encaixar.

### `corpo_base_pele_clara` — gere primeiro

```
Ilustração 2D cartoon infantil de uma criança de pé, de frente, corpo inteiro, braços abertos para os lados, sem cabelo (careca lisa), sem olhos, sem sobrancelha e sem boca: só a pele lisa do rosto. A cabeça é bem redonda, quase um círculo, com bochecha larga e queixo curto e macio, estilo boneco de feltro; orelhas pequenas e redondas coladas na cabeça. Camiseta branca lisa de manga curta, shorts branco liso, meias brancas e tênis branco. Pele clara uniforme, braços e pernas exatamente da mesma cor do rosto, pernas de criança, roliças. Contorno escuro fino e limpo, estilo de livro infantil, sombreado chapado, cores suaves. Fundo verde chapado #00FF00, uma cor só, sem chão e sem sombra projetada. Imagem quadrada 2048x2048, a criança centralizada, a cabeça entre 5% e 33% da altura do quadro.
```

### As 6 que vão junto — **anexe a base nova** em cada uma

Mesmo começo para todas; troque só o trecho **[ROUPA]**. Regra da pele: **nada
de roupa amarela, laranja ou bege** (o script confunde com pele e repinta).

```
Use a imagem anexada como base e mude apenas a roupa, mantendo exatamente a mesma criança, a mesma pose de frente com os braços abertos, o mesmo tamanho e a mesma posição da cabeça redonda, a mesma careca sem cabelo, o mesmo rosto vazio sem olhos nem boca, a pele exatamente da mesma cor e as pernas com a mesma grossura da imagem anexada, e o mesmo enquadramento. [ROUPA] Sem estampa e sem texto na roupa, nada de verde em nenhuma parte. Ilustração 2D cartoon, contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.
```

| arquivo | **[ROUPA]** |
|---|---|
| `roupa_macacao_jeans` | Vista a criança com um macacão jeans azul de alças sobre uma camiseta branca de manga curta, com tênis branco. |
| `roupa_vestido_rosa` | Vista a criança com um vestido infantil rosa-claro de manga curta, faixa rosa mais escura na cintura e saia um pouco rodada até acima do joelho, meias brancas e tênis branco. |
| `roupa_conjunto_roxo` | Vista a criança com uma blusa roxa de manga curta e um short roxo mais escuro, com tênis branco. |
| `roupa_camiseta_azul` | Vista a criança com uma camiseta azul-clara de manga curta e uma bermuda azul-marinho, com tênis branco. |
| `roupa_moletom_vermelho` | Vista a criança com um moletom vermelho de manga comprida com capuz e uma calça comprida cinza, com tênis branco. |
| `corpo_cadeira_pele_clara` | Em vez de trocar a roupa, mantenha a camiseta e o shorts brancos e **sente a criança numa cadeira de rodas infantil** vista de frente, mãos nos aros das rodas, pés no apoio; a cabeça continua no mesmo lugar e do mesmo tamanho. |

## Os dois acessórios com moldura

Óculos e aparelho auditivo flutuavam fora do lugar e saíram do criador (duas
linhas comentadas em `src/personagem.ts`). As peças vinham recortadas rente,
então o jogo não sabia onde é o meio dos olhos. A solução é vir **na mesma
moldura 2048x2048 do corpo, já no lugar**. **Anexe o `corpo_base_pele_clara`**
(o novo, se já tiver). Assim que chegarem, é só descomentar as duas linhas.

### `acessorio_oculos`

```
Na mesma moldura da imagem anexada, desenhe apenas um óculos infantil de armação arredondada, visto exatamente de frente, posicionado onde ficariam os olhos da criança anexada: centralizado na horizontal, a 33% da altura a partir do topo, ocupando 22% da largura do quadro. Não desenhe a criança, nem rosto, nem cabeça, nem orelhas: só o óculos. Armação azul-petróleo fina, lentes transparentes. Contorno escuro fino e limpo. Fundo verde chapado #00FF00, uma cor só. Imagem quadrada 2048x2048.
```

### `acessorio_aparelho_auditivo`

```
Na mesma moldura da imagem anexada, desenhe apenas um aparelho auditivo infantil retroauricular, visto de lado, com o gancho voltado para a esquerda, posicionado onde ficaria a orelha direita da criança anexada: a 38% da altura a partir do topo e a 65% da largura a partir da esquerda, ocupando 8% da largura do quadro. Não desenhe a criança, nem orelha, nem cabeça, nem pele: só o aparelho. Corpo bege-claro com um detalhe colorido. Contorno escuro fino e limpo. Fundo verde chapado #00FF00, uma cor só. Imagem quadrada 2048x2048.
```

---

# 3. O som

| falta | quantos | onde está o roteiro |
|---|---|---|
| música de fundo | 7 faixas em loop + 1 de 30 s para o timer | [MUSICA.md](MUSICA.md), um prompt de Suno/Udio por faixa |
| falas do jogo | 450 frases: 364 de adulto (feminina e masculina) e 86 do mascote | `assets/audio/narracao.csv`, regerado hoje com as 28 missões |
| historinhas | 6 mp3 de 2 a 3 min | [HISTORIAS.md](HISTORIAS.md), roteiro com marcas de pausa |

Como gravar as falas: [GRAVAR_VOZES.md](GRAVAR_VOZES.md).

---

# O que **não** é pendência

- `icone_01` a `icone_28`: o mapa usa o emoji da missão de propósito.
- Os 5 joguinhos ainda não programados (memória, corredor, escalada, estrelas,
  corrida): a arte vem junto com o código de cada um.
- `_sem_nome/floresta_noite_amigos.jpg` e `_sem_nome/mundo5_regerado.jpg`:
  chegaram sem pedido; ficam guardados até alguém decidir onde entram.

# Ordem, do que mais incomoda para o que menos

1. `corpo_base_pele_clara` redondo + as 6 que vão junto (rosto e perna, de uma vez)
2. `olhos_grandes` e `olhos_alegres`
3. `acessorio_oculos` e `acessorio_aparelho_auditivo` (voltam ao criador)
4. `olhos_triste`, `m01_espuma`, `mg1_kart_tras`, `m24_chuveiro`
5. `capa_historia5`
6. música, depois as falas, depois as historinhas
