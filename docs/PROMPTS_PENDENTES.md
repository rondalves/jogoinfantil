# Prompts do que ainda falta desenhar

> **Antes de ler o resto: rode `npm run faltando`.** Ele varre os JSONs e a
> pasta e diz exatamente o que falta hoje, mais o que existe mas precisa ser
> refeito. Esta lista escrita envelhece; o comando nao.


Lista conferida contra os JSONs em 9 de outubro de 2026. É o que o jogo pede e
não existe (ou existe errado) em `assets/img`. Cada um desses sai hoje como
emoji, cor chapada ou imagem trocada.

Salve com o **nome exato** na pasta das imagens e rode `npm run assets`.

## As três regras que valem para tudo

1. **Nenhum texto na imagem.** Nem no quadro, nem no rótulo, nem no livro. O
   narrador lê tudo em voz alta.
2. **Cores suaves e pouco saturadas**, contorno escuro fino, estilo de livro
   infantil. O jogo lava a cor de novo na preparação, então nada de cor forte.
3. **Peça solta vai em fundo verde #00FF00 chapado**; **cenário e cena inteira
   vão sem fundo verde**.

> ⚠️ Nunca ponha verde dentro de uma peça de fundo verde: o recorte come junto.
> Foi o que aconteceu com a lâmpada do semáforo e com o brócolis. Se a peça
> precisa de verde, peça **fundo MAGENTA #FF00FF** e me avise.

---

# 1. O mais urgente: `bg_sala_aula` está errado

O arquivo com esse nome **é uma cozinha**. As missões 07 (Ouvir a professora),
08 (Saber esperar) e 09 (Palavras mágicas) acontecem numa cozinha por causa
disso. Este prompt substitui o arquivo.

> Ilustração 2D cartoon infantil de uma **sala de aula de educação infantil
> vista de frente**, vazia, sem nenhuma pessoa. Ao fundo, um quadro verde limpo
> **sem nada escrito**, um mapa colorido sem letras, prateleiras baixas com
> livros e caixas de brinquedo, e uma janela grande com luz do dia.
> Carteirinhas pequenas de madeira clara organizadas nas laterais, deixando o
> **centro e a parte de baixo da imagem livres, só com o chão**. Tapete
> colorido no chão. Contorno escuro fino e limpo, estilo de livro infantil,
> cores suaves e pouco saturadas. **Sem texto, sem letras, sem números em lugar
> nenhum.** Imagem em pé, proporção 9:16, 1080x1920.

---

# 2. Peças soltas (8) — fundo verde #00FF00

Quadrado 2048x2048, objeto centralizado ocupando quase todo o quadro, visto de
frente, **sem mão, sem pessoa, sem chão e sem sombra projetada**.

| arquivo | onde aparece | troque **[O OBJETO]** por |
|---|---|---|
| `m24_chuveiro` | missão 24 | um **chuveiro de parede ligado**, com um leque de gotas de água caindo logo abaixo do crivo |
| `m24_sabonete` | missão 24 | uma **barra de sabonete** arredondada com espuma branca em volta e duas bolhinhas subindo |
| `m25_pente` | missão 25 | um **pente infantil** colorido, dentes para baixo |
| `m26_musica` | missão 26 | uma **nota musical** desenhada como caixinha de música: uma colcheia com um laço, cercada por três estrelinhas pequenas |
| `m19_luz` | missão 26 | um **abajur de mesa aceso**, com cúpula redonda e uma luz amarela quentinha saindo dela |
| `m19_historia` | missões 22 e 26 | um **livro infantil aberto**, páginas em branco **sem nenhuma letra nem desenho**, capa colorida |
| `m10_amigos` | missão 20 | **duas crianças pequenas de mãos dadas**, sorrindo, corpo inteiro, uma de pele clara e outra de pele escura, roupas simples e coloridas |
| `m03_terra` | missão 03 | um **canteiro de terra com uma plantinha pequena e uma pá de brinquedo**, terra marrom fofa |

Prompt completo:

