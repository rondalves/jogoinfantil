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
from PIL import Image, ImageDraw, ImageEnhance
from scipy import ndimage

ORIGEM = r"C:\Users\rondj\Downloads\Imagens para jogo infantil"
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "assets", "img")

LARGURA, ALTURA = 720, 1280

# Quanto a cor e puxada para baixo. 1.0 seria a arte crua.
SATURACAO_OBJETO = 0.72
BRANCO_OBJETO = 0.06
SATURACAO_CENARIO = 0.5
BRANCO_CENARIO = 0.2

# Tons de pele do jogo (iguais aos de src/personagem.ts).
PELES = [(255, 224, 189), (239, 201, 171), (243, 200, 147), (224, 172, 105), (198, 134, 66),
         (141, 85, 36), (92, 51, 23)]
CORES_CABELO = [(43, 27, 23), (107, 68, 35), (217, 169, 91), (179, 58, 43), (195, 195, 200),
                (125, 79, 160), (247, 226, 176), (232, 105, 159), (74, 144, 217)]

# Penteados e olhos que o jogo sabe mostrar (iguais aos catalogos de
# src/personagem.ts). So entra o que tiver arte: cabelo_<id>_castanho e
# olhos_<id>_castanhos na pasta das imagens cruas.
CABELOS = [
    "cacheado", "crespo", "ondulado", "enrolado", "liso_longo", "liso_curto",
    "trancas", "tranca_unica", "coque", "maria_chiquinha", "box_braids", "dreads",
    "menino_curto", "menino_cacheado", "menino_crespo", "menino_black_power",
    "menino_espetado", "menino_tigelinha", "menino_raspado", "menino_degrade", "menino_risco",
    "menino_moicano",
]
# "redondos" ficou de fora: e a unica peca so com olhos, e desde que a boca
# desenhada no corpo saiu, ela deixaria a crianca sem boca. Volta refeita.
OLHOS = ["alegres", "grandes", "sorriso"]

# Roupas: sufixo da chave no jogo -> arquivo cru (corpo inteiro vestido, no
# mesmo enquadramento do corpo base). Tem que bater com ROUPAS de
# src/personagem.ts. Evite roupa amarela, laranja ou bege (a troca de tom de
# pele repinta essas cores) e qualquer verde (some no chroma key).
ROUPAS = {
    "_macacao": "roupa_macacao_jeans",
    "_vestido_rosa": "roupa_vestido_rosa",
    "_roxo": "roupa_conjunto_roxo",
    "_azul": "roupa_camiseta_azul",
    "_vermelho": "roupa_moletom_vermelho",
}

