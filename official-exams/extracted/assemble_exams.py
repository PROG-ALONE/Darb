#!/usr/bin/env python3
"""يجمع كل صفحة في ملف امتحان واحد: الأسئلة (q-*.jsonl) + الحلول (نص OCR) لكل (مادة، سنة، دور).
الناتج: official-exams/extracted/exams/<مادة>/<سنة>__<دور>/{meta.json,questions.txt,answers.txt}
ثم meta.json يذكر عدد الأسئلة والحالة. الاستعمال:
  python3 assemble_exams.py [--out .../extracted/exams]
"""
import os, re, json, glob, argparse, unicodedata

ROOT = '/Users/macbookair/Downloads/darb-main/official-exams'
OUT_DEFAULT = os.path.join(ROOT, 'extracted', 'exams')
WATER = ['sadshelp', 'iraqedu', '@sads']


def norm(s):
    s = unicodedata.normalize('NFC', s)
    for ch in ('\u202a', '\u202b', '\u202c', '\u200e', '\u200f'):
        s = s.replace(ch, '')
    return s


def is_ad(text):
    t = (text or '').strip()
    if len(t) < 120:
        return True
    low = t.lower()
    hits = sum(low.count(w) for w in WATER)
    lines = [l for l in t.splitlines() if l.strip()]
    noise = sum(1 for l in lines if any(w in l.lower() for w in WATER))
    return hits >= 4 or (lines and noise >= max(4, len(lines) * 0.6))


def key(subject, year, rnd):
    return (subject, str(year), rnd)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=OUT_DEFAULT)
    a = ap.parse_args()

    qrows = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'extracted', 'out', 'q-*.jsonl'))):
        with open(f, encoding='utf-8') as fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                try:
                    qrows.append(json.loads(line))
                except Exception:
                    pass

    arows = []
    f = os.path.join(ROOT, 'extracted', 'out', '_ocr_solutions.jsonl')
    if os.path.exists(f):
        with open(f, encoding='utf-8') as fh:
            for line in fh:
                line = line.strip()
                if line:
                    arows.append(json.loads(line))

    exams = {}
    for r in qrows:
        k = key(r.get('subject'), r.get('year'), r.get('round'))
        exams.setdefault(k, {'q': [], 'a': []})['q'].append(r)
    for r in arows:
        k = key(r.get('subject'), r.get('year'), r.get('round'))
        exams.setdefault(k, {'q': [], 'a': []})['a'].append(r)

    os.makedirs(a.out, exist_ok=True)
    made = []
    for (subj, year, rnd), data in sorted(exams.items(), key=lambda kv: tuple(str(x or '') for x in kv[0])):
        qs = sorted(data['q'], key=lambda r: r.get('page', 0))
        ads = sorted(data['a'], key=lambda r: r.get('page', 0))
        keep = [r for r in ads if not is_ad(r.get('text'))]
        rnd = (rnd or '').replace('-', ' ').strip() or 'غير-محدد'
        folder = os.path.join(a.out, subj, str(year or '؟') + '__' + re.sub(r'[^\w؀-ۿ]+', '_', rnd))
        os.makedirs(folder, exist_ok=True)
        with open(os.path.join(folder, 'questions.txt'), 'w', encoding='utf-8') as fh:
            for r in qs:
                fh.write('\n===== [صفحة %s] =====\n' % r.get('page'))
                fh.write(norm(r.get('text', '')))
        with open(os.path.join(folder, 'answers.txt'), 'w', encoding='utf-8') as fh:
            for r in keep:
                fh.write('\n===== [صفحة %s] =====\n' % r.get('page'))
                fh.write(norm(r.get('text', '')))
        meta = {'subject': subj, 'year': year, 'round': rnd,
                'questionPages': len(qs), 'solutionPages': len(ads), 'solutionPagesKept': len(keep),
                'charsQ': sum(len(r.get('text', '')) for r in qs),
                'charsA': sum(len(r.get('text', '')) for r in keep),
                'status': 'مكتمل' if keep else 'ناقص (لا يوجد نص حلول)'}
        with open(os.path.join(folder, 'meta.json'), 'w', encoding='utf-8') as fh:
            json.dump(meta, fh, ensure_ascii=False, indent=1)
        made.append(meta)
        print('%-9s %s %-14s | أسئلة %2d صفحة / حلول %2d صفحة (مفيدة %2d) | حروف %6d + %6d' %
              (subj, str(year or '؟'), rnd[:14], len(qs), len(ads), len(keep), meta['charsQ'], meta['charsA']))
    print('\nامتحانات: %d | المسار: %s' % (len(made), a.out))


if __name__ == '__main__':
    main()