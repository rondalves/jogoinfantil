# Status da arte

O que já está no jogo e o que ainda sai como emoji. Atualizado no bloco A
(mundo 2). O jogo funciona sem a arte que falta: o emoji entra no lugar.

Para preparar qualquer folha nova: `npm run assets`
(as artes cruas ficam em `C:\Users\rondj\Downloads\Imagens para jogo infantil`).

## Pronto

| mundo / tela | arte |
|---|---|
| Personagem | corpo em 6 tons de pele, versão sentada, macacão, cabelo cacheado em 6 cores, olhos |
| Interface | mascote, 6 botões, 5 ícones de mundo, cadeado, 5 broches, estrela cheia e vazia, ficha, moeda, medalha |
| Mundo 1 | missões 01 a 04 completas |
| Mundo 2 | missões 06 a 11 completas |
| Cenários | 14 fundos de tela |
| Corrida de kart | kart, rival, moeda, cone, poça, presente, bandeira e as 3 pistas |
| Escalada | fundo do cenário |

## Falta desenhar

Mesmo padrão das outras: **fundo verde chapado**, cartoon, sem texto na imagem.

| arquivo cru | onde aparece | hoje sai como |
|---|---|---|
| `m05_ir_escola` (folha) | missão 05: mochila, caderno, lápis, garrafinha, uniforme, tênis | 🎒 📓 ✏️ 🧃 👕 👟 |
| `m01_prato` | missão 01, montar o café | 🍽️ |
| `m01_pnp_certa` / `m01_pnp_errada` | missão 01, Pode ou Não Pode | 🪥 🍰 |
| `m10_bater` | missões 10 e 11, cena errada | ✊ |
| `mg2_pedra` | escalada, obstáculo do degrau | 🪨 |
| `acessorio_oculos` | criador de personagem | 👓 |
| `acessorio_aparelho_auditivo` | criador | 🦻 |
| `acessorio_bone` | criador | 🧢 |
| `acessorio_laco` | criador | 🎀 |
| `acessorio_capa` | criador | 🧥 |
| `acessorio_medalha` | criador | 🏅 |
| `icone_app` 1024×1024 **fundo opaco** | ícone da loja | — |
| `logo` | abertura e capturas da loja | texto |

## Folhas já na pasta, ainda não usadas

Entram nos próximos blocos, é só acrescentar na tabela `FOLHAS` do script:

| folha | bloco |
|---|---|
| `m12_carro` | B — mundo 3 |
| `mg3_corredor`, `mg3_itens_corredor` | B — corredor infinito |
| `m13_almoco`, `m15_brinquedos`, `m16_guardar`, `m17_ajudante_casa`, `m18_tela` | C — mundo 4 |
| `m19_noite`, `m20_medico_dentista` | D — mundo 5 |

## Mais opções no criador de personagem

Cada arquivo novo vira uma opção, sem mexer no código:

- **Penteados**: `cabelo_<estilo>_castanho` (liso curto, liso longo, crespo, tranças, coque)
- **Olhos**: `olhos_<tipo>_castanhos` (alegres, grandes, sonolentos)
- **Roupas**: um corpo inteiro vestido, como o macacão

Depois acrescente o nome em `FOLHAS` (script) e na lista `CABELOS` / `OLHOS` /
`ROUPAS` de [src/personagem.ts](../src/personagem.ts).
