# Rotininha frente ao mercado: o que entrega, o que falta, o que melhorar

Análise de 15/10/2026. Duas partes: auditoria do próprio app (código, docs e conteúdo da branch `missoes-novas`) e pesquisa pública sobre apps parecidos.

**Como a "engenharia reversa" foi feita.** Só com informação pública: fichas das lojas, sites oficiais, resenhas (Common Sense Media, matérias, Trustpilot), estudos e textos de lei. Ninguém baixou nem descompilou APK. Não consegui abrir as páginas do Google Play nem alguns sites oficiais (Joon, Brili, Goally), então notas e preços vêm sobretudo da App Store e de resenhas. Marquei **[F]** para fato lido numa fonte e **[I]** para inferência.

---

## 1. Resumo em cinco linhas

1. A Rotininha é um **jogo que ensina o COMO** de cada hábito (modelagem pela raposinha, etapas curtas, "pode ou não pode", erro sem punição). Os apps de rotina do mercado fazem outra coisa: **acompanham se a criança fez de verdade**. Quase ninguém faz as duas coisas juntas, e em português nativo praticamente ninguém.
2. O maior buraco é a **ponte com a vida real**: hoje a criança joga a missão, mas nada liga o jogo ao "agora vá fazer". Não há confirmação, nem prêmio combinado com a família, nem conversa guiada para os pais.
3. O maior risco antes de publicar é o **som**: das 522 falas do jogo, nenhuma está gravada. Criança de 4 anos não lê, e sem voz o jogo vira texto.
4. O que já é diferencial: sem anúncios, offline, dados só no aparelho, limite diário de joguinhos que manda a criança de volta às missões ("Já fez as suas tarefas?"), personagem personalizável, compra única barata.
5. Na lei, o app está bem posicionado (sem anúncio, sem loot box, sem perfilamento, compra atrás de trava adulta), mas a **ECA Digital** (em vigor desde 17/03/2026) ainda tem pontos sem regulamentação clara para app offline sem conta. Vale um parecer antes da produção.

---

## 2. O que o app entrega hoje

| Área | O que existe |
|---|---|
| Conteúdo | 31 missões em 6 mundos (Manhã, Escola, Volta para Casa, Tarde, Janta, Banho e Cama), 4 delas bônus; 6 joguinhos (um por mundo); 6 historinhas |
| Pedagogia | Toda missão segue a mesma espinha: abertura da raposinha, o personagem mostra, 2 a 3 etapas, "pode ou não pode", estrelas e reforço. 9 tipos de etapa. Concluir nunca dá zero estrela e não existe tela de derrota |
| Personagem | Criador com tons de pele, rostos, penteados, roupas e acessórios; desbloqueia itens com broches de mundo |
| Economia | 1 moeda por missão, +5 por mundo concluído, 1 moeda = 3 fichas para joguinhos |
| Pais | Trava de conta de multiplicar, progresso, voz feminina/masculina, música liga/desliga, minutos de joguinho por dia, zerar/apagar perfil, política de privacidade, compra e restauração |
| Tempo de tela | Aviso "Já fez as suas tarefas?" quando passa o tempo do joguinho; mais tempo só com adulto |
| Privacidade | Sem backend, sem analytics, sem anúncios; perfis no localStorage |
| Plataforma | Android via Capacitor, Play Billing, `.aab` assinado pronto |
| Áudio | 522 falas mapeadas (415 de adulto em voz feminina e masculina, 107 da raposinha); **0 gravadas**; música de fundo e a musiquinha de guardar brinquedos ainda não existem |

**Pontos fortes que valem proteger**
- Errar ensina e não pune (mínimo de 1 estrela). Combina com a literatura de reforço positivo [I].
- A pegadinha em toda missão faz a criança pensar, em vez de só tocar.
- O limite de joguinhos que devolve a criança às missões é um desenho raro e responde diretamente à exigência da ECA Digital de mitigar uso compulsivo [F, via Demarest].
- Cada mundo concluído libera um joguinho e uma historinha para sempre: a recompensa é conteúdo, não moeda que vicia.

**Fragilidades que encontrei**
- O README está desatualizado: fala em "10 mundos livres" e compra de R$ 1,99; o código e a monetização hoje são 6 mundos, 4 livres e compra de R$ 4,99. Os nomes também divergem entre README ("Rotina Feliz"), loja ("Rotininha"), pacote Android (`rotinafeliz`) e chave do localStorage (`missoes-do-dia`). Na loja isso gera dúvida e pedido de revisão.
- O progresso vive só no localStorage. Se o aparelho for trocado ou os dados limpos, tudo some. A perda de progresso é queixa recorrente nos concorrentes (Disney Magic Timer, Joon).
- Não há lembretes, resumo semanal nem registro do que a criança fez em cada dia.
- O painel dos pais é de configuração, não de apoio: não orienta a conversa com a criança.

