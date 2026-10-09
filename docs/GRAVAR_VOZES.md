# Gravar as vozes do jogo

A lista completa das falas está em **`assets/audio/narracao.csv`** (abre no
Excel, separador `;`). Para refazê-la depois de mexer nas missões:

```bash
npm run narracao
```

## As três vozes

| voz na planilha | quem é | como gravar |
|---|---|---|
| `mascote` | a raposinha e o personagem da criança | **voz de criança**, animada |
| `adulto` | instrução, correção e explicação | **voz de adulto**, calma e pausada |

Da voz de adulto o jogo aceita **duas gravações da mesma frase**, e o adulto
escolhe qual usar no painel dos pais (Área dos adultos → *Trocar a voz*):

| arquivo | voz |
|---|---|
| `<nome>.mp3` | feminina — é a que o jogo usa por padrão |
| `<nome>_m.mp3` | masculina |

Exemplo: `m03_e1.mp3` (feminina) e `m03_e1_m.mp3` (masculina).

A voz do mascote tem **um arquivo só**, sem `_m`.

## Onde salvar

Tudo em `assets/audio/`, com o nome exato da coluna `arquivo`. Frase sem
arquivo continua saindo na voz do navegador — dá para gravar aos poucos.

## Como gravar

- **mp3, mono, 44.1 kHz.** Qualquer gravador serve, até o do celular.
- Um arquivo por frase, começando e terminando **sem silêncio longo**
  (até meio segundo de cada lado).
- Fale **devagar**: quem ouve tem 4 anos e ainda não lê.
- Mesma distância do microfone em todas as frases, para o volume não pular de
  uma para outra.
- `{nome}` no texto é o nome que a criança digitou. O jogo **não** consegue
  encaixar o nome dentro de uma gravação: nessas frases, grave dizendo
  *"amiguinho"* no lugar, ou deixe sem arquivo para o jogo falar com o nome
  certo pela voz do navegador.

## Por onde começar

A planilha vem na ordem em que a criança ouve. As que mais aparecem:

1. As 34 frases `ui_*`, `mapa_*`, `missao_*` e `tut_*` — todas as telas.
2. As 26 letras `letra_a` … `letra_z` — o teclado do nome.
3. As falas de cada missão, `m01_*` em diante.
4. Os nomes de objeto `nome_*` — o que o jogo diz quando a criança passa o
   dedo por cima de uma figura. São palavras soltas ("Mochila", "Lápis"), as
   mais rápidas de gravar e as que mais ajudam quem ainda não lê.

`musica_timer.mp3` não é fala: é uma música instrumental de uns 30 segundos
que roda em loop enquanto o cronômetro corre.
