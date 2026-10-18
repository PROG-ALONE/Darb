import sys
f = 'extract-solutions.cjs'
d = open(f, 'rb').read()
old = b"const ROOT = path.join(__dirname, 'ocr', 'solutions');"
new = b"""const ROOTS = [
  path.resolve(__dirname, 'solutions'),
  path.resolve(__dirname, 'ocr', 'solutions')
];"""
if old in d:
    d = d.replace(old, new, 1)
    open(f, 'wb').write(d)
    print('OK')
else:
    print('NOT FOUND')
