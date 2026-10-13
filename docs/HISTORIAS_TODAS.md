# As 20 historinhas — roteiro de gravação

As 20 histórias juntas, na ordem, para gravar de uma vez. As 01 a 12 têm
uns 3 minutos; as 13 a 20, de 4 a 5. Só 01 a 06 já estão no jogo.

## Antes de gravar

- Voz `adulto` (a mesma das instruções do jogo), **mais baixa e mais lenta**.
  É pra dormir. Pense em contar pra uma criança que já está de olho fechado.
- **Um arquivo por história**, salvo com o nome do cabeçalho (`01___...`,
  `02___...`): o script de áudio acha cada um pelo número.
- Todas no mesmo dia, mesmo lugar, mesma distância do microfone.
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

**Arquivo:** `01___O_sol_que_acordou_cedo.wav` · mundo 1 · ~2 min 30

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

**Arquivo:** `02___O_primeiro_dia_de_aula.wav` · mundo 2 · ~2 min 45

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

**Arquivo:** `03___A_viagem_da_lua_no_carro.wav` · mundo 3 · ~2 min 45

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

**Arquivo:** `04___O_brinquedo_que_queria_brincar.wav` · mundo 4 · ~2 min 45

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

**Arquivo:** `05___A_sopa_de_estrelas.wav` · mundo 5 · ~2 min 45

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

**Arquivo:** `06___A_raposinha_vai_dormir.wav` · mundo 6 · ~3 min

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

---

## 07 · A gotinha que lavou o rosto da raposinha

**Arquivo:** `07___A_gotinha.wav` · mundo 1 · Manhã · ~2 min 45

*(1 s de silêncio)*

Lá no alto do céu, dentro de uma nuvem branca, morava uma gotinha de água.
Ela era pequenininha, redondinha e muito curiosa.

[pausa]

Uma noite, choveu bem devagar.
E a gotinha desceu… desceu… desceu…
Passou por uma folha, escorregou por um galho, e caiu dentro de um rio.

[pausa]

O rio levou a gotinha passeando.
Ela viu peixinhos dormindo.
Viu pedrinhas lisas no fundo.
Viu a Lua brilhando em cima da água.

[pausa]

De manhã, a gotinha entrou num cano comprido, fez uma curva, fez outra curva…
e saiu pela torneira da casa da raposinha.
Plic.

[pausa]

A raposinha tinha acabado de acordar.
Ela juntou as patinhas embaixo da torneira, e a gotinha caiu bem no meio delas.
"Bom dia, gotinha", disse a raposinha.
E lavou o rosto.
A água estava fresquinha.
A raposinha abriu bem os olhos e sorriu.

[pausa]

Depois, a gotinha ajudou a escovar os dentes.
Os de cima… os de baixo… e os do fundo, lá atrás.
Depois ajudou a lavar as patinhas com sabão, fazendo espuma, espuma, espuma, até os germes irem embora.

[pausa]

Aí a gotinha escorreu pela pia, voltou pelo cano, e chegou no rio de novo.
O sol esquentou a água.
E a gotinha, bem leve, subiu… subiu… subiu…
até a nuvem branca, de volta para casa.

[pausa longa]

[baixinho]

Agora já é noite.
A gotinha está lá em cima, dentro da nuvem, descansando.
Amanhã ela pode cair de novo, bem devagarinho, em algum lugar.

[pausa]

Quem sabe na torneira da raposinha.
Quem sabe na sua.

[pausa]

Boa noite, gotinha.

*(1 s de silêncio, parar)*

---

## 08 · As cores do coração

**Arquivo:** `08___As_cores_do_coracao.wav` · mundo 2 · Escola · ~2 min 45

*(1 s de silêncio)*

Na escola da raposinha, tinha uma caixa de lápis de cor bem grande.
Um dia, a professora disse: "Hoje vamos desenhar o que a gente sente."

[pausa]

A raposinha pegou o lápis amarelo.
"Amarelo é quando eu fico feliz", ela disse.
E desenhou um sol, bem redondo, igual ao dia em que ganhou a mochila nova.

[pausa]

Depois ela pegou o lápis azul.
"Azul é quando eu fico triste."
E desenhou uma chuvinha, igual ao dia em que o balão dela voou para longe.
A professora fez carinho na cabeça dela.
"Tudo bem ficar azul às vezes", disse a professora. "Depois passa."

[pausa]

Depois ela pegou o lápis vermelho.
"Vermelho é quando eu fico brava."
E desenhou um vulcão, igual ao dia em que o amigo pegou o brinquedo dela sem pedir.
"E o que você fez?", perguntou a professora.
"Eu respirei fundo três vezes", disse a raposinha. "E pedi de volta, com calma."

[pausa]

Por último, ela pegou o lápis verde.
"Verde é quando eu fico calma."
E desenhou uma árvore grande, com sombra embaixo, bem quietinha.

