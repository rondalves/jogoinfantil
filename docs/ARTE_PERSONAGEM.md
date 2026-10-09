# A arte do personagem

O personagem é montado por camadas, cada uma um arquivo com **fundo verde
chapado (#00FF00)**. Depois de salvar na pasta das artes cruas e rodar
`npm run assets`, o criador acha a opção nova sozinho — não precisa mexer em
código, desde que o nome siga a tabela abaixo.

## Regra de ouro: tudo no mesmo enquadramento

Todas as camadas precisam sair **no mesmo quadro, com a cabeça exatamente no
mesmo lugar e do mesmo tamanho**. O jeito mais seguro é gerar todas a partir da
mesma imagem base, só trocando o que muda.

- Quadrado, 2048×2048
- Criança de corpo inteiro, de frente, braços abertos, centralizada
- A cabeça ocupa a faixa de 5% a 33% da altura do quadro
- Traço cartoon limpo, contorno escuro fino, sombreado chapado

## As camadas

| camada | arquivo cru | o jogo gera |
|---|---|---|
| Corpo | `corpo_base_pele_clara` | 7 tons de pele |
| Corpo sentado | `corpo_cadeira_pele_clara` | 7 tons |
| Macacão | `roupa_macacao_jeans` | 7 tons |
| Olhos e boca | `olhos_<id>_castanhos` | uma opção no criador |
| Cabelo | `cabelo_<id>_castanho` | 9 cores a partir do castanho |
| Acessório | `acessorio_<id>` | a peça, sem recolorir |

O `<id>` tem que bater com o catálogo de
[src/personagem.ts](../src/personagem.ts) (`CATALOGO_CABELOS`,
`CATALOGO_OLHOS`, `ACESSORIOS`) e com as listas `CABELOS`, `OLHOS` e `SOLTAS`
de [tools/preparar_assets.py](../tools/preparar_assets.py). Id que não está nos
dois lugares não vira opção.

Os prompts prontos, com o texto exato para cada camada, estão em
[FILA_GEMINI.md](FILA_GEMINI.md).

## Cabelo: o erro que mais acontece

O cabelo é uma peça que vai **atrás e em volta** da cabeça: o meio é vazado em
formato de rosto, um buraco oval que precisa ficar **verde**. Se o centro vier
branco ou com pele, o jogo desenha uma mancha no lugar da cara. Confira o
centro antes de aceitar a imagem.

Gere sempre em **castanho médio**: as 9 cores saem desse arquivo único.

## Hoje no jogo

7 tons de pele, 17 penteados em 9 cores, 4 pares de olhos, 6 acessórios, corpo
em pé, sentado e de macacão. O que falta está em
[PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md).
