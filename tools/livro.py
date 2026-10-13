"""Monta o livro animado de cada historinha: paginas com texto, cena e tempo no audio.

    python tools/livro.py <pasta-com-os-wav>            # grava `paginas` em src/stories/*.json
    python tools/livro.py --ver                         # so mostra as paginas de cada roteiro

Cada trecho do roteiro (docs/HISTORIAS*.md) entre duas marcas de pausa vira uma
pagina. A cena de cada pagina (cenario, pecas, clima, onde fica a raposinha)
vem de tools/livro_cenas.json, na mesma ordem dos trechos. O tempo em que a
pagina vira sai da gravacao: as fronteiras entre trechos caem nas pausas mais
longas perto de onde a contagem de palavras diz que deveriam estar.

Tambem escreve docs/PROMPTS_LIVRO.md: o pedido de ilustracao de cada pagina.
Quando a arte `hist01_p03` (etc.) existir em assets/img, ela substitui a cena
montada naquela pagina, sem mexer em codigo.
"""
import json
import re
import sys
from pathlib import Path

import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'tools'))
import historias_audio as audio  # noqa: E402

CENAS = RAIZ / 'tools' / 'livro_cenas.json'
STORIES = RAIZ / 'src' / 'stories'
PROMPTS = RAIZ / 'docs' / 'PROMPTS_LIVRO.md'
MARCA_PAUSA = re.compile(r'^\[pausa( longa)?\]$')


def trechos() -> dict[str, list[str]]:
    """Numero da historia -> lista de trechos de texto, na ordem do roteiro."""
    fora: dict[str, list[str]] = {}
    for md in sorted((RAIZ / 'docs').glob('HISTORIAS*.md')):
        for bloco in re.split(r'\n## (?=\d\d )', md.read_text(encoding='utf-8'))[1:]:
            num = bloco[:2]
            atual: list[str] = []
            lista: list[str] = []
            for linha in bloco.splitlines()[1:]:
                l = linha.strip()
                if l == '---':
                    break
                if MARCA_PAUSA.match(l):
                    if atual:
                        lista.append('\n'.join(atual))
                    atual = []
                elif l and not l.startswith(('**Arquivo', '*(', '[')):
                    atual.append(l)
            if atual:
                lista.append('\n'.join(atual))
            fora[num] = lista
    return fora


