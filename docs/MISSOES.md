# Todas as missoes do Rotininha

Gerado por `python tools/listar_missoes.py`. **Nao edite este arquivo:** ele e
reescrito a cada vez. Quem manda e `src/missions/NN-nome.json`.

Serve para ler tudo de uma vez, revisar o conteudo e escrever missao nova.

## Como uma missao funciona

Toda missao segue a mesma espinha:

1. **Abertura** — a raposinha conta o que vai acontecer.
2. **O personagem mostra** — a crianca ve como se faz, antes de fazer.
3. **Etapas** — de 2 a 3, cada uma de um dos tipos abaixo.
4. **Pode ou nao pode** — duas cenas, ela escolhe a certa.
5. **Estrelas e reforco** — 0 erros = 3 estrelas, 1 erro = 2, 2 ou mais = 1.
   Concluir nunca da zero e nunca existe tela de derrota.

## Os tipos de etapa

| tipo no JSON | o que a crianca faz |
|---|---|
| `tocar` | toca nas figuras certas; `correto: false` marca pegadinha |
| `arrastar_para_alvo` | arrasta coisas ate um alvo; o certo some, o errado leva X |
| `sequencia_ordenada` | toca na ordem certa |
| `escolher_entre_opcoes` | escolhe uma entre duas |
| `sim_ou_nao` | responde Sim ou Nao para varias situacoes seguidas |
| `segurar_com_timer` | segura o dedo enquanto o cronometro corre |
| `esfregar` | esfrega o dedo ate limpar |
| `escovar` | escovacao guiada, lugar por lugar |
| `respirar` | respira fundo algumas vezes |

Missao nova = arquivo JSON novo em `src/missions/`. O motor nao muda.

## O que faz uma missao boa aqui

- **Uma ideia so por missao.** O titulo tem de caber em tres palavras.
- **Duas ou tres etapas.** Mais que isso a crianca de 4 anos larga no meio.
- **Sempre uma pegadinha.** Errar e onde ela aprende; errar aqui nao pune.
- **A fala e curta e no imperativo.** "Toque nas tres gentilezas", nao
  "Agora vamos ver se voce consegue identificar...".
- **Nada de texto na arte.** Tudo o que esta escrito, o narrador le em voz alta.
- **O reforco fala da crianca, nao da tarefa.** "Maos limpas, corpo saudavel",
  nao "Voce lavou as maos".

---


## Indice

