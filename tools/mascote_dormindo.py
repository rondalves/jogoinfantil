"""Gera assets/img/mascote_dormindo.png: a raposinha com os olhos fechados, para o livro animado.

    python tools/mascote_dormindo.py
"""
import sys
from PIL import Image, ImageDraw
import numpy as np
src, dst = "assets/img/mascote_raposinha.png", "assets/img/mascote_dormindo.png"
im = Image.open(src).convert('RGBA')
arr = np.array(im).astype(int)
olhos = [(117, 145, 156, 184), (208, 154, 248, 193)]  # caixa de cada olho com o contorno
d = ImageDraw.Draw(im)
yy, xx = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
for (x0, y0, x1, y1) in olhos:
    cx, cy, rx, ry = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2
    dist = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    anel = (dist > 1.25) & (dist < 2.0) & (arr[..., :3].sum(-1) > 300) & (arr[..., 3] > 200)
    # pelo de cima e de baixo do olho tem cores diferentes: pinta cada metade com a sua
    for metade, sel in (('cima', yy < cy), ('baixo', yy >= cy)):
        cor = tuple(int(c) for c in np.median(arr[anel & sel][:, :3], axis=0)) + (255,)
        caixa = [x0 - 2, y0 - 2, x1 + 2, y1 + 2]
        mask = Image.new('L', im.size, 0)
        ImageDraw.Draw(mask).ellipse(caixa, fill=255)
        half = Image.new('L', im.size, 0)
        ImageDraw.Draw(half).rectangle([0, 0, im.size[0], cy] if metade == 'cima' else [0, cy, im.size[0], im.size[1]], fill=255)
        m = Image.fromarray(np.minimum(np.array(mask), np.array(half)).astype('uint8'))
        im.paste(Image.new('RGBA', im.size, cor), (0, 0), m)
    # olho fechado: arco curvado para baixo, com dois cilios
    d = ImageDraw.Draw(im)
    w = rx * 1.5
    d.arc([cx - w, cy - ry * 0.9, cx + w, cy + ry * 0.6], start=20, end=160, fill=(70, 40, 30, 255), width=5)
im.save(dst)
