#!/usr/bin/env python3
"""يتحقّق من ملفات بنك الأسئلة: JSON صالح، مخطط صحيح، أسئلة مرتبطة بمواضيع معروفة.
الاستعمال: python3 validate_bank.py <ملف.json> [ملف.json ...] | --all
"""
import os, sys, json, argparse

ROOT = '/Users/macbookair/Downloads/darb-main/official-exams'
TOPICS = os.path.join(ROOT, 'extracted', 'topics-index.json')
BANK = os.path.join(ROOT, 'bank')


def load_topics():
    try:
        with open(TOPICS, encoding='utf-8') as f:
            d = json.load(f)
        out = {}
        for subj, arr in d.items():
            for t in arr:
                out[t['id']] = (subj, t['name'])
        return out
    except Exception:
        return {}


def check(path, topics):
    errs = []
    try:
        with open(path, encoding='utf-8') as f:
            d = json.load(f)
    except Exception as e:
        return ['JSON غير صالح: %s' % e], None
    for k in ('subject', 'year', 'round', 'questions'):
        if k not in d:
            errs.append('مفتاح ناقص: ' + k)
    qs = d.get('questions') or []
    if not isinstance(qs, list) or not qs:
        errs.append('لا توجد أسئلة')
        return errs, None
    if not isinstance(d.get('subject'), str):
        errs.append('subject ليس نصًا')
    names = {q.get('topic') for q in qs if isinstance(q, dict)}
    if topics:
        bad = sorted(t for t in names if t not in topics)
        if bad:
            errs.append('مواضيع خارج الفهرس: ' + ', '.join(bad[:6]))
    for i, q in enumerate(qs):
        if not isinstance(q, dict):
            errs.append('السؤال %d ليس كائنًا' % (i + 1)); continue
        for k in ('n', 'text'):
            if not str(q.get(k) or '').strip():
                errs.append('السؤال %d: %s فارغ' % (i + 1, k))
        if q.get('kind') not in ('mcq', 'open'):
            errs.append('السؤال %d: kind غير صالح (%r)' % (i + 1, q.get('kind')))
        if q.get('kind') == 'mcq' and not q.get('choices'):
            errs.append('السؤال %d: mcq بلا choices' % (i + 1))
        if q.get('answer') and not str(q['answer']).strip():
            errs.append('السؤال %d: answer فارغة' % (i + 1))
        for k in ('steps', 'laws', 'choices'):
            if k in q and q[k] is not None and not isinstance(q[k], list):
                errs.append('السؤال %d: %s ليست مصفوفة' % (i + 1, k))
    solved = sum(1 for q in qs if q.get('answer'))
    missing = sum(1 for q in qs if q.get('missing') or not q.get('answer'))
    return errs, dict(n=len(qs), solved=solved, missing=missing)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('files', nargs='*')
    ap.add_argument('--all', action='store_true')
    a = ap.parse_args()
    files = a.files or ([os.path.join(BANK, f) for f in sorted(os.listdir(BANK)) if f.endswith('.json')] if a.all else [])
    if not files:
        print('لا ملفات'); return 2
    topics = load_topics()
    bad = 0
    for p in files:
        errs, stat = check(p, topics)
        name = os.path.basename(p)
        if errs:
            bad += 1
            print('✗ %s' % name)
            for e in errs[:12]:
                print('   - ' + e)
            if len(errs) > 12:
                print('   ... و%d غيرها' % (len(errs) - 12))
        else:
            print('✓ %s: %d سؤالًا | مع حلول: %d | ناقص: %d' % (name, stat['n'], stat['solved'], stat['missing']))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())