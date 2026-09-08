"""Converte o subconjunto Markdown do relatório em documento HTML local, sem dependências."""
from pathlib import Path
import html
import re

BASE = Path(__file__).resolve().parent
SOURCE = BASE / 'relatorio-cowboy.md'


def inline(value):
    value = html.escape(value)
    value = re.sub(r'`([^`]+)`', r'<code>\1</code>', value)
    value = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', value)
    value = re.sub(r'\[([^\]]+)\]\(([^\s)]+)\)', r'<a href="\2">\1</a>', value)
    return value


def is_block(line):
    return bool(re.match(r'^(#{1,6} |\| |>|- |\d+\. )', line))


def render(lines):
    blocks = []
    toc = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        heading = re.match(r'^(#{1,6}) (.+)', line)
        if heading:
            level = len(heading[1])
            anchor = f'sec-{len(toc) + 1}' if level == 2 else 'titulo'
            if level == 2:
                toc.append((anchor, heading[2]))
            blocks.append(f'<h{level} id="{anchor}">{inline(heading[2])}</h{level}>')
            i += 1
            continue
        if line.startswith('| '):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', c) for c in cells):
                    rows.append(cells)
                i += 1
            parts = ['<div class="table-wrap" tabindex="0" aria-label="Tabela com rolagem horizontal"><table><thead><tr>']
            parts.extend(f'<th scope="col">{inline(c)}</th>' for c in rows[0])
            parts.append('</tr></thead><tbody>')
            for row in rows[1:]:
                parts.append('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in row) + '</tr>')
            parts.append('</tbody></table></div>')
            blocks.append(''.join(parts))
            continue
        if line.startswith('>'):
            quote = []
            while i < len(lines) and lines[i].startswith('>'):
                quote.append(lines[i][1:].lstrip())
                i += 1
            inside, _ = render(quote)
            blocks.append('<blockquote>' + inside + '</blockquote>')
            continue
        listing = re.match(r'^(- |\d+\. )(.+)', line)
        if listing:
            ordered = line[0].isdigit()
            tag = 'ol' if ordered else 'ul'
            items = []
            pattern = r'^\d+\. (.+)' if ordered else r'^- (.+)'
            while i < len(lines):
                item = re.match(pattern, lines[i])
                if not item:
                    break
                items.append(f'<li>{inline(item[1])}</li>')
                i += 1
            blocks.append(f'<{tag}>' + ''.join(items) + f'</{tag}>')
            continue
        paragraph = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not is_block(lines[i]):
            paragraph.append(lines[i])
            i += 1
        blocks.append('<p>' + inline(' '.join(paragraph)) + '</p>')
    return '\n'.join(blocks), toc


body, contents = render(SOURCE.read_text(encoding='utf-8').splitlines())
nav = ''.join(f'<a href="#{anchor}">{html.escape(label)}</a>' for anchor, label in contents)
document = '''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Auditoria COWBOY Energia | 07.09.2026</title>
<style>
:root{--ink:#19232c;--muted:#53616b;--paper:#fff;--bg:#f3f1eb;--gold:#936b29;--line:#dddeda}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.7 "Segoe UI",Arial,sans-serif}
.masthead{background:#182831;color:#fff;padding:32px max(24px,calc((100vw - 1240px)/2));border-bottom:5px solid #caa15b}
.masthead p{margin:0;color:#e4c990;font-size:12px;letter-spacing:2px;text-transform:uppercase}.masthead b{display:block;font-size:26px;line-height:1.3;margin-top:8px}
.layout{display:grid;grid-template-columns:230px minmax(0,940px);gap:30px;max-width:1250px;margin:32px auto;padding:0 24px}
aside{align-self:start;position:sticky;top:20px;max-height:calc(100vh - 40px);overflow:auto;font-size:13px}aside b{display:block;font-size:11px;letter-spacing:1.5px;color:var(--muted);margin:0 0 12px}
nav a{display:block;padding:7px 9px;border-left:2px solid transparent;color:#42515c;text-decoration:none;line-height:1.35}nav a:hover{border-left-color:var(--gold);background:#e9e5dc}
main{background:var(--paper);padding:40px 44px;box-shadow:0 6px 30px #18283108;min-width:0;border:1px solid #e9e6de}
h1{font-size:34px;line-height:1.2;letter-spacing:-1px;margin:0 0 22px}h2{font-size:25px;line-height:1.3;letter-spacing:-.4px;margin:48px 0 20px;padding-top:20px;border-top:2px solid #dcc49c;scroll-margin-top:24px}
p{margin:0 0 18px}strong{font-weight:650}a{color:#24576c;text-underline-offset:3px;overflow-wrap:anywhere}code{font-size:.88em;background:#f1f3f4;padding:2px 5px;border-radius:3px;overflow-wrap:anywhere}
.table-wrap{overflow:auto;margin:24px 0;border:1px solid var(--line);border-radius:4px}table{width:100%;border-collapse:collapse;font-size:13px;line-height:1.5}th{background:#eaf0f2;text-align:left;color:#223a47;font-weight:650}th,td{padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:top;min-width:130px}tr:last-child td{border-bottom:0}tbody tr:nth-child(even){background:#fafaf8}
blockquote{margin:25px 0;background:#f9f4e9;border-left:4px solid var(--gold);padding:22px 26px}blockquote p:last-child{margin:0}blockquote strong{color:#523d1c}li{margin:0 0 9px}ul,ol{padding-left:25px;margin:18px 0 25px}
.document-footer{color:var(--muted);font-size:12px;border-top:1px solid var(--line);margin-top:40px;padding-top:20px}a:focus-visible,.table-wrap:focus-visible{outline:3px solid #c9943a;outline-offset:3px}
@media(max-width:950px){.layout{display:block;max-width:900px}aside{position:static;max-height:none;margin-bottom:24px}nav{display:grid;grid-template-columns:1fr 1fr}main{padding:28px}h1{font-size:30px}}
@media(max-width:520px){.layout{padding:0 12px;margin:18px auto}main{padding:24px 18px}nav{grid-template-columns:1fr}h1{font-size:27px}h2{font-size:22px}body{font-size:15px}blockquote{padding:18px}.masthead{padding:24px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
@media print{body{background:white;font-size:10pt}.masthead{background:white;color:#19232c;padding:0 0 12px;border-bottom:2px solid #936b29}.masthead p{color:#53616b}aside{display:none}.layout{display:block;margin:15px 0;padding:0;max-width:none}main{padding:0;border:0;box-shadow:none}h1{font-size:23pt}h2{font-size:17pt;break-after:avoid;margin-top:25px}.table-wrap{overflow:visible}table{font-size:8pt}th,td{min-width:0;padding:7px}tr,blockquote{break-inside:avoid}a{color:inherit}code{background:none}@page{size:A4;margin:16mm}}
</style></head><body>
<header class="masthead"><p>Documento de trabalho · 07 setembro 2026</p><b>Diagnóstico de conversão e oferta</b></header>
<div class="layout"><aside><b>ÍNDICE DO RELATÓRIO</b><nav aria-label="Índice">NAV</nav></aside>
<main>BODY<footer class="document-footer">Auditoria local · Story AUD-001 · <a href="relatorio-cowboy.md">Fonte Markdown</a> · <a href="inventario.json">Inventário técnico</a> · <a href="matriz-10-criativos.csv">Matriz dos 10 criativos</a></footer></main></div></body></html>'''
document = document.replace('>NAV<', '>' + nav + '<').replace('>BODY<', '>' + body + '<')
(BASE / 'relatorio-cowboy.html').write_text(document, encoding='utf-8')
print(f'Relatório HTML gerado: {len(contents)} seções; {len(document.encode("utf-8"))} bytes.')
