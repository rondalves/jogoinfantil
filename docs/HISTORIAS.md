# As seis historinhas de dormir — roteiro de gravação

Uma por mundo. A criança destrava a historinha quando fecha o mundo, junto com
o joguinho. Títulos e nomes de arquivo já estão em `src/stories/*.json`.

## Antes de gravar

- Voz `adulto` (a mesma das instruções do jogo), **mais baixa e mais lenta**.
  É pra dormir. Pense em contar pra uma criança que já está de olho fechado.
- **Um mp3 por história**, mono, 44.1 kHz, salvo em `assets/audio/historias/`
  com o nome indicado no cabeçalho de cada uma.
- Todas no mesmo dia, mesmo lugar, mesma distância do microfone. Depois,
  Audacity: redução de ruído e *Normalizar* em **-3 dB**, em todas.
- Depois de gravar, não precisa editar nada: rode o comando abaixo apontando
  para a pasta dos WAV (cada nome começando com `01___`, `02___`…). Ele limpa
  a voz, iguala o volume, põe a canção de ninar por baixo, salva os mp3 e
  preenche o `duracao` dos JSONs.

  ```bash
  python tools/historias_audio.py <pasta-dos-wav>
  ```

  Depois, o livro animado (páginas com texto e cena, virando junto com o
  áudio). A cena de cada página fica em `tools/livro_cenas.json`:

  ```bash
  python tools/livro.py <pasta-dos-wav>
  ```

## Como ler as marcas

| marca | o que fazer |
|---|---|
| fim de linha | pausa natural de **1 segundo** |
| `[pausa]` | **2 segundos** de silêncio |
| `[pausa longa]` | **3 a 4 segundos** de silêncio |
| `…` dentro da frase | segura meio segundo e continua na mesma respiração |
| `[baixinho]` | daqui até o fim da história, a voz vai caindo: mais lenta e mais baixa a cada linha |
| *(itálico)* | direção, não é pra ler |

Começo e fim de cada arquivo: **1 segundo de silêncio**, não mais.

---

## 01 · A raposinha e o sol que acordou cedo

**Arquivo:** `01-sol-que-acordou-cedo.mp3` · mundo 1 · ~2 min 30

*(1 s de silêncio)*

Era bem cedinho, e o céu ainda estava azul-escuro.
A raposinha dormia enroladinha, com o rabo cobrindo o nariz.

[pausa]

Lá no alto, o Sol abriu um olho.
Depois o outro.
E pensou: "Hoje eu acordei cedo demais."
Ele ficou ali, quietinho, esperando a hora de subir.

[pausa]

Enquanto esperava, o Sol foi acordando o mundo devagarzinho.
Primeiro acordou um passarinho, que fez um "piu" pequenininho… e dormiu de novo.
Depois acordou uma flor, que abriu só uma pétala… e esperou.
Depois acordou o vento, que passou de mansinho pela janela da raposinha e bagunçou um pouquinho a franja dela.

[pausa]

A raposinha se espreguiçou.
Esticou as patas da frente… esticou as patas de trás… e bocejou bem grande.

"Bom dia, Sol", ela disse.
"Bom dia, raposinha", disse o Sol. "Hoje eu acordei cedo. Posso te fazer companhia?"
"Pode", disse a raposinha.

[pausa]

E os dois ficaram olhando o céu mudar de cor.
Azul-escuro… azul-claro… cor-de-rosa… e depois amarelinho, bem quente.

[pausa]

A raposinha lavou o rosto com a água fresca.
Escovou os dentes bem devagar, um por um.
Penteou a franja que o vento bagunçou.
E arrumou a cama, puxando a coberta até ficar lisinha.

"Agora eu estou pronta", ela disse.
O Sol sorriu e subiu mais um pouquinho no céu.

[pausa longa]

[baixinho]

Mas isso foi de manhã.
Agora já é noite.

O Sol foi dormir do outro lado do mundo… e deixou a Lua cuidando da raposinha.

