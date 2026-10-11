# O personagem novo: prompts

## Por que refazer

Hoje cada parte da criança foi desenhada sozinha: o cabelo como uma peruca sem
cabeça, os olhos flutuando sem rosto, o corpo careca à parte. Nenhuma peça sabe
como é a outra. O resultado é o que você viu: o cabelo vira um aro em volta de
uma máscara, a cabeça não casa com o pescoço e o olho sem pálpebra parece de
bicho.

O jeito novo é **desenhar tudo em cima da mesma criança**:

1. Um **molde**: a criança careca e sem rosto, com proporção de criança de verdade.
2. Os **rostos**, desenhados no molde.
3. Os **cabelos**, desenhados na criança já com rosto.
4. As **roupas**, trocadas no molde.

Cada imagem é a criança inteira. Quem recorta o cabelo, o rosto e a roupa é o
`npm run assets`, comparando com o molde. Como tudo foi desenhado na mesma
cabeça, encaixa por construção.

## As medidas de criança de verdade

Tiradas das fotos que você mandou, das duas crianças, de frente:

| | criança de verdade | no desenho |
|---|---|---|
| cabeça | 1/5 da altura aos 2 anos, quase 1/6 aos 6 | **1/4**, um pouco maior para o rosto ler bem no celular |
| olhos | na linha do meio da cabeça, contando do alto do crânio | igual |
| distância entre os olhos | a largura de um olho | igual |
| pálpebra | cobre o alto da íris; não aparece branco em volta dela | igual: é o que tira a cara de bicho |
| nariz | a 70% da altura da cabeça | traço curto, sem sombra |
| boca | a 80% da altura da cabeça, da largura entre as pupilas | igual |
| orelha | o topo na altura dos olhos, a ponta na altura do nariz | igual |
| pescoço | curto, metade da largura da cabeça | igual |

Não precisa anexar as fotos no Gemini: as medidas já estão no texto dos
prompts. Prefiro que não anexe foto de rosto, porque o personagem pode sair
parecido com elas, e ele vai para uma loja pública.

## Como gerar

Use o Gem de [GEM_ESTILO.md](GEM_ESTILO.md), com as instruções novas.
**Sempre anexe a imagem que o prompt pede**: é ela que garante o encaixe.

Antes de aceitar cada imagem, confira:

- **Mesmo enquadramento** da imagem anexada: a cabeça no mesmo lugar e do mesmo tamanho, os pés inteiros.
- **Olho com pálpebra**: se aparecer branco em volta da íris inteira, gere de novo.
- **Cabelo no crânio**: se parecer peruca ou capacete, gere de novo.
- **Nada a mais**: sem chão, sem sombra, sem texto, fundo verde chapado.

Salve com o **nome exato** na pasta das imagens cruas.

### Lote 1: só cinco imagens, para eu testar o recorte

| ordem | arquivo | anexe |
|---|---|---|
| 1 | `corpo_base_pele_clara` | nada |
| 2 | `crianca_rosto_redondos` | a 1 |
| 3 | `crianca_cabelo_cacheado` | a 2 |
| 4 | `crianca_cabelo_menino_curto` | a 2 |
| 5 | `roupa_camiseta_azul` | a 1 |

Me mande essas cinco antes do resto. Eu ajusto o recorte com elas e confiro no
jogo. Só depois vale gerar as outras 31: se algo no método precisar mudar,
você não perde trabalho.

### Lote 2: o resto

Os outros 4 rostos, os outros 20 cabelos, as outras 5 roupas e os 2 acessórios.

---

# 1. O molde: `corpo_base_pele_clara`

Não anexe nada. A versão atual vai para `_substituidas`.

```
Ilustração 2D infantil de uma criança de 4 anos de pé, de frente, corpo inteiro, com proporções de criança de verdade: a cabeça ocupa um quarto da altura total; pescoço curto mas visível, com metade da largura da cabeça; ombros com uma vez e meia a largura da cabeça; braços afastados do corpo uns 30 graus, mãos abertas e relaxadas, as pontas dos dedos no meio da coxa; pernas retas e um pouco gordinhas; pés afastados na largura do quadril. Cabeça redonda e cheia, bochechas largas e macias, queixo curto e arredondado, orelhas pequenas com o topo na metade da altura da cabeça. A criança é careca, com a cabeça lisa e sem nenhum cabelo, e não tem rosto: sem olhos, sem sobrancelhas, sem nariz e sem boca, só a pele lisa, como um boneco de montar. Camiseta branca lisa de manga curta, shorts branco liso, meias brancas e tênis branco. Pele clara uniforme, a mesma cor no rosto, no pescoço, nos braços e nas pernas. Estilo de livro infantil moderno, formas simples e arredondadas, contorno escuro fino e constante, sombreado chapado com no máximo dois tons, cores suaves. Fundo verde chapado #00FF00, uma cor só, sem chão e sem sombra. Imagem quadrada 2048x2048, criança centralizada, com o alto da cabeça a 5% do topo e a sola do tênis a 5% de baixo.
```

---

