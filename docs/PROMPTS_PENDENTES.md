# Prompts do que ainda falta

> **Antes de ler: rode `npm run faltando`.** Ele varre os JSONs e a pasta e
> diz o que falta hoje e o que existe mas precisa ser refeito. Esta lista
> envelhece; o comando não.

Conferido em 15 de outubro de 2026: **8 artes novas pedidas** (seção 5), para as cenas que mudam a cada item. O que sobra é
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

# ~~4. Missões 29, 30 e 31 — 14 artes novas~~ (prontas em 15/10/2026)

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

---

# 5. Cenas que mudam a cada item — 8 artes novas (pedidas em 15/10/2026)

O jogo já está pronto para elas: assim que a arte entra na pasta com o nome
certo, a cena passa a mudar sozinha. Enquanto não chega, a etapa funciona como
antes. Para ficar igual ao que já existe, **anexe no Gemini a arte indicada em
"referência"** (de `assets/img`) e peça para manter o mesmo desenho. Mesma
regra das peças soltas: **fundo verde #00FF00, quadrado 2048x2048**.

### `m02_cama_colchao` — missão 02, a cama antes de arrumar (referência: `m02_cama_arrumada.png`)

> Ilustração 2D cartoon infantil da **mesma cama de madeira da imagem de referência, vista do mesmo ângulo, só com o colchão branco e liso**: sem lençol, sem cobertor e sem travesseiro. Mesma cabeceira, mesmos pés, mesma cor de madeira. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m02_cama_lencol` — missão 02, depois do lençol (referência: `m02_cama_arrumada.png` e `m02_lencol.png`)

> Ilustração 2D cartoon infantil da **mesma cama de madeira da imagem de referência, vista do mesmo ângulo, com o colchão coberto por um lençol claro em tons pastel, bem esticado e liso**, como o lençol da segunda referência. Ainda **sem cobertor e sem travesseiro**. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m02_cama_cobertor` — missão 02, depois do cobertor (referência: `m02_cama_arrumada.png`)

> Ilustração 2D cartoon infantil da **mesma cama arrumada da imagem de referência, igualzinha, mas sem o travesseiro**: lençol esticado e o cobertor listrado (vermelho, amarelo, azul e branco) estendido e dobrado na ponta, no mesmo lugar. A cabeceira fica à mostra, sem nada em cima do colchão nessa parte. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m05_mochila_pronta` — missão 05, a mochila arrumada (referência: `m05_mochila.png`)

> Ilustração 2D cartoon infantil da **mesma mochila escolar da imagem de referência, com o zíper de cima aberto e as coisas da escola aparecendo**: um caderno, um lápis, uma maçã vermelha e uma garrafinha de água saindo pela abertura. Mesmas cores e mesmos adesivos da mochila. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m13_mesa_posta` — missão 17, a mesa posta (referência: `m13_mesa.png`)

> Ilustração 2D cartoon infantil da **mesma mesinha com cadeira da imagem de referência, vista do mesmo ângulo, com a mesa posta**: um prato branco, um copo e um garfo arrumados em cima do tampo, na frente da cadeira. Nada fora da mesa. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m16_caixa_brinquedos` — missão 16, a caixa cheia (referência: `m16_caixa_blocos.png`)

> Ilustração 2D cartoon infantil da **mesma caixa azul de brinquedos da imagem de referência, aberta, com os brinquedos guardados aparecendo por cima**: uma bola colorida, um ursinho de pelúcia, um trenzinho de madeira e uma boneca, bem arrumados. Sem blocos espalhados fora da caixa. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `pet_cachorro_feliz` — missão 17, o cachorrinho alimentado (referência: `pet_cachorro.png`)

> Ilustração 2D cartoon infantil do **mesmo cachorrinho da imagem de referência, sentado, de olhos fechados de alegria e língua de fora, com um potinho de ração cheio na frente e um ossinho ao lado**. Mesma cor de pelo e mesma coleira vermelha. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### `m21_pia` — missão 21, a pia da cozinha (hoje aparece o cesto de roupa suja)

> Ilustração 2D cartoon infantil de **uma pia de cozinha vista de frente**: cuba de inox, torneira alta e um pedaço da bancada dos dois lados, sem louça dentro. Sem armário embaixo, sem parede atrás. Sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.