# O cabelo sai num quadro proprio, com 1 px = 1 unidade do personagem e o mesmo
# centro do corpo: o jogo so desenha por cima, sem conta nenhuma. Os numeros
# sao medidos na propria arte do corpo, nao na constante CABECA do jogo:
# a cabeca vai de -240 a -61, o cranio tem 158 de largura e as orelhas 182.
QUADRO_CABELO = 768
ROSTO_LARGURA = 150  # vao do rosto: o cranio menos a sobreposicao do cabelo
ROSTO_TOPO = -206  # altura onde o vao comeca, logo abaixo do alto da cabeca
TOPO_CABELO = -244  # o cabelo encosta no alto do cranio, nem acima nem abaixo
# teto de tamanho: arte com volume demais encolhe ate aqui, sem nunca fechar o
# vao abaixo de VAO_MINIMO (senao o cabelo entra na frente dos olhos)
LARGURA_MAXIMA = 258
ALTURA_MAXIMA = 268
VAO_MINIMO = 142

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
    "ui_icones_mundos": (["mundo1", "mundo2", "mundo3", "mundo4", "mundo6", "mundo_bloqueado"], 256, None),
    "ui_broches_mundos": (["broche1", "broche2", "broche3", "broche4", "broche6"], 256, ("grade", 5, 1)),
    "ui_estrela_cheia_e_vazia": ([None, "estrela", "estrela_vazia", None, None], 256, None),
    "ui_ficha": (["ficha"], 256, None),
    "ui_medalha_final": (["medalha_final"], 512, ("grade", 1, 1)),
    "mg3_itens_corredor": (
        ["moeda", "mg3_estrela", "mg3_ima", "mg3_balao", "mg3_cone", "mg3_caixa", "mg3_poca", None,
         "mg3_bola", "mg3_gol"],
        256, None,
    ),
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
    "m06_rua": (
        ["m06_sinal_vermelho", "m06_sinal_verde", "m06_faixa", "m06_carro", "m06_bola", "m06_mao_dada"],
        256,
        None,
    ),
    "m07_sala_aula": (
        ["m07_carteira", "m07_lousa", "m07_mao_levantada", "m07_balao", "m07_silencio", "m07_atividade"],
        256,
        None,
    ),
    "m08_esperar": (
        [
            "m08_ampulheta",
            "m08_relogio",
            "m08_respirar",
            None,
            "m08_cantar",
            None,
            None,
            None,
            None,
            None,
            "m08_fila_menino",
            None,
            "m08_fila_menina",
            None,
            "m08_olhar",
            None,
        ],
        256,
        None,
    ),
    "m09_palavras_magicas": (
        ["m09_varinha", "m09_balao", "m09_pedir", "m09_obrigado", "m09_licenca", None, None],
        256,
        None,
    ),
    "m10_amigos": (
        [
            "m10_sozinho",
            "m10_oferecer",
            "m10_dividir",
            "m10_caiu",
            "m10_ajudar",
            None,
            None,
            None,
            None,
            None,
            "m10_coracao",
        ],
        256,
        None,
    ),
    "m11_monstrinho_sentimentos": (
        ["m11_feliz", "m11_triste", "m11_respirar", "m11_bravo", "m11_medo", "m11_abraco"],
        256,
        None,
    ),
    "personagens_dentista_colegas": (["dentista", "colega_menino", "colegas", "colega_menina"], 320, None),
    # lote novo do Gemini (nomes do gerador, conteudo na tabela)
    "Gemini_Generated_Image_82ee4x82ee4x82ee": (["m01_boca_suja"], 512, None),
    "Gemini_Generated_Image_8zd1bh8zd1bh8zd1": (["m01_boca_limpa"], 512, None),
    "Gemini_Generated_Image_k5ne0wk5ne0wk5ne": (["m01_boca_espuma"], 512, None),
    "Gemini_Generated_Image_t7s27lt7s27lt7s2": (["m01_prato"], 320, None),
    "Gemini_Generated_Image_ry14i8ry14i8ry14": (["m05_mochila"], 320, None),
    "Gemini_Generated_Image_njmxgxnjmxgxnjmx": (["acessorio_laco"], 256, None),
    "Gemini_Generated_Image_q6mvumq6mvumq6mv": (["acessorio_bone"], 256, None),
    # o par vermelho sai cortado em qualquer recorte: fica de fora
    "Gemini_Generated_Image_pnlueqpnlueqpnlu": ([None, None], 256, ("grade", 1, 2)),
    "Gemini_Generated_Image_v2skq3v2skq3v2sk": ([None, "acessorio_oculos"], 256, ("grade", 1, 2)),
    "m12_carro": (
        [None, None, "m12_cinto", "m12_clique", "m12_cadeirinha", "m12_fivela", None, None, None,
         "m12_janela", "m12_janela_nao", "m12_macaneta", "m12_porta"],
        256, None,
    ),
    "m13_almoco": (
        ["m13_prato_cheio", "m13_prato_vazio", "m13_garfo", "m13_colher", "m13_suco", "m13_mesa",
         "m13_brocolis", None, None, "m13_cadeira"],
        256, None,
    ),
    "m15_brinquedos": (
        ["m15_bola", "m15_carrinho", "m15_boneca", "m15_blocos", "m15_urso", "m15_trem", "m15_piao",
         "m15_tambor"],
        256, None,
    ),
    "m16_guardar": (
        ["m16_caixa_cheia", "m16_bagunca", "m16_caixa_pelucia", "m16_caixa_blocos", "m16_tropecar",
         "m16_estrela"],
        256, None,
    ),
    "m17_ajudante_casa": (
        ["m17_cesto", "m17_camiseta_suja", "m17_meia_suja", "m17_prato", "m17_copo", "m17_garfo",
         "m17_colher", "m17_racao", "m17_potinho", "m17_osso"],
        256, None,
    ),
    "m18_tela": (
        ["m18_tablet_ligado", "m18_tablet_desligado", "m18_cronometro", "m18_relogio", "m18_pensando",
         "m18_brincar", "m18_desligar"],
        256, None,
    ),
    "m19_noite": (
        ["m19_banheira", "m19_toalha", "m19_pijama", "m19_escova", "m19_livro_aberto", "m19_livro",
         "m19_luz_acesa", "m19_luz_apagada", "m19_lua", "m19_estrelas", "m19_cama"],
        256, None,
    ),
    "m20_medico_dentista": (
        ["m20_estetoscopio", "m20_termometro", "m20_balanca", "m20_cadeira_dentista", None,
         "m20_espelho_dentista", "m20_dente", "m20_sala_espera", "m20_estrela"],
        256, None,
    ),
    "m02_cama": (
        ["m02_cama_bagunca", "m02_cama_arrumada", "m02_lencol", "m02_cobertor", "m02_travesseiro"],
        320,
        None,
    ),
    "m03_germes": (
        [
            None,
            "m03_maos_sujas",
            None,
            "m03_maos_limpas",
            "m03_bolhas",
            None,
            "m03_torneira",
            "m03_germe1",
            "m03_toalha",
            "m03_germe2",
            "m03_germe3",
            "m03_germe4",
            "m03_germe5",
        ],
        256,
        None,
    ),
    "m04_perigos": (
        [
            "m04_tomada",
            "m04_remedio",
            "m04_produto",
            "m04_faca",
            None,
            "m04_fogao",
            "m04_escada",
            "m04_campainha",
            "m04_porta",
            "m04_perigo",
        ],
        256,
        None,
    ),
    "personagens_adultos": ([None, "adulto", None, None], 320, None),
    "pets": (["pet_cachorro", "pet_gato"], 256, None),
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

