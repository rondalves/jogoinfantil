# Prompts do que ainda falta

> **Antes de ler: rode `npm run faltando`.** Ele varre os JSONs e a pasta e
> diz o que falta hoje e o que existe mas precisa ser refeito. Esta lista
> envelhece; o comando não.

Conferido em 11 de outubro de 2026: **nenhuma arte faltando**. O que sobra é
refazer o personagem inteiro, mais o som. Tudo tem substituto automático no
jogo, então nada quebra enquanto não chega.

Salve com o **nome exato** na pasta `C:\Users\rondj\Downloads\Imagens para jogo
infantil` e rode `npm run assets`. Gere no Gem de [GEM_ESTILO.md](GEM_ESTILO.md).

---

# 1. O personagem inteiro (36 imagens)

Corpo, rostos, cabelos, roupas, cadeira de rodas e acessórios do rosto saem
todos de um molde só, desenhados em cima da mesma criança. Os prompts, a ordem
e o que conferir antes de aceitar estão em
[PROMPTS_PERSONAGEM.md](PROMPTS_PERSONAGEM.md).

Comece pelo **lote 1**, só cinco imagens, e me mande antes de gerar o resto.

---

# 2. O som

| falta | quantos | onde está o roteiro |
|---|---|---|
| música de fundo | 7 faixas em loop + 1 de 30 s para o timer | [MUSICA.md](MUSICA.md), um prompt de Suno/Udio por faixa |
| falas do jogo | 450 frases: 364 de adulto (feminina e masculina) e 86 do mascote | `assets/audio/narracao.csv`, com as 28 missões |
| historinhas | 6 mp3 de 2 a 3 min | [HISTORIAS.md](HISTORIAS.md), roteiro com marcas de pausa |

Como gravar as falas: [GRAVAR_VOZES.md](GRAVAR_VOZES.md).

---

# 3. Melhorias: o que ainda sai como emoji

Nada aqui está faltando — o jogo roda. São os últimos pontos em que a criança
vê um emoji do sistema no meio da arte desenhada. Mesma regra de todas as peças
soltas: **fundo verde #00FF00, quadrado 2048x2048**.

**Tudo desta seção entrou no jogo em 13/10/2026.** Ficam os prompts
registrados, para quem precisar refazer alguma peça no mesmo estilo.

### ~~`m01_bolo` — missão 01, "Brincar com a comida"~~ (pronto)

> Ilustração 2D cartoon infantil de **um prato de comida todo bagunçado**,
> visto de frente: purê e pedaços de fruta espalhados e amassados na borda do
> prato, um garfo largado em cima e dois respingos pequenos ao lado. Sem mãos,
> sem pessoas, sem mesa. Contorno escuro fino e limpo, estilo de livro
> infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma
> cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### ~~Missão 20, "Conversa à mesa" — cinco cenas~~ (pronto)

As cinco entram como cartão, do mesmo jeito das cenas da missão 10. Em todas:
**uma criança sozinha, de frente, do peito para cima, sentada à mesa**, sem
mesa desenhada em volta, para o cartão não ficar carregado.

| arquivo | troque **[A CENA]** por |
|---|---|
| `m20_falar_cheio` | a criança falando de boca cheia, bochechas estufadas, três migalhas saindo da boca, sobrancelhas levantadas |
| `m20_escutar` | a criança escutando com atenção, boca fechada sorrindo, cabeça levemente inclinada e a mão apoiando o queixo |
| `m20_gritar` | a criança gritando, boca bem aberta, olhos apertados e três tracinhos de som saindo dos dois lados da boca |
| `m20_engolir` | a criança de boca fechada e dedinho levantado, esperando a vez de falar, com um balão de fala vazio ao lado |
| `m20_contar` | a criança contando uma novidade, sorrindo animada, mãos abertas na altura do peito e uma estrelinha ao lado |

> Ilustração 2D cartoon infantil de **uma criança de uns 5 anos, de frente, do
> peito para cima**, sem mesa, sem cadeira e sem fundo. **[A CENA]**. Roupa
> simples de cor suave, cabelo castanho curto. Contorno escuro fino e limpo,
> estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado
> #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### ~~`bg_montanha` — fundo da moto~~ (pronto)

Entrou atrás dos morros que correm: o céu da moto deixou de ser um degradê
chapado. Os morros de perto continuam desenhados por código, para terem
paralaxe.

> Ilustração 2D cartoon infantil de **uma paisagem de montanha ao longe, vista
> de frente**, sem pessoas e sem veículos: três fileiras de morros em tons de
> verde e azul que vão clareando até o horizonte, algumas árvores pequenas e
> arredondadas, nuvens fofas e um sol suave no alto. A metade de baixo é só
> céu e morro ao longe, **sem chão em primeiro plano** — o chão o jogo
> desenha. Contorno escuro fino e limpo, estilo de livro infantil, cores
> suaves e pouco saturadas. Imagem em pé, proporção 9:16, 1080x1920.

---

# O que **não** é pendência

- `icone_01` a `icone_28`: o mapa usa o emoji da missão de propósito.
- Os 5 joguinhos ainda não programados (memória, corredor, escalada, estrelas,
  corrida): a arte vem junto com o código de cada um.
- `_sem_nome/floresta_noite_amigos.jpg` e `_sem_nome/mundo5_regerado.jpg`:
  chegaram sem pedido; ficam guardados até alguém decidir onde entram.