---

## 3. Quem faz algo parecido

### 3.1 Apps de rotina e tarefas (acompanham a vida real)

| App | Como funciona [F] | Preço [F] | Queixas recorrentes |
|---|---|---|---|
| **Joon** (EUA) | Pai cria "quests"; criança joga num app de pet; pai aprova; moedas alimentam o pet; prêmios reais definidos pelos pais | Grátis limitado; Premium US$ 12,99/mês ou ~US$ 80–90/ano | Interesse cai em 4 a 8 semanas; preço; cobrança após cancelar; pai precisa aprovar tudo |
| **Brili Routines** | Agenda visual com timer e estrelas, manhã/tarde/noite; foto da galeria nas tarefas | US$ 49,99/ano (versão atual da loja) | Configuração difícil; criança marca sem fazer |
| **Goally** | Tablet fechado + app; rotinas passo a passo, fichas | Tablet ~US$ 189–249 + assinatura | Custo; bugs no app dos pais; o toque de lembrete irrita |
| **Choiceworks** | Quadros visuais de rotina, espera e sentimentos; áudio e foto dos pais; **tem português** | US$ 39,99 compra única | Sem painel remoto nem recompensa |
| **OurHome / ChoreMonster / Kiddo** | Tarefas com pontos e prêmios definidos pelos pais | Grátis ou freemium | Visual datado; gamificação rasa |
| **Rotina Divertida** (BR) | Cartaz de rotina visual para TEA, com imagens e áudio dos pais, estrelas e cartões PECS | R$ 124,90/ano [F, matéria] | Só achei uma matéria; sem nota |
| **Toyt** (BR) | Simulação de tarefas por ABA | Freemium | É treino simulado, não a rotina da casa |

Funcionalidades que mais aparecem como diferencial [I]: pet que cresce, aprovação dos pais, foto e voz própria, timer visual, prêmio real trocado por moeda, agenda por dia, perfis para irmãos.

### 3.2 Apps educativos que ensinam hábitos e emoções (ensinam o como)

| App | Técnica [F] |
|---|---|
| **Daniel Tiger** (Play at Home, Grr-ific Feelings) | Faz de conta de dormir, banheiro e médico; 18 canções que a criança usa para se acalmar; resenha destaca brincar junto com os pais |
| **Sesame Street: Breathe, Think, Do** | Cinco frustrações do dia a dia, sempre em três passos: respirar, pensar, escolher estratégia; o monstrinho tenta e a criança vê |
| **Khan Academy Kids** | Trilha adaptativa com função executiva e socioemocional |
| **Sago Mini / Toca / Pok Pok** | Brincar aberto, sem metas; Pok Pok sem pontos nem pressão, com ideias para fazer fora da tela |
| **Lingokids** | Vídeo, música, jogo; relatório e timer para os pais; reclamação de cobrança inesperada |
| **Galinha Pintadinha / Mundo Bita / Mundo Bibi** (BR) | Música, vídeo e jogos genéricos; "sem anúncios" como promessa; preços confusos (compra e assinatura misturadas) |
| **Auau Kiko: Dino Dentista** (BR) | Única referência brasileira de hábito que achei: escovar os dentes de um dinossauro; grátis, desenvolvedor solo |

### 3.3 Apps de um hábito só

- **Escovação:** Disney Magic Timer (timer de 2 min, figurinhas, relatório para os pais; reclamações de sequência que não registra e figurinha perdida), Brush DJ (2 min de música), Colgate Magik (AR, **descontinuado**), Brush Monster.
- **Banheiro:** Daniel Tiger's Stop & Go Potty (jogo que congela quando o personagem se mexe).
- **Sono:** Moshi (400+ faixas; nota 2,0 no Trustpilot por cobrança e reajuste), Children's Sleep Meditations (cobra por história, sem assinatura), Dorme Dorme do Mundo Bita.
- **Trânsito:** Bee Safe (2011, controle de inclinar difícil) e Traffic Safety for Kids (US$ 3,99, 12 módulos, para 6 a 8 anos).

---

## 4. Comparação direta