[pausa]

O ursinho, sentado do lado, olhou o desenho e disse: "Que bonito."
A raposinha disse: "Obrigada."
E emprestou o lápis verde para ele.

[pausa longa]

[baixinho]

À noite, deitada na cama, a raposinha pensou nas cores.
O amarelo do dia feliz.
O azul que passou.
O vermelho que se acalmou.

[pausa]

E agora, bem dentro do peito, só tinha o verde.
Calminho.
Igual à sombra da árvore.

[pausa]

E a raposinha dormiu.

*(1 s de silêncio, parar)*

---

## 09 · A tartaruga que não tinha pressa

**Arquivo:** `09___A_tartaruga.wav` · mundo 3 · Volta pra casa · ~2 min 45

*(1 s de silêncio)*

Na volta da escola, a raposinha e a mamãe pararam na calçada, esperando o sinal ficar verde.
E foi aí que a raposinha viu a tartaruga.

[pausa]

Ela estava parada do lado delas, com o casco marrom, olhando para o sinal também.
"Oi, tartaruga", disse a raposinha. "Você também vai atravessar?"
"Vou", disse a tartaruga. "Mas só quando o bonequinho ficar verde."

[pausa]

O sinal estava vermelho.
Os carros passavam: vrum… vrum… vrum…
A raposinha balançou o pé, impaciente.
A tartaruga nem se mexeu.

[pausa]

"Você não tem pressa?", perguntou a raposinha.
"Não", disse a tartaruga. "Quem tem pressa esquece de olhar. Eu gosto de olhar."
E ela olhou para o céu.
A raposinha olhou também.
Tinha uma nuvem com formato de coelho.

[pausa]

Aí o bonequinho ficou verde.
A mamãe deu a pata para a raposinha.
E as três atravessaram juntas, olhando para um lado… e para o outro.
A tartaruga foi devagarinho, um passo… outro passo… outro passo…
E a raposinha foi devagar também, só para acompanhar.

[pausa]

Do outro lado, a tartaruga disse: "Obrigada pela companhia."
"De nada", disse a raposinha. "Tchau, tartaruga."

[pausa longa]

[baixinho]

À noite, a raposinha lembrou da tartaruga.
Lembrou da nuvem de coelho.
E pensou que, às vezes, ir devagar é gostoso.

[pausa]

Ela respirou devagar, igual a tartaruga andava.
Um passo… outro passo…
Uma respiração… outra respiração…

[pausa]

E dormiu, sem pressa nenhuma.

*(1 s de silêncio, parar)*

---

## 10 · A cabana de cobertor

**Arquivo:** `10___A_cabana_de_cobertor.wav` · mundo 4 · Tarde em casa · ~2 min 45

*(1 s de silêncio)*

Era uma tarde de chuva.
A raposinha já tinha feito a lição de casa, com a letra bem caprichada.
E agora não sabia o que fazer.

[pausa]

"Papai, posso ver mais um desenho no tablet?"
O papai olhou o relógio. "O tempo do tablet de hoje já acabou", ele disse. "Mas eu tenho uma ideia melhor."

[pausa]

O papai pegou o cobertor grande, o xadrez.
Pegou duas cadeiras.
Pegou as almofadas do sofá.
E os dois construíram uma cabana, bem no meio da sala.

[pausa]

A raposinha entrou engatinhando.
Lá dentro estava escurinho e quentinho.
A chuva fazia tic… tic… tic… na janela.

[pausa]

O papai acendeu uma lanterna e apontou para o teto da cabana.
Apareceu um círculo de luz no cobertor.
"Olha, uma Lua", disse o papai.
A raposinha colocou a patinha na frente da lanterna, e apareceu a sombra de uma orelha de raposa.
Os dois riram baixinho.

[pausa]

Eles leram um livro dentro da cabana.
Contaram as gotas da chuva.
Fizeram sombra de passarinho, de coelho e de jacaré.

[pausa]

Quando a janta ficou pronta, a raposinha ajudou a desmontar a cabana.
Dobrou o cobertor, junto com o papai.
Colocou as almofadas de volta no sofá.
E guardou a lanterna na gaveta.

[pausa longa]

[baixinho]

Na hora de dormir, a raposinha puxou a coberta por cima da cabeça.
"Olha, papai. Outra cabana."
O papai sorriu e apagou a luz.

[pausa]

Lá fora, a chuva continuava: tic… tic… tic…
E dentro da cabaninha de coberta, bem quentinha…

[pausa]

a raposinha dormiu.

*(1 s de silêncio, parar)*

---

## 11 · A mesa comprida da floresta

**Arquivo:** `11___A_mesa_da_floresta.wav` · mundo 5 · Jantar · ~2 min 45

*(1 s de silêncio)*

