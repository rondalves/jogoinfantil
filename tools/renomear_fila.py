"""Renomeia as imagens do Gemini seguindo a fila de docs/FILA_GEMINI.md.

    python tools/renomear_fila.py --lote --pasta "C:\\caminho\\da\\pasta"
        renomeia de uma vez tudo o que ja esta na pasta, por ordem de data,
        mostrando o plano e pedindo confirmacao antes de mexer

    python tools/renomear_fila.py             # vigia o Downloads
    python tools/renomear_fila.py --pular 1   # pulei um item da fila
    python tools/renomear_fila.py --voltar    # desfaz o ultimo
    python tools/renomear_fila.py --autoteste # confere a logica da fila

Cada imagem recebe o proximo nome da fila e vai para a pasta das artes cruas.
O log tools/fila_log.csv e o estado: a posicao na fila e quantas linhas ele tem.
"""

import argparse
import csv
import datetime
import glob
import os
import shutil
import sys
import time

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILA = os.path.join(RAIZ, "docs", "FILA_GEMINI.md")
LOG = os.path.join(RAIZ, "tools", "fila_log.csv")
BAIXADOS = os.path.join(os.path.expanduser("~"), "Downloads")
# mesma pasta do ORIGEM de preparar_assets.py
DESTINO = r"C:\Users\rondj\Downloads\Imagens para jogo infantil"

PADRAO = "Gemini_Generated_Image_*"
EXTENSOES = (".jpg", ".jpeg", ".png")
CABECALHO = ["hora", "numero", "nome", "acao", "origem", "destino"]


def ler_fila(texto):
    """[(numero, nome)] na ordem dos titulos '### 7 - nome_do_arquivo'."""
    itens = []
    for linha in texto.splitlines():
        if not linha.startswith("### "):
            continue
        resto = linha[4:].strip()
        numero, _, resto = resto.partition(" ")
        if not numero.isdigit():
            continue
        nome = resto.lstrip("-\u2014 ").split(" ")[0].strip()
        if nome:
            itens.append((numero, nome))
    return itens


def ler_log():
    if not os.path.exists(LOG):
        return []
    with open(LOG, newline="", encoding="utf-8") as f:
        return [l for l in csv.reader(f, delimiter=";") if l and l[0] != "hora"]


