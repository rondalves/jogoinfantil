# Status da arte

O que já está no jogo e o que ainda sai como emoji. Atualizado com o jogo completo (20 missões, 5 mini games). O jogo funciona sem a arte que falta: o emoji entra no lugar.

Para preparar qualquer folha nova: `npm run assets`
(as artes cruas ficam em `C:\Users\rondj\Downloads\Imagens para jogo infantil`).

## Pronto

| mundo / tela | arte |
|---|---|
| Personagem | corpo em 7 tons de pele, versão sentada, macacão, **17 penteados em 9 cores cada**, 4 pares de olhos |
| Acessórios | óculos, boné, laço, aparelho auditivo, capa e medalha |
| Interface | mascote, 6 botões, 5 ícones de mundo, cadeado, 5 broches, estrela cheia e vazia, ficha, moeda, medalha |
| Mundo 1 | missões 01 a 04 completas |
| Mundo 2 | missões 06 a 11 completas |
| Mundos 3, 4 e 5 | missões 12 a 20 completas |
| Mini games | kart, escalada, corredor, memória e céu das estrelas |
| App | ícone e splash refeitos com a menina cacheada e a raposinha |
| Cenários | 14 fundos de tela (a sala de aula agora é uma sala de aula de verdade) |
| Missão 05 | caderno, lápis, garrafinha, uniforme, tênis e pente |
| Missões 10 e 11 | punho da cena errada |
| Corrida de kart | kart, rival, moeda, cone, poça, presente, bandeira e as 3 pistas |
| Escalada | fundo do cenário e a pedra do obstáculo |

## Falta desenhar

Mesmo padrão das outras: **fundo verde chapado**, cartoon, sem texto na imagem.

| item da fila | arquivo cru | onde aparece | hoje sai como |
|---|---|---|---|
| 9 | `cabelo_tranca_unica_castanho` | criador, penteado "Trança" | **refazer**: o buraco do rosto veio branco (está em `_refazer/`) |
| 26 | `m03_terra` | missão 03, brincar na terra | 🪴 |
| 30 | `logo` | abertura e capturas da loja | texto |
| 34 | `cabelo_menino_raspado_castanho` | criador, "Raspadinho" | a opção não aparece |
| 35 | `cabelo_menino_degrade_castanho` | criador, "Degradê" | a opção não aparece |
| 36 | `cabelo_menino_risco_castanho` | criador, "Risquinho" | a opção não aparece |
| 37 | `cabelo_menino_moicano_castanho` | criador, "Moicano" | a opção não aparece |

`m07_professora` já está em `assets/img`, mas ainda não aparece: a missão 07
não tem lugar para ela nos dados. Ver [PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md).

A lista completa do que falta, com o prompt de cada um, está em
[PROMPTS_PENDENTES.md](PROMPTS_PENDENTES.md). Os cenários da sala de aula e
da rua ficaram em [PROMPTS_CENARIOS.md](PROMPTS_CENARIOS.md).

A fila e os prompts estão em [FILA_GEMINI.md](FILA_GEMINI.md) (30 dos 37 itens
já entraram), o estilo fixo do Gem em [GEM_ESTILO.md](GEM_ESTILO.md), e
`python tools/renomear_fila.py` dá o nome certo a cada imagem gerada.

## Tudo o que já entrou

Todas as folhas da pasta estão recortadas e em uso: missões 01 a 20, os cinco
mini games, os cenários, o personagem, a interface e o ícone do app. São 401
arquivos em `assets/img`, somando 9,1 MB — destes, 4,7 MB entram no
carregamento da abertura, e 3,3 MB são só os 153 arquivos de cabelo. Esse peso
é a decisão nº 1 de [PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md).

## Mais opções no criador de personagem

O criador monta a lista sozinho a partir do que existe em `assets/img`: cada
penteado novo vira uma opção, com as 6 cores, sem mexer em código.

O catálogo tem 22 penteados e 17 já têm arte; faltam a trança única (refazer) e
os quatro cortes curtos de menino. São 9 cores de cabelo e 7 tons de pele, todos
gerados de um arquivo só por penteado. Os prompts estão em
[FILA_GEMINI.md](FILA_GEMINI.md).

## Cores

A arte crua vinha muito saturada para uma tela que a criança olha de perto por
muito tempo. O script lava tudo na preparação: objetos ficam com 72% da
saturação e um véu de 6% de branco; cenários, com 50% e 20%. Os números estão
no topo de [tools/preparar_assets.py](../tools/preparar_assets.py).
