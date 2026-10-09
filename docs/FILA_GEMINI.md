# Fila de geração no Gemini

A ordem é a desta página. Gere **um item por vez, de cima para baixo**, e não
mude a ordem: o renomeador (`tools/renomear_fila.py`) dá nome aos arquivos que
caem no Downloads seguindo exatamente esta numeração.

Como usar:

1. Abra o Gem com as instruções de [GEM_ESTILO.md](GEM_ESTILO.md).
2. Copie o bloco de código do item, cole no Gemini, baixe a imagem.
3. Dê nome aos arquivos com o renomeador, de um destes dois jeitos:

**Já gerou tudo e guardou numa pasta** — renomeia de uma vez, na ordem da data
de cada arquivo, mostrando o plano antes de mexer:

```bash
python tools/renomear_fila.py --lote --pasta "C:\caminho\da\sua\pasta"
```

A pasta tem que ser só das imagens novas, diferente da pasta das artes cruas.

**Gerando aos poucos** — deixa vigiando o Downloads enquanto você baixa:

```bash
python tools/renomear_fila.py
```

Se pular um item, rode `python tools/renomear_fila.py --pular 1` antes de baixar
o próximo. `--voltar` desfaz o último.

Itens marcados **folha** trazem vários objetos numa imagem só; o
`npm run assets` corta sozinho.

Faltam **30 itens**: 2 rostos, 17 cabelos, 3 acessórios, 1 cenário e 7 objetos.

---

## Rostos

### 1 — olhos_alegres_castanhos

```
Ilustração 2D cartoon infantil de apenas os olhos, as sobrancelhas e a boca de uma criança, sem rosto, sem cabeça, sem pele em volta, sem orelhas, sem cabelo. Olhos castanhos em arco, sorrindo, cílios curtos, sobrancelhas finas, e uma boca aberta num sorriso alegre. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048, o conjunto centralizado ocupando a faixa de 10% a 45% da altura do quadro.
```

### 2 — olhos_grandes_castanhos

```
Ilustração 2D cartoon infantil de apenas os olhos, as sobrancelhas e a boca de uma criança, sem rosto, sem cabeça, sem pele em volta, sem orelhas, sem cabelo. Olhos castanhos bem grandes e redondos com um ponto de brilho, cílios curtos, sobrancelhas finas, e uma boca pequena sorrindo fechada. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048, o conjunto centralizado ocupando a faixa de 10% a 45% da altura do quadro.
```

---

## Cabelos

Todos em **castanho médio**: o jogo gera as 6 cores a partir de um arquivo só.

### 3 — cabelo_crespo_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Cabelo crespo afro, volumoso e arredondado em formato de nuvem, textura bem marcada. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 4 — cabelo_ondulado_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Ondas largas e suaves que caem até o ombro, com leve volume no topo. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 5 — cabelo_enrolado_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Cachos grandes e soltos, bem cheios, caindo um pouco abaixo do ombro. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 6 — cabelo_liso_longo_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Cabelo liso e brilhante, comprimento até o meio das costas, repartido ao meio. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 7 — cabelo_liso_curto_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Cabelo liso curto na altura da orelha, com franja reta. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 8 — cabelo_trancas_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Duas tranças laterais caindo na frente dos ombros, com repartido no meio. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 9 — cabelo_tranca_unica_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Uma trança única grossa caindo pela frente do ombro direito. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 10 — cabelo_coque_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Coque alto arredondado no topo da cabeça, com fios presos e lisos nas laterais. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 11 — cabelo_maria_chiquinha_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Dois rabinhos laterais presos na altura das orelhas. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 12 — cabelo_box_braids_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Tranças finas estilo box braids caindo até o ombro, com repartido quadriculado visível no topo. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 13 — cabelo_dreads_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Dreadlocks médios caindo até o ombro. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 14 — cabelo_menino_curto_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Cabelo masculino curto e liso, com franja curta para o lado. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 15 — cabelo_menino_cacheado_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Cabelo masculino curto e cacheado, cachos pequenos e cheios no topo. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 16 — cabelo_menino_crespo_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Corte masculino crespo baixo, bem rente nas laterais e com volume curto no topo. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 17 — cabelo_menino_black_power_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Black power masculino, cabelo crespo redondo e volumoso. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 18 — cabelo_menino_espetado_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Cabelo masculino curto espetado para cima na frente. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 19 — cabelo_menino_tigelinha_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Corte masculino tigela, liso, com franja reta cobrindo a testa até acima das sobrancelhas. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

---

## Acessórios

### 20 — acessorio_aparelho_auditivo

```
Ilustração 2D cartoon infantil de apenas um aparelho auditivo infantil colorido, visto de lado, sem orelha, sem cabeça e sem pessoa. Peça pequena em azul claro com detalhe amarelo, gancho que passa atrás da orelha e tubinho transparente. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048, a peça centralizada ocupando cerca de metade do quadro.
```

### 21 — acessorio_capa

