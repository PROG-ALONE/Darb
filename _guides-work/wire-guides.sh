#!/bin/bash
# يدمج كل الأدلة في content/guides-all-*.js ويربطها بـ index.html و sw.js
set -e
cd /Users/macbookair/Downloads/darb-main
SPLIT="${1:-6}"

echo "١) فحص كل الحزم…"
node _guides-work/check-part.cjs --all | grep -c '^✓' | xargs -I{} echo "   حزم مكتملة: {}"
node _guides-work/check-part.cjs --all | grep '^✗' || echo "   كل الحزم مكتملة ✓"

echo "٢) الدمج…"
rm -f content/guides-all-*.js
node _guides-work/merge-guides.cjs "$SPLIT"

echo "٣) الربط في index.html…"
python3 - <<'PY'
import re, glob
p = 'index.html'
s = open(p, encoding='utf-8').read()
tags = '\n'.join('<script src="content/%s"></script>' % f.split('/')[-1] for f in sorted(glob.glob('content/guides-all-*.js')))
s2 = re.sub(r'<script src="content/guides-12\.js"></script>', tags, s)
if s2 == s:
    print('   ⚠ لم يُعثر على وسم guides-12.js (هل سبق الربط؟)')
else:
    open(p, 'w', encoding='utf-8').write(s2)
    print('   وُضعت %d وسمًا' % len(tags.splitlines()))
PY

echo "٤) sw.js…"
python3 - <<'PY'
import re, glob
p = 'sw.js'
s = open(p, encoding='utf-8').read()
s = re.sub(r"'content/guides-12\.js',\s*", '', s)
add = ''.join("'content/%s', " % f.split('/')[-1] for f in sorted(glob.glob('content/guides-all-*.js')))
s = s.replace("'./manifest.webmanifest'", add + "'./manifest.webmanifest'")
s = re.sub(r"const CACHE = 'darb-v\d+';", lambda m: "const CACHE = 'darb-v%d';" % (int(m.group(0)[-4:-2]) + 1), s)
open(p, 'w', encoding='utf-8').write(s)
print('   حُدّثت CORE والإصدار')
PY
echo "انتهى ✓"