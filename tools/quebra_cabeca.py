"""Monta as duas figuras do quebra-cabeca que nao existiam prontas.

    python tools/quebra_cabeca.py

A raposinha (mascote_raposinha.png) tem fundo transparente: cortada em pecas,
sobrariam pecas vazias. Aqui ela ganha um cenario do proprio jogo por tras e
vira um quadrado de 512 px, como as capas das historinhas.
"""
from pathlib import Path

from PIL import Image

IMG = Path(__file__).resolve().parent.parent / 'assets' / 'img'
LADO = 512

FIGURAS = {
    'quebra_raposinha': 'bg_mapa_mundos',
    'quebra_raposinha_brincar': 'bg_quarto_brincar',
}

raposa = Image.open(IMG / 'mascote_raposinha.png').convert('RGBA')
for nome, cenario in FIGURAS.items():
    bg = Image.open(IMG / f'{cenario}.jpg').convert('RGBA')
    # quadrado da metade de baixo do cenario: e onde fica o chao
    topo = bg.height - bg.width - 120
    quadro = bg.crop((0, topo, bg.width, topo + bg.width)).resize((LADO, LADO), Image.LANCZOS)
    r = raposa.copy()
    r.thumbnail((int(LADO * 0.62), int(LADO * 0.78)), Image.LANCZOS)
    quadro.alpha_composite(r, ((LADO - r.width) // 2, LADO - r.height - 24))
    quadro.convert('RGB').save(IMG / f'{nome}.jpg', quality=88)
    print(nome)