| | Rotininha | Joon | Brili | Choiceworks | Daniel Tiger | Disney Magic Timer | Galinha Pintadinha |
|---|---|---|---|---|---|---|---|
| Ensina o **como** de cada hábito | **Sim** | Não | Não | Parcial | Sim | Não | Não |
| Acompanha o que foi feito de verdade | **Não** | Sim | Sim | Sim | Não | Sim | Não |
| Prêmio real combinado com a família | **Não** | Sim | Sim | Não | Não | Não | Não |
| Foto ou voz própria dos pais | Voz do autor, pais não gravam | Não | Foto | **Foto e voz** | Não | Não | Não |
| Conversa guiada para os pais | **Não** | Não | Não | Não | **Sim** | Relatório | Não |
| Emoções com estratégia | Sim (1 missão) | Não | Não | Sim | **Sim** | Não | Não |
| Segurança (rua, carro, casa) | **Sim** | Não | Não | Não | Não | Não | Não |
| Historinhas e joguinhos | **Sim** | Não | Não | Não | Sim | Não | **Sim** |
| Sem anúncio e sem conta | **Sim** | Conta do pai | n/c | **Sim** (sem conta) | Sem anúncio de terceiros | n/c | Sem anúncio |
| Offline | **Sim** | n/c | n/c | Provável [I] | n/c | n/c | Sim (download) |
| Português nativo | **Sim** | Não | Não | Sim | Não | Não | **Sim** |
| Preço | R$ 4,99 única | US$ 12,99/mês | US$ 49,99/ano | US$ 39,99 única | Pago | Grátis + pacotes | R$ 59,90 a 99,90 |

`n/c` = não consegui confirmar nas fontes públicas.

Leitura: a Rotininha tem um território praticamente vazio (rotina **e** segurança **e** emoção, em português, com mascote), mas não oferece nada do que os pais pagam para ter nos apps de acompanhamento.

---

## 5. O que dá para melhorar, em ordem de prioridade

Respeitando o que você definiu: nada de campo de dias nem jornada por dia da semana, e nada pensado só para uma criança. Tudo abaixo serve a qualquer família.

### P0: antes de publicar

1. **Gravar as vozes.** 0 de 522. Comece pelas ~200 frases de interface, tutorial e joguinhos (`assets/audio/narracao.csv`). Sem voz, uma criança de 4 anos não joga sozinha. *Esforço: alto, é o gargalo.*
2. **Alinhar nome, README e ficha.** Um nome só em loja, README, política de privacidade e conta de desenvolvedor. Atualizar o README (6 mundos, R$ 4,99, 31 missões). *Esforço: baixo.*
3. **Declarar a faixa etária certa no Play Console** e auditar SDKs (Play Billing, relatório de falhas) para não pedir AD_ID nem localização. A política de Famílias exige isso para apps voltados a crianças [F]. Confira se o público 4 a 7 pede declarar "Ages 5 & Under" e "6–8" juntos. *Esforço: baixo.*
4. **Backup do progresso** (exportar e importar um arquivo, ou guardar no backup do Android). Perda de progresso é queixa recorrente nos concorrentes. *Esforço: médio.*

### P1: o que separa um jogo de um aliado dos pais

5. **Ponte com a vida real, sem câmera e sem vigilância.** Ao fim de cada missão, a raposinha diz "agora vai fazer de verdade" e a criança volta depois para tocar num botão grande "Fiz!". Vale 1 moeda extra, sem exigir aprovação (aprovação em toda tarefa é a queixa nº 2 contra o Joon). É a lacuna que o mercado inteiro reclama e que o app mais combina com o que já tem.
6. **Prêmio da família.** No painel dos pais, uma linha de texto livre ("20 moedas = passeio no parque") e um contador no Cantinho. A recompensa real é decidida pela família, fora do app, e funciona como economia de fichas: meta clara, ficha trocável, adulto presente [I]. O passeio no parque que você mencionou cabe aqui.
7. **Conversa em família.** Para cada missão, 1 ou 2 perguntas no painel dos pais ("Como foi a travessia da rua hoje?"). O estudo do Daniel Tiger (127 crianças, Texas Tech) mostrou ganho em empatia só quando os pais conversavam sobre o conteúdo [F]. É barato: texto, sem código novo.
8. **Esconder missões que não servem à família.** Um interruptor por missão no painel dos pais (sem dias, sem agenda). Ajuda quem não tem escola, não tem pet, não usa carro. É o mínimo de personalização para outras famílias usarem sem ver conteúdo que não é delas.
9. **Final de sessão claro.** Depois de 3 a 5 missões, a raposinha se despede ("por hoje chega, até amanhã"). A OMS e a SBP orientam cerca de 1 hora por dia de tela para 2 a 5 anos [F, SBP via TecMundo e comunicado de 2019] e a ECA Digital pede mitigar uso compulsivo. O aviso de joguinhos já é metade disso.

### P2: qualidade e profundidade

