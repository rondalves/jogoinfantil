# Prompts do que ainda falta desenhar

Tudo o que o jogo pede e ainda não existe em `assets/img`. Hoje cada um desses
sai como emoji ou como cor sólida — o jogo funciona, só fica feio.

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

# 1. Cenários (3) — sem fundo verde

Imagem **em pé, 9:16** (1080x1920). O meio e a parte de baixo ficam **livres**:
é onde o jogo põe os cartões. Mobília nas bordas e ao fundo.

### `bg_porta_casa` — chegando em casa (missão 13)

> Ilustração 2D cartoon infantil da **entrada de uma casa vista por dentro**,
> sem nenhuma pessoa. Porta de entrada fechada à esquerda, um cabideiro baixo
> com ganchos vazios, um tapetinho de boas-vindas e um banquinho para sentar e
> tirar o sapato. Ao fundo, a sala com um sofá e uma janela com luz de fim de
> tarde. O **centro e a metade de baixo ficam livres, só com o chão**. Contorno
> escuro fino e limpo, cores suaves e pouco saturadas. Sem texto, sem letras.
> Imagem em pé, 9:16, 1080x1920.

### `bg_sala_janta` — a mesa da janta (missões 19, 20 e 21)

> Ilustração 2D cartoon infantil de uma **sala de jantar de casa de família à
> noite**, vazia, sem nenhuma pessoa. Mesa de madeira ao fundo com uma toalha
> clara e um prato de comida no meio, cadeiras em volta, um armário baixo de
> louças na parede e uma luminária acesa sobre a mesa. Janela escura com a noite
> do lado de fora. O **centro e a metade de baixo ficam livres, só com o chão**.
> Contorno escuro fino e limpo, cores suaves e quentes, pouco saturadas. Sem
> texto. Imagem em pé, 9:16, 1080x1920.

### `bg_banheiro_banho` — o banho (missão 24)

> Ilustração 2D cartoon infantil de um **banheiro de criança na hora do banho**,
> **completamente vazio, sem nenhuma pessoa**. Box com chuveiro ligado soltando
> vapor, banheira infantil com espuma e patinho de borracha, toalha pendurada,
> tapetinho e prateleira com shampoo colorido. Ambiente claro e acolhedor. O
> **centro e a metade de baixo ficam livres**. Contorno escuro fino e limpo,
> cores suaves e pouco saturadas. Sem texto. Imagem em pé, 9:16, 1080x1920.

---

# 2. Peças soltas (7) — fundo verde #00FF00

Quadrado 2048x2048, objeto centralizado ocupando quase todo o quadro, visto de
frente, **sem mão, sem pessoa, sem chão e sem sombra projetada**.

| arquivo | onde aparece | prompt (o objeto) |
|---|---|---|
| `m24_chuveiro` | missão 24 | um **chuveiro de parede ligado**, visto de frente, com um leque de gotas de água caindo logo abaixo do crivo |
| `m24_sabonete` | missão 24 | uma **barra de sabonete** arredondada com espuma branca em volta e duas bolhinhas subindo |
| `m25_pente` | missão 25 | um **pente infantil** colorido, visto de frente, dentes para baixo |
| `m26_musica` | missão 26 | uma **nota musical** desenhada como caixinha de música: uma colcheia com um laço, cercada por três estrelinhas pequenas |
| `m19_luz` | missão 26 | um **abajur de mesa aceso**, com cúpula redonda e uma luz amarela quentinha saindo dela |
| `m19_historia` | missões 22 e 26 | um **livro infantil aberto**, visto de frente, páginas em branco **sem nenhuma letra nem desenho**, capa colorida |
| `m10_amigos` | missão 20 | **duas crianças pequenas de mãos dadas**, vistas de frente, sorrindo, corpo inteiro, uma de pele clara e outra de pele escura, roupas simples e coloridas |

Prompt completo (troque só a parte em negrito):

