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

Cada arquivo novo vira uma opção, sem mexer no código:

- **Penteados**: `cabelo_<estilo>_castanho` (liso curto, liso longo, crespo, tranças, coque)
- **Olhos**: `olhos_<tipo>_castanhos` (alegres, grandes, sonolentos)
- **Roupas**: um corpo inteiro vestido, como o macacão

Depois acrescente o nome em `FOLHAS` (script) e na lista `CABELOS` / `OLHOS` /
`ROUPAS` de [src/personagem.ts](../src/personagem.ts).
