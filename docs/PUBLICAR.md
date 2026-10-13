# Publicar o Rotina Feliz na Google Play

App: **Rotina Feliz** · Pacote: **com.colostudio.rotinafeliz** (definitivo)
Alvo: **API 36 (Android 16)**, que é o mínimo exigido hoje · Orientação: retrato
Permissões de aparelho: **nenhuma**. O manifesto só tem as da compra pela Google
Play (`BILLING`, `INTERNET`, `ACCESS_NETWORK_STATE`); o jogo roda sem rede.

## O que já está pronto e o que falta (13/10/2026)

Pronto no projeto: `apks/RotinaFeliz-release.aab` assinado (versionCode 1,
versão 1.0, alvo API 36), ficha e respostas dos questionários em
[FICHA_LOJA.md](FICHA_LOJA.md), 6 capturas, ícone, imagem de destaque e a
política de privacidade no ar com a compra descrita.

Falta, na Play Console (só você consegue):

1. Criar o app (3.1) e preencher **Conteúdo do app**: privacidade, anúncios,
   acesso, classificação, público-alvo, segurança dos dados (3.3 a 3.5).
2. Criar o produto **`rotinafeliz.mundos.completos`**, R$ 4,99, e ativar
   ([MONETIZACAO.md](MONETIZACAO.md)). Ele só aparece para criar depois que um
   `.aab` com a biblioteca de compras foi enviado a alguma faixa.
3. Cadastrar os testadores de licença e testar comprar e restaurar no celular.
4. Teste fechado com 12 testadores por 14 dias (3.2), depois produção (3.7).

---

## 0. O Java: nada a instalar

O Gradle do projeto subiu para a versao 9.1, que roda no **Java 25** que ja vem
dentro do Android Studio. Nao precisa baixar JDK nenhum.

Quem chama o build e `tools/gradle.cmd`: ele aponta o `JAVA_HOME` para o JDK do
Android Studio quando a maquina nao tem um proprio. Se o seu Android Studio
estiver em outra pasta, troque o caminho la (uma linha).

O caminho do SDK fica em `android/local.properties`, que nao vai para o git:

```
sdk.dir=C:/Users/rondj/AppData/Local/Android/Sdk
```

