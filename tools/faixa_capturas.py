# -*- coding: utf-8 -*-
"""Poe a faixa de texto no topo de cada captura da loja.

    python tools/faixa_capturas.py

Le as capturas brutas de store/screenshots e grava por cima, 1080x1920.
"""
import os

from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(RAIZ, 'store', 'screenshots')
FONTE = os.path.join(RAIZ, 'assets', 'fontes', 'lexend-700-latin.woff2')

# cores do tema (src/theme.ts)
FAIXA = (58, 63, 69)
TEXTO = (255, 255, 255)
DETALHE = (230, 184, 135)

TEXTOS = {
    '01-criador': 'Crie seu personagem',
    '02-mapa': 'Uma aventura para cada hora do dia',
    '03-escova': 'Aprender fazendo',
    '04-pode-ou-nao': 'Pode ou Não Pode?',
    '05-corrida': 'Jogue e se divirta',
    '06-medalha': 'Termine o dia com medalha',
}

ALTURA = 230


def carregar_fonte(tamanho):
    """woff2 o Pillow nao le: usa uma fonte do sistema com cara parecida."""
    for caminho in (
        r'C:\Windows\Fonts\segoeuib.ttf',
        r'C:\Windows\Fonts\arialbd.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    ):
        if os.path.exists(caminho):
            return ImageFont.truetype(caminho, tamanho)
    return ImageFont.load_default()


def faixa(caminho, texto):
    im = Image.open(caminho).convert('RGB')
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, im.width, ALTURA], fill=FAIXA)
    d.rectangle([0, ALTURA - 8, im.width, ALTURA], fill=DETALHE)

    tamanho = 68
    fonte = carregar_fonte(tamanho)
    while d.textlength(texto, font=fonte) > im.width - 110 and tamanho > 30:
        tamanho -= 3
        fonte = carregar_fonte(tamanho)

    caixa = d.textbbox((0, 0), texto, font=fonte)
    d.text(
        ((im.width - (caixa[2] - caixa[0])) / 2, (ALTURA - 8 - (caixa[3] - caixa[1])) / 2 - caixa[1]),
        texto,
        font=fonte,
        fill=TEXTO,
    )
    im.save(caminho)
    return tamanho


def main():
    for nome, texto in TEXTOS.items():
        caminho = os.path.join(PASTA, nome + '.png')
        if not os.path.exists(caminho):
            print('faltou:', nome)
            continue
        print(nome, '->', texto, f'({faixa(caminho, texto)}px)')


if __name__ == '__main__':
    main()
