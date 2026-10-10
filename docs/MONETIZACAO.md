# A compra única de R$ 4,99

O plano: a criança joga de graça os dois primeiros mundos — 12 das 28 missões,
**43% do jogo** — e o adulto abre o resto com uma compra única.

Metade do caminho já está no código. Falta ligar o pagamento de verdade.

## O que já existe

| peça | onde | estado |
|---|---|---|
| Trava por mundo | `CONFIG.MUNDOS_LIVRES` em [src/config.ts](../src/config.ts) | **hoje em 6** (tudo livre, para o teste). Vira **2** quando o pagamento entrar |
| Regra de "mundo pago" | `mundoPago()` em [src/compras.ts](../src/compras.ts) | pronta |
| Recibo no aparelho | `localStorage` fora do perfil — quem pagou pagou pela família | pronto |
| Botão de comprar e "já comprei, restaurar" | painel dos adultos, atrás da conta de multiplicação | pronto, some sozinho enquanto tudo estiver livre |
| Produto | `rotininha.mundos.completos`, R$ 4,99 | só o nome; não existe na Play ainda |
| Ponte com a loja | `window.RotininhaLoja` | **não existe** — é o que falta |

A criança nunca vê preço nem botão de compra: tudo fica na área dos adultos.
Isso não é detalhe, é exigência da política Families da Play.

## O que falta, na ordem

### 1. Criar o produto na Play Console

**Monetizar → Produtos → Produtos no app → Criar produto**

| campo | valor |
|---|---|
| ID do produto | `rotininha.mundos.completos` (igual ao `PRODUTO` do código) |
| Nome | Todos os mundos |
| Descrição | Abre os mundos 3 a 6, com todas as missões, joguinhos e historinhas. |
| Preço | R$ 4,99 |
| Tipo | Compra única, **não consumível** |

O app precisa já ter uma versão enviada em alguma faixa de teste, senão a aba
de produtos fica bloqueada.

### 2. Instalar o plugin de pagamento

```bash
npm i @capacitor-community/in-app-purchases
npx cap sync android
```

### 3. Escrever a ponte

Um arquivo só, carregado antes do jogo, que publica `window.RotininhaLoja` com
os dois métodos que [src/compras.ts](../src/compras.ts) já chama:

```ts
window.RotininhaLoja = {
  async comprar(produto) {
    const { purchase } = await InAppPurchases.purchaseProduct({ productIdentifier: produto });
    return purchase?.state === 'purchased';
  },
  async restaurar(produto) {
    const { purchases } = await InAppPurchases.restorePurchases();
    return purchases.some((p) => p.productIdentifier === produto);
  },
};
```

Nada mais muda: `comprar()` já guarda o recibo e o mapa já destranca sozinho.

### 4. Voltar a trava

Em [src/config.ts](../src/config.ts), `MUNDOS_LIVRES: 6` volta para `2`.

### 5. Testar a compra de verdade

Compra não funciona em `npm run dev` nem em APK instalado na mão. Precisa:

1. Subir o `.aab` assinado numa faixa de teste
2. **Configuração → Teste de licença**: ponha seu e-mail como testador de licença
3. Instalar pelo link de participação do teste
4. Comprar — vai aparecer "item de teste", sem cobrança

Teste também: comprar, desinstalar, reinstalar e usar **"Já comprei, restaurar"**.
Se isso falhar, a Play reprova.

### 6. Ficha e questionários

- Na ficha: troque "sem compras" por "uma compra única e opcional abre os
  mundos 3 a 6" ([docs/FICHA_LOJA.md](FICHA_LOJA.md))
- Em **Classificação de conteúdo** e **Público-alvo**: marque que o app
  **contém compras no app**
- A Play mostra "Compras no app R$ 4,99" embaixo do nome, automaticamente

## Por que 43% e não 40%

A divisão é por mundo, não por missão: mundos 1 e 2 (Manhã em Casa e Escola)
somam 12 das 28 missões. Cortar no meio de um mundo deixaria a criança parada
no meio de uma rotina, que é justamente o que o jogo ensina a terminar.

Para chegar mais perto de 40%, dá para mover uma missão do mundo 2 para o 3 —
mas o ganho é pequeno e mexe no progresso de quem já jogou.
