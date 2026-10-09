# Próximos passos

Onde o projeto está hoje e o que falta para fechar a arte. Atualizado em
09/10/2026, depois do lote de 30 imagens do Gemini.

## Como está

| | |
|---|---|
| Arte no jogo | 401 arquivos em `assets/img`, 9,1 MB |
| Personagem | 7 tons de pele, 17 penteados × 9 cores, 4 pares de olhos, 6 acessórios |
| Missões | 20 completas; só 2 peças ainda saem como emoji |
| Mini games | 5, todos com arte |
| Ícone do app | refeito com a menina cacheada e a raposinha |
| Testes | `npm test` 14 ✅, `tsc` ✅, `npm run smoke` ✅ |

## As 7 imagens que faltam

Os prompts estão em [FILA_GEMINI.md](FILA_GEMINI.md), com o número do item.

| item | arquivo | o que é | sem ela |
|---|---|---|---|
| 9 | `cabelo_tranca_unica_castanho` | refazer: veio com o buraco do rosto branco (está em `_refazer/` na pasta das artes) | falta a opção "Trança" |
| 26 | `m03_terra` | canteiro de terra da missão 03 | sai 🪴 |
| 30 | `logo` | logotipo da abertura e da loja | sai texto |
| 34 | `cabelo_menino_raspado_castanho` | corte na máquina | falta a opção |
| 35 | `cabelo_menino_degrade_castanho` | degradê | falta a opção |
| 36 | `cabelo_menino_risco_castanho` | social com risco lateral | falta a opção |
| 37 | `cabelo_menino_moicano_castanho` | moicano curto | falta a opção |

Os quatro cortes novos já estão no catálogo do criador: assim que o arquivo
existir e o `npm run assets` rodar, a opção aparece sozinha, nas 9 cores.

## O caminho de uma imagem nova

```bash
python tools/renomear_fila.py --lote --pasta "C:\pasta\com\as\imagens\novas"
npm run assets
```

1. Gere no Gemini com o Gem de [GEM_ESTILO.md](GEM_ESTILO.md), na ordem da fila.
2. O renomeador mostra o plano (`arquivo → nome`) e só move depois do `s`.
   A pasta de origem precisa ser **diferente** da pasta das artes cruas.
3. `npm run assets` recorta, tira o verde, lava a cor e grava em `assets/img`.
4. Confira com `npm run smoke`.

Os itens 9, 26 e 30 estão marcados como pulados no `tools/fila_log.csv`: quando
chegarem, é mais rápido salvar com o nome exato na mão do que usar o lote.

## Três decisões abertas

**1. O cabelo pesa na abertura.** Os 153 arquivos de cabelo (17 penteados × 9
cores) somam 3,3 MB dos 4,7 MB que o jogo carrega antes da primeira tela. Cada
cor nova custa ~0,4 MB. A saída é parar de gerar uma cópia por cor e pintar em
tempo de execução (`setTint` do Phaser sobre um único arquivo em tons de
cinza): cairia para ~0,4 MB, e qualquer cor nova passaria a sair de graça. O
preço é depender de WebGL — no Canvas o `setTint` não pinta, e o cabelo sairia
cinza. Em celular Android com WebView atual isso não acontece.

**2. A professora não tem lugar.** `m07_professora` está pronta em
`assets/img`, mas a missão 07 não tem nenhum campo que a mostre. Precisa
decidir onde ela entra (um figurante fixo na cena? o alvo da etapa de levantar
a mão?) antes de virar código.

**3. O logo não é carregado por ninguém.** Nenhuma cena pede a textura `logo`.
Depois de gerar o arquivo, falta uma linha na abertura
([src/scenes/Boot.ts](../src/scenes/Boot.ts)) para desenhá-lo.

## O que entra sozinho e o que precisa de código

Entra sozinho, só gerando o arquivo e rodando `npm run assets`:
penteados, olhos, acessórios, cenários (`bg_*`) e qualquer peça já citada num
JSON de missão.

Precisa de código: objeto novo que ainda não tem `"img"` no JSON da missão,
peça nova de mini game, o logo, e qualquer arquivo cru que não esteja na tabela
`FOLHAS`/`SOLTAS` de [tools/preparar_assets.py](../tools/preparar_assets.py).

## Antes de publicar

- `npm run build` e `npm test`
- `npm run smoke` (precisa do `npm run preview` rodando)
- `npm run capturas` para refazer as imagens da loja
- `npm run android:sync` e o passo a passo de [PUBLICAR.md](PUBLICAR.md)