# Pecas soltas: um arquivo cru, uma peca com o mesmo nome. Grade 1x1 pega a
# caixa de tudo junto, para o objeto nao sair picado em varios pedacos.
SOLTAS = [
    "mundo5",
    "broche5",
    "m05_pente",
    "m03_terra",
    "m07_professora",
    "m10_bater",
    "mg2_pedra",
    "logo",
    "acessorio_aparelho_auditivo",
    "acessorio_capa",
    "acessorio_medalha",
]
FOLHAS.update({n: ([n], 320, ("grade", 1, 1)) for n in SOLTAS})
FOLHAS["m05_mochila_itens"] = (
    # o lapis fica mais alto que o caderno na folha: a leitura pega ele primeiro
    ["m05_lapis", "m05_caderno", "m05_garrafinha", "m05_uniforme", "m05_tenis"],
    256,
    None,
)

# Folhas SEM fundo verde: so cortadas em grade e salvas como JPG. Tirar o verde
# aqui comeria a grama e a agua das ilustracoes.
FOLHAS_OPACAS = {
    "mg1_pistas": (["pista_quintal", "pista_parque", "pista_praia"], 3, 1, 420),
    "mg2_cenario_escalada": (["bg_escalada"], 1, 1, 1280),
    "mg3_corredor": (["bg_corredor"], 1, 1, 1280),
    # cenas inteiras, sem fundo verde: viram carta do Pode ou Nao Pode
    "Gemini_Generated_Image_4sgk7f4sgk7f4sgk": (["m01_pnp_certa"], 1, 1, 420),
    "Gemini_Generated_Image_pt9umspt9umspt9u": (["m01_pnp_errada"], 1, 1, 420),
    # salve as duas da rua ja com esse nome na pasta das imagens
    "m06_pnp_certa": (["m06_pnp_certa"], 1, 1, 420),
    "m06_pnp_errada": (["m06_pnp_errada"], 1, 1, 420),
}

# Capas das historinhas: quadradas, sem fundo verde, do tamanho do cartao.
CAPAS = ["capa_historia1", "capa_historia2", "capa_historia3",
         "capa_historia4", "capa_historia5", "capa_historia6"]