---

# 4. Missões 29, 30 e 31 — 14 artes novas (16/10/2026)

As três missões novas reaproveitam peças que já existem (`m06_carro`,
`m06_mao_dada`, `m05_tenis`, `m05_garrafinha`, `m01_maca`, `m15_urso`,
`m19_livro`, `m10_coracao`). Faltam as 14 abaixo. Enquanto não chegam, o jogo
mostra emoji e cor de fundo. Gere no Gem de [GEM_ESTILO.md](GEM_ESTILO.md).

Peças soltas (verde #00FF00, 2048x2048): `m29_cinto_solto`, `m29_porta_calcada`,
`m30_acenar`, `m30_escorregador`, `m30_banco_parque`, `m30_trilha_longe`,
`m31_olhos_tapados`. Cenas (sem verde, quadrado 1024x1024): `m29_pnp_certa`,
`m29_pnp_errada`, `m30_pnp_certa`, `m30_pnp_errada`, `m31_pnp_certa`,
`m31_pnp_errada`. Cenário (em pé 1080x1920): `bg_parque`.

### `m29_cinto_solto`

> Ilustração 2D cartoon infantil de **um cinto de segurança de carro solto**, com a fivela aberta pendurada ao lado do cinto, visto de frente. Sem banco, sem carro ao redor. Sem mãos, sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m29_porta_calcada`

> Ilustração 2D cartoon infantil de **uma porta de carro aberta ao lado de um pedaço de calçada com meio-fio**, vista de frente, a calçada bem visível junto à porta. Sem rua em volta além do meio-fio. Sem mãos, sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m30_acenar`

> Ilustração 2D cartoon infantil de **uma mão de criança aberta, acenando**, vista de frente, com duas linhas de movimento ao lado. Só a mão e um pedacinho do pulso, sem rosto, sem corpo. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m30_escorregador`

> Ilustração 2D cartoon infantil de **um escorregador de parquinho colorido com escada**, visto de frente, sem crianças em cima. Sem mãos, sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m30_banco_parque`

> Ilustração 2D cartoon infantil de **um banco de parque de madeira com um arbusto pequeno ao lado**, visto de frente. Sem mãos, sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m30_trilha_longe`

> Ilustração 2D cartoon infantil de **um caminho de terra curvo que se afasta e some ao longe, com duas árvores pequenas ao lado**, visto de frente. Sem mãos, sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m31_olhos_tapados`

> Ilustração 2D cartoon infantil de **duas mãozinhas de criança cobrindo um par de olhos de desenho**, como quem finge que não viu, visto de frente. Só os olhos e as mãos, sem rosto, sem corpo. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m29_pnp_certa`

> Ilustração 2D cartoon infantil, cena quadrada. **Uma criança pequena descendo de um carro pelo lado da calçada, de mão dada com um adulto que segura a porta aberta**, os dois sorrindo. Ao fundo, o portão de uma escola e a calçada. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Sem texto, sem letras, sem números. Imagem quadrada 1024x1024.

### `m29_pnp_errada`

> Ilustração 2D cartoon infantil, cena quadrada. **Uma criança pequena abrindo a porta do carro pelo lado da rua**, olhando para fora sem perceber que um carro vem vindo ao longe pela rua. Mesmo carro, mesma calçada e mesmo portão de escola ao fundo da cena anterior. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Sem texto, sem letras, sem números. Imagem quadrada 1024x1024.

### `m30_pnp_certa`

> Ilustração 2D cartoon infantil, cena quadrada. **Uma criança pequena brincando no escorregador de um parque**, sorrindo, enquanto um adulto sentado no banco ao fundo olha para ela e acena. Gramado, árvores e céu claro. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Sem texto, sem letras, sem números. Imagem quadrada 1024x1024.

### `m30_pnp_errada`

> Ilustração 2D cartoon infantil, cena quadrada. **Uma criança pequena andando sozinha por um caminho de terra, para longe do parquinho**, enquanto o adulto, pequeno e distante, está sentado no banco ao fundo e não está olhando. Mesmo parque da cena anterior. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Sem texto, sem letras, sem números. Imagem quadrada 1024x1024.

### `m31_pnp_certa`

> Ilustração 2D cartoon infantil, cena quadrada. **Uma criança pequena de pijama abraçando um adulto sentado na beira da cama**, os dois de olhos fechados e sorrindo. Quarto à noite, abajur aceso, luz quentinha. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Sem texto, sem letras, sem números. Imagem quadrada 1024x1024.

### `m31_pnp_errada`

> Ilustração 2D cartoon infantil, cena quadrada. **Uma criança pequena de pijama já deitada de costas para a porta, coberta até o ombro**, enquanto um adulto parado na porta, ao fundo, levanta a mão em despedida e não recebe resposta. Mesmo quarto da cena anterior, à noite. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Sem texto, sem letras, sem números. Imagem quadrada 1024x1024.

### `bg_parque`

> Cenário 2D cartoon infantil de **um parque**, em pé 1080x1920: árvores, arbustos, um escorregador e um banco nas bordas e ao fundo; gramado e caminho de terra bem livres no centro e na metade de baixo, para os cartões do jogo. Sem pessoas, sem texto, sem letras. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Sem fundo verde.