[pausa]

A raposinha se enrolou de novo, com o rabo cobrindo o nariz.
Fechou um olho…
fechou o outro…

[pausa]

E dormiu.

*(1 s de silêncio, parar)*

---

## 02 · O primeiro dia de aula

**Arquivo:** `02-primeiro-dia-de-aula.mp3` · mundo 2 · ~2 min 45

*(1 s de silêncio)*

A raposinha tinha uma mochila nova.
Era vermelha, com um bolso na frente.
Dentro da mochila tinha um lápis, um caderno e uma maçã.

[pausa]

Era o primeiro dia de aula, e a barriga da raposinha estava fazendo cócegas por dentro.
Não era fome.
Era um friozinho.

"Esse friozinho tem nome", disse a mamãe raposa.
"Chama saudade adiantada. É porque você vai sentir saudade de casa, e depois vai sentir saudade da escola. Isso é bom."

[pausa]

A raposinha deu a pata para a mamãe.
Elas atravessaram a rua bem juntinhas, olhando para um lado… e para o outro… e para o primeiro lado de novo.

[pausa]

Na porta da escola, tinha uma professora com um sorriso grande.
Ela se abaixou e disse: "Bom dia. Pode entrar."
A raposinha disse: "Bom dia", bem baixinho.
Mas a professora ouviu.

[pausa]

Na sala, tinha uma mesa pequena do tamanho dela.
E do lado, tinha um ursinho sentado, olhando para os próprios pés.
A raposinha também olhou para os próprios pés.
Ficaram um tempão assim.

[pausa]

Aí a raposinha tirou a maçã da mochila e disse: "Quer um pedaço?"
O ursinho disse: "Quero. Obrigado."
E pronto.
Agora eram dois.

[pausa]

Eles desenharam juntos, ouviram a professora contar uma história sobre um peixe que queria voar, e esperaram a vez de brincar no balanço.

[pausa]

Quando a mamãe voltou para buscar, a raposinha correu e deu um abraço bem apertado.
"Como foi?", perguntou a mamãe.
"Foi bom", disse a raposinha. "Amanhã eu volto."

[pausa longa]

[baixinho]

À noite, deitada na cama, a raposinha pensou no ursinho.
Pensou na professora.
Pensou no peixe que queria voar.

[pausa]

E o friozinho na barriga virou um quentinho.

Ela puxou a coberta até o queixo…
Fechou os olhos…

[pausa]

E dormiu.

*(1 s de silêncio, parar)*

---

## 03 · A viagem da lua no carro

**Arquivo:** `03-viagem-da-lua-no-carro.mp3` · mundo 3 · ~2 min 45

*(1 s de silêncio)*

Era fim de tarde, e a raposinha ia voltando para casa de carro.
Ela estava na cadeirinha, com o cinto bem afivelado.
Clique.

[pausa]

Pela janela, o céu estava ficando cor de laranja.
Depois cor de uva.
Depois azul-escuro.

E aí a raposinha viu a Lua.
A Lua estava redondinha, bem em cima de uma árvore.

[pausa]

O carro andou… e a Lua andou junto.
O carro virou a esquina… e a Lua virou junto.

"Mamãe, a Lua está vindo com a gente?", perguntou a raposinha.
"Parece que sim", disse a mamãe, sorrindo. "Ela quer ver onde você mora."

[pausa]

A raposinha ficou olhando.
A Lua passou por cima de uma casa amarela.
Passou por cima de um poste.
Passou por cima de um cachorro que latiu para ela, e ela nem ligou.

[pausa]

A raposinha bocejou.

O carro fazia um barulhinho baixinho: rrrrum… rrrrum…
E o balanço era gostoso, como um colo.

As luzes da rua iam passando pela janela: uma luz… outra luz… outra luz…

[pausa]

[baixinho]

