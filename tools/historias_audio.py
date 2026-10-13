"""Gravacao crua das historinhas -> mp3 pronto, com cancao de ninar por baixo.

    python tools/historias_audio.py <pasta-com-os-wav>

Acha cada arquivo pelo numero no comeco do nome ("01 - ...", "02___..."), limpa a voz (corta
grave de microfone, tira chiado, iguala o volume das seis), apara o silencio
das pontas e mistura uma musica sintetizada aqui mesmo: pad lento e caixinha
de musica, sem bateria. Grava em assets/audio/historias/ e atualiza o campo
`duracao` de src/stories/*.json.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.ndimage import maximum_filter1d
from scipy.signal import butter, lfilter, oaconvolve, sosfilt

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'assets' / 'audio' / 'historias'
STORIES = RAIZ / 'src' / 'stories'
SR = 44100
VOZ_LUFS = -13
# ritmo mais calmo sem esticar a fala (o alongamento digital espalhava o som): as pausas ficam 60% mais longas
PAUSA_X = 1.6
# nivel fixo da musica (RMS); a primeira versao ficava em -31.8, esta e 10% mais baixa (x0.9)
MUSICA_RMS_DB = -32.7
ENTRADA, SAIDA_S = 3.0, 7.0  # musica sozinha antes e depois da voz

# progressao por historia: graus em semitons a partir da tonica (I vi IV V e parentes)
PROGRESSOES = [
    [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]],
    [[0, 4, 7], [5, 9, 12], [0, 4, 7], [7, 11, 14]],
    [[0, 4, 7], [9, 12, 16], [2, 5, 9], [7, 11, 14]],
]
TONICAS = {'01': 53, '02': 55, '03': 50, '04': 52, '05': 53, '06': 48}  # F G D E F C: registro medio, sem baixo embolado


def ffmpeg(*args, entrada: bytes | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostats', *args], input=entrada, capture_output=True, check=True)


def limitar(x: np.ndarray, teto_db: float = -1.5, antecipa: float = 0.005, solta: float = 0.06) -> np.ndarray:
    """Limitador com antecipacao: segura os estouros (sopro no microfone) sem mexer no resto.

    O alimiter do ffmpeg 9 devolve picos acima de 0 dB, por isso e feito aqui.
    """
    teto = 10 ** (teto_db / 20)
    env = maximum_filter1d(np.abs(x), size=int(antecipa * SR))
    a = np.exp(-1 / (solta * SR))
    env = lfilter([1 - a], [1, -a], np.maximum(env, teto))  # so solta devagar; subir e imediato pelo max
    env = np.maximum(env, maximum_filter1d(np.abs(x), size=int(antecipa * SR)))
    ganho = np.minimum(1.0, teto / env)
    y = x * ganho
    assert np.abs(y).max() <= teto + 1e-6
    return y


def alongar_pausas(x: np.ndarray, fator: float = PAUSA_X) -> np.ndarray:
    """Estica so os silencios de 0,25 s ou mais, inserindo silencio no meio de cada um. A fala fica intacta."""
    bloco = SR // 20
    db = 20 * np.log10(np.sqrt(np.mean(x[: len(x) // bloco * bloco].reshape(-1, bloco) ** 2, axis=1)) + 1e-9)
    partes, fim_ant, ini = [], 0, None
    for i, quieto in enumerate(list(db < -38) + [False]):
        if quieto and ini is None:
            ini = i
        elif not quieto and ini is not None:
            if (i - ini) * 0.05 >= 0.25:
                meio = (ini + i) // 2 * bloco
                partes += [x[fim_ant:meio], np.zeros(int((i - ini) * bloco * (fator - 1)))]
                fim_ant = meio
            ini = None
    partes.append(x[fim_ant:])
    y = np.concatenate(partes)
    assert len(y) >= len(x) and np.count_nonzero(y) == np.count_nonzero(x)  # so silencio entrou
    return y


def voz(wav: Path) -> np.ndarray:
    # a gravacao tem ambiencia de sala (a voz leva 200-600 ms para sumir) e graves embolados (250-500 Hz):
    # corte de graves em 100 Hz, menos lama, um pouco de presencia, de-esser; o expansor rapido abaixa a
    # cauda da sala entre as palavras sem cortar o fim delas
    limpa = ('highpass=f=100,highpass=f=100,bandreject=f=60:w=3,afftdn=nr=8:nf=-60:tn=1,'
             'equalizer=f=280:t=q:w=1.0:g=-4,equalizer=f=500:t=q:w=1.2:g=-2,equalizer=f=3500:t=q:w=1.0:g=2,deesser=i=0.4,highshelf=f=7500:g=-2.5,'
             'agate=threshold=0.012:ratio=2.5:range=0.02:attack=3:release=90:knee=4,'
             'acompressor=threshold=0.08:ratio=2:attack=20:release=250:knee=6')
    medida = ffmpeg('-i', str(wav), '-af', f'{limpa},loudnorm=I={VOZ_LUFS}:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-')
    m = json.loads(re.search(r'\{[^{}]+\}', medida.stderr.decode())[0])
    norm = (f"loudnorm=I={VOZ_LUFS}:TP=-1.5:LRA=11:linear=true:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
            f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}")
    bruto = ffmpeg('-i', str(wav), '-af', f'{limpa},{norm}', '-ar', str(SR), '-ac', '1', '-f', 'f32le', '-').stdout
    x = limitar(np.frombuffer(bruto, dtype=np.float32).astype(np.float64))
    # apara as pontas: primeiro e ultimo bloco de 50 ms acima de -40 dB, com folga
    bloco = SR // 20
    rms = np.sqrt(np.mean(x[: len(x) // bloco * bloco].reshape(-1, bloco) ** 2, axis=1))
    ativos = np.nonzero(rms > 10 ** (-40 / 20))[0]
    ini = max(0, ativos[0] * bloco - SR // 4)
    fim = min(len(x), (ativos[-1] + 1) * bloco + SR // 2)
    return alongar_pausas(x[ini:fim])


def nota_hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def cancao(segundos: float, num: str) -> np.ndarray:
    rng = np.random.default_rng(int(num))
    n = int(segundos * SR)
    out = np.zeros(n)
    prog = PROGRESSOES[int(num) % len(PROGRESSOES)]
    tonica = TONICAS.get(num, 53)
    compasso = 5.0  # um acorde a cada 5 s: bem lento

    def soma(ini: float, sinal: np.ndarray):
        a = int(ini * SR)
        if a >= n:
            return
        b = min(n, a + len(sinal))
        out[a:b] += sinal[: b - a]

    k = 0
    t0 = 0.0
    while t0 < segundos:
        acorde = prog[k % len(prog)]
        dur = compasso + 2.0  # sobra 2 s para cruzar com o proximo acorde
        t = np.arange(int(dur * SR)) / SR
        env = np.minimum(1, t / 1.5) * np.clip((dur - t) / 2.0, 0, 1)
        pad = np.zeros_like(t)
        for semi in acorde:
            f = nota_hz(tonica + semi)
            # duas vozes levemente desafinadas: soa quente em vez de apito
            pad += np.sin(2 * np.pi * f * 1.0015 * t) + np.sin(2 * np.pi * f * 0.9985 * t) + 0.2 * np.sin(4 * np.pi * f * t)
        pad += 1.2 * np.sin(2 * np.pi * nota_hz(tonica + acorde[0] - 12) * t)  # baixo
        soma(t0, 0.05 * pad * env)

        # caixinha de musica: notas do acorde, uma oitava e meia acima, espacadas
        for batida in range(4):
            if rng.random() < 0.4:
                semi = acorde[rng.integers(len(acorde))] + 12 * rng.integers(0, 2)  # no maximo uma oitava acima
                f = nota_hz(tonica + 12 + semi)
                tt = np.arange(int(3.0 * SR)) / SR
                env_n = np.minimum(1, tt / 0.015) * np.exp(-tt / 1.3)  # ataque macio, cauda longa
                caixa = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt) + 0.06 * np.sin(6 * np.pi * f * tt)
                soma(t0 + batida + rng.uniform(0, 0.05), 0.06 * caixa * env_n)
        t0 += compasso
        k += 1

    # sala: reverb por convolucao com ruido decaindo
    tr = np.arange(int(2.8 * SR)) / SR
    ir = rng.standard_normal(len(tr)) * np.exp(-tr / 0.45)
    ir = sosfilt(butter(2, 1500, 'low', fs=SR, output='sos'), ir)
    ir /= np.sqrt(np.sum(ir ** 2))
    molhado = oaconvolve(out, ir)[:n]
    out = 0.8 * out + 0.22 * molhado  # pouca sala: a voz ja traz a dela
    out = sosfilt(butter(4, 1800, 'low', fs=SR, output='sos'), out)  # sem agudos: so o fundo quente

    t = np.arange(n) / SR
    out *= np.minimum(1, t / 3.0) * np.clip((segundos - t) / 6.0, 0, 1)
    return out


def rms_ativo(x: np.ndarray) -> float:
    bloco = SR // 10
    r = np.sqrt(np.mean(x[: len(x) // bloco * bloco].reshape(-1, bloco) ** 2, axis=1))
    return float(np.sqrt(np.mean(r[r > 10 ** (-40 / 20)] ** 2)))


def main(pasta: Path):
    SAIDA.mkdir(parents=True, exist_ok=True)
    jsons = {json.loads(p.read_text(encoding='utf-8'))['id']: p for p in STORIES.glob('*.json')}
    for wav in sorted(pasta.glob('*.wav')):
        achou = re.match(r'(\d\d)\D', wav.name)
        if not achou or achou[1] not in jsons:
            print('pulei', wav.name)
            continue
        num = achou[1]
        dados = json.loads(jsons[num].read_text(encoding='utf-8'))
        v = voz(wav)
        total = ENTRADA + len(v) / SR + SAIDA_S
        m = cancao(total, num)
        m *= 10 ** (MUSICA_RMS_DB / 20) / rms_ativo(m[int(ENTRADA * SR):])
        mix = m.copy()
        a = int(ENTRADA * SR)
        mix[a:a + len(v)] += v
        mix = limitar(mix, -3.0)  # folga para o mp3 nao passar de 0 dB ao decodificar
        destino = SAIDA / (Path(dados['audio']).name + '.mp3')
        ffmpeg('-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'libmp3lame', '-b:a', '96k', str(destino),
               entrada=mix.astype(np.float32).tobytes())
        dados['duracao'] = round(total)
        jsons[num].write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'{num}  {round(total)} s  {destino.relative_to(RAIZ)}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
