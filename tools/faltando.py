# -*- coding: utf-8 -*-
"""Diz que arte o jogo pede e ainda nao existe em assets/img.

    python tools/faltando.py        (ou: npm run faltando)

Le os JSONs das missoes e das historinhas, junta com a lista de pecas que o
codigo pede direto, e compara com a pasta. Serve para nao precisar conferir na
mao nem confiar numa lista escrita que envelhece.

O prompt de cada uma esta em docs/PROMPTS_PENDENTES.md.
"""
import glob
import json
import os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# pecas que nao aparecem em JSON nenhum: quem pede e o codigo
PEDIDAS_PELO_CODIGO = {
    "olhos_redondos": "criador (rosto padrao)",
    "olhos_triste": "animacoes.ts, expressao('triste')",
    "acessorio_oculos": "criador (fora da lista ate encaixar)",
    "acessorio_aparelho_auditivo": "criador (fora da lista ate encaixar)",
    "m01_espuma": "escovacao, espuma da pasta",
    "mg1_kart_tras": "corrida de kart, banco vazio",
    "logo": "abertura e ficha da loja",
}

# arte que existe mas esta errada: o arquivo nao falta, o desenho e que nao serve
ERRADAS = {
    "olhos_grandes": "olho grande demais, fica assustado",
    "olhos_alegres": "olho fechado em arco le como bichinho",
    "corpo_base_pele_clara": "cabeca muito oval; refazer obriga a refazer as 6 roupas",
}


def pedidas():
    """chave de arte -> onde ela e usada."""
    onde = {}

    def usa(chave, lugar):
        if chave and not chave.startswith("icone_"):
            onde.setdefault(chave, set()).add(lugar)

    for caminho in sorted(glob.glob(os.path.join(RAIZ, "src", "missions", "*.json"))):
        with open(caminho, encoding="utf-8") as f:
            d = json.load(f)
        lugar = f"missao {d['id']}"
        usa(d.get("cenario"), lugar)
        usa((d.get("mostrar") or {}).get("img"), lugar)
        for e in d["etapas"]:
            usa(e.get("cenario"), lugar)
            itens = (e.get("itens") or []) + (e.get("alvos") or []) + (e.get("perguntas") or [])
            if e.get("alvo"):
                itens = itens + [e["alvo"]]
            for i in itens:
                usa(i.get("img"), lugar)
            for s in e.get("sujeiras") or []:
                usa(s, lugar)
        pnp = d["pode_ou_nao_pode"]
        for cena in ("cena_certa", "cena_errada"):
            usa(pnp[cena].get("img"), lugar)
            usa(pnp[cena].get("imgCena"), lugar)

    for caminho in sorted(glob.glob(os.path.join(RAIZ, "src", "stories", "*.json"))):
        with open(caminho, encoding="utf-8") as f:
            d = json.load(f)
        usa(d["capa"], f"historinha {d['id']}")

    for chave, lugar in PEDIDAS_PELO_CODIGO.items():
        usa(chave, lugar)
    return onde


def main():
    pasta = os.path.join(RAIZ, "assets", "img")
    tem = {os.path.splitext(n)[0] for n in os.listdir(pasta)} if os.path.isdir(pasta) else set()
    onde = pedidas()
    falta = {k: v for k, v in onde.items() if k not in tem}

    print(f"{len(onde)} artes pedidas, {len(onde) - len(falta)} prontas, {len(falta)} faltando\n")
    if falta:
        print("FALTA DESENHAR (prompt em docs/PROMPTS_PENDENTES.md):")
        for k in sorted(falta):
            print(f"  {k:30s} {', '.join(sorted(falta[k]))}")
    erradas = {k: v for k, v in ERRADAS.items() if k in tem or k not in onde}
    if erradas:
        print("\nEXISTE MAS PRECISA SER REFEITA:")
        for k, motivo in sorted(erradas.items()):
            print(f"  {k:30s} {motivo}")


if __name__ == "__main__":
    main()
