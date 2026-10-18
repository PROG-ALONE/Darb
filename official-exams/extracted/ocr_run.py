#!/usr/bin/env python3
"""مشغّل OCR معزول: كل صفحة في عملية مستقلة (يمنع تجمّد Vision) مع تقدم مباشر.
الاستعمال: python3 ocr_run.py <مجلد الصور> <مجلد الإخراج> [--jobs 8]
يكتب <مجلد الإخراج>/<نفس المسار النسبي>.txt لكل صورة.
"""
import os, sys, subprocess, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
WORKER = os.path.join(HERE, 'ocr_vision.py')


def one(src, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        return 'skip'
    t0 = time.time()
    try:
        r = subprocess.run([sys.executable, WORKER, '--one', src, dst],
                           capture_output=True, timeout=180)
        if r.returncode == 0 and os.path.exists(dst):
            return 'ok %.1fs' % (time.time() - t0)
        return 'fail ' + (r.stderr.decode('utf-8', 'replace')[-120:].replace('\n', ' '))
    except subprocess.TimeoutExpired:
        return 'timeout'
    except Exception as e:
        return 'err ' + str(e)[:120]


def main():
    src_root = sys.argv[1]
    out_root = sys.argv[2]
    jobs = 8
    if '--jobs' in sys.argv:
        jobs = int(sys.argv[sys.argv.index('--jobs') + 1])
    files = []
    for dp, _, fs in os.walk(src_root):
        for f in fs:
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                files.append(os.path.join(dp, f))
    files.sort()
    print('صور: %d | عمال: %d' % (len(files), jobs), flush=True)
    t0 = time.time()
    done = [0]
    counts = {'ok': 0, 'skip': 0}

    def task(src):
        rel = os.path.relpath(src, src_root)
        dst = os.path.join(out_root, os.path.splitext(rel)[0] + '.txt')
        st = one(src, dst)
        done[0] += 1
        if st.startswith('ok') or st == 'skip':
            counts['ok' if st.startswith('ok') else 'skip'] += 1
        if done[0] % 50 == 0 or st not in ('ok', 'skip'):
            el = time.time() - t0
            print('  %d/%d  %.1fs  ok=%d skip=%d  %s' % (done[0], len(files), el, counts['ok'], counts['skip'], '' if st.startswith('ok') or st == 'skip' else os.path.basename(src) + ' → ' + st), flush=True)

    with ThreadPoolExecutor(max_workers=jobs) as ex:
        list(ex.map(task, files))
    el = time.time() - t0
    print('انتهى: %d صفحة في %.1f ثانية (%.2f/ثانية) | نجح=%d متجاوَز=%d' % (len(files), el, len(files) / el if el else 0, counts['ok'], counts['skip']), flush=True)


if __name__ == '__main__':
    main()