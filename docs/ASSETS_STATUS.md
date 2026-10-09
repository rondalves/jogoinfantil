# Status da arte

O que já está no jogo e o que ainda sai como emoji. Atualizado com o jogo completo (20 missões, 5 mini games). O jogo funciona sem a arte que falta: o emoji entra no lugar.

Para preparar qualquer folha nova: `npm run assets`
(as artes cruas ficam em `C:\Users\rondj\Downloads\Imagens para jogo infantil`).

## Pronto

| mundo / tela | arte |
|---|---|
| Personagem | corpo em 6 tons de pele, versão sentada, macacão, cabelo cacheado em 6 cores, olhos |
| Interface | mascote, 6 botões, 5 ícones de mundo, cadeado, 5 broches, estrela cheia e vazia, ficha, moeda, medalha |
| Mundo 1 | missões 01 a 04 completas |
| Mundo 2 | missões 06 a 11 completas |
| Mundos 3, 4 e 5 | missões 12 a 20 completas |
| Mini games | kart, escalada, corredor, memória e céu das estrelas |
| App | ícone e splash gerados do `icone_app` enviado |
| Cenários | 14 fundos de tela |
| Corrida de kart | kart, rival, moeda, cone, poça, presente, bandeira e as 3 pistas |
| Escalada | fundo do cenário |

## Falta desenhar

Mesmo padrão das outras: **fundo verde chapado**, cartoon, sem texto na imagem.

| arquivo cru | onde aparece | hoje sai como |
|---|---|---|
| `m05_caderno`, `m05_lapis`, `m05_garrafinha`, `m05_uniforme`, `m05_tenis` | missão 05, montar a mochila | 📓 ✏️ 🧃 👕 👟 |
| `m10_bater` | missões 10, 11 e 15, cena errada | ✊ |
| `mg2_pedra` | escalada, obstáculo do degrau | 🪨 |
| `acessorio_aparelho_auditivo` | criador | 🦻 |
| `acessorio_capa` | criador | 🧥 |
| `acessorio_medalha` | criador | 🏅 |
| `logo` | abertura e capturas da loja | texto |

## Tudo o que já entrou

Todas as folhas da pasta estão recortadas e em uso: missões 01 a 20, os cinco
mini games, os cenários, o personagem, a interface e o ícone do app. São 215
arquivos em `assets/img`, somando 4,5 MB.

## Mais opções no criador de personagem

O criador monta a lista sozinho a partir do que existe em `assets/img`: cada
penteado novo vira uma opção, com as 6 cores, sem mexer em código.

Os prompts prontos para gerar no Gemini (18 penteados, de menina, de menino,
cacheado, crespo, ondulado, tranças, black power) estão em
[PROMPTS_CABELOS.md](PROMPTS_CABELOS.md).

## Cores

A arte crua vinha muito saturada para uma tela que a criança olha de perto por
muito tempo. O script lava tudo na preparação: objetos ficam com 72% da
saturação e um véu de 6% de branco; cenários, com 50% e 20%. Os números estão
no topo de [tools/preparar_assets.py](../tools/preparar_assets.py).
