# Prompts para gerar os cabelos no Gemini

Cole um prompt por vez. Gere **um arquivo por penteado**, sempre em **castanho
médio** — o jogo cria sozinho as 6 cores (preto, castanho escuro, castanho
claro, ruivo, grisalho e colorido) a partir desse único arquivo.

Salve com o nome exato da tabela, na pasta das imagens, e rode `npm run assets`.

---

## A regra que faz tudo encaixar

Três coisas precisam ser iguais em **todos** os arquivos, senão o cabelo não
assenta na cabeça:

1. Quadro **quadrado de 2048×2048**
2. **Fundo verde chapado** (#00FF00), sem sombra no fundo
3. O cabelo ocupa **a faixa de 3% a 36% da altura do quadro**, centralizado na
   horizontal — é onde fica a cabeça do personagem

E o mais importante para o problema que você viu: **o cabelo não pode cobrir o
rosto**. Ele é uma peça que vai *atrás e em volta* da cabeça.

---

## Prompt base (copie e troque só a parte do penteado)

> Ilustração 2D cartoon infantil de **apenas o cabelo**, sem cabeça, sem rosto,
> sem orelhas, sem pescoço, sem corpo. Vista de frente. Formato do cabelo como
> uma peruca vista de frente: o topo e as laterais cheios, e **o meio vazado em
> formato de rosto** (um buraco oval no centro onde o rosto aparece).
> **[PENTEADO AQUI]**. Cor castanho médio uniforme, com sombreado suave em tom
> mais escuro, sem mechas de outras cores. Contorno escuro fino e limpo, estilo
> de livro infantil, cores suaves e pouco saturadas. Fundo verde chapado
> #00FF00, sem sombra projetada no fundo. Imagem quadrada 2048x2048, cabelo
> centralizado ocupando a parte de cima do quadro.

---

## Penteados — meninas e unissex

| arquivo | troque **[PENTEADO AQUI]** por |
|---|---|
| `cabelo_cacheado_castanho` | Cachos bem definidos em espiral, volume médio, comprimento até o queixo, repartido ao meio |
| `cabelo_crespo_castanho` | Cabelo crespo afro, volumoso e arredondado em formato de nuvem, textura bem marcada |
| `cabelo_ondulado_castanho` | Ondas largas e suaves que caem até o ombro, com leve volume no topo |
| `cabelo_enrolado_castanho` | Cachos grandes e soltos, bem cheios, caindo um pouco abaixo do ombro |
| `cabelo_liso_longo_castanho` | Cabelo liso e brilhante, comprimento até o meio das costas, repartido ao meio |
| `cabelo_liso_curto_castanho` | Cabelo liso curto na altura da orelha, com franja reta |
| `cabelo_trancas_castanho` | Duas tranças laterais caindo na frente dos ombros, com repartido no meio |
| `cabelo_tranca_unica_castanho` | Uma trança única grossa caindo pela frente do ombro direito |
| `cabelo_coque_castanho` | Coque alto arredondado no topo da cabeça, com fios presos e lisos nas laterais |
| `cabelo_maria_chiquinha_castanho` | Dois rabinhos laterais presos na altura das orelhas |
| `cabelo_box_braids_castanho` | Tranças finas estilo box braids caindo até o ombro, com repartido quadriculado visível no topo |
| `cabelo_dreads_castanho` | Dreadlocks médios caindo até o ombro |

## Penteados — meninos

| arquivo | troque **[PENTEADO AQUI]** por |
|---|---|
| `cabelo_menino_curto_castanho` | Cabelo masculino curto e liso, com franja curta para o lado |
| `cabelo_menino_cacheado_castanho` | Cabelo masculino curto e cacheado, cachos pequenos e cheios no topo |
| `cabelo_menino_crespo_castanho` | Corte masculino crespo baixo, bem rente nas laterais e com volume curto no topo |
| `cabelo_menino_black_power_castanho` | Black power masculino, cabelo crespo redondo e volumoso |
| `cabelo_menino_espetado_castanho` | Cabelo masculino curto espetado para cima na frente |
| `cabelo_menino_tigelinha_castanho` | Corte masculino tigela, liso, com franja reta cobrindo a testa até acima das sobrancelhas |

---

## Depois que você me mandar os arquivos

Eu acrescento cada penteado na tabela do script e na lista `CABELOS` do
[src/personagem.ts](../src/personagem.ts). Aí cada um vira uma opção no criador,
com as 6 cores, sem mexer em mais nada.

## Se algum sair errado

Os erros mais comuns e o que acrescentar ao prompt:

- **Veio com rosto ou cabeça**: acrescente *"NÃO desenhe rosto, olhos, boca,
  nariz, orelhas nem pele. Apenas a massa de cabelo."*
- **O cabelo tapou o meio**: acrescente *"o centro do cabelo é vazado, como uma
  moldura oval; deixe o meio totalmente verde."*
- **Fundo com sombra ou degradê**: acrescente *"fundo verde #00FF00 totalmente
  chapado, uma única cor, sem textura e sem sombra."*
- **Cor muito viva**: acrescente *"cores suaves e dessaturadas, tom pastel."*

## Também falta (mesma regra de enquadramento)

| arquivo | prompt |
|---|---|
| `olhos_alegres_castanhos` | Apenas os olhos, sobrancelhas e a boca de uma criança de desenho animado. Olhos em arco, sorrindo, boca aberta num sorriso. Sem rosto, sem cabeça, sem pele em volta. Fundo verde #00FF00 chapado, 2048x2048 |
| `olhos_grandes_castanhos` | Apenas os olhos, sobrancelhas e a boca de uma criança de desenho animado. Olhos bem grandes e redondos com brilho, boca pequena sorrindo. Sem rosto, sem cabeça. Fundo verde #00FF00 chapado, 2048x2048 |
| `acessorio_aparelho_auditivo` | Apenas um aparelho auditivo infantil colorido, visto de lado, sem orelha e sem cabeça. Fundo verde #00FF00 chapado, 2048x2048 |
| `acessorio_capa` | Apenas uma capa de herói infantil vista de frente, presa por um fecho no colarinho, sem corpo. Fundo verde #00FF00 chapado, 2048x2048 |
| `mg2_pedra` | Apenas uma pedra cinza de desenho animado, arredondada, vista de frente. Fundo verde #00FF00 chapado, 2048x2048 |
| `m10_bater` | Apenas um punho fechado infantil de desenho animado, visto de frente, com tracinhos de impacto. Fundo verde #00FF00 chapado, 2048x2048 |
