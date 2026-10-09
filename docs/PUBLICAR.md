# Publicar o Rotininha na Google Play

App: **Rotininha** · Pacote: **com.rotininha.missoesdodia** (definitivo)
Alvo: **API 36 (Android 16)**, que é o mínimo exigido hoje · Orientação: retrato
Permissões: **nenhuma** — o jogo roda inteiro no aparelho, sem rede.

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

No terminal, dentro da pasta do projeto:

```bash
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -genkeypair -v -keystore android/missoes-do-dia.jks -alias missoesdodia -keyalg RSA -keysize 2048 -validity 10000
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
- Nome: `Rotininha`
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
- Dados criptografados em trânsito: não se aplica (não há envio)
- Exclusão de dados: o app apaga no painel dos pais e ao desinstalar

### 3.4 Classificação de conteúdo
**Política → Classificação de conteúdo** → questionário.
Categoria **Educação/Jogos**, sem violência, sem linguagem imprópria, sem
compras, sem conteúdo gerado por usuários, sem anúncios. Resultado esperado:
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
- Descrição curta (até 80): `Missões do dia a dia para crianças de 4 a 7 anos.`
- Descrição completa: conte as 5 fases do dia, as missões, as estrelas e os mini
  games. Diga que é **sem anúncios, sem compras e sem internet**.
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
