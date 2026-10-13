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

Nada aqui está faltando — o jogo roda. São os seis últimos pontos em que a
criança vê um emoji do sistema no meio da arte desenhada. Mesma regra de todas
as peças soltas: **fundo verde #00FF00, quadrado 2048x2048**.

### `m01_bolo` — missão 01, "Brincar com a comida" (carta errada do Pode ou Não Pode)

> Ilustração 2D cartoon infantil de **um prato de comida todo bagunçado**,
> visto de frente: purê e pedaços de fruta espalhados e amassados na borda do
> prato, um garfo largado em cima e dois respingos pequenos ao lado. Sem mãos,
> sem pessoas, sem mesa. Contorno escuro fino e limpo, estilo de livro
> infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma
> cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.

### Missão 20, "Conversa à mesa" — cinco cenas

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

### `bg_montanha` — fundo da moto (opcional)

Hoje o céu e os morros da moto são desenhados por código, em cores chapadas:
é a tela mais lisa do jogo. **Não leva fundo verde** e, quando chegar, precisa
de uma linha no `MotoMontanha.ts` para entrar atrás dos morros.

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