Uma vez por ano, quando a Lua fica bem cheia, os bichos da floresta fazem um jantar juntos.
E esse ano, a raposinha foi convidada.

[pausa]

No meio da floresta tinha uma mesa comprida, feita de um tronco de árvore.
Em cima dela, vaga-lumes piscavam como velinhas.

[pausa]

Cada bicho trouxe uma coisa.
O coelho trouxe cenouras.
O esquilo trouxe nozes.
A dona coruja trouxe um pão quentinho.
O ursinho trouxe mel.
E a raposinha trouxe uma panela de sopa de estrelas, que a vovó ajudou a fazer.

[pausa]

Antes de comer, todos lavaram as patas no riacho.
Depois sentaram.
E ninguém começou a comer antes de todo mundo estar sentado.

[pausa]

"Por favor, me passa o pão?", pediu o coelho.
"Obrigado", disse o esquilo, quando ganhou a sopa.
A raposinha experimentou uma cenoura. Nunca tinha comido cenoura crua.
Era crocante.
Ela gostou.

[pausa]

Enquanto comiam, cada bicho contou uma coisa boa do seu dia.
O coelho achou um trevo.
O esquilo aprendeu a pular de um galho mais alto.
A raposinha contou que tinha desenhado as cores do coração.
E todos ouviram, quietinhos, um de cada vez.

[pausa longa]

[baixinho]

Quando a Lua chegou bem no alto, o jantar acabou.
Todos ajudaram a limpar a mesa.
E cada bicho foi para a sua toca.

[pausa]

A raposinha voltou para casa com a barriga cheia e o coração quentinho.
Os vaga-lumes foram iluminando o caminho, piscando devagar…
piscando devagar…

[pausa]

Até a raposinha chegar na cama, e dormir.

*(1 s de silêncio, parar)*

---

## 12 · A nuvenzinha cansada

**Arquivo:** `12___A_nuvenzinha_cansada.wav` · mundo 6 · Noite · ~3 min

*(Esta é a mais lenta da leva, igual à 06. Já comece baixo. É uma respiração guiada: a criança pode respirar junto.)*

*(1 s de silêncio)*

A raposinha já estava de pijama, deitada na cama.
Pela janela, ela viu uma nuvenzinha passando devagar na frente da Lua.

[pausa]

A nuvenzinha parecia cansada.
Ela tinha passeado o dia inteiro pelo céu.
Tinha feito sombra para as flores.
Tinha brincado de virar coelho, virar barco, virar sorvete.

[pausa]

"Nuvenzinha, você está com sono?", perguntou a raposinha, baixinho.
"Estou", disse a nuvenzinha. "Mas eu não sei dormir."
"Eu te ensino", disse a raposinha. "Faz igual a mim."

[pausa longa]

[baixinho]

"Primeiro, a gente enche a barriga de ar, devagar, igual um balão."
*(inspire junto, devagar)*
Enche…
enche…
enche…

[pausa]

"Agora solta, bem devagarinho."
*(solte o ar, devagar)*
Fuuuuu…

[pausa]

A nuvenzinha encheu… e soltou.
E ficou um pouquinho menor, um pouquinho mais leve.

[pausa]

"De novo", disse a raposinha.
Enche… enche… enche…

[pausa]

E solta… fuuuuu…

[pausa]

A nuvenzinha ficou mais leve ainda.
Ela parou de andar.
Ficou quietinha, bem na frente da Lua, como se a Lua fosse um travesseiro.

[pausa]

"Mais uma vez", disse a raposinha, com a voz já bem pequenininha.
Enche… devagar…

[pausa]

E solta…

[pausa longa]

A nuvenzinha dormiu.
E a Lua ficou cuidando dela.

[pausa]

E a raposinha, que também tinha respirado junto…

devagar…

devagarinho…

[pausa]

dormiu também.

*(1 s de silêncio, parar)*

---

## 13 · A raposinha e as sombras amigas

**Arquivo:** `13___As_sombras_amigas.wav` · ~4 min 50

*(1 s de silêncio)*

Naquela noite, a raposinha não conseguia dormir.
A luz já estava apagada.
A coberta estava puxada até o queixo.
Mas no canto do quarto tinha uma sombra grande, comprida, que parecia um monstro.

[pausa]

"Mamãe…", chamou a raposinha, bem baixinho.
A mamãe raposa entrou devagar e sentou na beira da cama.
"O que foi, meu amor?"
"Tem um monstro ali no canto."

[pausa]

A mamãe não riu.
Ela olhou para o canto, bem séria, e disse: "Vamos ver quem é esse monstro?"
Ela acendeu a luzinha pequena.
E a sombra virou… o roupão pendurado atrás da porta.
Só o roupão, com o capuz para cima.

[pausa]

