# Prompts do que ainda falta desenhar

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
- `mundo5` — hoje é **um ursinho de pelúcia**. É uma peça solta que entrou no
  lugar errado na fatiagem, não um medalhão. É o único que precisa ser gerado.

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
