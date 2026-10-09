"""Varre o jogo e escreve assets/audio/narracao.csv.

    python tools/gerar_narracao.py      (ou: npm run narracao)

Fontes: src/narracoes.json (telas) e src/missions/*.json (missoes).
Colunas: arquivo, texto, local. O nome do arquivo e a chave + .mp3 — basta
gravar com esse nome em assets/audio para o jogo parar de usar a voz do
navegador naquela frase.
"""

import csv
import glob
import json
import os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "assets", "audio", "narracao.csv")

LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def linhas():
    with open(os.path.join(RAIZ, "src", "narracoes.json"), encoding="utf-8") as f:
        for chave, v in json.load(f).items():
            yield chave, v["texto"], v["local"]

    for letra in LETRAS:
        yield f"letra_{letra.lower()}", letra, "Teclado do nome"

    for caminho in sorted(glob.glob(os.path.join(RAIZ, "src", "missions", "*.json"))):
        with open(caminho, encoding="utf-8") as f:
            m = json.load(f)
        onde = f"Missao {m['id']} - {m['titulo']}"
        if m.get("audio_intro"):
            yield m["audio_intro"], m["narracao_intro"], f"{onde}: abertura"
        mostrar = m.get("mostrar") or {}
        if mostrar.get("audio"):
            yield mostrar["audio"], mostrar["narracao"], f"{onde}: o personagem mostra"
        for i, e in enumerate(m["etapas"], start=1):
            if e.get("audio"):
                yield e["audio"], e["narracao"], f"{onde}: etapa {i} ({e['tipo']})"
            for r in e.get("regioes") or []:
                if r.get("audio"):
                    yield r["audio"], r["texto"], f"{onde}: etapa {i}, escovacao guiada"
            if e.get("consequencia"):
                yield f"m{m['id']}_erro{i}", e["consequencia"], f"{onde}: etapa {i}, quando erra"
        pnp = m["pode_ou_nao_pode"]
        if pnp.get("audio"):
            yield pnp["audio"], pnp.get("pergunta", "O que pode?"), f"{onde}: pode ou nao pode"
            yield f"m{m['id']}_pnp_explica", pnp["explicacao"], f"{onde}: explicacao do pode ou nao pode"
        if m.get("audio_reforco"):
            yield m["audio_reforco"], m["frase_reforco"], f"{onde}: frase de reforco"

    yield "musica_timer", "(musica instrumental de 30 s em loop)", "Timer da escovacao e da lavagem das maos"


def main():
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    vistos = set()
    with open(SAIDA, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["arquivo", "texto", "local"])
        n = 0
        for chave, texto, local in linhas():
            if chave in vistos:
                continue
            vistos.add(chave)
            w.writerow([f"{chave}.mp3", texto, local])
            n += 1
    print(f"{n} frases -> {SAIDA}")


if __name__ == "__main__":
    main()
