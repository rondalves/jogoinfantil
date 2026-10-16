"""Pinta de verde o corpo dos germes da missao 03 (m03_germe1..5).

    python tools/germes_verdes.py

O recorte do fundo levou junto o recheio claro dos germes: sobravam o
contorno, os olhos e a boca, e o cenario aparecia por dentro do corpo. Aqui o
que fica dentro do contorno ganha um verde (um tom por germe), mais claro em
cima e a esquerda, por baixo do desenho que ja existia.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import binary_fill_holes

IMG = Path(__file__).resolve().parent.parent / 'assets' / 'img'
VERDES = [(110, 196, 92), (150, 206, 74), (86, 184, 138), (128, 194, 62), (96, 176, 96)]

for n, cor in enumerate(VERDES, start=1):
    caminho = IMG / f'm03_germe{n}.png'
    arte = Image.open(caminho).convert('RGBA')
    a = np.asarray(arte)
    solido = a[:, :, 3] > 40
    dentro = binary_fill_holes(solido)
    h, w = dentro.shape
    yy, xx = np.mgrid[0:h, 0:w]
    # luz vindo de cima a esquerda: 1.12 no canto claro, 0.82 no escuro
    luz = 1.12 - 0.30 * ((xx / w) * 0.4 + (yy / h) * 0.6)
    corpo = np.zeros_like(a)
    for c in range(3):
        corpo[:, :, c] = np.clip(cor[c] * luz, 0, 255)
    corpo[:, :, 3] = np.where(dentro, 255, 0)
    fundo = Image.fromarray(corpo.astype(np.uint8), 'RGBA')
    fundo.alpha_composite(arte)
    fundo.save(caminho, optimize=True)
    print(caminho.name)