# 2. Os rostos: `crianca_rosto_<id>`

### `crianca_rosto_redondos`: o rosto padrão (anexe o molde)

```
Use a imagem anexada e desenhe somente o rosto da criança, mantendo todo o resto exatamente igual: a cabeça careca, o formato e o tamanho da cabeça, as orelhas, o corpo, a roupa, a pose, a posição, o enquadramento e o fundo verde. Rosto de uma criança de verdade de 4 anos, simpático e calmo, desenhado com poucos traços. Olhos na linha do meio da cabeça (a testa é grande), afastados um do outro na largura de um olho. Olhos amendoados de tamanho natural, íris castanho-escura grande com um brilho pequeno, e a pálpebra de cima cobrindo um pouco o alto da íris, de modo que não aparece branco em volta da íris inteira. Cílios curtos e discretos. Sobrancelhas finas, curvas e castanhas, um pouco acima dos olhos. Nariz pequeno e arredondado, só com um traço curto na ponta, sem sombra. Boca pequena fechada, sorrindo de leve, mais perto do nariz do que do queixo, da largura da distância entre as pupilas. Sem bochecha rosada, sem sardas, sem cabelo, sem maquiagem. O mesmo traço fino e escuro do resto do desenho.
```

### As 4 expressões (anexe o `crianca_rosto_redondos`)

Mesmo começo para todas; troque só o trecho **[EXPRESSÃO]**.

```
Use a imagem anexada e mude somente a expressão do rosto, mantendo todo o resto idêntico: a cabeça, as orelhas, o corpo, a roupa, a pose, a posição, o tamanho, o enquadramento, o fundo verde e o mesmo jeito de desenhar os olhos, o nariz e a boca. [EXPRESSÃO] Os olhos continuam na mesma altura e com a mesma distância entre eles, e o nariz não muda. Sem lágrima, sem bochecha rosada, sem cabelo.
```

| arquivo | quando aparece | **[EXPRESSÃO]** |
|---|---|---|
| `crianca_rosto_grandes` | surpresa boa | Olhos um pouco mais abertos e redondos, ainda com a pálpebra encostando no alto da íris; sobrancelhas levantadas; boca pequena e redonda, em formato de "o". |
| `crianca_rosto_alegres` | acertou | Olhos sorrindo, com a pálpebra de baixo subindo um pouco e a íris ainda aparecendo; sorriso de boca fechada, mais largo. |
| `crianca_rosto_sorriso` | comemorando | Sorrisão de boca aberta mostrando os dentinhos de cima; olhos apertadinhos de alegria, com a íris ainda aparecendo. |
| `crianca_rosto_triste` | errou | Sobrancelhas inclinadas para cima no meio; olhos olhando um pouco para baixo; boca pequena com os cantos para baixo. Cara de desanimado, não de choro. |

---

# 3. Os cabelos: `crianca_cabelo_<id>`

Anexe o `crianca_rosto_redondos`. Gere só em **castanho médio**: o jogo faz as
9 cores sozinho. Troque só o trecho **[PENTEADO]**.

```
Use a imagem anexada e desenhe somente o cabelo na criança, mantendo todo o resto idêntico: o rosto, a cabeça, as orelhas, o corpo, a roupa, a pose, a posição, o tamanho, o enquadramento e o fundo verde. O cabelo nasce numa linha de cabelo natural na testa, cobre o alto da cabeça com volume de verdade por cima do crânio e acompanha o formato redondo da cabeça. Não pode parecer peruca nem capacete, e não pode cobrir os olhos nem as sobrancelhas. [PENTEADO] Desenhado em massas grandes e simples, com poucas linhas de mecha, sem fio solto e sem cachinho miúdo desenhado um por um. Cor castanho médio uniforme, com sombreado em um tom mais escuro. Elástico ou prendedor, se tiver, da mesma cor do cabelo. Sem enfeite, sem laço, sem chapéu.
```