"Ah", disse a raposinha. "Era o roupão."
"Era", disse a mamãe. "Sabe, no escuro as coisas brincam de se fantasiar. O roupão vira monstro. A cadeira vira dragão. O ursinho vira um gigante."
"E por que elas fazem isso?"
"Porque também querem brincar antes de dormir", disse a mamãe, sorrindo.

[pausa]

Aí a mamãe teve uma ideia.
Ela pegou a lanterna da gaveta e deu para a raposinha.
"Vamos brincar com elas, então."

[pausa]

A raposinha acendeu a lanterna e apontou para a parede.
Apareceu um círculo de luz, redondo, igual à Lua.
A mamãe colocou as mãos na frente da luz, juntou os dedos assim… e na parede apareceu um passarinho, batendo as asas.
A raposinha riu.

[pausa]

Depois a raposinha tentou.
Ela levantou duas patinhas e apareceu uma sombra de coelho, com duas orelhas compridas.
Depois fez uma sombra de cachorro, que abria e fechava a boca.
Depois fez uma sombra de raposa, igualzinha a ela, com o focinho fino.

[pausa]

"Viu?", disse a mamãe. "As sombras não são monstros. São só desenhos que a luz faz. E quem segura a luz é você."

[pausa]

A raposinha apontou a lanterna para o roupão.
Agora ele era só um roupão, azul, macio, com o capuz para cima.
Ela apontou para a cadeira. Só uma cadeira, com a mochila em cima.
Ela apontou para o ursinho, sentado na prateleira. Só o ursinho, de olhos de botão, cuidando do quarto.

[pausa]

"Boa noite, roupão", disse a raposinha.
"Boa noite, cadeira."
"Boa noite, ursinho."

[pausa longa]

[baixinho]

A mamãe deixou a lanterna do lado do travesseiro, para o caso de alguma sombra querer brincar de novo.
Deu um beijo na testa da raposinha.
E saiu devagar, deixando a porta um pouquinho aberta.

[pausa]

No canto do quarto, o roupão continuou pendurado, quietinho.
Na parede, a luz do corredor fazia uma faixa fininha, dourada.

[pausa]

A raposinha segurou a lanterna, mas nem precisou acender.
Ela sabia quem era cada sombra.
E sabendo disso…

[pausa]

fechou os olhos…

e dormiu.

*(1 s de silêncio, parar)*

---

## 14 · O dente mole da raposinha

**Arquivo:** `14___O_dente_mole.wav` · ~4 min 35

*(1 s de silêncio)*

Num dia de manhã, enquanto escovava os dentes, a raposinha sentiu uma coisa diferente.
Um dente da frente, embaixo, estava balançando.
Ela tocou com a língua.
Balançava para a frente… e para trás.

[pausa]

"Mamãe! Meu dente está quebrado!"
A mamãe veio ver. Olhou bem de perto e sorriu.
"Não está quebrado, não. Ele está mole. Quer dizer que você está crescendo."
"Crescendo?"
"Esse é um dente de leite. Ele cuidou de você desde que você era bebê. Agora ele vai sair, para dar lugar a um dente novo, maior e mais forte."

[pausa]

A raposinha ficou um pouquinho preocupada.
"Vai doer?"
"Quase nada", disse a mamãe. "E, se você quiser, a gente pode visitar a doutora dentista para ela dar uma olhadinha."

[pausa]

À tarde, as duas foram ao consultório.
A doutora dentista era uma coruja de óculos redondos e jaleco branco.
Ela tinha uma cadeira que subia e descia, e uma luz que acendia em cima.
"Abre a boca bem grande, igual a um leão", disse a doutora coruja.
A raposinha abriu. Ahhhhhh.

[pausa]

A doutora olhou com um espelhinho pequenininho.
"Que dentes bonitos! Você escova direitinho, hein?"
A raposinha fez que sim com a cabeça, ainda de boca aberta.
"Esse aqui está prontinho para sair. Pode deixar que ele sai sozinho, quando quiser."
E deu para a raposinha um adesivo de estrela.

[pausa]

Os dias foram passando.
O dente balançava quando ela comia maçã.
Balançava quando ela ria.
Balançava quando ela bocejava.

[pausa]

Até que uma noite, comendo um pedaço de pão macio na janta…
plic.
O dente saiu.
Era pequenininho, branquinho, do tamanho de um grão de arroz.

[pausa]

A raposinha olhou no espelho.
Tinha uma janelinha no meio do sorriso.
Ela sorriu de novo, para ver melhor. E riu.
"Mamãe, olha! Agora eu tenho uma janelinha!"

[pausa]

O papai trouxe uma caixinha de madeira, pequena, com uma tampa que fechava com um clique.
"Para guardar o seu primeiro dente", ele disse.
A raposinha colocou o dente lá dentro, com cuidado.
Clique.
E deixou a caixinha embaixo do travesseiro, para ter certeza de que ele estava seguro.

[pausa longa]

[baixinho]