def pausas(v: np.ndarray) -> list[tuple[float, float]]:
    """Silencios da voz ja limpa: (inicio, duracao) em segundos, de 0,3 s para cima.

    O limiar e -32 dB porque o gate da voz solta devagar (400 ms) e a pausa so chega bem baixo no fim.
    """
    b = audio.SR // 20
    db = 20 * np.log10(np.sqrt(np.mean(v[: len(v) // b * b].reshape(-1, b) ** 2, axis=1)) + 1e-9)
    quieto = db < -32
    fora, ini = [], None
    for i, q in enumerate(list(quieto) + [False]):
        if q and ini is None:
            ini = i
        elif not q and ini is not None:
            if (i - ini) * 0.05 >= 0.3:
                fora.append((ini * 0.05, (i - ini) * 0.05))
            ini = None
    return fora


def alinhar(textos: list[str], ps: list[tuple[float, float]], total: float) -> list[float]:
    """Escolhe, em ordem, uma pausa para cada fronteira entre trechos (programacao dinamica).

    Custo de usar a pausa j na fronteira k: distancia ao tempo esperado pela
    contagem de palavras, menos um bonus pela duracao da pausa (as marcas do
    roteiro viraram as pausas mais longas da gravacao).
    """
    palavras = np.array([len(re.findall(r'\w+', t)) for t in textos], dtype=float)
    esperado = np.cumsum(palavras)[:-1] / palavras.sum() * total
    n, m = len(esperado), len(ps)
    if m < n:
        raise SystemExit(f'gravacao com {m} pausas para {n} fronteiras')
    t = np.array([a + d for a, d in ps])  # fim da pausa: a pagina vira quando a fala volta
    dur = np.array([min(d, 1.5) for _, d in ps])  # pausa muito longa nao vale mais que uma longa
    sigma = max(4.0, total / (n + 1) / 2)
    custo = ((t[None, :] - esperado[:, None]) / sigma) ** 2 - 2.0 * dur[None, :]
    melhor = np.full((n, m), np.inf)
    de = np.zeros((n, m), dtype=int)
    melhor[0] = custo[0]
    for k in range(1, n):
        best, arg = np.inf, -1
        for j in range(m):  # melhor caminho ate a fronteira anterior, terminando numa pausa antes de j
            if j > 0 and melhor[k - 1][j - 1] < best:
                best, arg = melhor[k - 1][j - 1], j - 1
            melhor[k][j] = best + custo[k][j]
            de[k][j] = arg
    j = int(np.argmin(melhor[n - 1]))
    escolha = [j]
    for k in range(n - 1, 0, -1):
        j = int(de[k][j])
        escolha.append(j)
    escolha.reverse()
    return [float(t[j]) - 0.15 for j in escolha]


def main():
    ts = trechos()
    if sys.argv[1:] == ['--ver']:
        for num, lista in ts.items():
            print(f'== {num}: {len(lista)} paginas')
            for i, t in enumerate(lista, 1):
                print(f'  {i:2d}. {t.splitlines()[0][:70]}')
        return
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    cenas = json.loads(CENAS.read_text(encoding='utf-8'))
    jsons = {json.loads(p.read_text(encoding='utf-8'))['id']: p for p in STORIES.glob('*.json')}
    prompts = ['# Ilustrações do livro animado', '',
               'Uma imagem por página, no estilo do Gem do jogo ([GEM_ESTILO.md](GEM_ESTILO.md)),',
               'em pé 1080x1920, cena inteira, sem fundo verde. Salve em `assets/img` com o',
               'nome indicado: o livro troca a cena montada pela ilustração sozinho.',
               'Deixe o terço de baixo calmo e sem detalhe: é ali que fica o texto.',
               'Anexe sempre `assets/img/mascote_raposinha.png` como referência: a raposinha é laranja,',
               'de peito e focinho creme, bochechas rosadas e lenço azul-claro no pescoço.', '']
    numero = lambda w: (re.match(r'(\d\d)\D', w.name) or [None, w.name])[1]
    for wav in sorted(Path(sys.argv[1]).glob('*.wav'), key=numero):
        achou = re.match(r'(\d\d)\D', wav.name)
        if not achou or achou[1] not in jsons or achou[1] not in cenas:
            print('pulei', wav.name)
            continue
        num = achou[1]
        textos, cena = ts[num], cenas[num]
        if len(textos) != len(cena):
            raise SystemExit(f'{num}: roteiro tem {len(textos)} trechos e livro_cenas.json tem {len(cena)}')
        v = audio.voz(wav)
        total = len(v) / audio.SR
        viradas = alinhar(textos, pausas(v), total)
        tempos = [audio.ENTRADA - 0.6] + [audio.ENTRADA + x for x in viradas]
        dados = json.loads(jsons[num].read_text(encoding='utf-8'))
        paginas = [{'t': 0, 'capa': True}]
        prompts += [f'## {num} · {dados["titulo"]}', '']
        for i, (texto, c, t) in enumerate(zip(textos, cena, tempos), 1):
            arte = f'hist{num}_p{i:02d}'
            paginas.append({'t': round(t, 2), 'texto': texto, 'arte': arte,
                            **{k: v for k, v in c.items() if k != 'desc'}})
            prompts += [f'**`{arte}`** — {c["desc"]}', '']
        paginas.append({'t': round(audio.ENTRADA + total + 0.8, 2), 'fim': True})
        dados['paginas'] = paginas
        jsons[num].write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'{num}: {len(paginas)} paginas ' + ' '.join(f'{p["t"]:.0f}' for p in paginas))
    PROMPTS.write_text('\n'.join(prompts), encoding='utf-8')


if __name__ == '__main__':
    main()
