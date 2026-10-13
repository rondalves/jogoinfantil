# Próximos passos: o beta

Conferido no código em 12/10/2026. O jogo está jogável de ponta a ponta, sem
arte faltando. O que falta está em três grupos.

## Onde estamos

| | |
|---|---|
| Conteúdo | 28 missões em 6 mundos, 6 joguinhos (um por mundo), 6 historinhas |
| Arte | 646 arquivos em `assets/img` (8,3 MB); nenhuma arte pedida faltando |
| Personagem | desenhado por código: 7 tons de pele, 6 roupas, 5 rostos, 29 cabelos × 9 cores, laço e capa |
| Android | `com.colostudio.rotinafeliz`, versionCode 1, targetSdk 36, chave de assinatura criada, voltar do celular tratado |
| Loja | ficha, ícone, imagem de destaque e 6 capturas em `store/screenshots/` prontos com o nome Rotina Feliz |
| Verificação | `tsc` ✅ · `npm test` 33 ✅ · `npm run smoke` 28 missões e 14 telas ✅ |

## 1. Para enviar o beta (Play Console)

- [ ] `npm run android:build` gera o `.aab` assinado em `android/app/build/outputs/bundle/release/`.
      Cada envio novo precisa de um `versionCode` maior em `android/app/build.gradle`.
- [ ] Instalar o APK de lançamento (`npm run android:apk`) uma vez no celular antes de subir.
- [ ] Criar o app na Play Console, colar a ficha de [FICHA_LOJA.md](FICHA_LOJA.md),
      subir ícone, destaque (`assets-loja/`) e as capturas.
- [ ] Questionários: segurança dos dados (não coleta nada), público infantil
      (Famílias), classificação (Livre), sem anúncios.
- [ ] Teste interno primeiro. Se a conta de desenvolvedor for pessoal e nova,
      a produção exige **teste fechado com 12 testadores por 14 dias** ([PUBLICAR.md](PUBLICAR.md)).

- [ ] **Compra**: criar o produto `rotinafeliz.mundos.completos` (R$ 4,99, não
      consumível) e cadastrar os testadores de licença; depois testar no celular
      comprar, reabrir e restaurar ([MONETIZACAO.md](MONETIZACAO.md)). Os
      mundos 5 e 6 já estão trancados no app, e a loja já está ligada
      (`LojaPlugin.java`, Play Billing 8).

## 2. O que muda o que os testadores vão achar

| o que | situação | roteiro |
|---|---|---|
| Testar no celular os joguinhos novos | moto, encaixe, quebra-cabeça e memória de 16 cartas foram conferidos só no navegador, com mouse | tocar com os dois dedos na moto (freio + acelerador) |
| Voz | 0 de 462 falas gravadas; sem gravação a frase fica só no texto (o jogo não usa voz sintética) | gravar primeiro as ~200 frases de interface, tutorial e joguinhos (`assets/audio/narracao.csv`, [GRAVAR_VOZES.md](GRAVAR_VOZES.md)); as 255 das missões vão chegando |
| Música | silêncio em todas as telas | a do menu e uma de mundo já mudam a sensação; prompts em [MUSICA.md](MUSICA.md) |
| Historinhas | 6 gravadas, com cantiga por baixo; vão ser regravadas | [HISTORIAS.md](HISTORIAS.md) |

## 3. Depois do beta

- As 14 historinhas novas (07 a 20), parte da compra: gravar e entrar como
  `src/stories/07-*.json` em diante, marcadas como pagas ([MONETIZACAO.md](MONETIZACAO.md)).
- Vídeos das historinhas em livro animado ([VIDEOS_HISTORIAS.md](VIDEOS_HISTORIAS.md)),
  depois da regravação.
- `m07_professora` está pronta mas nenhuma missão mostra; o `logo` existe mas a
  abertura escreve o nome em texto; o código antigo de recorte do personagem em
  `tools/preparar_assets.py` pode sair.