> Ilustração 2D cartoon infantil de **[O OBJETO]**, visto de frente, sem mãos,
> sem pessoas em volta, sem chão e sem sombra projetada. Contorno escuro fino e
> limpo, estilo de livro infantil, cores suaves e pouco saturadas. **Fundo verde
> chapado #00FF00**, uma cor só, sem textura e sem sombra no fundo. Imagem
> quadrada 2048x2048, objeto centralizado ocupando quase todo o quadro.

---

# 3. Mundo 6 no mapa (2)

O mapa tem medalhão redondo (`mundoN`) e broche de mundo fechado (`brocheN`)
para os mundos 1 a 5. O mundo 6 nasceu agora e não tem os dois.

**Feito:** o `mundo5` e o `broche5` de noite (lua e estrelas) viraram `mundo6` e
`broche6`, que é onde essa cara faz sentido agora. Falta só o par da Janta — até
lá o mundo 5 aparece no mapa com o emoji 🍽️.

### `mundo5` — Janta (medalhão)

> Ilustração 2D cartoon infantil de um **medalhão redondo** com uma cena
> pequena dentro: uma **mesa de jantar posta, com um prato fumegante e uma
> luminária acesa em cima**, vista de frente, sem pessoas. Moldura circular
> grossa em tom terroso quente, fundo da cena em tom de fim de noite. Contorno
> escuro fino e limpo, cores suaves e pouco saturadas. Fundo verde chapado
> #00FF00 fora do círculo. Imagem quadrada 2048x2048.

### `broche5` — Janta (broche)

> Ilustração 2D cartoon infantil de um **broche redondo de medalha**, com anel
> metálico grosso e brilho suave, e no centro um **prato com talheres cruzados**
> sorrindo de leve. Tom terroso quente. Contorno escuro fino e limpo, cores
> suaves e pouco saturadas. Fundo verde chapado #00FF00 fora do broche. Imagem
> quadrada 2048x2048.

---

# 4. Capas das historinhas (6) — sem fundo verde

Aparecem na aba 📖 Historinhas, em cartão. Quadrado 1024x1024, **sem texto** —
o título o jogo escreve por cima.

| arquivo | historinha | cena |
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

---

# 5. Já pedidos antes, ainda faltando

Os prompts destes estão em [PROMPTS_CENARIOS.md](PROMPTS_CENARIOS.md) e
[PROMPTS_CABELOS.md](PROMPTS_CABELOS.md):

- `bg_sala_aula` — **o arquivo com esse nome hoje é uma cozinha.** As missões 07,
  08 e 09 acontecem numa cozinha por causa disso.
- `m06_pnp_certa` e `m06_pnp_errada` — as duas cenas da rua (criança correndo
  atrás da bola / atravessando de mão dada). O JSON já aponta para elas.
- `m07_professora`, `m03_terra`
- `olhos_alegres_castanhos`, `olhos_grandes_castanhos`
- `acessorio_aparelho_auditivo`, `acessorio_capa`, `acessorio_medalha`
- `m05_caderno`, `m05_lapis`, `m05_garrafinha`, `m05_uniforme`, `m05_tenis`
- `m10_bater`, `mg2_pedra`, `logo`

---

# 6. O que **não** é pendência

`icone_01` até `icone_28`, os ícones de cada missão na lista do mapa, nunca
existiram: o mapa usa o emoji da missão de propósito, e fica bom assim. Só vale
desenhar se você quiser o mapa inteiro ilustrado — são 28 peças para um ganho
pequeno.

---

# Prioridade, se for gerar aos poucos

1. **`bg_sala_aula`** — é o único que está visivelmente errado hoje.
2. Os **3 cenários novos** — 5 missões rodam sem fundo por causa deles.
3. As **7 peças soltas** — tiram o emoji do meio da arte.
4. **`mundo5` e `broche5`** — o mapa fica com um buraco no mundo 6.
5. As **6 capas** — só fazem falta quando a aba de historinhas existir.
