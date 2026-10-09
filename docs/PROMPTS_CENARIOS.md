# Prompts dos cenários que faltam

Cenário é diferente das peças soltas: **não leva fundo verde**. É a imagem
inteira, em pé, que fica atrás da missão. O jogo escurece e lava a cor dela
sozinho, então gere com a cor natural.

Salve com o nome exato, na pasta das imagens, e rode `npm run assets`.

## A regra dos cenários

1. Imagem **em pé, proporção 9:16** (por exemplo 1080x1920)
2. **Sem texto nenhum** na imagem — nem no quadro, nem no cartaz, nem no livro
3. O **meio e a parte de baixo ficam livres**: é onde o jogo põe os cartões.
   A mobília vai nas bordas e no fundo da cena
4. Nada de criança em primeiro plano: quem aparece ali é o personagem do jogo

---

## `bg_sala_aula` — a sala de aula

O arquivo que está no jogo hoje com esse nome é, na verdade, uma cozinha: a
missão "Ouvir a professora" aparece dentro de uma cozinha. Este prompt
substitui o arquivo.

> Ilustração 2D cartoon infantil de uma **sala de aula de educação infantil
> vista de frente**, vazia, sem nenhuma pessoa. Ao fundo, um quadro verde
> limpo **sem nada escrito**, um mapa colorido sem letras, prateleiras baixas
> com livros e caixas de brinquedo, e uma janela grande com luz do dia.
> Carteirinhas pequenas de madeira clara organizadas nas laterais, deixando o
> **centro e a parte de baixo da imagem livres, só com o chão**. Tapete
> colorido no chão. Contorno escuro fino e limpo, estilo de livro infantil,
> cores suaves e pouco saturadas, tom calmo. **Sem texto, sem letras, sem
> números em lugar nenhum.** Imagem em pé, proporção 9:16, 1080x1920.

## `m07_professora` — a professora sentada

Essa é **peça solta**: vai com fundo verde, porque o jogo recorta e põe por
cima do cenário.

> Ilustração 2D cartoon infantil de **uma professora adulta sentada numa
> cadeira**, vista de frente, corpo inteiro, sorrindo de forma acolhedora, com
> um livro aberto no colo. Roupa simples e colorida em tom suave. Sem mesa,
> sem parede, sem chão, **só a professora e a cadeira**. Contorno escuro fino e
> limpo, estilo de livro infantil, cores suaves e pouco saturadas. **Fundo
> verde chapado #00FF00**, uma cor só, sem sombra projetada no fundo. Imagem
> quadrada 2048x2048, a professora centralizada ocupando a altura do quadro.

Gere uma versão de cada tom de pele se quiser variedade; o jogo usa uma só e
não recolore essa peça.

## `m03_terra` — brincar na terra

Peça solta, fundo verde, como a professora.

> Ilustração 2D cartoon infantil de **um canteiro de terra com uma plantinha
> pequena e uma pá de brinquedo**, visto de frente, sem mãos e sem pessoas.
> Terra marrom fofa, estilo de livro infantil, contorno escuro fino e limpo,
> cores suaves e pouco saturadas. **Fundo verde chapado #00FF00**, uma cor só,
> sem sombra projetada no fundo. Imagem quadrada 2048x2048.

---

## Se sair errado

- **Veio com texto no quadro**: acrescente *"o quadro está completamente vazio,
  sem nenhuma letra, palavra ou número"*.
- **Encheu o meio de carteiras**: acrescente *"a metade de baixo da imagem é só
  o chão vazio"*.
- **Cor muito viva**: acrescente *"cores dessaturadas, tom pastel"*.
- **A professora veio com fundo de sala**: acrescente *"NÃO desenhe parede,
  chão, janela nem móveis. Apenas a pessoa e a cadeira sobre o verde"*.