- [01 — Acordar e se cuidar](#missao-01-acordar-e-se-cuidar) · mundo 1 · livre
- [02 — Arrumar a cama](#missao-02-arrumar-a-cama) · mundo 1 · livre
- [03 — Guerra aos germes](#missao-03-guerra-aos-germes) · mundo 1 · livre
- [04 — Casa segura](#missao-04-casa-segura) · mundo 1 · livre
- [05 — Ir para a escola](#missao-05-ir-para-a-escola) · mundo 2 · livre
- [06 — Rua segura](#missao-06-rua-segura) · mundo 2 · livre
- [07 — Ouvir a professora](#missao-07-ouvir-a-professora) · mundo 2 · livre
- [08 — Saber esperar](#missao-08-saber-esperar) · mundo 2 · livre
- [09 — Palavras mágicas](#missao-09-palavras-m-gicas) · mundo 2 · livre
- [10 — Amigos e gentileza](#missao-10-amigos-e-gentileza) · mundo 2 · livre
- [11 — Monstro dos sentimentos](#missao-11-monstro-dos-sentimentos) · mundo 2 · livre
- [12 — Voltar de carro](#missao-12-voltar-de-carro) · mundo 3 · paga
- [13 — Almoçar](#missao-13-almo-ar) · mundo 4 · paga
- [14 — Lição de casa](#missao-14-li-o-de-casa) · mundo 4 · paga
- [15 — Brincar](#missao-15-brincar) · mundo 4 · paga
- [16 — Guardar os brinquedos](#missao-16-guardar-os-brinquedos) · mundo 4 · paga
- [17 — Ajudante da casa](#missao-17-ajudante-da-casa) · mundo 4 · paga
- [18 — Tela com limite](#missao-18-tela-com-limite) · mundo 4 · paga
- [19 — Banho, dentes e sono](#missao-19-banho-dentes-e-sono) · mundo 5 · paga
- [20 — Dia do doutor e do dentista](#missao-20-dia-do-doutor-e-do-dentista) · mundo 5 · paga

---

## Missao 01 — Acordar e se cuidar 🦷

Mundo 1 (Manha em Casa) · cenario `bg_quarto_manha`

**Abertura:** "Bom dia, {nome}! Vamos acordar e cuidar de você?"

**O personagem mostra:** "Escova em cada pedacinho: em cima, embaixo, dos dois lados e a linguinha!"

### Etapas

**1. Escovacao guiada**

> Vamos escovar! Siga a bolinha verde.

Escova a boca em 5 lugares, seguindo a bolinha verde:
  1. Em cima, deste lado
  2. Em cima, do outro lado
  3. Embaixo, deste lado
  4. Embaixo, do outro lado
  5. Agora a linguinha!

**2. Esfregar**

> Agora lave o rosto. Esfregue com o dedinho!

Esfrega **Rosto** ate limpar 5 sujeiras (ate 20 s).

**3. Arrastar para o alvo**

> Monte o café: leve a fruta e o pão para o prato.

Arrasta 3 de 3 coisas para **Prato do café**.
  - Maçã
  - Banana
  - Pão

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Escovar os dentes**
- Errado: Brincar com a comida
- Explicacao: "A comida é para comer. E a escova deixa o dente forte!"

**Reforco no fim:** "Dentes limpos, sorriso brilhando!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 02 — Arrumar a cama 🛏️

Mundo 1 (Manha em Casa) · cenario `bg_quarto_manha`

**Abertura:** "{nome}, vamos deixar a sua cama bonita?"

**O personagem mostra:** "Primeiro o lençol, depois o cobertor, por último o travesseiro!"

### Etapas

**1. Arrastar para o alvo**

> Leve o lençol, o cobertor e o travesseiro para a cama.

Arrasta 3 de 3 coisas para **Cama**.
  - Lençol
  - Cobertor
  - Travesseiro

**2. Segurar com cronometro**

> Agora dê tapinhas no travesseiro para ele ficar fofinho!

Segura o dedo em **Travesseiro** por 6 s.
  - _Se erra:_ "Segure mais um pouquinho, {nome}!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Pedir ajuda**
- Errado: Deixar bagunçada
- Explicacao: "Pedir ajuda é de gente esperta! Juntos fica mais fácil."

**Reforco no fim:** "Cama arrumada, dia começou bem!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 03 — Guerra aos germes 🧼

Mundo 1 (Manha em Casa) · cenario `bg_banheiro`

**Abertura:** "Olha só, {nome}: germes nas suas mãos! Vamos espantar todos?"

**O personagem mostra:** "Água, sabão e muita esfregada. E tem hora certa para lavar!"

### Etapas

**1. Esfregar**

> Esfregue as mãos até os germes sumirem!

Esfrega **Mãos sujas** ate limpar 5 sujeiras (ate 20 s).

**2. Tocar**

> Toque nas horas de lavar a mão: antes de comer, depois do banheiro e depois de brincar com o pet.

Toca em 3 de 3 figuras.
  - Antes de comer
  - Depois do banheiro
  - Depois de brincar
  - _Se erra:_ "Essa não é hora de lavar a mão. Tente outra!"

**3. Precisa ou nao precisa**

> Agora me diga: precisa lavar a mão agora?

Responde Sim ou Nao para 4 situacoes:
  - Vou comer agora -> **SIM** — Isso! Antes de comer, mão sempre lavada.
  - Vou brincar na terra -> **NAO** — Agora não precisa. A terra pode sujar! Lavar é depois de brincar.
  - Acabei de brincar com o cachorro -> **SIM** — Sim! Depois do pet, direto na pia.
  - Vou ver um desenho -> **NAO** — Não precisa. Ver desenho não suja a mão.

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Lavar as mãos**
- Errado: Comer com a mão suja
- Explicacao: "A água e o sabão levam os germes embora pelo ralo!"

**Reforco no fim:** "Mãos limpas, corpo saudável!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 04 — Casa segura ⚠️

Mundo 1 (Manha em Casa) · cenario `bg_casa_segura`

**Abertura:** "{nome}, tem coisas na casa que só adulto pode mexer. Vamos achar?"

**O personagem mostra:** "Toque só no que é perigoso. O resto pode deixar!"

### Etapas

**1. Tocar**

> Toque em tudo que é perigoso para criança.

Toca em 6 de 8 figuras.
  - Tomada
  - Remédio
  - Produto de limpeza
  - Faca
  - Fogão
  - Escada
  - Banana _(pegadinha)_
  - Toalha _(pegadinha)_
  - _Se erra:_ "Esse aí não é perigoso. Procure outro!"

**2. Escolher entre opcoes**

> A campainha tocou e você não conhece quem está na porta. O que fazer?

Escolhe uma:
  - Abrir a porta
  - Chamar um adulto _(certo)_
  - _Se erra:_ "Porta só adulto abre. Chame alguém!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Chamar um adulto**
- Errado: Mexer na tomada
- Explicacao: "Achou perigo? Não mexe: chama um adulto na hora!"

**Reforco no fim:** "Perigo? Chame um adulto!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 05 — Ir para a escola 🎒

Mundo 2 (Escola) · cenario `bg_quarto_manha`

**Abertura:** "{nome}, a escola está esperando! Vamos arrumar a mochila?"

**O personagem mostra:** "Caderno, lápis, lanche e garrafinha. Brinquedo fica em casa!"

### Etapas

**1. Arrastar para o alvo**

> Coloque na mochila só o que é da escola.

Arrasta 4 de 6 coisas para **Mochila**.
  - Caderno
  - Lápis
  - Lanche
  - Garrafinha
  - Bola _(pegadinha)_
  - Ursinho _(pegadinha)_
  - _Se erra:_ "Esse fica em casa! Na mochila vai só o que é da escola."

**2. Sequencia ordenada**

> Agora na ordem: vestir o uniforme, calçar o tênis, arrumar o cabelo e pegar a mochila.

Toca na ordem certa:
  1. Uniforme
  2. Tênis
  3. Cabelo
  4. Mochila
  - _Se erra:_ "Ainda não é esse. Olhe de novo!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Dar tchau para o adulto**
- Errado: Sair sem avisar
- Explicacao: "Avisar quem cuida de você deixa todo mundo tranquilo."

**Reforco no fim:** "Mochila pronta, dia começou!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 06 — Rua segura 🚦

Mundo 2 (Escola) · cenario `bg_escola_entrada`

**Abertura:** "{nome}, a rua pede atenção. Vamos atravessar do jeito certo?"

**O personagem mostra:** "Mão dada, esperar o vermelho, verde caminha, e sempre na faixa!"

### Etapas

**1. Sequencia ordenada**

> Toque na ordem certa para atravessar.

Toca na ordem certa:
  1. Dar a mão
  2. Esperar
  3. Verde
  4. Na faixa
  - _Se erra:_ "Calma! Esse vem depois. Tente outro."

**2. Escolher entre opcoes**

> A bola foi parar na rua. O que fazer?

Escolhe uma:
  - Chamar um adulto _(certo)_
  - Correr atrás
  - _Se erra:_ "Rua não é lugar de correr. Chame um adulto!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Atravessar na faixa, de mão dada**
- Errado: Correr atrás da bola na rua
- Explicacao: "A bola a gente pede para um adulto pegar. A gente atravessa na faixa, de mão dada."
- Animacao de premio: `atravessar`

**Reforco no fim:** "Vermelho espera, verde caminha!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 07 — Ouvir a professora ✋

Mundo 2 (Escola) · cenario `bg_sala_aula`

**Abertura:** "Começou a aula, {nome}! Vamos ver como se faz?"

**O personagem mostra:** "Sentar, ouvir, levantar a mão para falar e fazer a atividade."

### Etapas

**1. Sequencia ordenada**

> Toque na ordem: sentar, ouvir, levantar a mão e fazer a atividade.

Toca na ordem certa:
  1. Sentar
  2. Ouvir
  3. Levantar a mão
  4. Fazer a tarefa
  - _Se erra:_ "Esse é o próximo? Olhe mais uma vez!"

**2. Escolher entre opcoes**

> Você tem uma dúvida. Como pergunta?

Escolhe uma:
  - Levantar a mão _(certo)_
  - Gritar da cadeira
  - _Se erra:_ "Gritando ninguém escuta. Levante a mao!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Perguntar com a mão levantada**
- Errado: Gritar na sala
- Explicacao: "Com a mão levantada a professora vê você e todo mundo escuta."

**Reforco no fim:** "Quem escuta, aprende!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 08 — Saber esperar ⏳

Mundo 2 (Escola) · cenario `bg_sala_aula`

**Abertura:** "Às vezes a gente precisa esperar, {nome}. E dá para esperar bem!"

**O personagem mostra:** "Enquanto espera, dá para respirar, cantar baixinho ou olhar em volta."

### Etapas

**1. Tocar**

> Toque nos três jeitos de esperar bem.

Toca em 3 de 3 figuras.
  - Respirar
  - Cantar baixinho
  - Olhar em volta

**2. Segurar com cronometro**

> A fila está andando. Segure a ampulheta e espere a areia cair.

Segura o dedo em **Ampulheta** por 15 s.
  - _Se erra:_ "Ainda não acabou. Vamos esperar juntos!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Esperar a sua vez**
- Errado: Reclamar gritando
- Explicacao: "Esperar é difícil, mas passa. Quem espera bem chega na vez dele."

**Reforco no fim:** "Esperar também é ser forte!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 09 — Palavras mágicas ✨

Mundo 2 (Escola) · cenario `bg_sala_aula`

**Abertura:** "{nome}, tem palavras que fazem mágica de verdade. Quer ver?"

**O personagem mostra:** "Por favor, muito obrigado, com licença e desculpa. São as palavras mágicas!"

### Etapas

**1. Escolher entre opcoes**

> Voce quer o brinquedo do colega. O que fala?

Escolhe uma:
  - Por favor _(certo)_
  - Me dá isso!
  - _Se erra:_ "Com por favor fica muito mais fácil!"

**2. Escolher entre opcoes**

> Ganhou um presente. O que fala?

Escolhe uma:
  - Muito obrigado _(certo)_
  - Não falar nada
  - _Se erra:_ "Quem agradece deixa o outro feliz!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Dizer com licença**
- Errado: Empurrar e passar
- Explicacao: "Com licença abre caminho sem machucar ninguém."

**Reforco no fim:** "Palavra mágica abre portas!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 10 — Amigos e gentileza 💗

Mundo 2 (Escola) · cenario `bg_escola_entrada`

**Abertura:** "{nome}, ser amigo é fazer o outro se sentir bem. Vamos treinar?"

**O personagem mostra:** "Convidar quem está sozinho, dividir o brinquedo e ajudar quem caiu."

### Etapas

**1. Tocar**

> Toque nas três gentilezas.

Toca em 3 de 3 figuras.
  - Convidar para brincar
  - Dividir
  - Ajudar quem caiu

**2. Escolher entre opcoes**

> Um colega está sozinho no banco. O que fazer?

Escolhe uma:
  - Chamar para brincar _(certo)_
  - Deixar sozinho
  - _Se erra:_ "Ninguém gosta de ficar sozinho. Chame para brincar!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Conversar e ajudar**
- Errado: Bater no colega
- Explicacao: "Bater machuca. Conversar resolve."

**Reforco no fim:** "Amigo bom é amigo gentil!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 11 — Monstro dos sentimentos 😤

Mundo 2 (Escola) · cenario `bg_sala_aula`

**Abertura:** "Olha o monstrinho, {nome}! Ele sente tudo que a gente sente."

**O personagem mostra:** "Feliz, triste, bravo, com medo. Todo sentimento pode aparecer."

### Etapas

**1. Tocar**

> Toque no monstrinho que está bravo.

Toca em 1 de 4 figuras.
  - Feliz _(pegadinha)_
  - Triste _(pegadinha)_
  - Bravo
  - Com medo _(pegadinha)_
  - _Se erra:_ "Esse está com outro sentimento. Procure o bravo!"

**2. Respirar**

> Quando a raiva vem, a gente respira. Sopre três vezes bem devagar.

Respira fundo 3 vezes.

**3. Escolher entre opcoes**

> A raiva passou um pouco. E agora?

Escolhe uma:
  - Falar o que sentiu _(certo)_
  - Bater em alguém
  - _Se erra:_ "Bater não faz a raiva passar. Falar faz!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Pedir um abraço**
- Errado: Bater quando fica bravo
- Explicacao: "Sentir raiva pode. Bater não pode. Respire e fale o que sentiu."

**Reforco no fim:** "Todo sentimento é normal. Eu sei o que fazer com ele."

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 12 — Voltar de carro 🚗

Mundo 3 (Volta para Casa) · cenario `bg_carro_interior`

**Abertura:** "Fim da aula, {nome}! Vamos para casa com segurança?"

**O personagem mostra:** "Esperar o adulto abrir, sentar na cadeirinha e ouvir o clique do cinto!"

### Etapas

**1. Sequencia ordenada**

> Toque na ordem certa para entrar no carro.

Toca na ordem certa:
  1. Esperar o adulto
  2. Sentar na cadeirinha
  3. Passar o cinto
  4. Ouvir o clique
  - _Se erra:_ "Ainda não é esse. Olhe de novo!"

**2. Escolher entre opcoes**

> O carro está andando e a janela está do seu lado. O que fazer?

Escolhe uma:
  - Deixar a janela quieta _(certo)_
  - Mexer na janela
  - _Se erra:_ "Janela é o adulto quem mexe. Fique sentadinho!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Cinto afivelado**
- Errado: Tirar o cinto andando
- Explicacao: "O cinto segura você se o carro parar de repente. Ele fica até o fim da viagem!"

**Reforco no fim:** "Cinto afivelado, viagem segura!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 13 — Almoçar 🍽️

Mundo 4 (Tarde) · cenario `bg_sala_almoco`

**Abertura:** "A comida está na mesa, {nome}! Vamos almoçar direitinho?"

**O personagem mostra:** "Lavar as mãos, sentar na cadeira, comer e agradecer!"

### Etapas

**1. Sequencia ordenada**

> Toque na ordem: lavar as mãos, sentar, comer e agradecer.

Toca na ordem certa:
  1. Lavar as mãos
  2. Sentar
  3. Comer
  4. Agradecer
  - _Se erra:_ "Esse vem depois. Tente outro!"

**2. Escolher entre opcoes**

> Tem um legume novo no prato. O que fazer?

Escolhe uma:
  - Experimentar _(certo)_
  - Sair correndo
  - _Se erra:_ "Uma mordidinha só para conhecer. Se não gostar, tudo bem!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Experimentar comida nova**
- Errado: Levantar correndo
- Explicacao: "Na mesa a gente fica sentado até acabar. Experimentar é de gente corajosa!"

**Reforco no fim:** "Prato limpo, barriga feliz!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 14 — Lição de casa 📝

Mundo 4 (Tarde) · cenario `bg_quarto_brincar`

**Abertura:** "Hora da lição, {nome}. Vamos fazer com calma?"

**O personagem mostra:** "Guardar a tela, sentar, fazer a tarefa e pedir ajuda se travar."

### Etapas

**1. Sequencia ordenada**

> Toque na ordem: guardar a tela, sentar, fazer a tarefa, pedir ajuda.

Toca na ordem certa:
  1. Guardar a tela
  2. Sentar
  3. Fazer a tarefa
  4. Pedir ajuda
  - _Se erra:_ "Calma, esse vem depois!"

**2. Escolher entre opcoes**

> Travou numa continha difícil. O que fazer?

Escolhe uma:
  - Pedir ajuda _(certo)_
  - Desistir
  - _Se erra:_ "Pedir ajuda não é desistir. É jeito de aprender!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Pedir ajuda**
- Errado: Ficar na tela
- Explicacao: "Primeiro a lição, depois a diversão. E ajuda a gente sempre pode pedir!"

**Reforco no fim:** "Tarefa feita, cabeça leve!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 15 — Brincar 🧸

Mundo 4 (Tarde) · cenario `bg_quarto_brincar`

**Abertura:** "Agora é hora de brincar, {nome}! Escolha o seu brinquedo."

**O personagem mostra:** "Escolher um brinquedo, brincar bastante e dividir com um amigo!"

### Etapas

**1. Tocar**

> Toque nos brinquedos para escolher com o que brincar.

Toca em 3 de 3 figuras.
  - Bola
  - Ursinho
  - Trenzinho

**2. Escolher entre opcoes**

> Um amigo chegou e quer brincar também. O que fazer?

Escolhe uma:
  - Dividir o brinquedo _(certo)_
  - Jogar o brinquedo nele
  - _Se erra:_ "Brinquedo não se joga em ninguém. Dividir é mais divertido!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Dividir o brinquedo**
- Errado: Jogar brinquedo nos outros
- Explicacao: "Brinquedo machuca se voar. Brincar junto é bem melhor!"

**Reforco no fim:** "Brincar junto é muito melhor!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 16 — Guardar os brinquedos 📦

Mundo 4 (Tarde) · cenario `bg_quarto_brincar`

**Abertura:** "Olha a bagunça, {nome}! Vamos guardar tudo?"

**O personagem mostra:** "Cada brinquedo tem a sua caixa. E depois a gente procura os que sobraram!"

### Etapas

**1. Arrastar para o alvo**

> Leve cada brinquedo para a caixa.

Arrasta 4 de 4 coisas para **Caixa dos brinquedos**.
  - Bola
  - Ursinho
  - Trenzinho
  - Boneca

**2. Tocar**

> Procure os que ficaram no chão e toque neles.

Toca em 3 de 3 figuras.
  - Carrinho
  - Tambor
  - Pião

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Guardar tudo**
- Errado: Deixar no chão
- Explicacao: "Brinquedo no chão faz a gente tropeçar. Guardado, ninguém se machuca!"

**Reforco no fim:** "Tudo no lugar, ninguém tropeça!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 17 — Ajudante da casa 🧺

Mundo 4 (Tarde) · cenario `bg_sala_almoco`

**Abertura:** "{nome}, quer ser o ajudante da casa hoje?"

**O personagem mostra:** "Roupa suja no cesto, mesa posta e comida para o pet!"

### Etapas

**1. Arrastar para o alvo**

> Leve a roupa suja para o cesto.

Arrasta 2 de 2 coisas para **Cesto de roupa**.
  - Camiseta suja
  - Meia suja

**2. Arrastar para o alvo**

> Agora ponha a mesa.

Arrasta 3 de 3 coisas para **Mesa**.
  - Prato
  - Copo
  - Garfo

**3. Arrastar para o alvo**

> E a comidinha do pet?

Arrasta 2 de 2 coisas para **Cachorrinho**.
  - Ração
  - Ossinho

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Ajudar em casa**
- Errado: Jogar no chão
- Explicacao: "Quem ajuda deixa a casa boa para todo mundo!"

**Reforco no fim:** "Ajudante da casa, orgulho da família!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 18 — Tela com limite ⏱️

Mundo 4 (Tarde) · cenario `bg_quarto_brincar`

**Abertura:** "{nome}, a tela tem hora de começar e hora de acabar."

**O personagem mostra:** "Escolher o tempo, assistir, e desligar quando o tempo acabar."

### Etapas

**1. Segurar com cronometro**

> Segure o cronômetro: ele marca o tempo da tela.

Segura o dedo em **Cronômetro** por 12 s.
  - _Se erra:_ "Segure mais um pouquinho, o tempo ainda está correndo!"

**2. Escolher entre opcoes**

> O tempo acabou. O que fazer?

Escolhe uma:
  - Desligar na hora _(certo)_
  - Só mais 5 minutinhos
  - _Se erra:_ "Combinado é combinado. Desligar na hora é de gente grande!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Trocar por uma brincadeira**
- Errado: Só mais 5 minutos
- Explicacao: "Depois da tela vem a brincadeira. O corpo também quer se mexer!"

**Reforco no fim:** "Desliguei na hora, sou dono do meu tempo!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 19 — Banho, dentes e sono 🛁

Mundo 5 (Noite) · cenario `bg_quarto_noite`

**Abertura:** "O dia acabou, {nome}. Vamos se arrumar para dormir?"

**O personagem mostra:** "Banho, pijama, escovar os dentes, uma história e a luz apagada."

### Etapas

**1. Sequencia ordenada**

> Toque na ordem da hora de dormir.

Toca na ordem certa:
  1. Banho
  2. Pijama
  3. História
  4. Apagar a luz
  - _Se erra:_ "Ainda não! Esse vem depois."

**2. Escovacao guiada**

> Antes de dormir, escovação caprichada!

Escova a boca em 4 lugares, seguindo a bolinha verde:
  1. Em cima, deste lado
  2. Em cima, do outro lado
  3. Embaixo, deste lado
  4. Embaixo, do outro lado

**3. Respirar**

> Agora respire fundo três vezes para o sono chegar.

Respira fundo 3 vezes.

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Apagar a luz e dormir**
- Errado: Tela na cama
- Explicacao: "A tela acende o olho e o sono foge. História é bem melhor!"

**Reforco no fim:** "Dia cumprido, bons sonhos!"

Recompensa: 1 moeda · ate 3 estrelas

---

## Missao 20 — Dia do doutor e do dentista 🩺

Mundo 5 (Noite) · cenario `bg_consultorio` · **missao bonus** (so abre com os 5 mundos fechados)

**Abertura:** "Hoje é dia de consulta, {nome}. Não precisa ter medo: eu vou junto!"

**O personagem mostra:** "Esperar a vez, abrir a boca e contar onde dói. Só isso!"

### Etapas

**1. Segurar com cronometro**

> Primeiro, esperar a sua vez na sala de espera.

Segura o dedo em **Sala de espera** por 12 s.
  - _Se erra:_ "Já está quase! Respire e espere mais um pouquinho."

**2. Tocar**

> Toque no que o doutor usa para te cuidar.

Toca em 3 de 3 figuras.
  - Escutar o coração
  - Ver a febre
  - Ver o tamanho

**3. Escolher entre opcoes**

> O dentista pediu para abrir a boca. O que fazer?

Escolhe uma:
  - Abrir bem a boca _(certo)_
  - Fechar e esconder
  - _Se erra:_ "Dá para ter medo e mesmo assim abrir a boca. Eu estou aqui com você!"

### Pode ou nao pode

Pergunta: "O que pode?"

- Certo: **Contar onde dói**
- Errado: Não falar nada
- Explicacao: "Quem conta onde dói ajuda o doutor a cuidar mais rápido!"

**Reforco no fim:** "Fui corajoso no doutor!"

Recompensa: 1 moeda · ate 3 estrelas

---