10. **Historinha de dormir em modo áudio, com tela apagada.** A AAP orienta evitar telas 1 hora antes de dormir; a SBP, segundo matéria, 2 horas [F, fontes divergem]. Opção "só ouvir" com timer de desligar.
11. **Timer de escovação configurável (30 s, 1 min, 2 min).** A fonte australiana que li usa 2 min como critério para apps de escovação. Não consegui abrir as recomendações oficiais da SBP e da AAPD, então confirme antes de afirmar na loja. O app pode explicar que 30 s é um começo.
12. **Opções sensoriais separadas:** efeitos sonoros, música e voz com controles distintos, e "reduzir movimento" (sem animação piscante). Recomendação consensual de acessibilidade para TEA/TDAH [I]; vale mesmo que o app não seja clínico.
13. **Emoções com estratégia explícita.** A missão 11 é a única. O padrão "respirar, pensar, escolher" do Sesame (três passos fixos, o monstro tenta antes da criança) cabe no motor atual (`respirar` + `escolher_entre_opcoes`).
14. **Mais segurança no contexto brasileiro.** Ônibus escolar, bicicleta, não aceitar carona ou presente de estranho, praia e piscina. Não achei nada em português nessa linha.
15. **Mais jeitos de a família gravar a própria voz** nas frases mais importantes. Choiceworks e Rotina Divertida usam áudio dos pais como diferencial.

### P3: depois do beta

16. Resumo semanal simples no painel dos pais (missões feitas, estrelas), sem gráfico de pressão e sem "sequência" punitiva. Sequências que punem a falha estão na lista de padrões que a ECA Digital manda cuidar [F].
17. Um modo "jogar junto" (adulto e criança) para as missões de emoção.
18. Pensar o preço: veja a seção 7.

**O que não copiar dos concorrentes:** sequência de dias que se perde, personagem que fica triste quando a criança sai, contagem regressiva, loja visível dentro da área infantil, assinatura com preço confuso, pedir e-mail ou nome real da criança.

---

## 6. Conformidade (resumo para conferir, não é parecer jurídico)

| Tema | O que apurei | Situação do app |
|---|---|---|
| ECA Digital (Lei 15.211/2025) | Em vigor desde 17/03/2026. Verificação de idade confiável (autodeclaração proibida), contas de até 16 anos vinculadas a responsável, loot boxes proibidas, proibido perfilar criança para publicidade, prevenir uso compulsivo. Fiscalização pela ANPD; multa de até 10% do faturamento ou R$ 10 a R$ 1.000 por usuário (teto R$ 50 mi) [F, via Demarest; texto do Planalto não abriu] | Sem anúncio, sem loot box, sem perfilamento e com limite de joguinhos. **Dúvida aberta:** como a lei trata app offline sem conta. Aguardar o decreto e consultar advogado |
| Play Age Signals API | Passou a devolver a faixa etária no Brasil em 17/03/2026 [F, doc do Android] | Avaliar se precisa integrar |
| LGPD art. 14 | Dados de criança exigem consentimento específico de um dos pais [F] | Perfil só no aparelho reduz a exposição; relatórios de falha e Play Billing podem enviar dados a terceiros: verificar |
| Google Play, Famílias | Declarar público, sem AD_ID, sem localização, SDKs aprovados, política de privacidade correta [F] | Coerente; falta declarar no Console |
| Teste fechado | Conta pessoal criada depois de 13/11/2023: 12 testadores por 14 dias seguidos [F] | Em andamento |

---

## 7. Preço: o que o mercado cobra

| Produto | Preço [F] |
|---|---|
| Rotininha | R$ 4,99, compra única, abre mundos 5 e 6 e conteúdo novo |
| Mundo Bibi | R$ 19,90/mês ou R$ 99,90/ano |
| Galinha Pintadinha | Coletânea R$ 59,90; anual R$ 99,90; pacotes R$ 6,90 |
| Rotina Divertida | R$ 124,90/ano |
| Choiceworks | US$ 39,99 compra única |
| Brili | US$ 49,99/ano |
| Joon | US$ 12,99/mês |
| Children's Sleep Meditations | US$ 2,99 por história |
| Mundo Bita Dorme Dorme | US$ 0,99 por volume |

A Rotininha é o produto de preço mais baixo e o único com compra única barata e sem assinatura, o que é um argumento de confiança (cobrança inesperada é queixa recorrente). Fica a questão de se R$ 4,99 está abaixo do valor entregue, sobretudo com 31 missões, 6 joguinhos e 6 historinhas. Com os números de 40% pago que você citou: hoje são 11 de 31 missões pagas (35%); para chegar perto de 40% faltam 1 ou 2 missões.