```
Ilustração 2D cartoon infantil de apenas uma capa de herói infantil vista de frente, presa por um fecho redondo no colarinho, esvoaçando um pouco para os lados. Sem corpo, sem cabeça, sem braços. Vermelha com forro amarelo claro. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048, a capa centralizada ocupando a altura do quadro.
```

### 22 — acessorio_medalha

```
Ilustração 2D cartoon infantil de apenas uma medalha de ouro vista de frente, com fita listrada azul e branca em formato de V e um disco dourado redondo com uma estrela em relevo, sem texto e sem números. Sem corpo, sem pescoço, sem pessoa. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048, a medalha centralizada ocupando a altura do quadro.
```

---

## Cenários

### 23 — bg_sala_aula

Substitui o arquivo atual, que é uma cozinha. **Cenário não leva fundo verde.**

```
Ilustração 2D cartoon infantil de uma sala de aula de educação infantil vista de frente, vazia, sem nenhuma pessoa. Ao fundo, um quadro verde limpo sem nada escrito, um mapa colorido sem letras, prateleiras baixas com livros e caixas de brinquedo, e uma janela grande com luz do dia. Carteirinhas pequenas de madeira clara organizadas nas laterais, deixando o centro e a parte de baixo da imagem livres, só com o chão. Tapete colorido no chão. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas, tom calmo. Sem texto, sem letras, sem números em lugar nenhum. Imagem em pé, proporção 9:16, 1080x1920.
```

---

## Objetos

### 24 — m05_mochila_itens — **folha**, 5 peças

Uma imagem só com 5 objetos: **linha de cima** caderno, lápis, garrafinha;
**linha de baixo** uniforme, tênis. A ordem importa — é assim que o
`npm run assets` nomeia os recortes.

```
Ilustração 2D cartoon infantil de 5 objetos escolares separados e bem espaçados, sem se tocarem, sobre fundo verde chapado #00FF00. Dispostos em duas linhas: na linha de cima, da esquerda para a direita, um caderno fechado de capa colorida, um lápis amarelo apontado e uma garrafinha de água infantil com tampa; na linha de baixo, da esquerda para a direita, uma camiseta de uniforme escolar dobrada e um par de tênis infantil. Cada objeto visto de frente, inteiro, sem mãos e sem pessoas, sem texto e sem letras em nenhum deles. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde #00FF00 totalmente chapado, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048, com margem verde larga entre os objetos e nas bordas.
```

### 25 — m05_pente

```
Ilustração 2D cartoon infantil de apenas um pente e uma escova de cabelo infantil, vistos de frente, lado a lado e separados, sem mãos e sem pessoas. Cabo colorido em tom suave. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.
```

### 26 — m03_terra

```
Ilustração 2D cartoon infantil de um canteiro de terra com uma plantinha pequena e uma pá de brinquedo, visto de frente, sem mãos e sem pessoas. Terra marrom fofa, estilo de livro infantil, contorno escuro fino e limpo, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.
```

### 27 — m07_professora

```
Ilustração 2D cartoon infantil de uma professora adulta sentada numa cadeira, vista de frente, corpo inteiro, sorrindo de forma acolhedora, com um livro aberto no colo. Roupa simples e colorida em tom suave. Sem mesa, sem parede, sem chão, só a professora e a cadeira. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048, a professora centralizada ocupando a altura do quadro.
```

### 28 — m10_bater

```
Ilustração 2D cartoon infantil de apenas um punho fechado infantil visto de frente, com três tracinhos curtos de impacto em volta, sem braço, sem corpo e sem pessoa. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.
```

### 29 — mg2_pedra

```
Ilustração 2D cartoon infantil de apenas uma pedra cinza arredondada vista de frente, com duas ou três marcas claras de textura. Sem chão, sem grama, sem pessoas. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048.
```

### 30 — logo

Único item em que **o texto é obrigatório**. Confira a grafia antes de salvar.

```
Logotipo cartoon infantil com as palavras "Missões do Dia" em duas linhas, letras gordinhas e arredondadas, amarelo com contorno escuro grosso, levemente em arco. Acima das palavras, uma estrela e uma raposinha laranja pequena espiando por trás da letra. Sem moldura e sem fundo decorado. Grafia exata: Missões do Dia, com acento no "o" de Missões. Estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048, o logotipo centralizado.
```

---

## Lote 2 — o cabelo e o sorriso dela

### 31 — cabelo_cacheado_castanho

Substitui o cacheado que já está no jogo (o atual tapa o rosto). Anexe a foto
dela junto com o prompt, se o Gemini deixar.

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo e as laterais cheios, e o meio vazado em formato de rosto (um buraco oval no centro onde o rosto aparece). Cachos bem definidos em espiral, de tamanho médio, muito volumosos nas laterais, abrindo em formato de triângulo arredondado; bastante volume no alto da cabeça, sem risco de repartido, com alguns cachinhos soltos saindo do contorno; comprimento até um pouco abaixo dos ombros. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 32 — olhos_sorriso_castanhos

O sorriso aberto, com os dentinhos de cima aparecendo.

