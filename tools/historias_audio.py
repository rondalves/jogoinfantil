"""Gravacao crua das historinhas -> mp3 pronto, com cancao de ninar por baixo.

    python tools/historias_audio.py <pasta-com-os-wav>

Acha cada arquivo pelo numero ("01___...", "02___..."), limpa a voz (corta
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
from scipy.signal import butter, oaconvolve, sosfilt

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'assets' / 'audio' / 'historias'
STORIES = RAIZ / 'src' / 'stories'
SR = 44100
VOZ_LUFS = -15
# nivel fixo da musica (RMS); a primeira versao ficava em -31.8, esta e 10% mais baixa (x0.9)
MUSICA_RMS_DB = -32.7
ENTRADA, SAIDA_S = 3.0, 7.0  # musica sozinha antes e depois da voz

# progressao por historia: graus em semitons a partir da tonica (I vi IV V e parentes)
PROGRESSOES = [
    [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]],
    [[0, 4, 7], [5, 9, 12], [0, 4, 7], [7, 11, 14]],
    [[0, 4, 7], [9, 12, 16], [2, 5, 9], [7, 11, 14]],
]
TONICAS = {'01': 53, '02': 55, '03': 50, '04': 52, '05': 53, '06': 48}  # F G D E F C


def ffmpeg(*args, entrada: bytes | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostats', *args], input=entrada, capture_output=True, check=True)


def voz(wav: Path) -> np.ndarray:
    # chiado: reducao que acompanha o ruido; pausas: gate suave, que so abaixa (nao corta seco) respiracao e sala;
    # compressor leve aproxima as partes baixinhas das fortes, para o ganho nao estourar os picos
    limpa = ('highpass=f=80,afftdn=nr=20:nf=-50:tn=1,'
             'agate=threshold=0.02:range=0.03:attack=5:release=250:detection=peak,'
             'acompressor=threshold=0.063:ratio=2.5:attack=15:release=250')
    medida = ffmpeg('-i', str(wav), '-af', f'{limpa},loudnorm=I={VOZ_LUFS}:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-')
    m = json.loads(re.search(r'\{[^{}]+\}', medida.stderr.decode())[0])
    norm = (f"loudnorm=I={VOZ_LUFS}:TP=-1.5:LRA=11:linear=true:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
            f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}")
    bruto = ffmpeg('-i', str(wav), '-af', f'{limpa},{norm},alimiter=limit=0.84:level=false', '-ar', str(SR), '-ac', '1', '-f', 'f32le', '-').stdout
    x = np.frombuffer(bruto, dtype=np.float32).astype(np.float64)
    # apara as pontas: primeiro e ultimo bloco de 50 ms acima de -40 dB, com folga
    bloco = SR // 20
    rms = np.sqrt(np.mean(x[: len(x) // bloco * bloco].reshape(-1, bloco) ** 2, axis=1))
    ativos = np.nonzero(rms > 10 ** (-40 / 20))[0]
    ini = max(0, ativos[0] * bloco - SR // 4)
    fim = min(len(x), (ativos[-1] + 1) * bloco + SR // 2)
    return x[ini:fim]


def nota_hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def cancao(segundos: float, num: str) -> np.ndarray:
    rng = np.random.default_rng(int(num))
    n = int(segundos * SR)
    out = np.zeros(n)
    prog = PROGRESSOES[int(num) % len(PROGRESSOES)]
    tonica = TONICAS.get(num, 53)
    compasso = 4.0  # 60 bpm, um acorde a cada 4 s

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
            if rng.random() < 0.55:
                semi = acorde[rng.integers(len(acorde))] + 12 * rng.integers(1, 3)
                f = nota_hz(tonica + 12 + semi)
                tt = np.arange(int(3.0 * SR)) / SR
                env_n = np.minimum(1, tt / 0.006) * np.exp(-tt / 0.9)
                caixa = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt) + 0.06 * np.sin(6 * np.pi * f * tt)
                soma(t0 + batida + rng.uniform(0, 0.05), 0.09 * caixa * env_n)
        t0 += compasso
        k += 1

    # sala: reverb por convolucao com ruido decaindo
    tr = np.arange(int(2.8 * SR)) / SR
    ir = rng.standard_normal(len(tr)) * np.exp(-tr / 0.7)
    ir = sosfilt(butter(2, 3000, 'low', fs=SR, output='sos'), ir)
    ir /= np.sqrt(np.sum(ir ** 2))
    molhado = oaconvolve(out, ir)[:n]
    out = 0.7 * out + 0.45 * molhado
    out = sosfilt(butter(4, 3500, 'low', fs=SR, output='sos'), out)  # tira o brilho que briga com a voz

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
        achou = re.search(r'(\d\d)___', wav.name)
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
        pico = np.max(np.abs(mix))
        if pico > 10 ** (-1 / 20):
            mix *= 10 ** (-1 / 20) / pico
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
