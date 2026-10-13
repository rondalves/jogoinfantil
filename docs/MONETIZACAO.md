# A compra única de R$ 4,99

A criança joga de graça os mundos 1 a 4: 18 das 28 missões, 4 joguinhos e 4
historinhas. O adulto abre o resto com uma compra única:

- os mundos 5 (Janta) e 6 (Banho e Cama): 10 missões, 2 joguinhos (moto na
  montanha e estoura-bolhas) e 2 historinhas;
- as 14 historinhas novas (07 a 20), assim que forem gravadas.

Sem anúncio, sem assinatura e sem moeda comprada. A criança nunca vê preço nem
botão de comprar: tudo fica na área dos adultos, atrás da conta de
multiplicação. Isso é exigência da política Families da Play.

## Como está no código

| peça | onde |
|---|---|
| Trava por mundo | `CONFIG.MUNDOS_LIVRES: 4` em [src/config.ts](../src/config.ts); `mundoPago()` em [src/compras.ts](../src/compras.ts) |
| Loja | `LojaPlugin.java`, com a Play Billing Library 8 (a Play exige 8 ou mais nova). Fala só com o app da Play Store do aparelho; nada vai para outro servidor |
| Ponte com o jogo | `src/compras.ts` chama o plugin `Loja` pelo Capacitor: `comprar` e `restaurar` |
| Recibo no aparelho | `localStorage`, fora do perfil: quem pagou pagou pela família |
| Botões | painel dos adultos: "Abrir os mundos 5 e 6 — R$ 4,99" e "Já comprei: restaurar pela conta da Play Store" |

**Restaurar**: a Play identifica a compra pela conta Google que está na Play
Store do aparelho. Não existe "digitar o e-mail": quem trocou de celular entra
com a mesma conta na loja e toca em restaurar. A compra também é reconhecida
(acknowledge) na hora, senão a Play devolve o dinheiro em 3 dias.

No navegador (`npm run dev`) a loja não existe: os botões avisam que a compra
abre no app instalado pela Play Store.

## O que falta na Play Console

1. **Criar o produto** em Monetizar → Produtos → Produtos no app:

   | campo | valor |
   |---|---|
   | ID do produto | `rotinafeliz.mundos.completos` (igual ao `PRODUTO` do código) |
   | Nome | Mundos 5 e 6 e historinhas novas |
   | Descrição | Abre os mundos Janta e Banho e Cama, com 10 missões, 2 joguinhos e 2 historinhas, e as 14 historinhas novas conforme chegam. |
   | Preço | R$ 4,99 |
   | Tipo | Compra única, **não consumível** |

   A aba de produtos só abre depois que uma versão foi enviada a alguma faixa
   de teste.

2. **Testadores de licença** (Configurações → Testes de licença): as contas
   que vão testar compram de graça, sem cobrança no cartão.

3. **Testar no celular**: comprar, fechar o app, abrir de novo (continua
   aberto), desinstalar, instalar e restaurar.

4. Na ficha, marcar que o app tem compras e trocar "sem compras" pelo texto
   da compra ([FICHA_LOJA.md](FICHA_LOJA.md)).

## As 14 historinhas novas

Os roteiros estão em [HISTORIAS_2.md](HISTORIAS_2.md) e [HISTORIAS_3.md](HISTORIAS_3.md).
Quando forem gravadas, entram como `src/stories/07-*.json` em diante, marcadas
como pagas, e a biblioteca passa a mostrá-las para quem comprou. Enquanto isso,
a descrição do produto diz "conforme chegam": vender o que ainda não existe é
o que a Play mais reclama, então o texto não pode prometer data.
