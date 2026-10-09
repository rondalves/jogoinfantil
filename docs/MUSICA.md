# Música de fundo

O jogo toca uma faixa em loop o tempo todo, e **troca sozinho a cada mundo**.
É só colocar o arquivo em `assets/audio/` com o nome exato: sem o arquivo, a
tela fica em silêncio e nada quebra.

## Os 6 arquivos

| arquivo | onde toca | clima |
|---|---|---|
| `musica_menu.mp3` | abertura, perfis, mapa, criador e painel dos pais | leve e curiosa, caixinha de música com xilofone |
| `musica_mundo1.mp3` | Mundo 1 — Manhã em Casa 🌅 | acordando: ukulele dedilhado, sino suave, animada sem correria |
| `musica_mundo2.mp3` | Mundo 2 — Escola 🎒 | marchinha boba e curiosa, pizzicato de cordas e palminhas |
| `musica_mundo3.mp3` | Mundo 3 — Volta para Casa 🚗 | balanço de viagem, violão com batida leve e assobio |
| `musica_mundo4.mp3` | Mundo 4 — Tarde 🧸 | brincadeira, marimba saltitante e percussão de brinquedo |
| `musica_mundo5.mp3` | Mundo 5 — Noite 🌙 | acalanto, caixinha de música lenta e cordas suaves |

Já existe `musica_timer.mp3`, que é outra coisa: toca só enquanto o cronômetro
da escovação corre. Enquanto ele toca, a música de fundo abaixa sozinha.

## Como as faixas precisam ser

- **MP3, 44.1 kHz, estéreo**, 96–128 kbps (é música de fundo em celular).
- **1 a 2 minutos**, em **loop perfeito**: o fim tem que emendar no começo sem
  pausa e sem clique. Corte exatamente no fim de um compasso.
- **Instrumental**, sem voz: a narração fala por cima.
- **Sem percussão forte e sem mudança brusca** de volume ou de andamento. A
  criança vai ouvir a mesma faixa por muitos minutos seguidos.
- Mixada **baixa e constante**: o jogo já toca a 35% do volume, mas uma faixa
  muito comprimida ainda briga com a narração.
- Até ~2 MB por arquivo. Seis faixas de 2 MB já pesam 12 MB no APK.

## De onde tirar

Qualquer uma destas serve, desde que a licença permita uso comercial:

- **Gerar**: Suno ou Udio, pedindo "instrumental infantil, [clima da tabela],
  loop, sem vocais". Confira a licença do plano que você usa antes de publicar.
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