FOLHAS_OPACAS.update({n: ([n], 1, 1, 512) for n in CAPAS})

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
    "bg_porta_casa",
    "bg_sala_janta",
    "bg_banheiro_banho",
]


def abrir(nome, obrigatorio=True):
    for ext in (".jpg", ".jpeg", ".png", ".webp"):
        p = os.path.join(ORIGEM, nome + ext)
        if os.path.exists(p):
            return Image.open(p).convert("RGB")
    if obrigatorio:
        raise SystemExit(f"nao achei {nome} em {ORIGEM}")
    return None


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


def lavar(im, saturacao, branco):
    """Tira o exagero da cor: o jogo e para olhar por muito tempo, de perto."""
    rgba = im.convert("RGBA")
    alpha = rgba.getchannel("A")
    base = rgba.convert("RGB")
    base = ImageEnhance.Color(base).enhance(saturacao)
    if branco:
        base = Image.blend(base, Image.new("RGB", base.size, (255, 255, 255)), branco)
    base = ImageEnhance.Brightness(base).enhance(1.02)
    saida = base.convert("RGBA")
    saida.putalpha(alpha)
    return saida


def tapar_buraco(cor):
    """Devolve um retoque que pinta o vazio de dentro da peca.

    Arte com verde dentro (a lampada acesa do semaforo, o brocolis) perde
    essa parte no chroma key: sobra um buraco transparente, que na tela vira
    um vao branco. Aqui o buraco volta a ter cor.
    """

    def retocar(im):
        a = np.asarray(im.convert("RGBA")).astype(np.uint8)
        opaco = a[..., 3] > 40
        buraco = ndimage.binary_fill_holes(opaco) & ~opaco
        if not buraco.any():
            return im
        for canal, valor in enumerate(cor):
            a[..., canal] = np.where(buraco, valor, a[..., canal])
        a[..., 3] = np.where(buraco, 255, a[..., 3])
        return Image.fromarray(a, "RGBA")

    return retocar


# retoque de uma peca so, depois do recorte e antes de lavar
RETOQUES = {
    # crianca de 4 anos le o semaforo pela cor antes do bonequinho
    "m06_sinal_verde": tapar_buraco((86, 176, 104)),
    # brocolis branco nao e brocolis
    "m13_brocolis": tapar_buraco((124, 173, 112)),
}


def gravar(im, nome):
    """PNG de paleta: arte chapada fica ~6x menor sem diferenca visivel."""
    os.makedirs(DESTINO, exist_ok=True)
    caminho = os.path.join(DESTINO, nome + ".png")
    retoque = RETOQUES.get(nome)
    if retoque:
        im = retoque(im)
    lavada = lavar(im, SATURACAO_OBJETO, BRANCO_OBJETO)
    lavada.quantize(colors=160, method=Image.FASTOCTREE).save(caminho, optimize=True)
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
    # a arte original e castanha e media ~0.35: normaliza para usar toda a faixa.
    # Cor clara precisa de meio-tom mais alto, senao loiro e grisalho viram caqui
    claro = (destino[0] * 0.299 + destino[1] * 0.587 + destino[2] * 0.114) / 255.0
    luz = np.clip(luz / (0.55 - 0.35 * max(0.0, claro - 0.45)), 0, 1.25)
    novo = np.clip(luz[..., None] * np.array(destino, dtype=np.float32), 0, 255)
    return Image.fromarray(np.dstack([novo, alpha]).astype(np.uint8), "RGBA")


def cobrir(im, larg, alt):
    escala = max(larg / im.width, alt / im.height)
    im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    x = (im.width - larg) // 2
    y = (im.height - alt) // 2
    return im.crop((x, y, x + larg, y + alt))


