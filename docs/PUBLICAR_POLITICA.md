# Publicar a política de privacidade de graça (GitHub Pages)

A Play Store exige uma **URL pública** da política de privacidade. O arquivo já
está pronto em `docs/privacidade.html`.

## Antes de publicar

1. Abra `docs/privacidade.html` e troque os dois `[E-MAIL]` pelo seu e-mail de contato.
2. Confira a data de atualização no topo.

## Passo a passo

1. **O repositório precisa ser público.** Hoje `rondalves/jogoinfantil` é
   privado, e o GitHub Pages de repositório privado só funciona no plano pago.
   Em `Settings → General → Danger Zone → Change repository visibility`,
   escolha *Make public*. Só o código fica visível — nenhum dado de usuário
   existe no projeto.
2. No GitHub, abra o repositório → **Settings** → **Pages**.
3. Em *Source*, escolha **Deploy from a branch**.
4. Em *Branch*, escolha **main** e a pasta **/docs**. Clique em **Save**.
5. Espere de 1 a 3 minutos e recarregue a página. O GitHub mostra o endereço:

   ```
   https://rondalves.github.io/jogoinfantil/privacidade.html
   ```

6. Abra esse endereço para conferir se a página aparece certinha.

Esse é o endereço que vai no Play Console, em
**Política da Play → Conteúdo do app → Política de privacidade**, e também no
campo **Privacidade** da ficha da loja.

## Se preferir não deixar o repositório público

Alternativas gratuitas, todas aceitas pela Play Store:

- **Netlify Drop** — arraste a pasta `docs/` para <https://app.netlify.com/drop>.
- **Cloudflare Pages** ou **Vercel** — conectam a um repositório privado de graça.
- Um repositório novo e **só** com o arquivo `privacidade.html`, público, usando
  Pages, enquanto o do jogo segue privado.

## Depois de publicar

O link dentro do app está em `src/config.ts`, na chave `URL_PRIVACIDADE`.
Se o endereço final for diferente, troque lá — ele aparece no painel dos pais.
