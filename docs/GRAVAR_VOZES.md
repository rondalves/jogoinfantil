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

## O jeito que dá menos trabalho

Gravar 60 frases uma a uma, salvando arquivo por arquivo, leva uma tarde. Em
bloco leva uns 40 minutos:

1. Abra `assets/audio/narracao.csv` no Excel e deixe na tela. A ordem da
   planilha é a ordem em que a criança ouve.
2. Grave **tudo numa tomada só**, lendo de cima para baixo, com **dois segundos
   de silêncio entre uma frase e outra**. Erra? Diz a frase de novo, sem parar
   a gravação.
3. Abra a tomada no [Audacity](https://www.audacityteam.org) (grátis) e:
   - *Efeitos → Redução de ruído*: selecione 2 s só de silêncio, "Obter perfil
     de ruído", depois selecione tudo e aplique.
   - *Efeitos → Normalizar* para **-3 dB**.
   - *Analisar → Localizar silêncio* ou corte na mão nos intervalos.
   - *Arquivo → Exportar → Exportar vários*, usando os rótulos como nome.
4. Renomeie cada arquivo com o nome exato da coluna `arquivo` da planilha, em
   minúsculas, e jogue tudo em `assets/audio/`.

Dá para gravar aos poucos: cada frase que ganha arquivo para de usar a voz do
navegador na hora. O resto continua em TTS até você gravar.

## Para a gravação sair boa

- **Lugar**: o cômodo mais abafado da casa. Guarda-roupa aberto cheio de roupa,
  ou um cobertor pendurado atrás de você, mata o eco. Quarto vazio e banheiro
  são os piores lugares.
- **Desligue** ventilador, ar-condicionado, geladeira próxima e notificações do
  celular.
- **Distância**: um palmo da boca, falando **de lado** para o microfone (não de
  frente), senão o "p" e o "t" estouram. Não mude de distância no meio.
- **Celular serve**, e o gravador nativo grava melhor que a maioria dos apps.
  Se tiver fone com microfone, melhor ainda: prenda perto do queixo.
- **Volume**: fale como quem conta história para uma criança no colo — nem
  sussurro, nem projetando. Se o medidor encostar no vermelho, afaste.
- **Ritmo**: devagar, com pausa entre as frases. Quem ouve tem 4 anos e ainda
  não lê.
- Grave as frases do **mascote com voz de criança animada** e as do **adulto com
  voz calma**. Se for a mesma pessoa, grave todas as do mascote primeiro: trocar
  de personagem a cada frase cansa e a voz sai inconsistente.

## Conferir no jogo

```bash
npm run dev
```

Não precisa mexer em código nem rodar nada além disso: o jogo acha os arquivos
novos sozinho. Se uma frase continuar na voz do navegador, o nome do arquivo
está diferente da coluna `arquivo` (confira acentos e `_m`).

## Por onde começar

A planilha vem na ordem em que a criança ouve. As que mais aparecem:

1. As 34 frases `ui_*`, `mapa_*`, `missao_*` e `tut_*` — todas as telas.
2. As 26 letras `letra_a` … `letra_z` — o teclado do nome.
3. As falas de cada missão, `m01_*` em diante.
4. Os nomes de objeto `nome_*` — o que o jogo diz quando a criança passa o
   dedo por cima de uma figura. São palavras soltas ("Mochila", "Lápis"), as
   mais rápidas de gravar e as que mais ajudam quem ainda não lê.

`musica_timer.mp3` não é fala: é uma música instrumental de uns 30 segundos
que roda em loop enquanto o cronômetro corre. A música de fundo do jogo é outra
coisa, e está em [MUSICA.md](MUSICA.md).
