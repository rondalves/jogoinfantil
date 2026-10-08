"""Prepara as imagens cruas (fundo verde) para assets/img do jogo.

    python tools/preparar_assets.py              # gera tudo
    python tools/preparar_assets.py --fatias m01_cuidado_manha
        -> contato numerado em tools/_fatias/ para descobrir a ordem dos recortes

Fundo verde vira transparente, cada folha e cortada em pecas, os cenarios sao
redimensionados para o tamanho da tela. Fonte: ORIGEM (mude se preciso).
"""

import argparse
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ORIGEM = r"C:\Users\rondj\Downloads\Imagens para jogo infantil"
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "assets", "img")

LARGURA, ALTURA = 720, 1280

# Tons de pele do jogo (iguais aos de src/personagem.ts).
PELES = [(255, 224, 189), (243, 200, 147), (224, 172, 105), (198, 134, 66), (141, 85, 36), (92, 51, 23)]
CORES_CABELO = [(43, 27, 23), (107, 68, 35), (217, 169, 91), (179, 58, 43), (74, 74, 74), (125, 79, 160)]

# folha -> nomes dos recortes, em ordem de leitura (linha por linha).
# Peca sem nome util recebe None e nao e gravada.
# folha -> (nomes dos recortes em ordem de leitura, tamanho maximo, modo).
# None no lugar do nome descarta a peca (brilhos, respingos e sobras).
# modo ("grade", colunas, linhas) corta em celulas iguais quando as pecas se
# encostam e o recorte automatico junta tudo.
FOLHAS = {
    "mascote": (["mascote_raposinha"], 512, None),
    "ui_botoes": (
        ["botao_play", None, "botao_som", "botao_voltar", "botao_avancar", "botao_pais", "botao_casa"],
        192,
        None,
    ),
    "ui_icones_mundos": (["mundo1", "mundo2", "mundo3", "mundo4", "mundo5", "mundo_bloqueado"], 256, None),
    "ui_broches_mundos": (["broche1", "broche2", "broche3", "broche4", "broche5"], 256, ("grade", 5, 1)),
    "ui_estrela_cheia_e_vazia": ([None, "estrela", "estrela_vazia", None, None], 256, None),
    "ui_ficha": (["ficha"], 256, None),
    "ui_medalha_final": (["medalha_final"], 512, None),
    "mg3_itens_corredor": (["moeda"], 256, None),
    "mg1_kart": (
        [
            "mg1_kart",
            "mg1_moeda",
            "mg1_cone",
            "mg1_rival",
            "mg1_presente",
            None,
            "mg1_poca",
            None,
            None,
            "mg1_chegada",
        ],
        256,
        None,
    ),
    "m01_cuidado_manha": (
        [
            "m01_escova",
            "m01_pasta",
            "m01_copo",
            None,
            "m01_toalha",
            None,
            "m01_sabonete",
            "m01_rosto",
            "m01_leite",
            "m01_maca",
            "m01_banana",
            "m01_laranja",
            "m01_pao",
        ],
        256,
        None,
    ),
}

# Folhas SEM fundo verde: so cortadas em grade e salvas como JPG. Tirar o verde
# aqui comeria a grama e a agua das ilustracoes.
FOLHAS_OPACAS = {
    "mg1_pistas": (["pista_quintal", "pista_parque", "pista_praia"], 3, 1, 420),
}

# Cenarios: viram JPG do tamanho da tela (nao tem fundo verde).
CENARIOS = [
    "bg_menu_inicial",
    "bg_criador_personagem",
    "bg_mapa_mundos",
    "bg_quarto_manha",
    "bg_banheiro",
    "bg_cozinha_cafe",
    "bg_casa_segura",
    "bg_escola_entrada",
    "bg_sala_aula",
    "bg_carro_interior",
    "bg_sala_almoco",
    "bg_quarto_brincar",
    "bg_quarto_noite",
    "bg_consultorio",
]


def abrir(nome):
    for ext in (".jpg", ".jpeg", ".png", ".webp"):
        p = os.path.join(ORIGEM, nome + ext)
        if os.path.exists(p):
            return Image.open(p).convert("RGB")
    raise SystemExit(f"nao achei {nome} em {ORIGEM}")