```
Ilustração 2D cartoon infantil de apenas os olhos, as sobrancelhas e a boca de uma criança, sem rosto, sem cabeça, sem pele em volta, sem orelhas, sem cabelo. Olhos castanhos escuros grandes e levemente apertados de tanto sorrir, com cílios curtos e sobrancelhas finas e arqueadas. Boca num sorriso largo e aberto, cantos bem levantados, mostrando a fileira de dentinhos de cima, brancos e juntos, e um pouco de língua ao fundo. Expressão alegre e espontânea. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, uma cor só, sem sombra projetada no fundo. Imagem quadrada 2048x2048, o conjunto centralizado ocupando a faixa de 10% a 45% da altura do quadro.
```

### 33 — icone_app

**Não leva fundo verde**: o ícone da loja tem fundo opaco, 1024x1024.

```
Ícone de aplicativo infantil, ilustração 2D cartoon, quadrado 1024x1024, sem texto e sem letras. Uma menina de uns 5 anos em close do rosto e dos ombros, de frente, com cabelo cacheado castanho escuro bem volumoso e cachos em espiral até abaixo dos ombros, pele clara levemente morena, sorrindo largo com os dentinhos de cima aparecendo e os olhos apertadinhos de alegria. Ao lado dela, menor e um pouco atrás, uma raposinha laranja de desenho animado espiando e sorrindo. Fundo circular em azul-claro suave com uma estrela amarela discreta atrás dos dois, sem moldura e sem borda. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Os dois personagens centralizados e grandes no quadro, com folga nas bordas para o recorte do ícone.
```

---

## Lote 3 — cortes de menino bem curtos

Mesma regra dos outros cabelos: castanho médio, peça vazada no meio, fundo
verde. Em corte curto o buraco do rosto é **grande**: o cabelo é uma faixa fina
em volta do alto da cabeça, nada de massa cobrindo a testa inteira.

### 34 — cabelo_menino_raspado_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: uma faixa fina que acompanha o alto da cabeça, e o meio vazado em formato de rosto (um buraco oval grande no centro onde o rosto aparece). Corte masculino raspado na máquina, bem rente ao couro cabeludo em toda a cabeça, contorno do cabelo baixo e reto na testa, textura lisa e uniforme, sem volume nenhum. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 35 — cabelo_menino_degrade_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo cheio e as laterais bem finas, e o meio vazado em formato de rosto (um buraco oval grande no centro onde o rosto aparece). Corte masculino degradê: laterais raspadas bem rentes e claras, que vão escurecendo e engrossando até um topo curto e cheinho, penteado para cima, com a transição suave entre os dois. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 36 — cabelo_menino_risco_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: o topo cheio e as laterais curtas, e o meio vazado em formato de rosto (um buraco oval grande no centro onde o rosto aparece). Corte masculino social curto, liso, penteado para o lado, com um risco lateral bem marcado como uma linha raspada no lado esquerdo, laterais curtas e topo um pouco mais comprido caindo de lado. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

### 37 — cabelo_menino_moicano_castanho

```
Ilustração 2D cartoon infantil de apenas o cabelo, sem cabeça, sem rosto, sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como uma peruca vista de frente: uma faixa de cabelo no meio do alto da cabeça com as laterais raspadas, e o meio vazado em formato de rosto (um buraco oval grande no centro onde o rosto aparece). Moicano infantil curto e divertido: uma crista de cabelo espetada no centro do topo, de altura média, com as laterais bem raspadas e lisas. Cor castanho médio uniforme, com sombreado suave em tom mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo centralizado ocupando a parte de cima do quadro.
```

---

## Se algum sair errado

- **Veio com rosto ou cabeça**: acrescente *"NÃO desenhe rosto, olhos, boca,
  nariz, orelhas nem pele. Apenas a massa de cabelo."*
- **O cabelo tapou o meio**: acrescente *"o centro do cabelo é vazado, como uma
  moldura oval; deixe o meio totalmente verde."*
- **Fundo com sombra ou degradê**: acrescente *"fundo verde #00FF00 totalmente
  chapado, uma única cor, sem textura e sem sombra."*
- **Cor muito viva**: acrescente *"cores suaves e dessaturadas, tom pastel."*
- **Os objetos da folha se encostaram**: acrescente *"deixe um espaço largo de
  fundo verde entre cada objeto."*

## Depois de cada lote

```bash
npm run assets
```

A folha do item 24 pode sair com os recortes fora de ordem. Para conferir:

```bash
python tools/preparar_assets.py --fatias m05_mochila_itens
```

O contato numerado sai em `tools/_fatias/`. Se a ordem estiver trocada, eu
ajusto a tabela `FOLHAS` em [tools/preparar_assets.py](../tools/preparar_assets.py).

Cabelos, olhos e acessórios entram no criador sozinhos. Os objetos de missão
(itens 24 a 28) só aparecem depois que eu acrescentar o `"img"` no JSON da
missão, e o `logo` depois de uma linha no `Boot.ts` — me avise quando o lote
estiver pronto.