def vao_do_rosto(rgba):
    """(centro x, topo, largura) do vao onde o rosto aparece, em px da peca.

    Nao da para achar por "buraco fechado": em quase todo penteado o vao e
    aberto embaixo. Mede linha a linha o espaco transparente entre o cabelo da
    esquerda e o da direita, e fica com a metade de cima desse corredor, que e
    onde o rosto esta.
    """
    a = np.asarray(rgba)[..., 3] > 40
    linhas = []
    for y in range(a.shape[0]):
        xs = np.flatnonzero(a[y])
        if xs.size < 2:
            continue
        meio = ~a[y, xs[0] : xs[-1]]
        if not meio.any():
            continue
        rot, n = ndimage.label(meio)
        maior = int(np.argmax(ndimage.sum(meio, rot, range(1, n + 1)))) + 1
        p = np.flatnonzero(rot == maior)
        if p.size < a.shape[1] * 0.08:  # fresta entre mechas, nao e o rosto
            continue
        linhas.append((y, xs[0] + p[0], xs[0] + p[-1]))
    if not linhas:
        return None
    # cabelo espetado abre frestas entre as pontas, bem acima do rosto: fica so
    # o trecho continuo de linhas que contem a maior abertura, que e a cabeca
    trechos, atual = [], [linhas[0]]
    for anterior, l in zip(linhas, linhas[1:]):
        if l[0] == anterior[0] + 1:
            atual.append(l)
        else:
            trechos.append(atual)
            atual = [l]
    trechos.append(atual)
    linhas = max(trechos, key=lambda t: max(l[2] - l[1] for l in t))
    # descendo do contorno do cabelo, o corredor abre ate a maca do rosto e
    # depois fecha no queixo. A primeira barriga e a largura do rosto; o que
    # vem abaixo (pescoco, ombros, vao entre as mechas) nao serve de medida.
    larguras = np.array([l[2] - l[1] for l in linhas], dtype=float)
    k = max(3, len(larguras) // 20)
    suave = np.convolve(larguras, np.ones(k) / k, mode="same")
    larg, face = 0.0, len(suave) - 1
    for i, w in enumerate(suave):
        if w > larg:
            larg, face = w, i
        elif w < larg * 0.85:  # fechou no queixo: o que vem abaixo nao e rosto
            break
    ate = linhas[: face + 1]
    cx = sum((l[1] + l[2]) / 2 for l in ate) / len(ate)
    return cx, linhas[0][0], larg


def apagar_boca(rgba):
    """Tira a boca desenhada no corpo: quem poe boca e a peca de olhos.

    Tres artes de corpo vieram com nariz e boca; as roupas novas, com o rosto
    vazio. Com a boca da arte a crianca ficava com duas bocas. Apaga esticando
    a pele das laterais, linha a linha, para nao achatar o sombreado.
    """
    cab = cabeca_da_arte(rgba)
    if cab is None:
        return rgba
    topo, cx, larg = cab
    a = np.asarray(rgba).copy()
    luz = a[..., :3].mean(axis=2)
    dentro = np.zeros(luz.shape, bool)
    # so o miolo do rosto: o contorno da cabeca tambem e escuro
    y0, y1 = int(topo + larg * 0.35), int(topo + larg * 1.35)
    x0, x1 = int(cx - larg * 0.42), int(cx + larg * 0.42)
    dentro[y0:y1, x0:x1] = True
    escuro = (luz < 140) & (a[..., 3] > 100) & dentro
    rot, n = ndimage.label(escuro)
    if n == 0:
        return rgba
    boca = None
    for i, fatia in enumerate(ndimage.find_objects(rot), start=1):
        ys, xs = fatia
        alt, lar = ys.stop - ys.start, xs.stop - xs.start
        # boca: larga, baixa e no miolo. Nariz e pequeno; queixo e largo demais
        if not (larg * 0.12 < lar < larg * 0.6 and alt < larg * 0.22 and lar > alt):
            continue
        if boca is None or ys.start > boca[0].start:
            boca = fatia
    if boca is None:
        return rgba
    ys, xs = boca
    m = max(3, int(larg * 0.02))
    opaco = a[..., 3] > 100
    for y in range(max(0, ys.start - m), min(a.shape[0], ys.stop + m)):
        e, d = xs.start - m, xs.stop + m
        if e < 1 or d >= a.shape[1] or not opaco[y, e] or not opaco[y, d]:
            continue
        esq, dir_ = a[y, e, :3].astype(np.float32), a[y, d, :3].astype(np.float32)
        rampa = np.linspace(0, 1, d - e)[:, None]
        a[y, e:d, :3] = (esq * (1 - rampa) + dir_ * rampa).astype(np.uint8)
    return Image.fromarray(a, "RGBA")


def cabeca_da_arte(rgba):
    """(topo, centro x, largura) do rosto: a maior mancha de pele la em cima.

    Pela silhueta nao da: capuz, cabelo e ombro largo enganam. A pele nua do
    rosto e o unico ponto em comum entre as artes de corpo.
    """
    a = np.asarray(rgba).astype(np.float32)
    rgb, alpha = a[..., :3], a[..., 3]
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    pele = (r > g) & (g > b) & (sat > 0.13) & (sat < 0.62) & (mx > 90) & (alpha > 40)
    pele[int(pele.shape[0] * 0.55) :] = False  # so a metade de cima: maos fora
    rot, n = ndimage.label(pele)
    if n == 0:
        return None
    maior = int(np.argmax(ndimage.sum(pele, rot, range(1, n + 1)))) + 1
    ys, xs = np.where(rot == maior)
    return ys.min(), (xs.min() + xs.max()) / 2, xs.max() - xs.min()


def encaixar_corpo(arte, base, caixa_base):
    """Roupa nova no quadro do corpo base, casando a cabeca das duas artes.

    A arte gerada vem com outro enquadramento, e alinhar pela caixa joga a
    cabeca para fora do lugar do cabelo e dos olhos.
    """
    cb, ca = cabeca_da_arte(base), cabeca_da_arte(arte)
    if not cb or not ca:
        return None
    k = cb[2] / ca[2]
    nova = arte.resize((max(1, round(arte.width * k)), max(1, round(arte.height * k))), Image.LANCZOS)
    quadro = Image.new("RGBA", base.size, (0, 0, 0, 0))
    quadro.alpha_composite(nova, (round(cb[1] - ca[1] * k), round(cb[0] - ca[0] * k)))
    return quadro


def tirar_tracos(rgba):
    """Apaga linha fina solta — nas artes de cabelo vem um contorno de rosto
    desenhado, que o fundo verde nao leva e fica como risco em volta do queixo.
    Abertura morfologica: some o que e fino, a massa de cabelo fica."""
    a = np.asarray(rgba)
    cheio = a[..., 3] > 40
    n = max(5, round(0.007 * max(rgba.size)))
    limpo = ndimage.binary_opening(cheio, np.ones((n, n)))
    saida = a.copy()
    saida[..., 3] = saida[..., 3] * limpo
    return Image.fromarray(saida, "RGBA")


def encaixar_cabelo(rgba):
    """Peca de cabelo no quadro do corpo, com o vao do rosto sobre a cabeca.

    Cada arte vem com o vao de um tamanho e numa altura diferente. Alinhar pela
    caixa da imagem joga o cabelo na frente do rosto; aqui a referencia e o vao.
    """
    rgba = tirar_tracos(rgba)
    caixa = grade(rgba, 1, 1)[0]
    corte = rgba.crop(caixa)
    # mede numa copia pequena: o resultado so precisa de alguns px de precisao
    escala_medida = 512 / max(corte.width, corte.height)
    v = vao_do_rosto(corte.resize((max(1, round(corte.width * escala_medida)),
                                   max(1, round(corte.height * escala_medida))), Image.NEAREST))
    if v is None:
        return None
    cx, topo, larg = (n / escala_medida for n in v)
    k = ROSTO_LARGURA / larg
    # arte muito volumosa viraria um cabelo maior que a crianca: encolhe ate o
    # teto, mas so ate o ponto em que o vao ainda deixa o rosto inteiro livre
    teto = min(LARGURA_MAXIMA / corte.width, ALTURA_MAXIMA / corte.height)
    k = min(max(k, VAO_MINIMO / larg), teto)  # o teto manda: nada maior que isso
    if larg < corte.width * 0.2:
        print(f"  ! vao do rosto medido em so {larg / corte.width:.0%} da peca: confira o encaixe")
    corte = corte.resize((max(1, round(corte.width * k)), max(1, round(corte.height * k))), Image.LANCZOS)
    quadro = Image.new("RGBA", (QUADRO_CABELO, QUADRO_CABELO), (0, 0, 0, 0))
    x = round(QUADRO_CABELO / 2 - cx * k)
    y = round(QUADRO_CABELO / 2 + ROSTO_TOPO - topo * k)
    # penteado de risco no meio quase nao tem cabelo acima do vao: se o topo da
    # peca ficar abaixo da cabeca, aparece o couro cabeludo. Sobe o necessario.
    y = min(y, round(QUADRO_CABELO / 2 + TOPO_CABELO))
    quadro.alpha_composite(corte, (max(-corte.width, x), max(-corte.height, y)))
    if x < 0 or y < 0 or x + corte.width > QUADRO_CABELO or y + corte.height > QUADRO_CABELO:
        print(f"  ! cabelo maior que o quadro de {QUADRO_CABELO}: sobrou para fora")
    return quadro


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
        bruta = abrir(nome, obrigatorio=False)
        if bruta is None:
            print(f"  . {nome}: ainda nao chegou, pulando")
            continue
        rgba = tirar_verde(bruta)
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
        im = abrir(nome, obrigatorio=False)
        if im is None:
            print(f"  . {nome}: ainda nao chegou, pulando")
            continue
        lx, ly = im.width / cols, im.height / linhas
        for i, rotulo in enumerate(rotulos):
            if not rotulo:
                continue
            c, l = i % cols, i // cols
            corte = im.crop((round(c * lx), round(l * ly), round((c + 1) * lx), round((l + 1) * ly)))
            corte.thumbnail((tam, tam * 3), Image.LANCZOS)
            corte = lavar(corte, SATURACAO_CENARIO, BRANCO_CENARIO).convert("RGB")
            os.makedirs(DESTINO, exist_ok=True)
            corte.save(os.path.join(DESTINO, rotulo + ".jpg"), quality=82, optimize=True)
        print(f"{nome}: {len([r for r in rotulos if r])} pecas")


def fazer_personagem():
    base = apagar_boca(tirar_verde(abrir("corpo_base_pele_clara")))
    caixa_base = pecas(base)[0]
    corpos = {"": base, "_sentado": apagar_boca(tirar_verde(abrir("corpo_cadeira_pele_clara")))}
    for sufixo, arquivo in ROUPAS.items():
        bruta = abrir(arquivo, obrigatorio=False)
        if bruta is None:
            print(f"  . {arquivo}: ainda nao chegou, pulando")
            continue
        # a arte da roupa vem com outro enquadramento: casa pela cabeca
        encaixada = encaixar_corpo(apagar_boca(tirar_verde(bruta)), base, caixa_base)
        if encaixada is None:
            print(f"  ! {arquivo}: nao achei a cabeca, pulando")
            continue
        corpos[sufixo] = encaixada
    feitas = 0
    for sufixo, arte in corpos.items():
        caixa = caixa_base if sufixo not in ("", "_sentado") else pecas(arte)[0]
        for i, tom in enumerate(PELES, start=1):
            gravar(recortar(recolorir_pele(arte, tom), caixa, 512), f"corpo{sufixo}_pele{i}")
            feitas += 1
    print(f"corpo: {feitas} pecas")

    # olhos sao varias manchas (sobrancelhas + olhos): pega a caixa de tudo junto
    feitas = 0
    for nome in OLHOS:
        bruta = abrir(f"olhos_{nome}_castanhos", obrigatorio=False)
        if bruta is None:
            continue
        olhos = tirar_verde(bruta)
        gravar(recortar(olhos, grade(olhos, 1, 1)[0], 512), f"olhos_{nome}")
        feitas += 1

    for nome in CABELOS:
        bruta = abrir(f"cabelo_{nome}_castanho", obrigatorio=False)
        if bruta is None:
            continue
        peca = encaixar_cabelo(tirar_verde(bruta))
        if peca is None:
            print(f"  ! cabelo_{nome}: nao achei o vao do rosto, pulando")
            continue
        for i, cor in enumerate(CORES_CABELO, start=1):
            gravar(recolorir_cabelo(peca, cor), f"cabelo_{nome}_{i}")
        feitas += len(CORES_CABELO)
    print(f"olhos + cabelo: {feitas} pecas")


def fazer_cenarios():
    for nome in CENARIOS:
        im = cobrir(abrir(nome), LARGURA, ALTURA)
        im = lavar(im, SATURACAO_CENARIO, BRANCO_CENARIO).convert("RGB")
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
