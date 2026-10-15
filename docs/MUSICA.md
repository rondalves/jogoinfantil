# Música de fundo

O jogo toca uma faixa em loop o tempo todo e **troca sozinho a cada mundo**.
É só colocar o arquivo em `assets/audio/` com o nome exato: sem o arquivo, a
tela fica em silêncio e nada quebra.

## Os 8 arquivos

| arquivo | onde toca | clima |
|---|---|---|
| `musica_menu.mp3` | abertura, perfis, mapa, criador, biblioteca e painel dos pais | leve e curiosa, caixinha de música com xilofone |
| `musica_mundo1.mp3` | Mundo 1 — Manhã em Casa 🌅 | acordando: ukulele dedilhado, sino suave, animada sem correria |
| `musica_mundo2.mp3` | Mundo 2 — Escola 🎒 | marchinha boba e curiosa, pizzicato de cordas e palminhas |
| `musica_mundo3.mp3` | Mundo 3 — Volta para Casa 🚗 | balanço de viagem, violão com batida leve e assobio |
| `musica_mundo4.mp3` | Mundo 4 — Tarde 🧸 | brincadeira, marimba saltitante e percussão de brinquedo |
| `musica_mundo5.mp3` | Mundo 5 — Janta 🍽️ | mesa em família: violão quente e piano macio, aconchego, ainda acordada |
| `musica_mundo6.mp3` | Mundo 6 — Banho e Cama 🛁 | acalanto: caixinha de música lenta e cordas suaves, bem devagar |
| `musica_timer.mp3` | só enquanto o cronômetro da escovação e da lavagem corre | 30 segundos cravados, xilofone animado marcando o tempo |

**Faixa extra:** `musica_guardar_brinquedos.mp3` toca só na missão 16 (Guardar os brinquedos), em loop, no lugar da música do mundo 4. É a musiquinha de guardar brinquedo da família: salve o arquivo com esse nome exato. Sem o arquivo, a missão usa a música do mundo. Qualquer missão pode ter a sua: basta o campo `"musica": "nome_do_arquivo"` no JSON.

Enquanto o timer toca, a música do mundo abaixa sozinha.

## Prompt de cada faixa (Suno, Udio ou parecido)

Em inglês porque é o que os geradores entendem melhor. Cole no campo de estilo,
marque **Instrumental** e peça 2 minutos. Gere duas ou três variações e fique
com a mais parada: a criança ouve a mesma faixa por muitos minutos.

| arquivo | prompt |
|---|---|
| `musica_menu` | `gentle children's music box with xylophone and soft bells, light and curious, slow tempo, no drums, no vocals, seamless loop, calm background for a kids app` |
| `musica_mundo1` | `warm morning children's tune, fingerpicked ukulele, soft glockenspiel, light shaker, cheerful but unhurried, no vocals, seamless loop, quiet background music` |
| `musica_mundo2` | `playful school march for kids, pizzicato strings, soft hand claps, toy piano, curious and silly, medium-slow tempo, no vocals, seamless loop, low dynamics` |
| `musica_mundo3` | `relaxed road-trip tune for kids, acoustic guitar with a light swing beat, soft whistling melody, sunny and easygoing, no drums, no vocals, seamless loop` |
| `musica_mundo4` | `playtime afternoon music for kids, bouncy marimba, toy percussion, kalimba, bright and gentle, no heavy drums, no vocals, seamless loop` |
| `musica_mundo5` | `cozy family dinner music, warm nylon guitar and soft piano, slow and comforting, a little sleepy but still awake, no drums, no vocals, seamless loop` |
| `musica_mundo6` | `very slow lullaby, music box and soft strings, bath time then bedtime, dreamy and quiet, minimal, no drums, no vocals, seamless loop, fade-free ending` |
| `musica_timer` | `upbeat 30 second xylophone and marimba jingle for a kids toothbrushing timer, steady clear beat, happy, no vocals, exactly 30 seconds, loops cleanly` |

## Como as faixas precisam ser

- **MP3, 44.1 kHz, estéreo**, 96–128 kbps (é música de fundo em celular).
- **1 a 2 minutos**, em **loop perfeito**: o fim tem que emendar no começo sem
  pausa e sem clique. Corte exatamente no fim de um compasso. O timer é a
  exceção: **30 segundos** exatos.
- **Instrumental**, sem voz: a narração fala por cima.
- **Sem percussão forte e sem mudança brusca** de volume ou de andamento.
- Mixada **baixa e constante**: o jogo já toca a 35% do volume, mas uma faixa
  muito comprimida ainda briga com a narração.
- Até ~2 MB por arquivo. Oito faixas de 2 MB já pesam 16 MB no APK.

## De onde tirar

Qualquer uma destas serve, desde que a licença permita uso comercial:

- **Gerar**: Suno ou Udio com os prompts acima. Confira a licença do plano que
  você usa antes de publicar.
- **Banco livre**: Pixabay Music, Incompetech (Kevin MacLeod, exige crédito),
  Free Music Archive. Filtre por "uso comercial permitido".
- **Comprar**: Envato, AudioJungle.

Guarde num arquivo de texto de onde veio cada faixa e sob qual licença — a
Play Store não pede, mas um pedido de remoção por direitos autorais, sim.

## Colocar no jogo

1. Salve em `assets/audio/` com o nome exato da tabela.
2. `npm run build` (o jogo acha o arquivo sozinho, não precisa mexer em código).
3. Teste com `npm run dev`: entre numa missão de cada mundo e confira a troca.

O pai pode desligar a música no **painel dos pais → Música de fundo**. A
escolha fica salva no perfil.
