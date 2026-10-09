# O que gerar para melhorar os personagens

Os rostos e o cabelo cacheado atuais vieram de uma geração única. Para trocar,
gere as imagens abaixo com **fundo verde chapado (#00FF00)** e rode
`npm run assets`. O jogo troca sozinho — não precisa mexer em código.

## Regra de ouro: tudo no mesmo enquadramento

Todas as camadas do personagem precisam sair **no mesmo quadro, com a cabeça
exatamente no mesmo lugar e do mesmo tamanho**. O jeito mais seguro é gerar
todas a partir da mesma imagem base, só trocando o que muda.

- Quadrado, 2048×2048
- Criança de corpo inteiro, de frente, braços abertos, centralizada
- A cabeça ocupa a faixa de 5% a 33% da altura do quadro
- Traço cartoon limpo, contorno escuro fino, sombreado chapado

## 1. Rostos (prioridade)

O que está feio hoje são os olhos e a boca. Gere **só os olhos e a boca**,
sem cabeça, no mesmo quadro de 2048×2048:

| arquivo | descrição |
|---|---|
| `olhos_redondos_castanhos` | olhos redondos grandes, castanhos, cílios curtos, sobrancelhas finas, boca sorrindo fechada |
| `olhos_alegres_castanhos` | olhos em arco (sorrindo), boca aberta sorrindo |
| `olhos_grandes_castanhos` | olhos bem grandes com brilho, boca pequena sorrindo |

Peça: *"apenas os olhos e a boca de uma criança de desenho animado, estilo
limpo, fundo verde chapado, sem rosto, sem cabeça, centralizado"*.

## 2. Cabelos

Cada penteado é **uma imagem só**, em **castanho médio** — o jogo gera as 6
cores sozinho. Sem cabeça embaixo, só o cabelo, no mesmo quadro.

| arquivo | penteado |
|---|---|
| `cabelo_cacheado_castanho` | **refazer**: cachos definidos, volume médio, na altura do queixo |
| `cabelo_crespo_castanho` | crespo volumoso arredondado |
| `cabelo_liso_curto_castanho` | liso curto com franja |
| `cabelo_liso_longo_castanho` | liso longo até o ombro |
| `cabelo_trancas_castanho` | duas tranças |
| `cabelo_coque_castanho` | coque no alto |
| `cabelo_maria_chiquinha_castanho` | dois rabinhos laterais |

Depois de salvar, acrescente o estilo na lista `CABELOS` de
[src/personagem.ts](../src/personagem.ts) e na tabela `FOLHAS` do script.

### Para ficar parecido com a sua filha

Me diga e eu já deixo o arquivo e a lista prontos:

- é liso, ondulado, cacheado ou crespo?
- comprimento: curto, no ombro ou comprido?
- tem franja?
- cor: preto, castanho escuro, castanho claro, ruivo ou loiro?
- costuma usar preso (rabo, tranças, maria-chiquinha) ou solto?

## 3. Corpos

Só se quiser trocar o traço. Mesma regra de enquadramento, **pele clara** (o
jogo gera os 6 tons):

| arquivo | descrição |
|---|---|
| `corpo_base_pele_clara` | criança careca, camiseta e shorts brancos, tênis branco |
| `corpo_cadeira_pele_clara` | a mesma criança sentada em cadeira de rodas |
| `roupa_macacao_jeans` | a mesma criança de macacão jeans |

Qualquer roupa nova é um corpo inteiro vestido, no mesmo enquadramento.

## 4. Acessórios

Mesmo quadro, só a peça, sem cabeça:
`acessorio_oculos`, `acessorio_aparelho_auditivo`, `acessorio_bone`,
`acessorio_laco`, `acessorio_capa`, `acessorio_medalha`.