Na cama, a raposinha passou a língua na janelinha.
Lá embaixo, escondidinho, um dente novo já estava começando a crescer.
Devagar.
Sem pressa.
Um pouquinho a cada noite, enquanto ela dormia.

[pausa]

"Boa noite, dentinho", ela disse para a caixinha.
"Obrigada por cuidar de mim."

[pausa]

E, com a caixinha embaixo do travesseiro e a janelinha no sorriso…

[pausa]

a raposinha dormiu.

*(1 s de silêncio, parar)*

---

## 15 · A sementinha do jardim da vovó

**Arquivo:** `15___A_sementinha.wav` · ~4 min 40

*(1 s de silêncio)*

A vovó raposa tinha um jardim atrás da casa.
Tinha flor amarela, flor vermelha, flor roxa.
Tinha uma horta com alface, cenoura e tomatinho.
E tinha um banquinho de madeira, onde a vovó sentava de tarde para olhar tudo crescer.

[pausa]

Num sábado, a raposinha foi visitar a vovó.
"Hoje você vai plantar uma coisa", disse a vovó.
E colocou na palma da patinha da raposinha uma semente.
Era pequena, marrom, redondinha.

[pausa]

"O que vai nascer dela?", perguntou a raposinha.
"Um girassol", disse a vovó. "Uma flor grande, amarela, que gosta de olhar para o sol."
A raposinha olhou para a semente. Era tão pequena.
"Uma flor grande vai sair daqui de dentro?"
"Vai", disse a vovó. "Mas precisa de três coisas: terra, água… e paciência."

[pausa]

As duas cavaram um buraquinho na terra, com uma pazinha.
A raposinha colocou a semente lá dentro.
Cobriu com terra, bem de leve, como quem cobre um bebê com um cobertor.
E regou com o regador verde. A água fez chhhhh na terra.

[pausa]

No dia seguinte, a raposinha correu para o jardim.
Olhou para o buraquinho.
Nada.
Só terra.

[pausa]

"Vovó, ela não nasceu!"
A vovó riu baixinho. "Ela está trabalhando lá embaixo, no escurinho. Primeiro ela faz raízes, para se segurar firme. Depois ela sobe. Ela tem o tempo dela."

[pausa]

Então a raposinha esperou.
Toda vez que visitava a vovó, regava a semente.
E conversava com ela.
"Oi, sementinha. Hoje eu aprendi a pular corda."
"Oi, sementinha. Hoje choveu, você deve ter gostado."

[pausa]

Até que, numa manhã de domingo, lá estava.
Um brotinho verde, fininho, com duas folhinhas abertas, como duas mãozinhas dizendo oi.
A raposinha arregalou os olhos.
"Vovó! Vovó! Ela nasceu!"

[pausa]

As semanas passaram.
O brotinho virou um caule.
O caule ficou mais alto que a raposinha.
E um dia, lá no alto, abriu uma flor enorme, amarela, redonda, olhando para o sol.

[pausa]

A raposinha e a vovó sentaram no banquinho de madeira para olhar.
"Viu?", disse a vovó. "Você também é assim. Cada noite, enquanto dorme, você cresce um pouquinho. Não dá para ver. Mas está acontecendo."

[pausa longa]

[baixinho]

Naquela noite, na cama, a raposinha pensou no girassol.
Pensou nas raízes, lá embaixo, no escurinho, se segurando firme.
Pensou nas folhinhas abrindo devagar.

[pausa]

E sentiu o corpo ficando pesado e quentinho, igual terra depois da chuva.
Lá no jardim, o girassol também tinha fechado as pétalas para dormir.

[pausa]

E os dois cresceram mais um pouquinho naquela noite…

[pausa]

enquanto dormiam.

*(1 s de silêncio, parar)*

---

## 16 · As ondas que respiravam

**Arquivo:** `16___As_ondas.wav` · ~4 min 30

*(Esta tem uma respiração guiada no fim, como a 12. Leia as ondas bem devagar.)*

*(1 s de silêncio)*

Nas férias, a raposinha foi pela primeira vez à praia.
Ela nunca tinha visto tanta água junta.
O mar era azul, verde e prateado, tudo ao mesmo tempo.
E não acabava nunca. Ia até onde o céu começava.

[pausa]

A areia estava quentinha embaixo das patas.
O papai abriu um guarda-sol listrado.
A mamãe estendeu uma toalha.
E a raposinha correu até a beira da água.

[pausa]

Uma onda pequenininha veio chegando… chegando…
e molhou as patas dela.
Estava gelada! A raposinha deu um pulinho e riu.
Aí a onda voltou para o mar, devagar, puxando a areia junto.

[pausa]

Ela ficou ali olhando.
A onda vinha… e voltava.
Vinha… e voltava.
Parecia que o mar estava respirando.

[pausa]

