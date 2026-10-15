# Melhorias: cenas vivas e próximos mundos

Escrito em 15/10/2026, depois do prato que enche e da cama que se arruma. A
ideia que guia tudo aqui: **a criança vê o mundo mudar por causa do que ela
fez**. Cada tarefa termina com o "antes e depois" na tela, como na vida real.

## 1. O que o motor já faz (use nas missões novas)

Tudo pelo JSON da missão, sem código novo:

| campo | etapa | o que acontece |
|---|---|---|
| `estados` | arrastar | o alvo troca de arte a cada item certo ("" = não muda); no fim, antes e depois |
| `efeito: "puxar"` | arrastar (no item) | a arte nova entra varrendo, como lençol esticado |
| `efeito: "cair"` | arrastar (no item) | o item sobe e cai no lugar, como travesseiro |
| `empilha` | arrastar | os itens ficam em cima do alvo, em roda (prato) |
| `emOrdem` | arrastar | fora de ordem não é erro: aparece "Primeiro: lençol" e o item volta |
| `antes` | arrastar | arte do "antes" no fim, se for outra (cama bagunçada) |
| `estados[0]` | esfregar | no fim, a arte limpa aparece com brilho (mãos limpas) |

Arte de estado que ainda não existe é pulada: dá para ligar o JSON antes de a
imagem ficar pronta.

## 2. Pontos do jogo atual que ainda pedem o mesmo cuidado

| missão | hoje | melhoria | precisa |
|---|---|---|---|
| 17 roupa suja | o cesto já começa cheio | cesto vazio que enche peça a peça | `m17_cesto_vazio` |
| 16 guardar brinquedos (etapa 2) | os brinquedos achados só ficam claros | cada um voa para a caixa | código pequeno no `tocar` |
| 02 travesseiro fofinho | o travesseiro balança | ele vai inflando enquanto a criança segura | `estados` no segurar |
| 24 banho | a espuma some | a criança aparece limpinha, com brilho | arte de "depois do banho" |
| 25 pijama | sequência de toques | as peças aparecem no **personagem da criança** (desenhado por código) | etapa nova "vestir" |
| 21 sair da mesa | prato some na pia | a pia termina com a louça dentro, e a mesa limpa no antes e depois | `m21_pia_louca`, `m21_mesa_limpa` |
| 05 mochila | as coisas somem dentro | zíper fechando no fim | arte de zíper fechado |

O mais forte é o **vestir**: o personagem que a criança montou veste o
uniforme, o pijama e o casaco peça por peça. Isso dá para fazer por código,
porque as roupas do personagem já são camadas.

## 3. Próximos mundos

Cada mundo novo mantém a fórmula: 4 a 5 missões curtas, um joguinho e uma
historinha liberados no fim.

**Mundo 7 — Fim de semana em família.** Arrumar o quarto (o quarto vai se
organizando por cantos), ajudar na feira (a sacola enche, contar as frutas),
regar a planta (ela cresce em 3 estados ao longo dos dias), dar banho no pet
(espuma e depois o pet brilhando), brincar ao ar livre com protetor solar
(esfregar o protetor até sumir). Joguinho: jardim que floresce. Historinha: a
raposinha e a horta.

**Mundo 8 — Seguro fora de casa.** Praia e piscina (boia, só com adulto),
bicicleta (capacete, joelheira: vestir em ordem), não aceitar presente nem
carona de estranho ("pode ou não pode"), perdido no mercado (procurar quem
trabalha ali, dizer o nome do adulto), ônibus escolar (esperar sentado, cinto).
É o tema que a análise de mercado não achou em português.

**Mundo 9 — Sentimentos.** Um passo a passo fixo em todas: **respirar, pensar,
escolher**. Raiva (soprar o balão sem estourar), medo do escuro (acender a
luz, abraçar o bicho de pelúcia), tristeza (pedir colo, desenhar), ciúme do
irmão (esperar a vez), alegria (contar para alguém). O monstrinho da missão 11
volta como guia.

**Mundo 10 — Cuidando da saúde.** Beber água (o copo enche enquanto segura),
prato colorido (montar o prato com uma cor de cada grupo), vacina com
coragem (segurar a mão do adulto e respirar), dentista (abrir a boca e contar
os dentes), lavar as mãos antes de comer (já existe o esfregar).

## 4. Capítulos e continuidade

- **Uma história que anda.** Cada mundo fecha um capítulo da raposinha: ela
  também aprende a rotina, e a historinha do mundo conta como foi o dia dela.
- **Datas especiais sem religião nem consumo:** aniversário (arrumar a festa),
  primeiro dia de aula, férias, dia de chuva em casa.
- **Quarto que evolui.** O Cantinho mostra o quarto da criança, que ganha um
  objeto a cada mundo fechado (abajur, tapete, estante). Prêmio visível, sem
  loja e sem moeda.
- **Semana de rotina.** Nos mundos novos, a mesma missão aparece em dias
  diferentes com um detalhe novo (o lençol tem outra cor, o lanche muda), para
  a repetição não cansar.
