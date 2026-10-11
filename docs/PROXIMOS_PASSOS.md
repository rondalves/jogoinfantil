# Próximos passos

O que falta para o jogo ficar pronto. Conferido no código em 11/10/2026.

## Onde estamos

| | |
|---|---|
| Conteúdo | 28 missões em 6 mundos, 5 mini games de ficha, 4 joguinhos de prêmio, 6 historinhas |
| Arte | 646 arquivos em `assets/img` (8,3 MB); nenhuma arte pedida faltando |
| Personagem | desenhado por código: 7 tons de pele, 6 roupas, 5 rostos, 29 cabelos × 9 cores, laço e capa |
| Android | `com.rotininha.missoesdodia`, versionCode 1, targetSdk 36, chave de assinatura criada |
| Verificação | `tsc` ✅ · `npm test` 26 ✅ · `npm run smoke` 28 missões, 5 mini games e 12 telas ✅ |

## 1. O jogo em si

| o que | situação | o que fazer |
|---|---|---|
| **Joguinhos de prêmio** | prontos: corrida de kart sem fim (até acabarem as vidas), jogo da memória sem fim, colorir (6 bichinhos) e estoura-bolhas, um por mundo do 1 ao 4. Passou do tempo do dia (padrão 15 min, ajustável no painel dos pais), aparece "já fez as suas tarefas?" e só um adulto libera mais 10 min | os mundos 5 e 6 ficam sem joguinho de prêmio; dá para criar mais um ou dois |
| **Nome** | a abertura diz "Rotina Feliz"; o ícone, a loja e os textos ainda dizem "Rotininha" | decidir o nome e trocar tudo junto (o id do pacote não muda) |
| **Compra dos mundos** | os 6 mundos estão livres de propósito, para o teste; o pagamento não está ligado | se for cobrar: plugin de compra no Android, produto `rotininha.mundos.completos` na Play Console e `MUNDOS_LIVRES` de volta para 2. Dá também para lançar grátis e cobrar numa atualização |

## 2. Áudio (o principal que falta)

Sem gravação, cada fala sai na voz do celular, que muda de aparelho para
aparelho; sem música, as telas ficam em silêncio. Nada quebra.

| o que | quanto | roteiro |
|---|---|---|
| Falas do jogo | 450: 364 de adulto e 86 da raposinha | `assets/audio/narracao.csv`, [GRAVAR_VOZES.md](GRAVAR_VOZES.md) |
| Voz masculina | as mesmas 364 de adulto, com `_m` no nome | opcional: dá para lançar só com a feminina |
| Música | 7 faixas em loop e 1 de 30 s para o timer | [MUSICA.md](MUSICA.md), com prompt de gerador por faixa |
| Historinhas | 6, que vão ser regravadas | [HISTORIAS.md](HISTORIAS.md) |

## 3. Para publicar

1. Gerar o `.aab` assinado e subir para **teste interno** ([PUBLICAR.md](PUBLICAR.md)).
2. Refazer as capturas da loja: as de `store/screenshots/` são de 10/10, com o
   personagem antigo (`npm run capturas`).
3. Ficha da loja ([FICHA_LOJA.md](FICHA_LOJA.md)) com o nome decidido.
4. Questionários da Play Console: segurança dos dados (não coleta nada), público
   infantil (Famílias), classificação indicativa, sem anúncios. A política de
   privacidade já está no ar.
5. Se a conta de desenvolvedor for pessoal e nova, a Play exige um **teste
   fechado com pelo menos 12 pessoas por 14 dias** antes de liberar a produção.

## 4. Refinamento, depois

- Ajustes de arte que aparecerem no teste com as crianças.
- `m07_professora` está pronta mas nenhuma missão mostra; o `logo` existe mas a
  abertura escreve o nome em texto.
- O código antigo de recorte do personagem em `tools/preparar_assets.py` não é
  mais usado (o personagem sai de `tools/personagem.mjs`) e pode sair.
- Os vídeos das historinhas em livro animado ([VIDEOS_HISTORIAS.md](VIDEOS_HISTORIAS.md)),
  depois da regravação.
