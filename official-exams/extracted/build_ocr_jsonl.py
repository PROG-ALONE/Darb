#!/usr/bin/env python3
"""يبني JSONL من نصوص OCR (Vision) للصفحات، بنفس مخطط extracted/out/*.jsonl
   ثم يدمجها في ملف واحد: extracted/out/_all_solutions.jsonl
الاستعمال: python3 build_ocr_jsonl.py [--root .../official-exams/ocr/solutions] [--out .../extracted/out]"""
import os, re, json, argparse, unicodedata

SUBJ_ORDER = ['أحياء', 'رياضيات', 'عربي', 'فرنسي', 'فيزياء', 'كيمياء']


def parse_path(rel):
    """يحلّل المسار مهما كان عمقه: <مادة>/<سنة>/<دور>/<مجلد>/p-03.txt أو أعمق/أضحل"""
    parts = [p for p in rel.split(os.sep) if p]
    subj = year = rnd = None
    for p in parts:
        if subj is None and re.match(r'^[؀-ۿ]+$', p) and len(p) <= 12:
            subj = p
        elif year is None and re.match(r'^\d{4}$', p):
            year = p
        elif rnd is None and re.search(r'دور|تمهيدي', p):
            rnd = p.replace('-', ' ').strip()
    m = re.search(r'(\d+)', parts[-1] if parts else '')
    page = int(m.group(1)) if m else 0
    return dict(subject=subj, year=year, round=rnd, page=page)


WATER = ['sadshelp', 'iraqedu', 'sads help', '@sads']


def is_ad(text):
    t = (text or '').strip()
    if len(t) < 80:
        return True
    lines = [l for l in t.splitlines() if l.strip()]
    if not lines:
        return True
    keep = [l for l in lines if not any(w in l.lower() for w in WATER)]
    rest = ' '.join(keep).strip()
    if len(rest) < 80:
        return True
    promo = ['شبكة المساعد', 'المنهجية', 'المراجعات', 'الملخصات', 'الاختبارات', 'قناة تعليمية', 'نسخ الأسئلة', 'امسح الباركود', 'انضم الينا']
    promo_hits = sum(1 for p in promo if p in rest)
    return promo_hits >= 2 and len(rest) < 500


def clean(text):
    text = unicodedata.normalize('NFC', text)
    text = text.replace('‫', '').replace('‬', '').replace('‎', '').replace('‏', '')
    lines = [re.sub(r'[ \t]+', ' ', l).strip() for l in text.splitlines()]
    out, prev = [], None
    for l in lines:
        if not l:
            continue
        if l == prev:
            continue
        out.append(l)
        prev = l
    return '\n'.join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='/Users/macbookair/Downloads/darb-main/official-exams/ocr/solutions')
    ap.add_argument('--out', default='/Users/macbookair/Downloads/darb-main/official-exams/extracted/out')
    ap.add_argument('--name', default='_ocr_solutions.jsonl')
    a = ap.parse_args()

    rows, ads = [], 0
    for dirpath, _, files in os.walk(a.root):
        for f in sorted(files):
            if not f.endswith('.txt'):
                continue
            full = os.path.join(dirpath, f)
            rel = os.path.relpath(full, a.root)
            meta = parse_path(rel)
            if not meta:
                continue
            with open(full, encoding='utf-8') as fh:
                raw = fh.read()
            text = clean(raw)
            ad = is_ad(text)
            ads += 1 if ad else 0
            rows.append({
                'src': os.path.join(a.root, rel[:-4] + '.jpg'),
                'page': meta['page'],
                'subject': meta['subject'],
                'year': meta['year'],
                'round': meta['round'],
                'kind': 'solution',
                'text': text,
                'answers': [],
                'notes': 'صفحة إعلانية/لا امتحان' if ad else 'ocr',
            })
    rows.sort(key=lambda r: (str(r['subject'] or ''), str(r['year'] or ''), str(r['round'] or ''), r['page']))
    dst = os.path.join(a.out, a.name)
    os.makedirs(a.out, exist_ok=True)
    with open(dst, 'w', encoding='utf-8') as fh:
        for r in rows:
            fh.write(json.dumps(r, ensure_ascii=False) + '\n')
    chars = sum(len(r['text']) for r in rows)
    print('صفحات: %d (إعلانية/فارغة: %d) | حروف: %d | كُتب: %s' % (len(rows), ads, chars, dst))


if __name__ == '__main__':
    main()