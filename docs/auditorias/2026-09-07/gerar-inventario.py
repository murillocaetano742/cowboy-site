"""Inventário estático reproduzível; não executa scripts nem acessa a rede."""
from html.parser import HTMLParser
from pathlib import Path
from collections import Counter
from decimal import Decimal
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[3]
OUTPUT = Path(__file__).resolve().parent


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.elements = []
        self.body = False
        self.skip = 0
        self.text = []

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs), self.getpos()[0]))
        if tag == 'body':
            self.body = True
        if tag in ('script', 'style'):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)
        if tag == 'body':
            self.body = False

    def handle_data(self, data):
        if self.body and not self.skip:
            self.text.append(data)


def inspect_page(filename):
    raw = (ROOT / filename).read_text(encoding='utf-8')
    page = Page()
    page.feed(raw)
    counts = Counter(tag for tag, _, _ in page.elements)
    ids = {attrs['id'] for _, attrs, _ in page.elements if 'id' in attrs}
    refs = []
    for tag, attrs, line in page.elements:
        for key in ('src', 'poster'):
            value = attrs.get(key, '')
            if value and not re.match(r'^(https?:|data:|//)', value):
                path = ROOT / value.lstrip('/')
                refs.append({'reference': value, 'line': line, 'exists': path.is_file(), 'bytes': path.stat().st_size if path.is_file() else None})
    images = {x['reference']: x['bytes'] for x in refs if x['reference'].lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))}
    links = [{'href': attrs.get('href'), 'line': line} for tag, attrs, line in page.elements if tag == 'a']
    syntax = []
    for index, match in enumerate(re.finditer(r'<script\b([^>]*)>([\s\S]*?)</script>', raw, re.I), 1):
        attrs, body = match.groups()
        if 'application/ld+json' in attrs:
            json.loads(body)
            syntax.append({'script': index, 'kind': 'json_ld', 'valid': True})
        elif body.strip():
            checked = subprocess.run(['node', '--check'], input=body, text=True, encoding='utf-8', capture_output=True, check=False)
            syntax.append({'script': index, 'kind': 'javascript', 'valid': checked.returncode == 0, 'error': checked.stderr.strip() or None})
    return {
        'file': filename,
        'bytes': (ROOT / filename).stat().st_size,
        'body_word_count_approx': len(re.findall(r'\S+', ' '.join(page.text))),
        'elements': {k: counts[k] for k in ('section', 'h1', 'h2', 'img', 'video', 'script')},
        'local_asset_references': refs,
        'unique_image_bytes': sum(v or 0 for v in images.values()),
        'links': links,
        'empty_anchor_lines': [x['line'] for x in links if x['href'] == '#'],
        'missing_fragment_links': [x for x in links if x['href'] and x['href'].startswith('#') and len(x['href']) > 1 and x['href'][1:] not in ids],
        'lazy_image_count': sum(tag == 'img' and attrs.get('loading') == 'lazy' for tag, attrs, _ in page.elements),
        'images_with_explicit_dimensions': sum(tag == 'img' and 'width' in attrs and 'height' in attrs for tag, attrs, _ in page.elements),
        'has_meta_pixel_source': 'fbq(' in raw,
        'has_ga4_placeholder': 'G-XXXXXXXXXX' in raw,
        'script_syntax': syntax,
    }


data = {
    'date': '2026-09-07',
    'scope': 'Arquivos locais; não são medições de rede nem métricas reais de conversão.',
    'pages': [inspect_page(f) for f in ('index.html', 'loja.html', 'privacidade.html', 'termos.html')],
    'media': [{'file': str(p.relative_to(ROOT)).replace('\\', '/'), 'bytes': p.stat().st_size} for folder in ('imagens', 'videos') for p in sorted((ROOT / folder).iterdir()) if p.is_file()],
    'offer_math': [],
    'yield_math': {'claimed_drops_per_bottle': 600, 'claimed_daily_drops': 24, 'days_if_both_claims_correct': 600 / 24, 'not_a_dosage_recommendation': True},
}
for kit, price, days, anchor in [(1, '89.90', 15, '149.90'), (2, '109.90', 30, '179.80'), (4, '219.92', 60, '359.90')]:
    p, a, shipping = Decimal(price), Decimal(anchor), Decimal('25.00')
    data['offer_math'].append({'bottles': kit, 'product_brl': str(p), 'shipping_claim_brl': str(shipping), 'total_brl': str(p + shipping), 'per_bottle_without_shipping_brl': str(p / kit), 'per_bottle_with_shipping_brl': str((p + shipping) / kit), 'claimed_days': days, 'anchor_brl': str(a), 'discount_percent': str(((a - p) / a * 100).quantize(Decimal('0.01')))})
(OUTPUT / 'inventario.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'pages': [{k: p[k] for k in ('file', 'body_word_count_approx', 'elements', 'unique_image_bytes', 'lazy_image_count', 'script_syntax')} for p in data['pages']], 'offer_math': data['offer_math'], 'missing_assets': [r for p in data['pages'] for r in p['local_asset_references'] if not r['exists']]}, ensure_ascii=False, indent=2))