A raposinha passou a tarde inteira na praia.
Fez um castelo de areia com quatro torres e uma ponte.
Achou uma concha cor-de-rosa, com listrinhas.
Encostou a concha na orelha e ouviu um barulhinho: shhhhhh.
"É o mar morando aqui dentro", disse o papai.

[pausa]

Viu um caranguejo andando de lado.
Viu uma gaivota branca voando bem alto.
E, no fim da tarde, viu o sol descendo, laranja, até encostar no mar.
O céu ficou cor de pêssego. Depois cor-de-rosa. Depois roxo.

[pausa]

A família voltou para a casinha de praia.
A raposinha tomou banho para tirar a areia.
Vestiu o pijama.
E deitou na cama, com a concha cor-de-rosa do lado do travesseiro.

[pausa]

Pela janela aberta, dava para ouvir o mar lá longe.
Shhhhhh… shhhhhh…

[pausa longa]

[baixinho]

"Papai, o mar ainda está respirando?", perguntou a raposinha.
"Está", disse o papai. "Quer respirar junto com ele?"

[pausa]

"Quando a onda vem, a gente puxa o ar… devagar."
*(inspire junto)*
A onda vem… vem… vem…

[pausa]

"Quando a onda volta, a gente solta o ar… devagar."
*(solte o ar)*
A onda volta… shhhhhh…

[pausa]

A onda vem… vem… vem…

[pausa]

E volta… shhhhhh…

[pausa]

A raposinha respirou junto com o mar.
Cada onda deixava o corpo dela um pouquinho mais pesado.
Um pouquinho mais quentinho.
Um pouquinho mais leve.

[pausa]

A onda vem…

[pausa]

e volta…

[pausa longa]

E, com o barulho do mar entrando pela janela…

devagarinho…

[pausa]

a raposinha dormiu.

*(1 s de silêncio, parar)*

---

## 17 · O irmãozinho da raposinha

**Arquivo:** `17___O_irmaozinho.wav` · ~4 min 45

*(1 s de silêncio)*

A barriga da mamãe raposa estava ficando grande.
Cada semana, um pouquinho maior.
"Tem um bebê aqui dentro", a mamãe explicou. "Logo ele vai chegar. E você vai ser a irmã mais velha."

[pausa]

A raposinha encostou a orelha na barriga.
Ouviu um barulhinho: tum-tum… tum-tum…
E sentiu um chutinho, bem pequenininho, na bochecha.
"Ele me deu oi!", ela disse.

[pausa]

Um dia, a mamãe e o papai foram para o hospital.
A raposinha ficou na casa da vovó, comendo sopa de estrelas.
E, no dia seguinte, o papai voltou com uma notícia.
"Ele chegou. O seu irmãozinho chegou."

[pausa]

O irmãozinho era muito pequeno.
Tinha orelhas que ainda não ficavam em pé.
Tinha um rabinho fininho, que parecia um pincel.
E dormia quase o dia inteiro, enroladinho num cobertor branco.

[pausa]

No começo, foi bom.
Mas depois de uns dias, a raposinha começou a sentir uma coisa diferente.
A mamãe estava sempre segurando o bebê.
O papai estava sempre trocando a fralda do bebê.
E todo mundo que visitava a casa só queria ver o bebê.

[pausa]

Uma tarde, a raposinha sentou sozinha no canto da sala, abraçada no ursinho.
O coração dela estava azul. Um pouquinho azul e um pouquinho vermelho.
A mamãe percebeu.
Colocou o bebê no berço e sentou do lado dela.

[pausa]

"Você está triste?", perguntou a mamãe.
A raposinha fez que sim.
"Parece que agora vocês só gostam dele."

[pausa]

A mamãe abraçou a raposinha bem forte.
"Sabe o amor?", disse a mamãe. "Ele não é igual a um bolo, que quando divide fica menor. O amor é igual a uma vela. Quando você acende outra vela com ela, a primeira continua brilhando do mesmo tamanho. E a casa fica com mais luz."

[pausa]

A raposinha pensou nisso.
"Então eu continuo com o amor inteiro?"
"Inteirinho", disse a mamãe. "E agora tem mais um para te amar também."

[pausa]

Nesse momento, o irmãozinho acordou e começou a chorar baixinho.
A raposinha chegou perto do berço.
Pegou o ursinho e colocou do lado dele.
E cantou uma musiquinha, bem baixinho, igual a mamãe cantava para ela.

[pausa]

O irmãozinho parou de chorar.
Abriu os olhinhos.
E segurou o dedo da raposinha com a patinha, bem apertado.

[pausa longa]

[baixinho]

Naquela noite, a raposinha foi dormir com o coração amarelo.
Do quarto dela, ela ouvia a mamãe cantando para o bebê, a mesma musiquinha.

[pausa]

Ela lembrou do dedo apertado.
Lembrou da vela que acende outra vela.
E pensou que a casa estava, mesmo, com mais luz.