A raposinha encostou a cabeça na cadeirinha.
Os olhos foram ficando pesados.
Mas ela queria ver se a Lua ia chegar junto.

Mais uma luz… mais uma luz…

[pausa]

O carro parou.
"Chegamos", disse a mamãe, bem baixinho.

A raposinha abriu um olho.
Lá fora, em cima da casa dela, bem redondinha, estava a Lua.
"Ela chegou", disse a raposinha.

[pausa]

A mamãe soltou o cinto, pegou a raposinha no colo e entrou em casa devagar, sem fazer barulho.
A raposinha nem lembrou de tirar o sapato.
A mamãe tirou por ela.

[pausa longa]

E pela janela do quarto, a Lua ficou olhando…
bem quietinha…

[pausa]

Até a raposinha dormir.

*(1 s de silêncio, parar)*

---

## 04 · O brinquedo que queria brincar

**Arquivo:** `04-brinquedo-que-queria-brincar.mp3` · mundo 4 · ~2 min 45

*(1 s de silêncio)*

Na caixa de brinquedos da raposinha morava um carrinho azul.
Ele era um carrinho feliz.
Tinha quatro rodas que giravam, uma porta que abria, e uma buzina que fazia "bi-bi" bem fininho.

[pausa]

Todo dia, de tarde, a raposinha abria a caixa e o carrinho azul saía correndo pela sala.
Ele subia o sofá como se fosse uma montanha.
Descia a almofada como se fosse um escorregador.
Passava por baixo da mesa como se fosse um túnel.
Era o melhor momento do dia.

[pausa]

Mas um dia a raposinha brincou… brincou… e, quando a janta ficou pronta, deixou o carrinho azul embaixo do sofá e foi comer.

O carrinho ficou lá, no escuro.
Ele não ficou bravo.
Só ficou um pouquinho sozinho.

[pausa]

"Será que ela esqueceu de mim?", pensou o carrinho.
De dentro da caixa de brinquedos, o ursinho respondeu: "Não esqueceu. Ela só está jantando. Daqui a pouco ela volta."
E o carrinho esperou.

[pausa]

Ele ouviu a raposinha rindo na cozinha.
Ouviu os pratos tilintando.
Ouviu a água do banho.
E aí ouviu os passinhos dela voltando para a sala.

[pausa]

A raposinha se abaixou, olhou embaixo do sofá, e disse: "Achei você!"
Ela pegou o carrinho azul, passou a mão nele para tirar o pó, e colocou dentro da caixa, bem do lado do ursinho.

"Boa noite, carrinho. Amanhã a gente brinca de novo."
"Bi-bi", disse o carrinho, bem fininho.

[pausa]

A raposinha fechou a tampa da caixa com cuidado.

[pausa longa]

[baixinho]

Dentro da caixa, estava escurinho e quentinho.
O carrinho encostou no ursinho.
O ursinho encostou na boneca.
A boneca encostou na bola.
Todos os brinquedos juntos, bem guardadinhos, esperando o dia seguinte.

[pausa]

E a raposinha foi para a cama…
pensando em que montanha o carrinho ia subir amanhã…

[pausa]

E dormiu.

*(1 s de silêncio, parar)*

---

## 05 · A sopa de estrelas

**Arquivo:** `05-sopa-de-estrelas.mp3` · mundo 5 · ~2 min 45

*(1 s de silêncio)*

A vovó raposa estava fazendo sopa.
A panela era grande, e a colher era de madeira, e o cheiro ia pela casa inteira: pela sala… pelo corredor… até o quarto da raposinha.

[pausa]

"Vovó, que sopa é essa?", perguntou a raposinha, subindo no banquinho.
"É sopa de estrelas", disse a vovó.
A raposinha arregalou os olhos. "Estrelas de verdade?"
"Olha aqui", disse a vovó.
E mexeu a sopa devagarinho.

[pausa]

Dentro da panela, boiando no caldo dourado, tinha um monte de macarrãozinho em formato de estrela.
Pequenininhas.
Amarelas.
Girando devagar quando a colher passava.

