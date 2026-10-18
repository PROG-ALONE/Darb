#!/usr/bin/env python3
"""استخراج نص عربي من صور صفحاتSolutions باستخدام Vision (macOS) — سريع ودقيق.
الاستخدام:  python3 ocr_vision.py <صورة> [صورة ...]
أو:          python3 ocr_vision.py --dir <مجلد> --out <مجلد> [--jobs 8]
يكتب ملفًا نصيًا لكل صورة بنفس الاسم، ويطبع إحصاء.
"""
import sys, os, glob, json, time
from concurrent.futures import ProcessPoolExecutor

VN_IMG = None


def load_vision():
    global VN_IMG
    if VN_IMG is not None:
        return VN_IMG
    import Vision
    from Foundation import NSURL
    VN_IMG = (Vision, NSURL)
    return VN_IMG


def ocr_one(path, langs=("ar-IQ", "ar-SA", "en-US")):
    Vision, NSURL = load_vision()
    import objc
    from Foundation import NSData
    url = NSURL.fileURLWithPath_(path)
    data = NSData.dataWithContentsOfURL_(url)
    if data is None:
        return path, None, 'تعذّر قراءة الصورة'
    handler = Vision.VNImageRequestHandler.alloc().initWithData_options_(data, None)
    request = Vision.VNRecognizeTextRequest.alloc().init()
    ok_langs = request.supportedRecognitionLanguagesAndReturnError_(None)[0]
    use = [l for l in langs if l in ok_langs] or ['ar']
    request.setRecognitionLevel_(0)              # 0 = accurate
    request.setRecognitionLanguages_(use)
    request.setUsesLanguageCorrection_(True)
    err = None
    try:
        handler.performRequests_error_([request], None)
    except Exception as e:                       # noqa
        return path, None, str(e)
    out = []
    results = request.results()
    if results:
        # ترتيب الأسطر: من الأعلى للأسفل ثم من اليمين لليسار (العربية)
        rows = []
        for obs in results:
            bb = obs.boundingBox()
            top = bb.origin.y
            left = bb.origin.x
            txt = []
            for cand in obs.topCandidates_(1):
                txt.append(cand.string())
            s = ''.join(txt).strip()
            if s:
                rows.append((-top, left, s))
        rows.sort(key=lambda r: (round(r[0], 3), -r[1]))
        out = [r[2] for r in rows]
    return path, '\n'.join(out), None


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 1
    # وضع الملف الواحد (يستخدمه ocr_run.py لعزل كل صفحة)
    if args[0] == '--one':
        src, dst = args[1], args[2]
        path, text, err = ocr_one(src)
        if err or text is None:
            sys.stderr.write(str(err) + '\n')
            return 1
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(dst, 'w', encoding='utf-8') as f:
            f.write(text)
        return 0
    outdir = None
    jobs = 8
    files = []
    i = 0
    while i < len(args):
        if args[i] == '--out':
            outdir = args[i + 1]; i += 2
        elif args[i] == '--jobs':
            jobs = int(args[i + 1]); i += 2
        elif args[i] == '--dir':
            pat = os.path.join(args[i + 1], '**', '*.jpg')
            files += sorted(glob.glob(pat, recursive=True)); i += 2
        else:
            files.append(args[i]); i += 1

    t0 = time.time()
    n_ok = n_err = 0
    results = []
    for path in files:
        text, err = ocr_one(path)
        if err or text is None:
            n_err += 1
            print('✗', os.path.basename(path), err or '', flush=True)
            continue
        if outdir:
            dst = os.path.join(outdir, os.path.splitext(os.path.basename(path))[0] + '.txt')
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            with open(dst, 'w', encoding='utf-8') as f:
                f.write(text)
        results.append((path, text))
        n_ok += 1
    dt = time.time() - t0
    print('OCR: %d صفحة في %.1f ثانية (%.2f صفحة/ثانية) | أخطاء: %d' % (n_ok, dt, n_ok / dt if dt else 0, n_err))
    if not outdir:
        for p, t in results[:3]:
            print('---', p)
            print(t[:1500])
    return 0


if __name__ == '__main__':
    sys.exit(main())