[pausa]

"Boa noite, irmãozinho", ela sussurrou.

[pausa]

E dormiu.

*(1 s de silêncio, parar)*

---

## 18 · O dia em que a raposinha ficou dodói

**Arquivo:** `18___Dodoi.wav` · ~4 min 15

*(1 s de silêncio)*

Numa manhã, a raposinha acordou diferente.
O nariz estava entupido.
A garganta arranhava.
E o corpo estava quente, quente, como se tivesse corrido muito.

[pausa]

A mamãe colocou a mão na testa dela.
"Acho que alguém está com febre."
Pegou o termômetro, que fez um piiiip.
"Hoje você não vai para a escola. Hoje é dia de descansar."

[pausa]

A raposinha ficou um pouco triste.
Ia ter aula de pintura na escola.
E o ursinho, o amigo dela, ia levar um livro novo.
"Eles vão ficar com saudade?", ela perguntou.
"Vão", disse a mamãe. "E vão ficar felizes quando você voltar boazinha."

[pausa]

A mamãe arrumou um ninho no sofá.
Travesseiro fofo.
O cobertor xadrez.
O ursinho do lado.
E um copo de água com canudinho, bem pertinho.

[pausa]

A doutora coruja passou para ver a raposinha.
Ouviu o peito dela com um aparelho gelado: "respira fundo… agora solta".
Olhou a garganta: "ahhhhh".
"É um resfriado", disse a doutora. "O corpo dela está lutando contra uns germes. Precisa de três coisas: água, sopa quentinha e muito descanso."

[pausa]

Então a raposinha descansou.
A vovó trouxe sopa de estrelas, e soprou junto com ela: fuuu… fuuu…
O papai leu duas histórias, com voz bem baixinha.
O carrinho azul ficou estacionado do lado do travesseiro, para fazer companhia.

[pausa]

De tarde, a raposinha cochilou.
E quando acordou, ouviu a campainha.
Era o ursinho, com a mamãe dele, na porta.
Ele não podia entrar, para não pegar o resfriado.
Mas deixou um desenho na janela: uma raposinha sorrindo, com um sol em cima.
Embaixo estava escrito: "Melhora logo."

[pausa]

A raposinha sorriu.
E o coração dela ficou quentinho, de um jeito bom, diferente da febre.

[pausa longa]

[baixinho]

Na hora de dormir, a mamãe trocou o pijama dela por um mais fresquinho.
Deu o remédio que a doutora mandou.
E fez carinho na cabeça dela, devagar… devagar…

[pausa]

"Enquanto você dorme", disse a mamãe, "o seu corpo trabalha para te deixar boa. Ele é muito forte. Você só precisa descansar."

[pausa]

A raposinha respirou devagar.
O nariz já estava um pouquinho melhor.
A testa, um pouquinho menos quente.
O desenho do ursinho estava pendurado na parede, bem na frente da cama.

[pausa]

E, cuidada por todo mundo…

[pausa]

a raposinha dormiu, para acordar boazinha.

*(1 s de silêncio, parar)*

---

## 19 · O presente do ursinho

**Arquivo:** `19___O_presente_do_ursinho.wav` · ~4 min 30

*(1 s de silêncio)*

O aniversário do ursinho estava chegando.
Ele ia fazer cinco anos.
E a raposinha queria dar um presente muito especial.

[pausa]

"Mamãe, a gente pode comprar um presente bem grande?"
A mamãe pensou um pouco.
"Podemos comprar um presente. Mas sabe o que costuma deixar os amigos mais felizes? Um presente feito por você."
"Feito por mim?"
"Com as suas patinhas. Pensando nele."

[pausa]

A raposinha pensou.
O que o ursinho gostava?
Ele gostava de mel.
Gostava de desenhar.
E gostava, mais do que tudo, de olhar as estrelas.

[pausa]

Então a raposinha teve uma ideia.
Ela pegou um pote de vidro vazio, lavado e sequinho.
Pegou papel amarelo, uma tesoura sem ponta e cola.
E começou a recortar estrelas.
Uma estrela… duas estrelas… dez estrelas…

[pausa]

Algumas saíram tortas.
Uma saiu com quatro pontas em vez de cinco.
A raposinha ficou brava e quase desistiu.
Mas aí respirou fundo três vezes, igual tinha aprendido.
E pensou: "Estrela torta também brilha."

[pausa]

Em cada estrela, a mamãe ajudou a escrever uma coisinha.
"Você é meu amigo."
"Obrigada por dividir o lápis verde."
"Eu gosto quando a gente balança no balanço."
"Você me deu oi no primeiro dia de aula."

[pausa]

A raposinha colocou todas as estrelas dentro do pote.
Fechou a tampa.
E amarrou uma fita vermelha em volta, com um laço meio torto.
Era o pote de estrelas do ursinho.

[pausa]

