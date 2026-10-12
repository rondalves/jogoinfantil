"""Gera o PDF de um roteiro de historinhas, pra ler na hora de gravar.

    python tools/historias_pdf.py                       # docs/HISTORIAS.md
    python tools/historias_pdf.py docs/HISTORIAS_2.md   # outra leva
"""
import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

RAIZ = Path(__file__).resolve().parent.parent
MD = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else RAIZ / 'docs' / 'HISTORIAS.md'
PDF = MD.with_suffix('.pdf')

for nome, arq in [('Georgia', 'georgia.ttf'), ('Georgia-B', 'georgiab.ttf'), ('Georgia-I', 'georgiai.ttf')]:
    pdfmetrics.registerFont(TTFont(nome, f'C:/Windows/Fonts/{arq}'))
pdfmetrics.registerFontFamily('Georgia', normal='Georgia', bold='Georgia-B', italic='Georgia-I', boldItalic='Georgia-B')

corpo = ParagraphStyle('corpo', fontName='Georgia', fontSize=15, leading=24, spaceAfter=2)
h1 = ParagraphStyle('h1', fontName='Georgia-B', fontSize=22, leading=28, spaceAfter=14)
h2 = ParagraphStyle('h2', fontName='Georgia-B', fontSize=20, leading=26, spaceAfter=8)
meta = ParagraphStyle('meta', parent=corpo, fontSize=12, leading=16, textColor=colors.grey, spaceAfter=14)
direcao = ParagraphStyle('direcao', parent=corpo, fontName='Georgia-I', fontSize=12, leading=16, textColor=colors.grey)
pausa = ParagraphStyle('pausa', fontName='Georgia-B', fontSize=12, leading=16, alignment=TA_CENTER,
                       textColor=colors.white, backColor=colors.HexColor('#6b7280'),
                       borderPadding=(4, 10, 4, 10), spaceBefore=10, spaceAfter=14)
pausa_longa = ParagraphStyle('pausa_longa', parent=pausa, backColor=colors.HexColor('#1f2937'))
baixinho = ParagraphStyle('baixinho', parent=pausa, backColor=colors.HexColor('#7c3aed'))


def inline(t: str) -> str:
    t = t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'`(.+?)`', r'<font face="Courier">\1</font>', t)
    return re.sub(r'\*(.+?)\*', r'<i>\1</i>', t)


def tabela(linhas: list[str]) -> Table:
    celulas = [[Paragraph(inline(c.strip()), corpo) for c in l.strip('|').split('|')] for l in linhas if not re.match(r'^\|[-| ]+\|$', l)]
    t = Table(celulas, colWidths=[4.5 * cm, 12 * cm])
    t.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.5, colors.grey), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                           ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e5e7eb'))]))
    return t


story = []
linhas = MD.read_text(encoding='utf-8').splitlines()
i = 0
while i < len(linhas):
    l = linhas[i]
    if l.startswith('|'):
        fim = i
        while fim < len(linhas) and linhas[fim].startswith('|'):
            fim += 1
        story += [tabela(linhas[i:fim]), Spacer(1, 12)]
        i = fim
        continue
    if l.startswith('# '):
        story.append(Paragraph(inline(l[2:]), h1))
    elif l.startswith('## '):
        story.append(Paragraph(inline(l[3:]), h2))
    elif l.strip() == '---':
        story.append(PageBreak())
    elif l.startswith('**Arquivo:**'):
        story.append(Paragraph(inline(l), meta))
    elif l.strip() == '[pausa]':
        story.append(Paragraph('pausa · 2 s', pausa))
    elif l.strip() == '[pausa longa]':
        story.append(Paragraph('pausa longa · 3 a 4 s', pausa_longa))
    elif l.strip() == '[baixinho]':
        story.append(Paragraph('baixinho · daqui até o fim, mais lento e mais baixo', baixinho))
    elif re.match(r'^\*\(.*\)\*$', l.strip()):
        story.append(Paragraph(inline(l.strip()), direcao))
    elif l.startswith('- '):
        story.append(Paragraph('• ' + inline(l[2:]), corpo))
    elif l.strip() == '':
        story.append(Spacer(1, 8))
    else:
        story.append(Paragraph(inline(l), corpo))
    i += 1

SimpleDocTemplate(str(PDF), pagesize=A4, leftMargin=2 * cm, rightMargin=2 * cm, topMargin=2 * cm, bottomMargin=2 * cm,
                  title=MD.read_text(encoding='utf-8').splitlines()[0].lstrip('# ')).build(story)
print(PDF)