---

## 8. O que não consegui verificar

- Páginas do Google Play (notas, número de avaliações, reclamações por país) e os sites oficiais de Joon, Brili e Goally.
- O texto da Lei 15.211 no Planalto (os números de artigo vêm de alertas de escritórios de advocacia).
- Os documentos oficiais da SBP e da AAPD sobre escovação e tempo de tela (as orientações da SBP vêm de matéria).
- Os formulários IARC e de segurança de dados do Google.
- A literatura de superjustificação (Lepper, Deci e outros) e de acessibilidade para TEA/TDAH está citada de memória [I].
- Vários preços são da App Store ou de terceiros e variam por país e data.

---

## 9. Fontes principais

Apps de rotina: [Joon (Neurolaunch)](https://neurolaunch.com/joon-app-review/) · [Joon (ChoosingTherapy)](https://www.choosingtherapy.com/joon-app-review/) · [Brili (Common Sense)](https://www.commonsensemedia.org/app-reviews/brili-routines) · [Brili (App Store)](https://apps.apple.com/app/id1516036620) · [Goally](https://www.educationalappstore.com/app/goally) · [Choiceworks](https://apps.appfollow.io/ios/choiceworks/486210964?country=us) · [Rotina Divertida (Startupi)](https://startupi.com.br/?p=245267) · [Toyt (O Povo)](https://www.opovo.com.br/noticias/tecnologia/opovotecnologia/2025/04/01/aplicativo-auxilia-o-desenvolvimento-de-criancas-com-tea.html)

Educativos: [Daniel Tiger Grr-ific Feelings](https://www.commonsensemedia.org/app-reviews/daniel-tigers-grr-ific-feelings) · [Sesame Breathe, Think, Do](https://www.commonsensemedia.org/app-reviews/breathe-think-do-with-sesame) · [Khan Academy Kids](https://www.commonsensemedia.org/app-reviews/khan-academy-kids) · [Pok Pok](https://www.educationalappstore.com/app/pok-pok) · [Lingokids](https://www.commonsensemedia.org/app-reviews/lingokids-play-and-learn) · [Galinha Pintadinha](https://apps.apple.com/BR/app/id426811787) · [Mundo Bibi](https://apps.apple.com/br/app/mundo-bibi-jogo-para-crian%C3%A7as/id1666589059) · [Auau Kiko](https://ohoje.com/2025/02/08/jogo-incentiva-criancas-a-escovarem-os-dentes-de-forma-ludica/)

Hábitos e evidência: [Disney Magic Timer](https://apps.apple.com/au/app/disney-magic-timer-by-oral-b/id747541884) · [Brush DJ](https://mwm.ai/apps/brush-dj/475739913) · [Stop & Go Potty](https://www.commonsensemedia.org/app-reviews/daniel-tigers-stop-go-potty) · [Moshi (Trustpilot)](https://ie.trustpilot.com/review/moshikids.com) · [Traffic Safety for Kids](https://apps.apple.com/app/id1616124965) · [Brush Up, PMC8023978](https://pmc.ncbi.nlm.nih.gov/articles/PMC8023978) · [Revisão em Frontiers 2025](https://public-pages-files-2025.frontiersin.org/journals/dental-medicine/articles/10.3389/fdmed.2025.1639572/text) · [Daniel Tiger, Texas Tech](https://www.depts.ttu.edu/comc/about/news/posts/2018/09/daniel-tiger.php) · [Mindell 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4402657) · [OMS 2019](https://new.chconline.org/new-who-guidelines-on-physical-activity-sedentary-behaviour-and-sleep-for-children-under-5-years-of-age) · [SBP 2019](https://www.sbp.com.br/?p=13811) · [AAP sono e tela](https://www.aap.org/en/patient-care/media-and-children/center-of-excellence-on-social-media-and-youth-mental-health/qa-portal/qa-portal-library/qa-portal-library-questions/screen-time-affecting-sleep/)

Leis e regras: [ECA Digital, Demarest](https://www.demarest.com.br/eca-digital-entrada-em-vigor-em-17-de-marco-de-2026/) · [Cartilha ECA Digital](https://www.demarest.com.br/wp-content/uploads/2026/03/Cartilha-ECA-Digital_V2.pdf) · [Lei 15.211 (Planalto)](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm) · [Play Age Signals](https://developer.android.com/google/play/age-signals/use-age-signals-api) · [Política de Famílias do Google Play](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en) · [Teste fechado](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) · [ANPD e LGPD art. 14 (Felsberg)](https://www.felsberg.com.br/importante-anpd-publica-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes/)
