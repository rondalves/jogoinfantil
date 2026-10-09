# -*- coding: utf-8 -*-
"""Escreve docs/MISSOES.md com o passo a passo de todas as missoes.

    python tools/listar_missoes.py      (ou: npm run missoes)

Serve para ler, revisar e escrever missao nova sem abrir JSON. O arquivo e
gerado: mexer nele nao muda o jogo, mexer em src/missions/*.json muda.
"""
import glob
import json
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "docs", "MISSOES.md")

MUNDOS = {
    1: ("Manha em Casa", "livre"),
    2: ("Escola", "livre"),
    3: ("Volta para Casa", "paga"),
    4: ("Tarde", "paga"),
    5: ("Janta", "paga"),
    6: ("Banho e Cama", "paga"),
}

TIPOS = {
    "tocar": "Tocar",
    "arrastar_para_alvo": "Arrastar para o alvo",
    "segurar_com_timer": "Segurar com cronometro",
    "esfregar": "Esfregar",
    "escolher_entre_opcoes": "Escolher entre opcoes",
    "sequencia_ordenada": "Sequencia ordenada",
    "respirar": "Respirar",
    "escovar": "Escovacao guiada",
    "sim_ou_nao": "Precisa ou nao precisa",
}


def ancora(titulo, ident):
    base = f"missao-{ident}-{titulo.lower()}"
    return re.sub(r"[^a-z0-9]+", "-", base).strip("-")


def rotulo(item):
    nome = item.get("texto") or item.get("fala") or item.get("img") or item.get("icone") or "?"
    marcas = []
    if item.get("correto") is True:
        marcas.append("certo")
    if item.get("correto") is False:
        marcas.append("pegadinha")
    return nome + (" _(" + ", ".join(marcas) + ")_" if marcas else "")


def descrever(e):
    """O que a crianca faz nesta etapa, mais a lista do que aparece."""
    linhas = []
    t = e["tipo"]
    if t == "tocar":
        itens = e.get("alvos") or e.get("itens") or []
        certos = len([i for i in itens if i.get("correto") is not False])
        linhas.append(f"Toca em {certos} de {len(itens)} figuras.")
        linhas += ["  - " + rotulo(i) for i in itens]
    elif t == "arrastar_para_alvo":
        alvo = e.get("alvo") or {}
        itens = e.get("itens") or []
        certos = len([i for i in itens if i.get("correto") is not False])
        linhas.append(f"Arrasta {certos} de {len(itens)} coisas para **{rotulo(alvo)}**.")
        linhas += ["  - " + rotulo(i) for i in itens]
    elif t == "sequencia_ordenada":
        linhas.append("Toca na ordem certa:")
        linhas += [f"  {n}. {rotulo(i)}" for n, i in enumerate(e.get("itens") or [], 1)]
    elif t == "escolher_entre_opcoes":
        linhas.append("Escolhe uma:")
        linhas += ["  - " + rotulo(i) for i in e.get("itens") or []]
    elif t == "sim_ou_nao":
        perguntas = e.get("perguntas") or []
        linhas.append(f"Responde Sim ou Nao para {len(perguntas)} situacoes:")
        for p in perguntas:
            resp = "SIM" if p.get("resposta") else "NAO"
            linhas.append(f"  - {p['texto']} -> **{resp}** — {p.get('explica', '')}")
    elif t == "segurar_com_timer":
        linhas.append(f"Segura o dedo em **{rotulo(e.get('alvo') or {})}** por {e.get('segundos', 60)} s.")
    elif t == "esfregar":
        linhas.append(
            f"Esfrega **{rotulo(e.get('alvo') or {})}** ate limpar {e.get('passos', 5)} sujeiras "
            f"(ate {e.get('segundos', 20)} s)."
        )
    elif t == "escovar":
        regioes = e.get("regioes") or []
        linhas.append(f"Escova a boca em {len(regioes)} lugares, seguindo a bolinha verde:")
        linhas += [f"  {n}. {r['texto']}" for n, r in enumerate(regioes, 1)]
    elif t == "respirar":
        linhas.append(f"Respira fundo {e.get('repeticoes', 3)} vezes.")
    return linhas