No dia da festa, tinha bolo de mel, balões e música.
O ursinho ganhou um caminhão, um quebra-cabeça e uma bola.
A raposinha esperou a vez dela, com o pote escondido atrás das costas.
O coração batia rápido.
"E se ele não gostar?"

[pausa]

Quando chegou a vez, ela entregou o pote.
O ursinho olhou as estrelas amarelas lá dentro.
Abriu a tampa.
Pegou uma estrela e leu, com a ajuda da mamãe dele: "Você é meu amigo."
E abriu o maior sorriso da festa.

[pausa]

"É o melhor presente", ele disse. E deu um abraço apertado na raposinha.

[pausa longa]

[baixinho]

Naquela noite, a raposinha deitou na cama cansadinha da festa.
Pela janela, o céu estava cheio de estrelas de verdade.

[pausa]

Ela imaginou o ursinho, na casa dele, lendo mais uma estrela do pote.
E depois mais uma.
Até dormir também.

[pausa]

A raposinha sorriu, com o coração cheio.
Às vezes, dar um presente deixa a gente tão feliz quanto ganhar.

[pausa]

E, pensando nas estrelinhas tortas que também brilham…

[pausa]

ela dormiu.

*(1 s de silêncio, parar)*

---

## 20 · A estrelinha que caiu no quintal

**Arquivo:** `20___A_estrelinha.wav` · ~5 min

*(A última da leva e a mais lenta, igual à 06 e à 12. O fim é uma contagem para dormir: deixe cada número bem espaçado.)*

*(1 s de silêncio)*

Era uma noite bem escura, sem Lua.
A raposinha já estava de pijama, olhando pela janela, quando viu uma luz riscar o céu.
Ziiiiim.
E a luz caiu… bem no quintal.

[pausa]

"Papai! Uma estrela caiu no quintal!"
O papai olhou pela janela. Lá embaixo, perto do pé de laranja, tinha um brilho pequenininho, amarelo, piscando.
"Vamos ver?", disse o papai.
Os dois desceram de pantufa, bem devagar, sem fazer barulho.

[pausa]

Lá estava ela.
Uma estrelinha pequena, do tamanho de uma maçã, sentada na grama.
Ela piscava fraquinho, como quem está com frio.
E estava chorando.

[pausa]

"Oi, estrelinha", disse a raposinha. "Você se machucou?"
"Não", disse a estrelinha, fungando. "Eu escorreguei. Estava brincando de pega-pega com as outras estrelas e caí. Agora não sei voltar para o céu."

[pausa]

A raposinha pensou.
"Como você subia, antes de cair?"
A estrelinha pensou também.
"Quando eu fico bem calminha… eu fico leve. E quando eu fico leve, eu flutuo."
"Então vamos te deixar calminha", disse a raposinha.

[pausa]

Ela pegou a estrelinha com as duas patinhas, com muito cuidado.
Era quentinha, como uma xícara de leite morno.
O papai trouxe o cobertor xadrez, e os três sentaram na grama, embaixo do céu.

[pausa]

"Sabe o que eu faço quando quero ficar calminha?", disse a raposinha. "Eu conto as estrelas. Quer contar comigo?"
A estrelinha piscou que sim.

[pausa]

Elas olharam para cima.
O céu estava cheio de pontinhos de luz.
E as estrelas lá de cima, vendo a amiga lá embaixo, começaram a brilhar mais forte, uma de cada vez, para ajudar.

[pausa longa]

[baixinho]

"Uma estrela", disse a raposinha.
E uma estrela brilhou.

[pausa]

"Duas estrelas."
A estrelinha brilhou junto. Já não estava mais com frio.

[pausa]

"Três estrelas."
Ela parou de chorar.

[pausa]

"Quatro estrelas."
Ela ficou mais leve. Quase não pesava mais nas patinhas da raposinha.

[pausa]

"Cinco estrelas."
Ela começou a flutuar, só um pouquinho, acima das patinhas.

[pausa]

"Seis estrelas."
Subiu até a altura do pé de laranja.

[pausa]

"Sete estrelas."
Subiu até o telhado da casa.

[pausa]

"Oito estrelas."
Lá do alto, a estrelinha piscou: obrigada.

[pausa]

"Nove estrelas."
Ela encontrou as amigas no céu, e todas brilharam juntas.

[pausa]

"Dez estrelas…"

[pausa longa]

O papai pegou a raposinha no colo, enroladinha no cobertor.
Ela já estava de olhos fechados.
Subiu a escada devagar e colocou a raposinha na cama.

[pausa]

Pela janela, lá no alto, uma estrelinha pequena piscava mais forte que as outras.
Cuidando da casa.
Cuidando do quintal.
Cuidando da raposinha.

[pausa]

Que, contando estrelas…

devagar…

devagarinho…

[pausa]

dormiu.

*(1 s de silêncio, parar)*