Use **barras normais** nesse arquivo. Com `\` o Gradle le o caminho errado e
para com `Invalid file path`.

Para conferir que esta tudo de pe, antes mesmo da chave de assinatura:

```bash
npm run android:apk
```

Sai um `android/app/build/outputs/apk/release/app-release-unsigned.apk`.

---

## 1. Criar a chave de assinatura (keystore)

A keystore é o que prova que o app é seu. **Se você perder, não consegue mais
atualizar o app** — nem o Google recupera.

No PowerShell, dentro da pasta do projeto. O `&` na frente é obrigatório:
sem ele o PowerShell lê o caminho entre aspas como texto e para com
*Token '-genkeypair' inesperado*.

```bash
& "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -genkeypair -v -keystore android/missoes-do-dia.jks -alias missoesdodia -keyalg RSA -keysize 2048 -validity 10000
```

Ele vai pedir:
- **senha da keystore** — escolha uma e **guarde**
- nome, organização, cidade, estado, país (pode ser simples: seu nome, `BR`)
- **senha da chave** — pode repetir a mesma

### Como guardar a senha
- Num **gerenciador de senhas** (Bitwarden, 1Password, o do Google).
- Uma cópia do arquivo `missoes-do-dia.jks` em **outro lugar** (pen drive, nuvem privada).
- **Nunca** no repositório: o `.gitignore` já bloqueia `*.jks` e `keystore.properties`.

### Apontar o build para a chave

Crie `android/keystore.properties` (esse arquivo não vai para o git):

```
storeFile=missoes-do-dia.jks
storePassword=SUA_SENHA
keyAlias=missoesdodia
keyPassword=SUA_SENHA
```

---

## 2. Gerar o .aab assinado

```bash
npm run android:build
```

Esse comando faz três coisas:
1. `vite build` — gera o site do jogo em `dist/`
2. `cap sync android` — copia o `dist/` para dentro do projeto Android
3. `gradlew bundleRelease` — empacota e assina

O arquivo sai em:
`android/app/build/outputs/bundle/release/app-release.aab`

Para testar no seu celular antes de mandar para a loja:

```bash
npm run android:apk
```

e instale o `app-release.apk` de `android/app/build/outputs/apk/release/`.

---

## 3. Play Console, passo a passo

### 3.1 Criar o app
**Todos os apps → Criar app**
- Nome: `Rotina Feliz`
- Idioma padrão: Português (Brasil)
- Tipo: **Jogo** · Gratuito
- Aceite as declarações de diretrizes

### 3.2 Teste fechado (obrigatório para contas novas)
Contas de desenvolvedor pessoais criadas depois de nov/2023 precisam de
**12 testadores por 14 dias seguidos** antes de liberar produção.

1. **Teste → Teste fechado → Criar faixa**
2. Envie o `.aab`
3. Em **Testadores**, crie uma lista de e-mails com **12 contas Google pessoais**
   (não podem ser contas da mesma organização)
4. Copie o **link de participação** e mande para os 12
5. Cada um precisa **aceitar o convite e instalar**
6. Os 14 dias só contam enquanto os 12 estiverem inscritos — se alguém sair, o contador reinicia

### 3.3 Segurança dos dados
**Política → Segurança dos dados**: responda **não** para tudo.
- Coleta de dados: **Não**
- Compartilhamento: **Não**
- Dados criptografados em trânsito: não se aplica (o app não envia nada)
- A compra é processada pela própria Google Play; o app só recebe a confirmação
  de que ela existe e não manda dado nenhum a servidor ou SDK
- Exclusão de dados: o app apaga no painel dos pais e ao desinstalar

### 3.4 Classificação de conteúdo
**Política → Classificação de conteúdo** → questionário.
Categoria **Educação/Jogos**, sem violência, sem linguagem imprópria, **com
compra no app** (uma única, atrás da conta de multiplicação), sem conteúdo
gerado por usuários, sem anúncios. Resultado esperado:
**Livre / 3+**.

### 3.5 Público-alvo e política Families
**Política → Público-alvo e conteúdo**
- Faixas etárias: **5 e menos** e **6 a 8**
- Como o app é voltado a crianças, ele entra na **política Families**:
  - sem anúncios, sem SDK de publicidade ✔
  - sem coleta de dados pessoais ✔
  - sem links externos para fora do app, exceto a política de privacidade no
    painel dos pais, que fica atrás de uma conta de multiplicação ✔
- Declare que o app **não** usa APIs de localização, câmera, microfone ou contatos

### 3.6 Ficha da loja
**Crescimento → Presença na loja → Ficha principal**
- Descrição curta, descrição completa e notas da versão: prontas para colar em
  [FICHA_LOJA.md](FICHA_LOJA.md).
- Ícone 512×512, imagem de destaque 1024×500
- **Capturas**: as 6 de `/store/screenshots` (1080×1920)
- **Política de privacidade**: a URL publicada (veja `docs/PUBLICAR_POLITICA.md`)

### 3.7 Enviar para produção
Depois dos 14 dias de teste fechado com os 12 testadores:
1. **Produção → Criar versão**
2. Promova o `.aab` do teste fechado
3. Preencha as notas da versão
4. **Enviar para revisão**

A revisão costuma levar de alguns dias a duas semanas para apps infantis,
porque a política Families é checada com mais cuidado.

---

## 4. Atualizações depois

A cada versão nova, suba `versionCode` em `android/app/build.gradle`
(1 → 2 → 3…) e `versionName` (`1.0` → `1.1`). Depois `npm run android:build`
e envie o novo `.aab`. **Sempre com a mesma keystore.**

---

## Conformidade com o Feito para a Familia (conferida em 13/10/2026)

O que a Play exige de um app para menores de 13 anos, e onde o jogo esta:

| exigencia | estado | onde conferir |
|---|---|---|
| Nenhuma coleta de dados | **ok** | zero `fetch`, `XMLHttpRequest`, `WebSocket` ou SDK de analytics no `src/`. As dependencias sao so Phaser e Capacitor |
| Funciona offline | **ok** | nenhuma URL buscada em tempo de execucao; a fonte Lexend vai embutida em `assets/fontes/` |
| Nenhuma permissao de aparelho | **ok** | o manifesto do app nao pede nada; as unicas do APK final (`BILLING`, `INTERNET`, `ACCESS_NETWORK_STATE`) vem da biblioteca de compras da Play |
| Dados so no aparelho | **ok** | `allowBackup=false` e `res/xml/sem_backup.xml`: nem backup na nuvem, nem copia para outro celular |
| Compra fora do alcance da crianca | **ok** | o botao so existe em `Pais.painel()`, e `painel()` so e chamado pelo acerto da conta em `Pais.portao()` |
| Nenhum anuncio | **ok** | nao ha rede de anuncio no projeto |
| Link externo so na area do adulto | **ok** | o unico `window.open` do jogo e o link da politica de privacidade, dentro do painel dos pais — e a Play exige que ele esteja la |
| Politica de privacidade publica | **ok** | no ar em `CONFIG.URL_PRIVACIDADE`, ja descrevendo a compra pela Google Play |

Para a varredura continuar valendo, nao acrescente: biblioteca de anuncio ou
analytics, chamada de rede (fora a da compra), permissao no manifesto, nem
`window.open` fora de `Pais.ts`. Qualquer um desses tira o app do programa.