> Ilustração 2D cartoon infantil de **[O OBJETO]**, visto de frente, sem mãos,
> sem pessoas em volta, sem chão e sem sombra projetada. Contorno escuro fino e
> limpo, estilo de livro infantil, cores suaves e pouco saturadas. **Fundo verde
> chapado #00FF00**, uma cor só, sem textura e sem sombra no fundo. Imagem
> quadrada 2048x2048, objeto centralizado ocupando quase todo o quadro.

---

# 3. As duas cenas da rua (missão 06) — sem fundo verde

Cenas inteiras, do jeito da missão 01: quadrado, com a criança dentro. O JSON já
aponta para esses dois nomes — o jogo troca sozinho quando chegarem.

### `m06_pnp_errada` — correr atrás da bola

> Ilustração 2D cartoon infantil, cena quadrada. **Uma criança pequena correndo
> para dentro da rua atrás de uma bola colorida**, vista de lado, com expressão
> de empolgação e sem perceber o perigo. A bola rola à frente dela no asfalto.
> Ao fundo, a calçada, um portão de casa e um carro parado ao longe. Contorno
> escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas.
> **Sem texto, sem letras, sem números.** Imagem quadrada 1024x1024.

### `m06_pnp_certa` — atravessar na faixa

> Ilustração 2D cartoon infantil, cena quadrada. **Uma criança pequena
> atravessando a rua na faixa de pedestres, de mão dada com um adulto**, vista
> de lado, os dois sorrindo e olhando para frente. Faixa de pedestres branca bem
> visível no asfalto e um semáforo de pedestre **aceso em verde** na calçada. Ao
> fundo, a calçada e um carro parado esperando. Contorno escuro fino e limpo,
> estilo de livro infantil, cores suaves e pouco saturadas. **Sem texto, sem
> letras, sem números.** Imagem quadrada 1024x1024.

As duas precisam parecer **a mesma rua**: gere uma logo depois da outra na mesma
conversa, pedindo *"mesma rua, mesmo traço e mesmas cores da imagem anterior"*.

---

# 4. O medalhão do mundo 5 (Janta)

Situação atual, conferida na pasta:

- `mundo6` e `broche6` — a lua e as estrelas. **Certos**, é a cara do mundo 6.
- `broche5` — um medalhão de mesa de jantar. **Serve**, e combina com a Janta.
- `mundo5` — hoje é **um ursinho de pelúcia**. Não foi erro de fatiagem: o
  arquivo cru `mundo5.jpg` que chegou na pasta é mesmo um ursinho em fundo
  verde. É o único que precisa ser gerado de novo, com o prompt abaixo.

### `mundo5` — Janta (medalhão do mapa)

> Ilustração 2D cartoon infantil de um **medalhão redondo**, com moldura
> circular grossa em tom terroso quente, e dentro dele uma cena pequena: uma
> **mesa de jantar posta, com um prato fumegante e uma luminária acesa em
> cima**, vista de frente, **sem pessoas**. Fundo da cena em tom de fim de
> noite. Contorno escuro fino e limpo, cores suaves e pouco saturadas. **Fundo
> verde chapado #00FF00** fora do círculo. Imagem quadrada 2048x2048.

---

# 5. Capas das historinhas (6) — sem fundo verde

Aparecem na aba 📖 Historinhas, em cartão. Quadrado 1024x1024, **sem texto** — o
título o jogo escreve por cima.

| arquivo | historinha | troque **[A CENA]** por |
|---|---|---|
| `capa_historia1` | A raposinha e o sol que acordou cedo | uma raposinha laranja espreguiçando na janela, com o sol nascendo atrás dela |
| `capa_historia2` | O primeiro dia de aula | uma raposinha de mochila na porta de uma escola, olhando para dentro, um pouco tímida |
| `capa_historia3` | A viagem da lua no carro | uma raposinha olhando pela janela do banco de trás de um carro à noite, a lua acompanhando lá fora |
| `capa_historia4` | O brinquedo que queria brincar | um ursinho de pelúcia sozinho num canto do quarto, olhando para uma caixa de brinquedos |
| `capa_historia5` | A sopa de estrelas | uma panela de sopa fumegante com estrelinhas saindo do vapor, numa mesa de cozinha |
| `capa_historia6` | A raposinha vai dormir | uma raposinha enroladinha num cobertor, dormindo, com a lua na janela |

Prompt completo:

> Ilustração 2D cartoon infantil, **capa de historinha**: **[A CENA]**. Estilo de
> livro infantil, contorno escuro fino e limpo, cores suaves e pouco saturadas,
> clima calmo e acolhedor. **Sem nenhum texto, letra ou número na imagem.**
> Imagem quadrada 1024x1024, com a cena preenchendo o quadro inteiro.

A raposinha é o mascote que já existe no jogo (`mascote_raposinha`). Para as seis
saírem com a mesma raposinha, **mande a imagem dela junto** na primeira geração e
peça *"use exatamente esta raposinha nas próximas"*.

---

# 6. `logo` — a marca do jogo

Usada na abertura e nas capturas da loja. Hoje a abertura escreve o nome em
texto.

> Ilustração 2D cartoon infantil de um **emblema de logotipo infantil**, redondo
> e macio, **sem nenhuma letra ou palavra dentro**: uma raposinha laranja
> sorrindo no centro, com um solzinho de um lado e uma luazinha do outro,
> formando um arco em volta dela. Moldura arredondada em tom creme. Contorno
> escuro fino e limpo, cores suaves e pouco saturadas. **Fundo verde chapado
> #00FF00**. Imagem quadrada 2048x2048.

O nome **Rotininha** o jogo escreve por cima, na fonte dele. Não peça o texto na
imagem: cada geração sai com uma letra diferente e quase sempre com erro de
ortografia.

---

# O que **não** é pendência

`icone_01` até `icone_28`, os ícones de cada missão na lista do mapa, nunca
existiram: o mapa usa o emoji da missão de propósito e fica bom assim. Só vale
desenhar se você quiser o mapa inteiro ilustrado — são 28 peças para um ganho
pequeno.

---

# Ordem, se for gerar aos poucos

1. **`bg_sala_aula`** — é o único hoje visivelmente errado.
2. As **8 peças soltas** — tiram o emoji do meio da arte.
3. **`mundo5`** — o mapa está com um ursinho no lugar do medalhão da Janta.
4. As **2 cenas da rua** — o "pode ou não pode" da missão 06 fica muito melhor.
5. As **6 capas** — só fazem falta quando a aba de historinhas existir.
6. **`logo`** — cosmético, serve para a ficha da loja.

---

# O rosto do personagem (testado no celular em 10/10/2026)

Quatro problemas vistos no aparelho, com o que resolve cada um.

## 1. O rosto e oval demais

A cabeca da arte do corpo e um ovo em pe. Crianca de 4 anos le melhor rosto
**redondo, com a bochecha larga e o queixo curto**. Isso vem da arte do corpo
base, nao do codigo.

Arquivo cru: `corpo_base_pele_clara`

> Ilustracao 2D cartoon infantil de **uma crianca de pe, de frente, corpo
> inteiro, braco aberto para o lado**, sem rosto desenhado (sem olhos, sem
> boca, sem sobrancelha) — so a pele lisa da cabeca. **A cabeca e bem redonda,
> quase um circulo**, com bochecha larga e queixo curto e macio, no estilo de
> boneco de feltro. Orelhas pequenas coladas. Camiseta branca e shorts branco
> lisos, tenis branco. Pele clara uniforme. Contorno escuro fino e limpo,
> cores suaves e pouco saturadas. **Fundo verde chapado #00FF00.** Imagem
> quadrada 2048x2048, a crianca centralizada ocupando a altura do quadro.

Se trocar esse arquivo, **todas as roupas precisam ser regeradas** no mesmo
enquadramento, senao a cabeca da roupa nao casa com a do corpo.

## 2. Os olhos

| hoje | problema |
|---|---|
| `olhos_grandes` | olho grande demais num rosto oval fica estranho, meio assustado |
| `olhos_alegres` | olho fechado em arco + boca aberta le como **bichinho**, nao crianca |
| `olhos_sorriso` | **esse ficou bom**, serve de referencia para os outros |

Regere os dois primeiros pedindo olho **aberto**, com iris visivel:

> Apenas **os olhos, as sobrancelhas e a boca** de uma crianca de desenho
> animado, sem rosto, sem cabeca, sem pele em volta. **[O JEITO]**. Olhos
> abertos com iris castanha e um brilho pequeno, sobrancelha fina e suave,
> boca pequena sorrindo de canto. Contorno escuro fino e limpo, cores suaves.
> **Fundo verde chapado #00FF00.** Imagem quadrada 2048x2048, as pecas
> centralizadas ocupando a largura de um rosto.

- `olhos_grandes` → **[O JEITO]** = *Olhos redondos e medios, um pouco maiores
  que o normal, mas sem exagero — ainda cabem num rosto de crianca*
- `olhos_alegres` → **[O JEITO]** = *Olhos abertos em formato de amendoa,
  cantos levemente curvados para cima, cara de quem esta contente*

## 3. Oculos e aparelho auditivo sairam do criador

Os dois flutuavam fora do lugar, entao sairam da lista (ficaram comentados em
`src/personagem.ts`). **Voltam assim que a arte chegar na moldura certa** — e
so descomentar duas linhas.

O que estava errado: as pecas vinham cortadas rente ao objeto, entao o jogo nao
tinha como saber onde e o "meio dos olhos" ou "onde encosta na orelha". A
solucao e vir **na mesma moldura 2048x2048 do corpo**, ja no lugar:

### `acessorio_oculos`

> Apenas **um oculos infantil de armacao arredondada**, visto exatamente de
> frente, sem rosto, sem cabeca e sem orelhas. Armacao azul petroleo fina,
> lentes transparentes. Contorno escuro fino e limpo. **Fundo verde chapado
> #00FF00.** Imagem quadrada 2048x2048, com o oculos **centralizado na
> horizontal e posicionado a 33% da altura a partir do topo**, ocupando 22% da
> largura do quadro.

### `acessorio_aparelho_auditivo`

> Apenas **um aparelho auditivo infantil retroauricular**, visto de lado,
> gancho voltado para a esquerda, sem orelha, sem cabeca e sem pele. Corpo
> bege claro com um detalhe colorido. Contorno escuro fino e limpo. **Fundo
> verde chapado #00FF00.** Imagem quadrada 2048x2048, com o aparelho **a 38%
> da altura a partir do topo e a 65% da largura a partir da esquerda**,
> ocupando 8% da largura do quadro.

As porcentagens sao o que faz a peca cair sozinha no lugar: sao as mesmas
coordenadas que o codigo ja usa (olhos em -0.30 da altura, orelha em x 0.155).

## 4. A perna some no fundo claro

Nas roupas novas (vestido rosa, conjunto roxo, camiseta azul, moletom) a perna
fica **mais clara que a do corpo base** e desaparece em cenario bege — e o que
parecia "crianca sem perna" na travessia da rua.

Medido na canela, tom de pele 3:

| arte | cor da perna |
|---|---|
| `corpo_pele3` (base) | (184, 132, 102) |
| `corpo_macacao_pele3` | (183, 128, 99) |
| `corpo_azul_pele3` | (222, 176, 146) |
| `corpo_roxo_pele3` | (225, 179, 149) |

O `recolorir_pele` preserva o brilho do original, entao arte que nasce com pele
mais clara continua clara depois de repintada. Nao e so contraste: a perna do
vestido tambem e **mais fina** (665 px de pele na canela contra 2778 na base).

Duas saidas: regerar as roupas novas com a **mesma pele do corpo base**, ou
normalizar o brilho dentro do `recolorir_pele` antes de aplicar o tom. A
primeira e mais segura — mexer no filtro pode repintar camiseta branca.

---

# Arte que o teste de 10/10 pediu (segunda rodada)

As quatro coisas que eu consertei no codigo — painel dos pais, kart sem a
cadeira, escova virada e o objeto solto num cartao — nao precisam de arte. Esta
lista e o que **so** sai com desenho novo.

## 1. Os cinco emojis que ainda aparecem no meio do jogo

Emoji no meio da arte desenhada salta aos olhos. Os que ainda aparecem na tela
"olha como se faz" de cada missao, dentro do cartao novo:

| onde | hoje | arquivo a gerar |
|---|---|---|
| missao 01, 23 | 🪥 | **ja existe** (`m01_escova`), falta o JSON apontar — eu faco |
| missao 02 | 🛏️ | `m02_cama_arrumada` ja existe, idem |
| missao 05 | 🎒 | `m05_mochila` ja existe, idem |
| missao 13 | 🏠 | `m13_casa` |
| missao 22 | 🧸 | ja existe |

Para `m13_casa`, peca solta de fundo verde:

> Ilustracao 2D cartoon infantil de **uma casinha simples vista de frente**,
> com porta, duas janelas e telhado, sem chao e sem jardim em volta. Contorno
> escuro fino e limpo, cores suaves e pouco saturadas. **Fundo verde chapado
> #00FF00.** Imagem quadrada 2048x2048, a casinha centralizada.

## 2. A boca da escovacao pode fechar o ciclo

Hoje a escovacao tem `m01_boca_suja` e `m01_boca_limpa` e troca uma pela outra
no fim. O que daria a sensacao de limpeza que voce pediu e **a espuma**: uma
peca de espuma branca que aparece onde a escova passa.

> Ilustracao 2D cartoon infantil de **um tufo de espuma branca de pasta de
> dente**, formato de nuvem irregular com algumas bolhinhas, visto de frente,
> sem boca, sem escova e sem maos. Branco levemente azulado, contorno escuro
> fino e limpo. **Fundo verde chapado #00FF00.** Imagem quadrada 2048x2048.

Salve como `m01_espuma`. Com ela eu ponho a espuma nascendo sob a cerda e
sumindo no enxague — e so codigo depois que o arquivo existir.

## 3. O kart pede uma vista de tras

A crianca no kart aparece de frente com o kart tapando da cintura para baixo.
Funciona, mas o certo mesmo e **um kart visto de tras**, com o banco aberto
para a crianca sentar dentro.

> Ilustracao 2D cartoon infantil de **um kart infantil visto de tras**, com o
> encosto do banco baixo e vazio no meio (sem ninguem sentado), duas rodas
> grandes atras, aerofolio pequeno e um volante aparecendo por cima do banco.
> Cores primarias suaves. Contorno escuro fino e limpo. **Fundo verde chapado
> #00FF00.** Imagem quadrada 2048x2048, o kart centralizado e ocupando quase
> toda a largura.

Salve como `mg1_kart_tras`. Assim a crianca senta de verdade no vao do banco,
em vez de ser recortada na linha da cintura.

## 4. O que continua da lista antiga

Nada do que estava pendente foi resolvido nesta rodada. Continuam valendo os
prompts das secoes acima: `bg_sala_aula` (hoje e uma cozinha), as 8 pecas
soltas, as 2 cenas da rua, as 6 capas de historinha, a logo, o corpo base de
rosto redondo, os dois olhos e os dois acessorios com moldura.

**A ordem que eu faria**, do que mais incomoda para o que menos:

1. `corpo_base_pele_clara` de rosto redondo + **as 6 roupas regeradas juntas**
   (resolve o rosto oval E a perna que some, de uma vez)
2. `bg_sala_aula`
3. `acessorio_oculos` e `acessorio_aparelho_auditivo` com moldura (voltam ao jogo)
4. `olhos_grandes` e `olhos_alegres` refeitos
5. as 2 cenas da rua
6. `m01_espuma`, `mg1_kart_tras`, `m13_casa`
7. as 6 capas e a logo

## `olhos_triste` — a cara de desanimado

O jogo sabe deixar o personagem triste (ombro cai, cabeca pende), mas sem essa
peca a **cara** nao muda junto. Mesma moldura dos outros olhos.

> Apenas **os olhos, as sobrancelhas e a boca** de uma crianca de desenho
> animado, sem rosto, sem cabeca, sem pele em volta. Olhos abertos olhando um
> pouco para baixo, **sobrancelhas inclinadas para cima no meio** (cara de
> desanimado, nao de bravo), boca pequena em arco virado para baixo, suave.
> Nada de lagrima. Contorno escuro fino e limpo, cores suaves. **Fundo verde
> chapado #00FF00.** Imagem quadrada 2048x2048, as pecas centralizadas
> ocupando a largura de um rosto.

Triste aqui nunca e castigo: aparece junto com a frase que explica o que
aconteceu e volta ao normal sozinho em dois segundos.
