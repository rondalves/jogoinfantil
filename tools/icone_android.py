"""Monta o icone adaptavel do Android a partir da arte quadrada do icone.

    python tools/icone_android.py

O Android mostra so o miolo do icone (72 de 108 dp) dentro do formato do
celular (circulo, gota, quadrado arredondado). Antes, a imagem da frente ja
vinha num circulo com folga e o XML ainda encolhia mais 16,7% de cada lado:
a crianca ficava com menos da metade do icone, e borrada (192 px esticados).

Aqui a frente e a propria arte, grande e no tamanho certo de cada densidade,
e o fundo e o mesmo azul da arte, sem emenda. O XML fica sem inset.
"""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ARTE = RAIZ / 'assets-loja' / 'icon.png'
RES = RAIZ / 'android' / 'app' / 'src' / 'main' / 'res'
# lado do icone adaptavel (108 dp) em px de cada densidade
LADOS = {'ldpi': 81, 'mdpi': 108, 'hdpi': 162, 'xhdpi': 216, 'xxhdpi': 324, 'xxxhdpi': 432}
# quanto da largura do icone a arte ocupa: o rosto e a raposinha ficam dentro
# do miolo que aparece; 0.86 cortava a raposinha no icone redondo
ESCALA = 0.78

XML = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
"""

arte = Image.open(ARTE).convert('RGBA')
azul = arte.getpixel((4, 4))
for dens, lado in LADOS.items():
    pasta = RES / f'mipmap-{dens}'
    Image.new('RGBA', (lado, lado), azul).save(pasta / 'ic_launcher_background.png', optimize=True)
    frente = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
    a = round(lado * ESCALA)
    frente.alpha_composite(arte.resize((a, a), Image.LANCZOS), ((lado - a) // 2, (lado - a) // 2))
    frente.save(pasta / 'ic_launcher_foreground.png', optimize=True)
for nome in ('ic_launcher.xml', 'ic_launcher_round.xml'):
    (RES / 'mipmap-anydpi-v26' / nome).write_text(XML, encoding='utf-8')
print('icone adaptavel refeito em', len(LADOS), 'densidades')
