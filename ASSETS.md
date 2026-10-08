# ASSETS — nomes dos arquivos

Renomeie suas imagens e áudios exatamente como está aqui e jogue nas pastas
`assets/img/` e `assets/audio/`. **Não precisa colocar tudo de uma vez**: o que
faltar continua aparecendo como emoji (imagem) ou é narrado pelo text-to-speech
do navegador (áudio). O jogo descobre sozinho o que existe — é só salvar o
arquivo com o nome certo e recarregar.

Regras gerais das imagens:

- PNG com **fundo transparente** (salvo onde a tabela diz o contrário).
- Quadradas, recortadas com folga: o jogo redimensiona pelo lado maior.
- **Nunca** escreva texto dentro da imagem. Todo texto é desenhado pelo código.
- Nada de marca, logo ou personagem de terceiros.

Áudio: MP3 mono, 44.1 kHz, voz calma e pausada, sem música por trás.
O nome do arquivo é o mesmo `audio` que aparece no JSON da missão.

---

## 1. Personagem (camadas sobrepostas)

Todas as camadas do personagem precisam ter **o mesmo tamanho de canvas
(512×512) e a mesma posição** — a cabeça sempre no mesmo lugar, senão o cabelo
não encaixa no corpo. Fundo transparente em todas.

| arquivo | tamanho | o que é |
|---|---|---|
| `corpo_pele1.png` … `corpo_pele6.png` | 512×512 | corpo em pé, 6 tons de pele (do mais claro ao mais escuro) |
| `corpo_sentado_pele1.png` … `corpo_sentado_pele6.png` | 512×512 | mesmo corpo sentado, para a cadeira de rodas |
| `cadeira_de_rodas.png` | 512×512 | a cadeira, desenhada na posição do corpo sentado |
| `olhos_abertos.png`, `olhos_alegres.png`, `olhos_grandes.png` | 512×512 | só os olhos e a boca |
| `cabelo_liso_curto.png` | 512×512 | cabelo **em branco/cinza claro** (o jogo pinta por cima) |
| `cabelo_liso_longo.png` | 512×512 | idem |
| `cabelo_cacheado.png` | 512×512 | idem |
| `cabelo_crespo.png` | 512×512 | idem |
| `cabelo_trancas.png` | 512×512 | idem |
| `cabelo_coque.png` | 512×512 | idem |
| `roupa1.png` … `roupa6.png` | 512×512 | camiseta/vestido **em branco** (o jogo pinta) |
| `acessorio_oculos.png` | 512×512 | óculos |
| `acessorio_aparelho_auditivo.png` | 512×512 | aparelho auditivo |
| `acessorio_bone.png` | 512×512 | boné |
| `acessorio_laco.png` | 512×512 | laço |
| `acessorio_capa.png` | 512×512 | capa de herói |
| `acessorio_medalha.png` | 512×512 | medalha |

> Cabelo e roupa são recoloridos pelo código. Desenhe em tons claros, quase
> brancos, com o sombreado em cinza — a cor escolhida pela criança multiplica
> em cima.

## 2. Mascote e interface

| arquivo | tamanho | fundo | o que é |
|---|---|---|---|
| `mascote_raposinha.png` | 512×512 | transparente | a raposinha guia, de corpo inteiro, sorrindo |
| `moeda.png` | 256×256 | transparente | moeda dourada |
| `ficha.png` | 256×256 | transparente | ficha de fliperama |
| `estrela.png` | 256×256 | transparente | estrela cheia |
| `estrela_vazia.png` | 256×256 | transparente | contorno da estrela |
| `broche.png` | 256×256 | transparente | broche de mundo completo |
| `icone_app_512.png` | 512×512 | **opaco** | ícone do app (ETAPA 4) |
| `icone_app_192.png` | 192×192 | **opaco** | ícone do app (ETAPA 4) |

## 3. Mundos (ícone de cada faixa no mapa)

| arquivo | tamanho | o que é |
|---|---|---|
| `mundo1.png` | 256×256 | manhã em casa |
| `mundo2.png` | 256×256 | escola |
| `mundo3.png` | 256×256 | volta para casa |
| `mundo4.png` | 256×256 | tarde |
| `mundo5.png` | 256×256 | noite |

## 4. Missão 01 — Acordar e se cuidar

| arquivo | tamanho | o que é |
|---|---|---|
| `m01_escova.png` | 512×512 | escova de dentes com pasta |
| `m01_rosto.png` | 512×512 | pia com água e sabonete |
| `m01_prato.png` | 512×512 | prato vazio visto de cima |
| `m01_banana.png` | 256×256 | banana |
| `m01_morango.png` | 256×256 | morango |
| `m01_pao.png` | 256×256 | pão |
| `m01_pnp_certa.png` | 512×512 | criança escovando os dentes |
| `m01_pnp_errada.png` | 512×512 | criança brincando com a comida |

> As missões 02 a 20 entram na ETAPA 3 e cada uma acrescenta sua lista aqui,
> com o mesmo padrão `mNN_<nome>.png`.

## 5. Áudio

### Narração da missão 01

| arquivo | o que diz |
|---|---|
| `m01_intro.mp3` | "Bom dia! Vamos acordar e cuidar de você?" |
| `m01_mostrar.mp3` | "Olha só: primeiro a escova, depois o rosto, depois o café!" |
| `m01_e1.mp3` | "Passe a escova nos dentes. Vamos escovar com a música!" |
| `m01_e2.mp3` | "Agora lave o rosto. Esfregue com o dedinho!" |
| `m01_e3.mp3` | "Monte o café: leve a fruta e o pão para o prato." |
| `m01_pnp.mp3` | "O que pode?" |
| `m01_reforco.mp3` | "Dentes limpos, sorriso brilhando!" |

> A narração que usa o nome da criança (`{nome}` no JSON) só funciona pelo
> text-to-speech. Se você gravar o arquivo, grave a frase **sem** o nome — o
> arquivo gravado toca no lugar do TTS.

### Interface

| arquivo | o que diz |
|---|---|
| `ui_quem_joga.mp3` | "Quem vai jogar hoje?" |
| `ui_monte_personagem.mp3` | "Monte um personagem parecido com você!" |
| `ui_escreva_nome.mp3` | "Escreva seu nome com as letrinhas." |
| `letra_a.mp3` … `letra_z.mp3` | o som de cada letra (26 arquivos), para o teclado |

### Música

| arquivo | duração | o que é |
|---|---|---|
| `musica_timer.mp3` | 30 s em loop | musiquinha leve do timer (escovação, lavar as mãos) |

> Sem `musica_timer.mp3` o jogo toca uma notinha a cada 5 segundos, gerada pelo
> próprio navegador. Os efeitos de acerto e de moeda também são gerados em
> código — não precisam de arquivo.