"Cada estrela tem um gosto", disse a vovó.
"Essa tem gosto de cenoura. Essa tem gosto de batata. E essa… essa tem gosto de dia bom."

[pausa]

A raposinha ajudou a pôr a mesa.
Um prato para ela, um prato para a vovó.
Uma colher para cada uma.
Um copo de água.
Elas sentaram juntas.

[pausa]

A raposinha soprou a sopa para esfriar: fuuu… fuuu…
E tomou a primeira colherada.
Estava quentinha.
Estava gostosa.
E tinha gosto de dia bom mesmo.

[pausa]

"Vovó, o que você fez hoje?", perguntou a raposinha.
"Fiz sopa", disse a vovó. "E você?"
"Eu brinquei. E fiz a lição. E guardei os brinquedos."
"Então você teve um dia cheio de estrelas", disse a vovó.

[pausa]

Elas tomaram a sopa até o fim, sem pressa, conversando baixinho.
Depois a raposinha levou o prato para a pia.
Agradeceu a vovó.
E deu um beijo nela.

[pausa longa]

[baixinho]

Na hora de dormir, a raposinha olhou pela janela.
O céu estava escuro e cheio de estrelas, pequenininhas, amarelas, igualzinhas às da sopa.

[pausa]

"Será que o céu também é uma sopa?", ela pensou.

E foi pensando nisso…
bem devagar…

[pausa]

Até dormir.

*(1 s de silêncio, parar)*

---

## 06 · A raposinha vai dormir

**Arquivo:** `06-raposinha-vai-dormir.mp3` · mundo 6 · ~3 min

*(Esta é a mais lenta de todas. Já comece baixo.)*

*(1 s de silêncio)*

A raposinha estava de pijama.
Era um pijama macio, com estrelinhas, e as mangas eram um pouquinho grandes.

[pausa]

Ela já tinha tomado banho.
A pele estava cheirosa.
O cabelo estava penteado.
Ela já tinha escovado os dentes, um por um, os de cima e os de baixo.

Agora era hora de dormir.

[pausa]

A mamãe raposa apagou a luz grande e acendeu a luzinha pequena, que fazia um brilho amarelo bem fraquinho no canto do quarto.
A raposinha deitou.
A mamãe puxou a coberta até o queixo dela.

[pausa]

"Agora vamos dizer boa noite para tudo", disse a mamãe.

*(cada "boa noite" com 1 s depois)*

"Boa noite, janela", disse a raposinha.
"Boa noite, cortina."
"Boa noite, ursinho."
"Boa noite, carrinho azul."
"Boa noite, sapatos."
"Boa noite, luzinha."
"Boa noite, Lua."

[pausa longa]

A mamãe fez carinho na cabeça da raposinha.
Devagar… devagar…

[pausa]

[baixinho]

"Agora vamos relaxar o corpo", disse a mamãe.
"Primeiro as patinhas dos pés. Elas estão pesadas… pesadas… e quentinhas."
A raposinha sentiu as patinhas ficarem pesadas.

[pausa]

"Agora as pernas. Pesadas… quentinhas."

[pausa]

"Agora a barriga. Sobe… e desce… sobe… e desce…"

[pausa]

"Agora as patas da frente. Soltinhas."

[pausa]

"Agora o rostinho. Soltinho. A boca fecha. Os olhos fecham."

[pausa]

A raposinha respirou fundo.

Lá fora, o vento passou de mansinho pela janela.
Um grilo cantou bem baixinho.
A Lua ficou olhando.

[pausa]

A mamãe deu um beijo na testa da raposinha.
"Boa noite, raposinha. Eu te amo."
"Boa noite, mamãe", disse a raposinha, com a voz já bem pequenininha.

[pausa longa]

E a raposinha…

devagar…

devagarinho…

[pausa]

Dormiu.

*(1 s de silêncio, parar)*
