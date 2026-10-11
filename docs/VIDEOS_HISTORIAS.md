# Vídeos das historinhas, cena a cena

Cada historinha vira um vídeo que acompanha a narração: uma cena animada para
cada trecho, trocando nas pausas que já estão no roteiro. A voz e a música são
as gravações que já temos; o som do vídeo gerado é descartado.

## Como funciona

1. **A ilustração de cada cena**, gerada no Gemini com a capa da historinha
   anexada: assim a raposinha sai igual em todas.
2. **A animação de cada cena**, gerada no Veo a partir dessa ilustração: um
   clipe de 8 segundos, com movimento calmo.
3. **A montagem**: um script junta tudo de uma vez. Ele acha as pausas da
   narração (filtrando só a faixa da voz, porque a cantiga toca por baixo),
   põe cada clipe no seu trecho, desacelera o clipe até cobrir o trecho, faz a
   transição suave e coloca título no começo e "Rotina Feliz" no fim.

## Onde gerar e quanto custa

São cerca de **11 cenas por historinha, 66 no total**, contando as 6.

| onde | custo das 66 animações |
|---|---|
| **Google Flow** (labs.google/flow), que vem com o Google AI Pro | ~1.320 créditos (Veo 3.1 Fast = 20 por clipe); o Pro dá 1.000 por mês, então cabe em um mês e pouco |
| **AI Studio / API do Gemini** (a tela do Veo 3.1 Fast) | cobrado por segundo: ~US$ 0,12/s em 1080p, uns US$ 63 no total; o crédito de US$ 10 do Pro cobre ~10 clipes |

Use o **Flow**: sai do que você já paga. O AI Studio só vale para testar um
clipe ou outro. Os preços vêm de sites que acompanham a tabela do Google;
confira no Flow antes de gerar tudo.

## Como salvar

- Ilustração: `historia01_cena01.png`, `historia01_cena02.png`...
- Animação: `historia01_cena01.mp4`, `historia01_cena02.mp4`...

Tudo na pasta `videos/cenas/` do projeto.

No Flow, use **"Frames to Video"** (ou "Quadros para vídeo"), com a ilustração da
cena como primeiro quadro, **16:9**, **Veo 3.1 Fast**, **8 s**.

---

# Piloto: 01 · A raposinha e o sol que acordou cedo

Faça esta historinha primeiro e me mande. Eu monto o vídeo, você aprova o
jeito, e só então vale gerar as outras cinco.

### Prompt da ilustração (Gemini), anexando `capa_historia1.jpg`

Troque só **[CENA]**:

```
Use a raposinha da imagem anexada, com exatamente o mesmo traço, as mesmas cores e o mesmo estilo de livro infantil. [CENA] Ilustração 2D de livro infantil, contorno fino, cores suaves e pouco saturadas, luz calma e aconchegante. Sem texto, sem letras, sem números. Imagem horizontal 16:9, 1920x1080.
```

### Prompt da animação (Veo), com a ilustração como primeiro quadro

Troque só **[MOVIMENTO]**:

```
Gentle children's storybook animation in the exact style of the image. [MOVIMENTO] Slow, calm, soothing movement for a bedtime story. Camera almost still, with a very slow push-in. Keep the character and the drawing style exactly the same. No text, no speech, no dialogue.
```

### As 11 cenas

| arquivo | trecho | **[CENA]** | **[MOVIMENTO]** |
|---|---|---|---|
| `historia01_cena01` | 0:03–0:18 | Quarto da raposinha bem cedinho, céu azul-escuro na janela, a raposinha dormindo enroladinha na cama com o rabo cobrindo o nariz. | The little fox sleeps curled up, breathing slowly; stars twinkle softly outside the window. |
| `historia01_cena02` | 0:20–0:35 | Céu azul-escuro sobre colinas; atrás delas, um Sol simpático com rosto, ainda meio escondido, com um olho aberto e o outro fechado. | The sun slowly opens one eye, then the other, and looks around sleepily from behind the hills. |
| `historia01_cena03` | 0:36–0:56 | Amanhecer bem fraquinho: um passarinho num galho perto da janela e, embaixo, uma flor ainda fechada. | The little bird chirps once, then tucks its head and dozes again; the flower slowly opens a single petal. |
| `historia01_cena04` | 0:57–1:08 | O vento entrando de mansinho pela janela aberta, a cortina mexendo, a raposinha dormindo com a franja levantada. | A soft breeze moves the curtain and gently ruffles the fox's fringe while she keeps sleeping. |
| `historia01_cena05` | 1:09–1:20 | A raposinha sentada na cama, se espreguiçando, de olhos fechados. | The fox stretches her front paws, then her back paws, and gives a big slow yawn. |
| `historia01_cena06` | 1:22–1:38 | A raposinha na janela, de pijama, olhando para o Sol sorridente que aparece atrás das colinas. | The fox waves good morning to the smiling sun, who smiles back and nods gently. |
| `historia01_cena07` | 1:40–1:53 | A raposinha e o Sol olhando juntos o céu do amanhecer. | The sky slowly changes color from dark blue to light blue, then pink, then warm yellow. |
| `historia01_cena08` | 1:55–2:04 | A raposinha no banheiro, na frente da pia, escovando os dentes com uma escovinha. | The fox washes her face with fresh water, then brushes her teeth slowly and carefully. |
| `historia01_cena09` | 2:04–2:14 | A raposinha no quarto ensolarado, arrumando a cama, com a coberta lisinha. | The fox smooths the blanket on her bed, combs her fringe and smiles; the sun rises a little higher. |
| `historia01_cena10` | 2:15–2:39 | Fim de tarde virando noite sobre a casa da raposinha: o Sol se pondo de um lado e a Lua com rosto tranquilo subindo do outro. | The sun slowly sets on one side while the smiling moon rises on the other; the sky turns to deep night blue. |
| `historia01_cena11` | 2:40–3:01 | Noite: a Lua na janela, a raposinha enroladinha na cama com o rabo cobrindo o nariz. | The fox curls up, closes one eye, then the other, and falls asleep; the moon glows softly. |

Os trechos vêm das pausas da gravação; se uma cena ficar mais longa que o
clipe, a montagem desacelera o movimento, o que combina com historinha de
dormir.
