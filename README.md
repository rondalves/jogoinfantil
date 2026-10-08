# Missões do Dia

Jogo educativo infantil (4–7 anos, pt-BR), 2D cartoon, retrato, mobile-first.
Vite + TypeScript + Phaser 3. Sem backend, sem anúncios, sem analytics, sem compras.
Tudo fica no aparelho (localStorage).

## Como rodar

```bash
npm install
npm run dev
```

### Testar no celular pela rede local

1. PC e celular na **mesma rede Wi-Fi**.
2. `npm run dev` (já sobe com `--host`). O terminal mostra duas URLs; use a **Network**, ex. `http://192.168.0.12:5173`.
3. Se não aparecer a URL Network, descubra o IP do PC (`ipconfig` no Windows) e abra `http://SEU_IP:5173` no Chrome do celular.
4. Primeira vez no Windows: libere a porta no firewall quando pedir (rede privada).
5. No celular, use "Adicionar à tela inicial" para jogar em tela cheia.

> A narração usa arquivos de áudio quando existem e, se faltar, cai no text-to-speech pt-BR do navegador. O TTS só dispara depois do primeiro toque na tela (política dos navegadores) — o botão 🔊 "ouvir de novo" resolve.

## Scripts

| comando | o que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento acessível na rede |
| `npm run build` | checa tipos e gera `dist/` |
| `npm run preview` | serve o `dist/` na rede |
| `npm test` | testes da lógica de estrelas/moedas/fichas |
| `npm run assets` | prepara as imagens cruas (Python + pillow, numpy, scipy) |
| `npm run narracao` | regenera `assets/audio/narracao.csv` com todas as frases |

## Estrutura de pastas

```
assets/
  img/              imagens (PNG transparente). Nomes em ASSETS.md
  audio/            narração e músicas (MP3). Nomes em ASSETS.md
src/
  main.ts           configuração do Phaser (720x1280 retrato)
  theme.ts          paleta, fonte arredondada e duração das transições
  config.ts         números do jogo (fichas, moedas, limite diário) e lista de mundos
  narracoes.json    todas as frases da interface (a chave é o nome do .mp3)
  types.ts          schema das missões
  assets.ts         descobre o que existe em /assets e entrega a URL
  narrador.ts       narração por arquivo + fallback text-to-speech pt-BR
  ui.ts             botões grandes, HUD, balão de fala, timer musical
  teclado.ts        teclado grande na tela para o nome
  personagem.ts     personagem em camadas (corpo, olhos, cabelo, roupa, acessórios)
  economia.ts       estrelas, moedas, fichas, bônus de mundo, limite diário
  storage.ts        perfis e progresso no localStorage
  missions/         UMA missão = UM arquivo JSON (o motor não muda)
  minigames/        interface comum dos mini games (registro vazio até a ETAPA 2)
  scenes/
    Boot.ts         abertura: logotipo, raposinha e barra de carregamento
    Tutorial.ts     4 passos narrados de 5 s, na primeira vez que abre o mapa
    Perfis.ts       escolher/criar perfil
    Criador.ts      criador de personagem + nome
    Mapa.ts         mundos, missões, estrelas, saldo, painel dos pais
    Missao.ts       MOTOR GENÉRICO: lê o JSON e monta a missão
    etapas.ts       os 7 tipos de etapa
    Pais.ts         painel dos pais (conta de matemática)
```

## Como adicionar uma missão nova

1. Crie `src/missions/NN-nome-da-missao.json` (ex.: `02-arrumar-a-cama.json`). O motor carrega sozinho, em ordem de nome de arquivo.
2. Preencha o schema:

```json
{
  "id": "02",
  "mundo": 1,
  "titulo": "Arrumar a cama",
  "icone": "🛏️",
  "narracao_intro": "{nome}, vamos arrumar a cama?",
  "mostrar": { "narracao": "Olha como se faz!", "icone": "🛏️" },
  "etapas": [
    { "tipo": "arrastar_para_alvo", "narracao": "Arraste o lençol para a cama.",
      "audio": "m02_e1", "alvo": { "icone": "🛏️", "x": 360, "y": 900 },
      "itens": [{ "icone": "🧺", "x": 180, "y": 560 }] }
  ],
  "pode_ou_nao_pode": {
    "cena_certa": { "icone": "🙋", "texto": "Pedir ajuda" },
    "cena_errada": { "icone": "🌀", "texto": "Deixar bagunçada" },
    "explicacao": "Pedir ajuda é esperto!",
    "audio": "m02_pnp"
  },
  "frase_reforco": "Cama arrumada, dia começou bem!",
  "recompensa": { "moedas": 1 },
  "estrelas_max": 3
}
```

