# ASSETS — imagens e áudio

As artes cruas (com fundo verde) ficam fora do repositório, em
`C:\Users\rondj\Downloads\Imagens para jogo infantil`. O comando abaixo prepara
tudo e grava em `assets/img`:

```bash
npm run assets
```

O jogo descobre sozinho o que existe: imagem que falta vira emoji, áudio que
falta é narrado pela voz do navegador em pt-BR. Dá para ir completando aos poucos.

## Já preparado (não precisa fazer nada)

| grupo | arquivos | vem de |
|---|---|---|
| Personagem | `corpo_pele1..6`, `corpo_macacao_pele1..6`, `corpo_sentado_pele1..6` | `corpo_base_pele_clara`, `roupa_macacao_jeans`, `corpo_cadeira_pele_clara` (os 6 tons são gerados) |
| Cabelo e olhos | `cabelo_cacheado_1..6`, `olhos_redondos` | `cabelo_cacheado_castanho` (as 6 cores são geradas), `olhos_redondos_castanhos` |
| Mascote | `mascote_raposinha` | `mascote` |
| Botões | `botao_play`, `botao_som`, `botao_voltar`, `botao_avancar`, `botao_pais`, `botao_casa` | `ui_botoes` |
| Mundos | `mundo1..5`, `mundo_bloqueado`, `broche1..5` | `ui_icones_mundos`, `ui_broches_mundos` |
| Fichas e prêmios | `moeda`, `ficha`, `estrela`, `estrela_vazia`, `medalha_final` | `mg3_itens_corredor`, `ui_ficha`, `ui_estrela_cheia_e_vazia`, `ui_medalha_final` |
| Missão 01 | `m01_escova`, `m01_pasta`, `m01_copo`, `m01_toalha`, `m01_sabonete`, `m01_rosto`, `m01_maca`, `m01_banana`, `m01_laranja`, `m01_pao`, `m01_leite` | `m01_cuidado_manha` |
| Corrida | `mg1_kart`, `mg1_rival`, `mg1_moeda`, `mg1_cone`, `mg1_poca`, `mg1_presente`, `mg1_chegada`, `pista_quintal`, `pista_parque`, `pista_praia` | `mg1_kart`, `mg1_pistas` |
| Cenários | `bg_menu_inicial`, `bg_criador_personagem`, `bg_mapa_mundos`, `bg_quarto_manha`, `bg_banheiro`, `bg_cozinha_cafe`, `bg_casa_segura`, `bg_escola_entrada`, `bg_sala_aula`, `bg_carro_interior`, `bg_sala_almoco`, `bg_quarto_brincar`, `bg_quarto_noite`, `bg_consultorio` | os `bg_*` originais, reduzidos para 720x1280 |

## Falta gerar (hoje aparece como emoji)

Mesmo padrão das outras: **fundo verde chapado**, cartoon, sem texto na imagem.

| arquivo cru | o que desenhar |
|---|---|
| `m01_prato` | prato vazio visto de cima (alvo do café da manhã) |
| `m01_pnp_certa` | criança escovando os dentes |
| `m01_pnp_errada` | criança brincando com a comida |
| `acessorio_oculos` | óculos, sozinho, do tamanho do rosto |
| `acessorio_aparelho_auditivo` | aparelho auditivo |
| `acessorio_bone` | boné |
| `acessorio_laco` | laço de cabelo |
| `acessorio_capa` | capa de herói |
| `acessorio_medalha` | medalha de pescoço |
| `icone_app` | 1024x1024, **fundo opaco**, sem texto — ícone da loja |
| `logo` | logotipo "Missões do Dia", fundo transparente |

Acessórios e peças soltas podem vir várias numa folha só: o script separa
sozinho. Para conferir a ordem antes de dar nome:
`python tools/preparar_assets.py --fatias nome_da_folha`.

## Mais opções no criador de personagem

Cada arquivo novo vira uma opção a mais, sem mexer no código:

- **Penteados**: `cabelo_<estilo>_castanho` (liso curto, liso longo, crespo, tranças, coque). As 6 cores saem automáticas.
- **Olhos**: `olhos_<tipo>_castanhos` (alegres, grandes, sonolentos).
- **Roupas**: um corpo inteiro vestido, como o macacão (`roupa_<nome>`), que o script recolore nos 6 tons de pele.

Depois de salvar o arquivo, acrescente o nome na tabela do script e na lista
`CABELOS` / `OLHOS` / `ROUPAS` de [src/personagem.ts](src/personagem.ts).

## Áudio

MP3 mono, 44.1 kHz, voz calma e pausada. O nome do arquivo é o mesmo campo
`audio` do JSON da missão. Sem o arquivo, a frase é lida pelo navegador.

| arquivo | onde toca |
|---|---|
| `m01_intro`, `m01_mostrar`, `m01_e1`, `m01_e2`, `m01_e3`, `m01_pnp`, `m01_reforco` | missão 01 |
| `ui_quem_joga`, `ui_monte_personagem`, `ui_escreva_nome` | telas iniciais |
| `letra_a` … `letra_z` | teclado do nome (26 arquivos) |
| `mg1_escolha_pista`, `mg1_como_jogar` | corrida de kart |
| `musica_timer` | 30 s em loop, durante a escovação e a lavagem das mãos |

Frases com o nome da criança (`{nome}` no JSON) só funcionam no text-to-speech.
Se gravar o arquivo, grave a frase **sem** o nome.

Sem `musica_timer` o jogo toca uma notinha a cada 5 segundos gerada pelo próprio
navegador; os sons de acerto, moeda e freada também são gerados em código.