def missao(m):
    fora = [f"## Missao {m['id']} — {m['titulo']} {m['icone']}", ""]
    extra = " · **missao bonus** (so abre com os 5 mundos fechados)" if m.get("bonus") else ""
    fora.append(f"Mundo {m['mundo']} ({MUNDOS.get(m['mundo'], ('?', '?'))[0]}) · cenario `{m.get('cenario', '—')}`{extra}")
    fora += ["", f"**Abertura:** \"{m['narracao_intro']}\""]
    mostrar = m.get("mostrar") or {}
    if mostrar.get("narracao"):
        fora += ["", f"**O personagem mostra:** \"{mostrar['narracao']}\""]
    fora += ["", "### Etapas", ""]
    for n, e in enumerate(m["etapas"], 1):
        fora += [f"**{n}. {TIPOS.get(e['tipo'], e['tipo'])}**", "", f"> {e['narracao']}", ""]
        fora += descrever(e)
        if e.get("consequencia"):
            fora.append(f"  - _Se erra:_ \"{e['consequencia']}\"")
        fora.append("")
    pnp = m["pode_ou_nao_pode"]
    fora += ["### Pode ou nao pode", "", f"Pergunta: \"{pnp.get('pergunta', 'O que pode?')}\"", ""]
    fora.append(f"- Certo: **{pnp['cena_certa']['texto']}**")
    fora.append(f"- Errado: {pnp['cena_errada']['texto']}")
    fora.append(f"- Explicacao: \"{pnp['explicacao']}\"")
    if pnp.get("animacao"):
        fora.append(f"- Animacao de premio: `{pnp['animacao']}`")
    fora += ["", f"**Reforco no fim:** \"{m['frase_reforco']}\"", ""]
    fora.append(f"Recompensa: {m['recompensa']['moedas']} moeda · ate {m['estrelas_max']} estrelas")
    fora += ["", "---", ""]
    return fora


CABECALHO = """# Todas as missoes do Rotininha

Gerado por `python tools/listar_missoes.py`. **Nao edite este arquivo:** ele e
reescrito a cada vez. Quem manda e `src/missions/NN-nome.json`.

Serve para ler tudo de uma vez, revisar o conteudo e escrever missao nova.

## Como uma missao funciona

Toda missao segue a mesma espinha:

1. **Abertura** — a raposinha conta o que vai acontecer.
2. **O personagem mostra** — a crianca ve como se faz, antes de fazer.
3. **Etapas** — de 2 a 3, cada uma de um dos tipos abaixo.
4. **Pode ou nao pode** — duas cenas, ela escolhe a certa.
5. **Estrelas e reforco** — 0 erros = 3 estrelas, 1 erro = 2, 2 ou mais = 1.
   Concluir nunca da zero e nunca existe tela de derrota.

## Os tipos de etapa

| tipo no JSON | o que a crianca faz |
|---|---|
| `tocar` | toca nas figuras certas; `correto: false` marca pegadinha |
| `arrastar_para_alvo` | arrasta coisas ate um alvo; o certo some, o errado leva X |
| `sequencia_ordenada` | toca na ordem certa |
| `escolher_entre_opcoes` | escolhe uma entre duas |
| `sim_ou_nao` | responde Sim ou Nao para varias situacoes seguidas |
| `segurar_com_timer` | segura o dedo enquanto o cronometro corre |
| `esfregar` | esfrega o dedo ate limpar |
| `escovar` | escovacao guiada, lugar por lugar |
| `respirar` | respira fundo algumas vezes |

Missao nova = arquivo JSON novo em `src/missions/`. O motor nao muda.

## O que faz uma missao boa aqui

- **Uma ideia so por missao.** O titulo tem de caber em tres palavras.
- **Duas ou tres etapas.** Mais que isso a crianca de 4 anos larga no meio.
- **Sempre uma pegadinha.** Errar e onde ela aprende; errar aqui nao pune.
- **A fala e curta e no imperativo.** "Toque nas tres gentilezas", nao
  "Agora vamos ver se voce consegue identificar...".
- **Nada de texto na arte.** Tudo o que esta escrito, o narrador le em voz alta.
- **O reforco fala da crianca, nao da tarefa.** "Maos limpas, corpo saudavel",
  nao "Voce lavou as maos".

---

"""


def main():
    arquivos = sorted(glob.glob(os.path.join(RAIZ, "src", "missions", "*.json")))
    missoes = [json.load(open(f, encoding="utf-8")) for f in arquivos]

    partes = [CABECALHO, "## Indice\n"]
    for m in missoes:
        livre = MUNDOS.get(m["mundo"], ("?", "?"))[1]
        partes.append(
            f"- [{m['id']} — {m['titulo']}](#{ancora(m['titulo'], m['id'])}) · mundo {m['mundo']} · {livre}"
        )
    partes.append("\n---\n")
    for m in missoes:
        partes.append("\n".join(missao(m)))

    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with open(SAIDA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(partes))
    etapas = sum(len(m["etapas"]) for m in missoes)
    print(f"{len(missoes)} missoes, {etapas} etapas -> {SAIDA}")


if __name__ == "__main__":
    main()