3. Tipos de etapa disponíveis (campos usados por cada um):

| tipo | campos | comportamento |
|---|---|---|
| `tocar` | `alvos[]` com `correto:false` nos errados | toca em todos os corretos |
| `arrastar_para_alvo` | `itens[]`, `alvo` | arrasta cada item até o alvo |
| `segurar_com_timer` | `alvo`, `segundos` | segura/arrasta sobre o objeto até o timer musical fechar |
| `esfregar` | `alvo`, `passos`, `segundos` | esfrega o dedo; cada passo limpa um pedaço |
| `escolher_entre_opcoes` | `itens[]` com um `correto:true` | escolhe a opção certa |
| `sequencia_ordenada` | `itens[]` (a ordem do array é a certa) | toca na ordem |
| `respirar` | `repeticoes` | segura para soprar, solta, repete |

Campos comuns a todas: `narracao`, `audio` (nome do arquivo em `/assets/audio`, sem extensão), `consequencia` (frase leve narrada quando erra).

4. Textos nunca entram na imagem — a interface é desenhada por código.
5. Para áudio, acrescente os nomes no `ASSETS.md` e grave os arquivos; sem eles o jogo narra por TTS.

> `{nome}` em qualquer narração é trocado pelo nome da criança.

## Narração

Toda frase tem uma chave, que é o nome do arquivo em `assets/audio`
(`m01_intro.mp3`, `ui_quem_joga.mp3`…). Com o arquivo, o jogo toca a gravação;
sem ele, lê pela voz do navegador em pt-BR.

`npm run narracao` varre `src/narracoes.json` e os JSONs das missões e escreve
`assets/audio/narracao.csv` (`arquivo;texto;local`) — a lista pronta para gravar.

## Política de privacidade

`docs/privacidade.html` está pronta. O passo a passo para publicar de graça está
em [docs/PUBLICAR_POLITICA.md](docs/PUBLICAR_POLITICA.md). O link dentro do app
fica em `CONFIG.URL_PRIVACIDADE` e aparece no painel dos pais.

## Estado da entrega

- **ETAPA 1** — motor genérico, mapa, estrelas/moedas/fichas, timer musical, painel dos pais, criador de personagem.
- **ETAPA 2** — arte real no jogo todo + mini game de corrida de kart.
- **Publicação, fase 1** — abertura, transições, confete, tema único, tutorial narrado.
- **Publicação, fase 2** — `narracao.csv` com as 59 frases do jogo.
- **Publicação, fase 3** — política de privacidade e instruções para publicá-la.
- A fazer: missões 2 a 20, os outros 4 mini games, PWA, Capacitor e o build Android.

> Para testar rápido, a etapa de escovação está com `"segundos": 120` (os 2 minutos reais). Baixe para `20` no JSON enquanto testa.

## Privacidade

Nenhum dado sai do aparelho: sem rede, sem analytics, sem SDK de anúncios, sem login.
O painel dos pais permite apagar todo o progresso de um perfil.

## De onde vêm as imagens

As artes cruas (com fundo verde chroma key) ficam **fora do repositório**, em
`C:\Users\rondj\Downloads\Imagens para jogo infantil` — caminho configurado em
`ORIGEM`, no topo de [tools/preparar_assets.py](tools/preparar_assets.py).
Guarde essa pasta num backup: o repositório tem só as imagens já preparadas.

```bash
npm run assets
```

(precisa de Python com `pip install pillow numpy scipy`)

O script faz tudo de uma vez:

- tira o fundo verde e corrige a franja esverdeada das bordas;
- corta as folhas (vários objetos numa imagem só) em arquivos separados, pelo
  recorte automático ou por grade quando as peças se encostam;
- gera os 6 tons de pele e as 6 cores de cabelo a partir de uma arte base,
  trocando só os pixels de pele e de cabelo (roupa e tênis não mudam);
- redimensiona os cenários para 720x1280 em JPG.

Para conferir a ordem das peças de uma folha nova antes de dar nome a elas:

```bash
python tools/preparar_assets.py --fatias nome_da_folha
```

O contato numerado sai em `tools/_fatias/` (pasta ignorada pelo git). Depois é
só acrescentar a folha e os nomes na tabela `FOLHAS` do script.