| arquivo | **[PENTEADO]** |
|---|---|
| `crianca_cabelo_cacheado` | Cachos grandes e redondos, com volume nas laterais em formato de triângulo arredondado, até um pouco abaixo dos ombros, sem repartido. |
| `crianca_cabelo_crespo` | Crespo afro, em formato de nuvem redonda e volumosa em volta da cabeça. |
| `crianca_cabelo_ondulado` | Ondas largas e suaves até o ombro, repartido de lado. |
| `crianca_cabelo_enrolado` | Cachos grandes e soltos, bem cheios, até um pouco abaixo do ombro. |
| `crianca_cabelo_liso_longo` | Liso até o meio das costas, repartido ao meio, caindo por trás dos ombros. |
| `crianca_cabelo_liso_curto` | Liso na altura do queixo, com franja reta logo acima das sobrancelhas. |
| `crianca_cabelo_trancas` | Duas tranças, uma de cada lado, caindo na frente dos ombros, repartido no meio. |
| `crianca_cabelo_tranca_unica` | Uma trança grossa caindo pela frente de um dos ombros, no lado direito da imagem. |
| `crianca_cabelo_coque` | Coque alto e redondo no topo da cabeça, com as laterais presas e lisas. |
| `crianca_cabelo_maria_chiquinha` | Dois rabinhos, um de cada lado, presos na altura das orelhas. |
| `crianca_cabelo_box_braids` | Tranças finas estilo box braids até o ombro, desenhadas como faixas paralelas simples. |
| `crianca_cabelo_dreads` | Dreadlocks médios até o ombro, em faixas grossas e simples. |
| `crianca_cabelo_menino_curto` | Curto e liso, com franja curta penteada para o lado. |
| `crianca_cabelo_menino_cacheado` | Curto e cacheado, cachos cheios no topo e laterais curtas. |
| `crianca_cabelo_menino_crespo` | Crespo baixo, rente nas laterais, com volume curto no topo. |
| `crianca_cabelo_menino_black_power` | Black power redondo e volumoso em volta da cabeça. |
| `crianca_cabelo_menino_espetado` | Curto, espetado para cima na frente. |
| `crianca_cabelo_menino_tigelinha` | Corte tigela, liso, com franja reta logo acima das sobrancelhas. |
| `crianca_cabelo_menino_raspado` | Raspado rente em toda a cabeça, com o contorno baixo e reto na testa, sem volume. |
| `crianca_cabelo_menino_degrade` | Degradê: laterais bem rentes, topo curto e cheio penteado para cima. |
| `crianca_cabelo_menino_risco` | Social curto penteado para o lado, com um risco raspado no lado esquerdo da imagem. |
| `crianca_cabelo_menino_moicano` | Moicano curto: uma crista no meio do topo e as laterais raspadas. |

---

# 4. As roupas e a cadeira de rodas

Anexe o **molde**. Nada de roupa amarela, laranja ou bege: o script confunde
com pele e repinta. Troque só o trecho **[ROUPA]**.

```
Use a imagem anexada e mude somente a roupa, mantendo todo o resto idêntico: a mesma criança careca e sem rosto, a cabeça com o mesmo formato, tamanho e posição, a pele da mesma cor, a pose, os braços, as pernas com a mesma grossura, os pés inteiros dentro do quadro, o enquadramento e o fundo verde. [ROUPA] Sem estampa, sem texto e nada de verde na roupa. Mesmo traço fino e escuro e mesmo sombreado chapado do resto do desenho.
```

| arquivo | **[ROUPA]** |
|---|---|
| `roupa_camiseta_azul` | Camiseta azul-clara de manga curta e bermuda azul-marinho, com tênis branco. |
| `roupa_macacao_jeans` | Macacão jeans azul de alças sobre uma camiseta branca de manga curta, com tênis branco. |
| `roupa_vestido_rosa` | Vestido rosa-claro de manga curta, faixa rosa mais escura na cintura e saia um pouco rodada até acima do joelho, meias brancas e tênis branco. |
| `roupa_conjunto_roxo` | Blusa roxa de manga curta e short roxo mais escuro, com tênis branco. |
| `roupa_moletom_vermelho` | Moletom vermelho de manga comprida com o capuz caído nas costas, sem cobrir a cabeça, e calça comprida cinza, com tênis branco. |
| `corpo_cadeira_pele_clara` | Mantenha a camiseta e o shorts brancos e sente a criança numa cadeira de rodas infantil vista de frente, mãos nos aros das rodas e pés no apoio. A cabeça continua no mesmo lugar e do mesmo tamanho. |

---

# 5. Os acessórios do rosto

Anexe o `crianca_rosto_redondos`. Desenhados no rosto, eles caem no lugar
certo sozinhos.

```
Use a imagem anexada e acrescente somente [ACESSÓRIO], mantendo todo o resto idêntico: o rosto, a cabeça, as orelhas, o corpo, a roupa, a pose, a posição, o tamanho, o enquadramento e o fundo verde. Sem cabelo. Mesmo traço fino e escuro do resto do desenho.
```

| arquivo | **[ACESSÓRIO]** |
|---|---|
| `crianca_acessorio_oculos` | um óculos infantil de armação redonda e fina, azul-petróleo, com lentes transparentes, no lugar certo em frente aos olhos e apoiado nas orelhas |
| `crianca_acessorio_aparelho_auditivo` | um aparelho auditivo infantil bege-claro atrás da orelha que fica no lado direito da imagem, com o gancho por cima da orelha |

---

# Se sair errado

| o que aparece | o que pedir de novo, na mesma conversa |
|---|---|
| a cabeça mudou de tamanho ou de lugar | "Mantenha a cabeça exatamente do tamanho e na posição da imagem anexada." |
| branco em volta da íris inteira | "A pálpebra de cima precisa cobrir um pouco o alto da íris." |
| cabelo parecendo peruca | "O cabelo nasce na pele da testa e cobre o crânio; não deixe vão entre o cabelo e a cabeça." |
| desenhou rosto no molde | "Sem rosto: só a pele lisa, sem olhos, nariz nem boca." |
| mudou a roupa ao fazer o cabelo | "Mude só o cabelo; roupa, corpo e rosto idênticos à imagem anexada." |