def gravar_log(linhas):
    with open(LOG, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(CABECALHO)
        w.writerows(linhas)


def anotar(linha):
    linhas = ler_log()
    linhas.append(linha)
    gravar_log(linhas)


def proximo(fila, linhas):
    """Item da vez: a fila anda uma casa por linha do log (chegou ou pulado)."""
    i = len(linhas)
    return fila[i] if i < len(fila) else None


def livre(pasta, nome, ext):
    """Nao sobrescreve arte que ja esta na pasta: vira _2, _3..."""
    caminho = os.path.join(pasta, nome + ext)
    n = 2
    while os.path.exists(caminho):
        caminho = os.path.join(pasta, f"{nome}_{n}{ext}")
        n += 1
    return caminho


def candidatos(pasta=None, todas=False):
    """Imagens da pasta, da mais antiga para a mais nova.

    todas=True pega qualquer imagem (pasta dedicada); senao so os nomes
    Gemini_Generated_Image_*, porque o Downloads tem muita outra coisa.
    """
    achados = []
    for c in glob.glob(os.path.join(pasta or BAIXADOS, "*" if todas else PADRAO)):
        if os.path.splitext(c)[1].lower() in EXTENSOES:
            achados.append(c)
    return sorted(achados, key=os.path.getmtime)


def estavel(caminho):
    """Espera o download terminar: tamanho igual em duas olhadas e abre."""
    try:
        a = os.path.getsize(caminho)
        time.sleep(1.5)
        return a > 0 and a == os.path.getsize(caminho)
    except OSError:
        return False


def vigiar(fila):
    os.makedirs(DESTINO, exist_ok=True)
    antigos = set(candidatos())
    if antigos:
        print(f"ignorando {len(antigos)} imagem(ns) que ja estavam no Downloads")
    item = proximo(fila, ler_log())
    if not item:
        print("a fila acabou. Nada a renomear.")
        return
    print(f"proximo: {item[0]} - {item[1]}")
    print("vigiando o Downloads. Ctrl+C para parar.")
    while True:
        for caminho in candidatos():
            if caminho in antigos:
                continue
            if not estavel(caminho):
                continue
            antigos.add(caminho)
            item = proximo(fila, ler_log())
            if not item:
                print("a fila acabou. Deixei o arquivo onde estava.")
                return
            numero, nome = item
            ext = os.path.splitext(caminho)[1].lower()
            alvo = livre(DESTINO, nome, ext)
            shutil.move(caminho, alvo)
            anotar([
                datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                numero, nome, "chegou", caminho, alvo,
            ])
            print(f"  {numero} {nome} -> {os.path.basename(alvo)}")
            seguinte = proximo(fila, ler_log())
            print(f"  proximo: {seguinte[0]} - {seguinte[1]}" if seguinte else "  fila completa!")
        time.sleep(2)


def lote(fila, pasta):
    """Renomeia tudo o que ja esta na pasta, na ordem de data dos arquivos."""
    if os.path.normcase(os.path.abspath(pasta)) == os.path.normcase(os.path.abspath(DESTINO)):
        raise SystemExit(
            "a pasta de origem e a mesma do destino.\n"
            f"mova as imagens novas para uma pasta separada antes, senao eu renomeio\n"
            f"tambem a arte que ja esta em {DESTINO}"
        )
    linhas = ler_log()
    feitos = {l[4] for l in linhas if len(l) > 4}
    # numa pasta dedicada os arquivos podem ja ter outro nome; no Downloads, nao
    # da para pegar tudo, senao vai foto que nada tem a ver junto
    achados = candidatos(pasta) or candidatos(pasta, todas=True)
    arquivos = [a for a in achados if a not in feitos]
    if not arquivos:
        raise SystemExit(f"nao achei imagem nova em {pasta}")
    pendentes = fila[len(linhas):]
    plano = list(zip(arquivos, pendentes))
    print(f"\n{len(arquivos)} imagem(ns) em {pasta}, por ordem de data:\n")
    for caminho, (numero, nome) in plano:
        data = datetime.datetime.fromtimestamp(os.path.getmtime(caminho)).strftime("%d/%m %H:%M")
        ext = os.path.splitext(caminho)[1].lower()
        print(f"  {data}  {os.path.basename(caminho):45} -> {numero:>3} {nome}{ext}")
    if len(arquivos) > len(pendentes):
        print(f"\n! sobraram {len(arquivos) - len(pendentes)} imagem(ns) sem item na fila: ficam onde estao")
    if len(pendentes) > len(arquivos):
        print(f"\n! a fila ainda tem {len(pendentes) - len(arquivos)} item(ns) depois destes")
    print("\nConfira a ordem acima antes de aceitar.")
    if input("renomear e mover? (s/n) ").strip().lower() not in ("s", "sim"):
        print("nao mexi em nada.")
        return
    os.makedirs(DESTINO, exist_ok=True)
    for caminho, (numero, nome) in plano:
        ext = os.path.splitext(caminho)[1].lower()
        alvo = livre(DESTINO, nome, ext)
        shutil.move(caminho, alvo)
        anotar([
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            numero, nome, "chegou", caminho, alvo,
        ])
        print(f"  {numero} {nome} -> {os.path.basename(alvo)}")
    print(f"\npronto: {len(plano)} em {DESTINO}")
    print("agora rode: npm run assets")


def pular(fila, quantos):
    for _ in range(quantos):
        linhas = ler_log()
        item = proximo(fila, linhas)
        if not item:
            print("a fila ja acabou.")
            return
        anotar([
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            item[0], item[1], "pulado", "", "",
        ])
        print(f"pulado: {item[0]} - {item[1]}")
    item = proximo(fila, ler_log())
    print(f"proximo: {item[0]} - {item[1]}" if item else "fila completa!")


def voltar(fila):
    linhas = ler_log()
    if not linhas:
        print("o log esta vazio, nada para desfazer.")
        return
    ultima = linhas.pop()
    if ultima[3] == "chegou" and ultima[5]:
        if os.path.exists(ultima[5]):
            de_volta = ultima[4]
            if not de_volta or os.path.exists(de_volta):
                de_volta = livre(os.path.dirname(de_volta) or BAIXADOS, ultima[2],
                                 os.path.splitext(ultima[5])[1])
            shutil.move(ultima[5], de_volta)
            print(f"devolvi para {de_volta}")
        else:
            print(f"! {ultima[5]} nao esta mais la; so tirei do log")
    gravar_log(linhas)
    item = proximo(fila, linhas)
    print(f"proximo: {item[0]} - {item[1]}" if item else "fila completa!")


def autoteste():
    exemplo = "# t\n\n### 1 \u2014 um_arquivo\n\ntexto\n\n### 2 - dois - **folha**\n\n### x - nao\n"
    assert ler_fila(exemplo) == [("1", "um_arquivo"), ("2", "dois")], ler_fila(exemplo)
    fila = ler_fila(exemplo)
    assert proximo(fila, []) == ("1", "um_arquivo")
    assert proximo(fila, [["h", "1", "um_arquivo", "chegou", "a.png", "b.png"]]) == ("2", "dois")
    assert proximo(fila, [[], []]) is None
    real = ler_fila(open(FILA, encoding="utf-8").read())
    assert len(real) >= 1, "FILA_GEMINI.md sem itens '### n - nome'"
    print(f"ok: {len(real)} itens na fila, primeiro {real[0][1]}, ultimo {real[-1][1]}")


def main():
    global BAIXADOS
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--pasta", help=f"pasta onde estao as imagens (padrao: {BAIXADOS})")
    p.add_argument("--lote", action="store_true", help="renomeia tudo o que ja esta na pasta")
    p.add_argument("--pular", type=int, metavar="N", help="pula os N proximos itens")
    p.add_argument("--voltar", action="store_true", help="desfaz o ultimo item")
    p.add_argument("--autoteste", action="store_true", help="confere a logica da fila")
    args = p.parse_args()
    if args.autoteste:
        return autoteste()
    if args.pasta:
        if not os.path.isdir(args.pasta):
            raise SystemExit(f"nao achei a pasta {args.pasta}")
        BAIXADOS = args.pasta
    fila = ler_fila(open(FILA, encoding="utf-8").read())
    if not fila:
        raise SystemExit(f"nao achei itens em {FILA}")
    if args.voltar:
        return voltar(fila)
    if args.pular:
        return pular(fila, args.pular)
    if args.lote:
        return lote(fila, BAIXADOS)
    try:
        vigiar(fila)
    except KeyboardInterrupt:
        print("\nparei.")


if __name__ == "__main__":
    sys.exit(main())
