# Próximos passos

Estado do projeto e o caminho até a Play Store. Atualizado em 09/10/2026.

## Pronto para subir em teste

O APK de release compila e o jogo roda inteiro. Tudo o que ainda falta de arte
e de som tem substituto automático — emoji, texto ou silêncio — então nada
quebra na mão da criança.

| | |
|---|---|
| Conteúdo | 28 missões em 6 mundos, 5 mini games |
| Arte | 461 arquivos em `assets/img`, 8,7 MB |
| Personagem | 7 tons de pele, 20 penteados × 9 cores, 4 pares de olhos, 6 roupas, 6 acessórios |
| Pacote | `com.rotininha.missoesdodia`, versionCode 1, versionName 1.0 |
| APK de release | 15 MB, sai com `npm run android:apk` |
| Verificação | `tsc` ✅ · `npm test` 19 ✅ · `npm run smoke` 28 missões, 5 mini games e 6 telas ✅ |

## O que falta, e o que aparece no lugar

| falta | hoje sai como | prompt |
|---|---|---|
| 7 peças de missão (`m24_chuveiro`, `m24_sabonete`, `m25_pente`, `m26_musica`, `m19_luz`, `m19_historia`, `m10_amigos`) | emoji | [PROMPTS_PENDENTES.md](PROMPTS_PENDENTES.md) |
| 6 capas de historinha | cartão sem imagem | [PROMPTS_PENDENTES.md](PROMPTS_PENDENTES.md) |
| `m03_terra`, `m06_pnp_certa`, `m06_pnp_errada` | emoji | [PROMPTS_PENDENTES.md](PROMPTS_PENDENTES.md) |
| `logo` | o nome em texto na abertura | [FILA_GEMINI.md](FILA_GEMINI.md), item 30 |
| `cabelo_tranca_unica`, `cabelo_menino_degrade` | a opção não aparece no criador | itens 9 e 35; as artes ruins estão em `_refazer/` |
| 6 faixas de música | silêncio | [MUSICA.md](MUSICA.md) |
| ~60 falas gravadas | voz do navegador (TTS pt-BR) | [GRAVAR_VOZES.md](GRAVAR_VOZES.md) |

Nada disso bloqueia a publicação: entra numa atualização depois, sem mexer em
código.

## Para subir na Play Store

Passo a passo com os comandos em [PUBLICAR.md](PUBLICAR.md). O que falta:

1. **Criar a chave de assinatura** e o `android/keystore.properties`. É o único
   passo sem volta: perdeu a chave, não atualiza mais o app.
2. `npm run android:build` para gerar o `.aab` assinado.
3. **Publicar a política de privacidade** numa URL pública
   ([PUBLICAR_POLITICA.md](PUBLICAR_POLITICA.md)) e colar o link na ficha.
4. Na Play Console: criar o app, preencher a ficha, subir as capturas de
   `store/screenshots/` e mandar para **teste interno**.
5. Responder o questionário de público infantil (Famílias): o app não coleta
   dado nenhum, não tem anúncio, não tem compra e não acessa a rede.

## Três decisões que ficaram para depois

**1. O cabelo pesa na abertura.** 20 penteados × 9 cores são a maior parte do
que o jogo carrega antes da primeira tela. Dá para gravar um arquivo só em tons
de cinza e pintar com `setTint`, o que derruba o peso e deixa cor nova de
graça; o preço é depender de WebGL (no Canvas o cabelo sairia cinza).

**2. A professora não tem lugar.** `m07_professora` está pronta, mas a missão
07 não tem campo que a mostre.

**3. O logo não é carregado por ninguém.** Depois de gerar o arquivo, falta uma
linha em [src/scenes/Boot.ts](../src/scenes/Boot.ts).

## Como entra arte nova

```bash
python tools/renomear_fila.py --lote --pasta "C:\pasta\com\as\imagens"
npm run assets
npm run smoke
```

O renomeador mostra o plano e só move depois do `s`; a pasta de origem precisa
ser diferente da pasta das artes cruas. Cabelo, olhos, roupa, acessório e
cenário entram sozinhos — o script acha o rosto na arte e encaixa. Peça de
missão só aparece se o JSON da missão citar o nome dela em `"img"`, e arquivo
cru novo precisa estar na tabela `FOLHAS`/`SOLTAS`/`ROUPAS`/`CENARIOS` de
[tools/preparar_assets.py](../tools/preparar_assets.py).
