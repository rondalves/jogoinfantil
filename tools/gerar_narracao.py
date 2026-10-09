"""Varre o jogo e escreve assets/audio/narracao.csv.

    python tools/gerar_narracao.py      (ou: npm run narracao)

Fontes: src/narracoes.json (telas) e src/missions/*.json (missoes).
Colunas: arquivo, voz, texto, local.

A coluna "voz" diz quem fala:

  mascote  -> a raposinha e o personagem da crianca. Voz de crianca.
  adulto   -> instrucao, correcao e explicacao. Voz de adulto.

Da voz de adulto o jogo aceita duas gravacoes da mesma frase:

  <chave>.mp3     voz feminina (a que o jogo usa por padrao)
  <chave>_m.mp3   voz masculina (o painel dos pais troca para ela)

A voz de mascote tem um arquivo so, <chave>.mp3. Sem o arquivo, o jogo
continua usando a voz do navegador naquela frase.
"""

import csv
import glob
import json
import os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "assets", "audio", "narracao.csv")

LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

ACENTOS = str.maketrans("áàâãéêíóôõúüç", "aaaaeeiooouuc")


def _chave(texto):
    """Nome de arquivo a partir da frase: so letras minusculas e _."""
    limpo = texto.lower().translate(ACENTOS)
    return "".join(c if c.isalnum() else "_" for c in limpo).strip("_")


# frases de tela ditas pela raposinha, nao por um adulto
MASCOTE_UI = {
    "ui_nome_bonito",
    "mapa_termine_mundo",
    "missao_moeda",
    "missao_mundo_completo",
    "mg1_fim",
    "mg2_fim",
    "mg3_fim",
    "mg4_fim",
    "mg5_fim",
    "medalha_final",
    "tut_2",
}


def linhas():
    with open(os.path.join(RAIZ, "src", "narracoes.json"), encoding="utf-8") as f:
        for chave, v in json.load(f).items():
            voz = "mascote" if chave in MASCOTE_UI else "adulto"
            yield chave, voz, v["texto"], v["local"]

    for letra in LETRAS:
        yield f"letra_{letra.lower()}", "adulto", letra, "Teclado do nome"

    for caminho in sorted(glob.glob(os.path.join(RAIZ, "src", "missions", "*.json"))):
        with open(caminho, encoding="utf-8") as f:
            m = json.load(f)
        onde = f"Missao {m['id']} - {m['titulo']}"
        if m.get("audio_intro"):
            yield m["audio_intro"], "mascote", m["narracao_intro"], f"{onde}: abertura (raposinha)"
        mostrar = m.get("mostrar") or {}
        if mostrar.get("audio"):
            yield mostrar["audio"], "mascote", mostrar["narracao"], f"{onde}: o personagem mostra"
        for i, e in enumerate(m["etapas"], start=1):
            if e.get("audio"):
                yield e["audio"], "adulto", e["narracao"], f"{onde}: etapa {i} ({e['tipo']})"
            for r in e.get("regioes") or []:
                if r.get("audio"):
                    yield r["audio"], "adulto", r["texto"], f"{onde}: etapa {i}, escovacao guiada"
            for k, q in enumerate(e.get("perguntas") or [], start=1):
                yield f"m{m['id']}_e{i}_p{k}", "adulto", q["texto"], f"{onde}: etapa {i}, pergunta {k}"
                yield f"m{m['id']}_e{i}_p{k}_ok", "adulto", q["explica"], f"{onde}: etapa {i}, resposta {k}"
            for it in (e.get("itens") or []) + (e.get("alvos") or []) + ([e["alvo"]] if e.get("alvo") else []):
                nome = it.get("fala") or it.get("texto")
                if nome:
                    yield f"nome_{_chave(nome)}", "adulto", nome, "Nome de objeto (dedo por cima)"
            if e.get("consequencia"):
                yield f"m{m['id']}_erro{i}", "adulto", e["consequencia"], f"{onde}: etapa {i}, quando erra"
        pnp = m["pode_ou_nao_pode"]
        if pnp.get("audio"):
            yield pnp["audio"], "adulto", pnp.get("pergunta", "O que pode?"), f"{onde}: pode ou nao pode"
            yield f"m{m['id']}_pnp_explica", "adulto", pnp["explicacao"], f"{onde}: explicacao do pode ou nao pode"
        if m.get("audio_reforco"):
            yield m["audio_reforco"], "mascote", m["frase_reforco"], f"{onde}: frase de reforco"

    yield "musica_timer", "adulto", "(musica instrumental de 30 s em loop)", "Timer da escovacao e da lavagem das maos"


def main():
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    vistos = set()
    with open(SAIDA, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["arquivo", "voz", "texto", "local"])
        n = 0
        por_voz = {"adulto": 0, "mascote": 0}
        for chave, voz, texto, local in linhas():
            if chave in vistos:
                continue
            vistos.add(chave)
            w.writerow([f"{chave}.mp3", voz, texto, local])
            por_voz[voz] += 1
            n += 1
    print(f"{n} frases -> {SAIDA}")
    print(f"  adulto: {por_voz['adulto']} (grave duas vezes: feminina e masculina _m)")
    print(f"  mascote: {por_voz['mascote']} (voz de crianca, uma gravacao so)")


if __name__ == "__main__":
    main()