def tirar_verde(im):
    """Fundo verde -> transparente, com borda suave e sem franja verde."""
    a = np.asarray(im).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    verde = g - np.maximum(r, b)  # quanto o verde domina
    alpha = np.clip((verde - 20) / 40.0, 0, 1)  # 20 = ainda objeto, 60 = fundo puro
    alpha = (1 - alpha) * 255
    # despill: onde sobrou verde demais, puxa para o maior dos outros canais
    limite = np.maximum(r, b)
    excesso = (g > limite + 10) & (alpha > 0)
    g = np.where(excesso, limite + 10, g)
    saida = np.dstack([r, g, b, alpha]).astype(np.uint8)
    return Image.fromarray(saida, "RGBA")


def pecas(rgba, min_area=4000):
    """Caixas de cada objeto, em ordem de leitura."""
    alpha = np.asarray(rgba)[..., 3] > 40
    alpha = ndimage.binary_closing(alpha, structure=np.ones((25, 25)))
    rotulos, n = ndimage.label(alpha)
    caixas = []
    for i, fatia in enumerate(ndimage.find_objects(rotulos), start=1):
        ys, xs = fatia
        area = (ys.stop - ys.start) * (xs.stop - xs.start)
        if area < min_area:
            continue
        caixas.append((xs.start, ys.start, xs.stop, ys.stop))
    if not caixas:
        return []
    alturas = sorted(c[3] - c[1] for c in caixas)
    faixa = alturas[len(alturas) // 2] * 0.6
    caixas.sort(key=lambda c: (round((c[1] + c[3]) / 2 / faixa), c[0]))
    return caixas


def recortar(rgba, caixa, tam):
    x0, y0, x1, y1 = caixa
    folga = int(max(x1 - x0, y1 - y0) * 0.04)
    corte = rgba.crop(
        (max(0, x0 - folga), max(0, y0 - folga), min(rgba.width, x1 + folga), min(rgba.height, y1 + folga))
    )
    corte.thumbnail((tam, tam), Image.LANCZOS)
    return corte


def gravar(im, nome):
    os.makedirs(DESTINO, exist_ok=True)
    caminho = os.path.join(DESTINO, nome + ".png")
    im.save(caminho, optimize=True)
    return caminho


def contato(nome, cortes, saida):
    """Folha numerada para conferir a ordem dos recortes."""
    cols = 6
    cel = 200
    linhas = (len(cortes) + cols - 1) // cols
    folha = Image.new("RGB", (cols * cel, max(1, linhas) * cel), "white")
    d = ImageDraw.Draw(folha)
    for i, c in enumerate(cortes):
        mini = c.copy()
        mini.thumbnail((cel - 30, cel - 30))
        x, y = (i % cols) * cel, (i // cols) * cel
        folha.paste(mini, (x + 15, y + 25), mini)
        d.text((x + 6, y + 6), f"{i}", fill="red")
        d.rectangle([x, y, x + cel - 1, y + cel - 1], outline="#ccc")
    folha.save(saida)
    print(f"{nome}: {len(cortes)} pecas -> {saida}")


def recolorir_pele(rgba, destino):
    """Troca so os pixels de pele, deixando roupa, tenis e contorno em paz."""
    a = np.asarray(rgba).astype(np.float32)
    rgb, alpha = a[..., :3], a[..., 3:]
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    pele = (r > g) & (g > b) & (sat > 0.13) & (sat < 0.62) & (mx > 90) & (alpha[..., 0] > 0)
    base = np.array(PELES[0], dtype=np.float32)
    alvo = np.array(destino, dtype=np.float32)
    fator = alvo / base
    novo = np.clip(rgb * fator, 0, 255)
    rgb = np.where(pele[..., None], novo, rgb)
    return Image.fromarray(np.dstack([rgb, alpha]).astype(np.uint8), "RGBA")


def recolorir_cabelo(rgba, destino):
    """Duotone: mantem o sombreado, troca a cor."""
    a = np.asarray(rgba).astype(np.float32)
    rgb, alpha = a[..., :3], a[..., 3:]
    luz = (rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114) / 255.0
    # a arte original e castanha e media ~0.35: normaliza para usar toda a faixa
    luz = np.clip(luz / 0.55, 0, 1.25)
    novo = np.clip(luz[..., None] * np.array(destino, dtype=np.float32), 0, 255)
    return Image.fromarray(np.dstack([novo, alpha]).astype(np.uint8), "RGBA")


def cobrir(im, larg, alt):
    escala = max(larg / im.width, alt / im.height)
    im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    x = (im.width - larg) // 2
    y = (im.height - alt) // 2
    return im.crop((x, y, x + larg, y + alt))


def grade(rgba, cols, linhas):
    """Caixa de todo o conteudo dividida em celulas iguais."""
    alpha = np.asarray(rgba)[..., 3] > 40
    ys, xs = np.where(alpha)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    lx = (x1 - x0) / cols
    ly = (y1 - y0) / linhas
    return [
        (round(x0 + c * lx), round(y0 + l * ly), round(x0 + (c + 1) * lx), round(y0 + (l + 1) * ly))
        for l in range(linhas)
        for c in range(cols)
    ]


def fazer_folhas(so=None):
    alvos = FOLHAS
    if so and so not in FOLHAS:
        alvos = {so: ([], 512, None)}  # folha nova: so para ver os recortes
    for nome, (rotulos, tam, modo) in alvos.items():
        if so and nome != so:
            continue
        rgba = tirar_verde(abrir(nome))
        caixas = grade(rgba, modo[1], modo[2]) if modo else pecas(rgba)
        cortes = [recortar(rgba, c, tam) for c in caixas]
        if so:
            os.makedirs(os.path.join(RAIZ, "tools", "_fatias"), exist_ok=True)
            contato(nome, cortes, os.path.join(RAIZ, "tools", "_fatias", nome + ".png"))
            continue
        if len(cortes) != len(rotulos):
            print(f"  ! {nome}: {len(cortes)} pecas para {len(rotulos)} nomes (confira com --fatias)")
        for rotulo, corte in zip(rotulos, cortes):
            if rotulo:
                gravar(corte, rotulo)
        print(f"{nome}: {min(len(cortes), len(rotulos))} pecas")


def fazer_opacas():
    for nome, (rotulos, cols, linhas, tam) in FOLHAS_OPACAS.items():
        im = abrir(nome)
        lx, ly = im.width / cols, im.height / linhas
        for i, rotulo in enumerate(rotulos):
            if not rotulo:
                continue
            c, l = i % cols, i // cols
            corte = im.crop((round(c * lx), round(l * ly), round((c + 1) * lx), round((l + 1) * ly)))
            corte.thumbnail((tam, tam * 3), Image.LANCZOS)
            os.makedirs(DESTINO, exist_ok=True)
            corte.save(os.path.join(DESTINO, rotulo + ".jpg"), quality=82, optimize=True)
        print(f"{nome}: {len([r for r in rotulos if r])} pecas")


def fazer_personagem():
    corpo = tirar_verde(abrir("corpo_base_pele_clara"))
    sentado = tirar_verde(abrir("corpo_cadeira_pele_clara"))
    macacao = tirar_verde(abrir("roupa_macacao_jeans"))
    for i, tom in enumerate(PELES, start=1):
        gravar(recortar(recolorir_pele(corpo, tom), pecas(corpo)[0], 512), f"corpo_pele{i}")
        gravar(recortar(recolorir_pele(sentado, tom), pecas(sentado)[0], 512), f"corpo_sentado_pele{i}")
        gravar(recortar(recolorir_pele(macacao, tom), pecas(macacao)[0], 512), f"corpo_macacao_pele{i}")
    print("corpo: 18 pecas")

    # olhos sao varias manchas (sobrancelhas + olhos): pega a caixa de tudo junto
    olhos = tirar_verde(abrir("olhos_redondos_castanhos"))
    gravar(recortar(olhos, grade(olhos, 1, 1)[0], 512), "olhos_redondos")

    cabelo = tirar_verde(abrir("cabelo_cacheado_castanho"))
    caixa = grade(cabelo, 1, 1)[0]
    for i, cor in enumerate(CORES_CABELO, start=1):
        gravar(recortar(recolorir_cabelo(cabelo, cor), caixa, 512), f"cabelo_cacheado_{i}")
    print("olhos + cabelo: 7 pecas")


def fazer_cenarios():
    for nome in CENARIOS:
        im = cobrir(abrir(nome), LARGURA, ALTURA)
        os.makedirs(DESTINO, exist_ok=True)
        im.save(os.path.join(DESTINO, nome + ".jpg"), quality=80, optimize=True, progressive=True)
    print(f"cenarios: {len(CENARIOS)}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--fatias", help="so mostra os recortes numerados desta folha")
    args = p.parse_args()
    if args.fatias:
        fazer_folhas(so=args.fatias)
        return
    fazer_folhas()
    fazer_opacas()
    fazer_personagem()
    fazer_cenarios()
    print("pronto ->", DESTINO)


if __name__ == "__main__":
    sys.exit(main())
