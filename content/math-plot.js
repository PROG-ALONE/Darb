/* Safe implicit-equation plotter for the grade-12 math lab. */
(function (root) {
  'use strict';

  const FUNCTIONS = { sin: Math.sin, cos: Math.cos, tan: Math.tan, sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp, ln: Math.log, log: Math.log };
  const DIGITS = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9', '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9' };
  const esc = x => String(x).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  function tokens(source) {
    const text = String(source).trim().replace(/[٠-٩۰-۹]/g, d => DIGITS[d]).replace(/٫/g, '.')
      .replace(/[²³]/g, d => '^' + (d === '²' ? '2' : '3')).replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/جتا/g, 'cos').replace(/ظا/g, 'tan').replace(/جا/g, 'sin')
      .replace(/س/g, 'x').replace(/ص/g, 'y').replace(/π/g, 'pi');
    if (!text.trim() || text.length > 120) throw new Error('اكتب معادلة قصيرة وواضحة (١٢٠ رمزًا كحد أقصى).');

    const re = /\s*(?:(\d+(?:\.\d*)?|\.\d+)|([a-zA-Z]+)|([()+\-*/^]))/gy, raw = [];
    let at = 0;
    while (at < text.length) {
      re.lastIndex = at;
      const m = re.exec(text);
      if (!m) throw new Error('رمز غير مدعوم عند: ' + text.slice(at, at + 8));
      at = re.lastIndex;
      if (m[1]) raw.push({ type: 'num', value: Number(m[1]) });
      else if (m[2]) {
        const word = m[2].toLowerCase();
        if (word === 'x' || word === 'y') raw.push({ type: 'var', value: word });
        else if (word === 'pi' || word === 'e') raw.push({ type: 'num', value: word === 'pi' ? Math.PI : Math.E });
        else if (Object.prototype.hasOwnProperty.call(FUNCTIONS, word)) raw.push({ type: 'func', value: word });
        else if (/^[xy]+$/.test(word)) for (const v of word) raw.push({ type: 'var', value: v });
        else throw new Error('الدالة أو المتغير "' + word + '" غير مدعوم.');
      } else raw.push({ type: 'op', value: m[3] });
    }
    const out = [], ends = t => t && (t.type === 'num' || t.type === 'var' || t.value === ')');
    const starts = t => t && (t.type === 'num' || t.type === 'var' || t.type === 'func' || t.value === '(');
    raw.forEach((t, i) => {
      const p = raw[i - 1];
      if (ends(p) && starts(t)) out.push({ type: 'op', value: '*' });
      out.push(t);
    });
    return out;
  }

  function parse(source) {
    const ts = tokens(source);
    let i = 0;
    const peek = () => ts[i];
    const take = v => {
      if (!peek() || peek().value !== v) throw new Error('تأكد من الأقواس والعمليات قرب الرمز ' + (peek() ? peek().value : 'النهاية') + '.');
      i++;
    };
    const expression = () => {
      let node = product();
      while (peek() && (peek().value === '+' || peek().value === '-')) {
        const op = peek().value; i++; node = { op, left: node, right: product() };
      }
      return node;
    };
    const primary = () => {
      const t = peek();
      if (!t) throw new Error('المعادلة غير مكتملة.');
      i++;
      if (t.type === 'num') return { op: 'num', v: t.value };
      if (t.type === 'var') return { op: t.value };
      if (t.type === 'func') { take('('); const arg = expression(); take(')'); return { op: 'fn', name: t.value, arg }; }
      if (t.value === '(') { const node = expression(); take(')'); return node; }
      throw new Error('موضع غير صالح للرمز ' + t.value + '.');
    };
    const power = () => {
      const left = primary();
      if (peek() && peek().value === '^') { i++; return { op: '^', left, right: unary() }; }
      return left;
    };
    const unary = () => {
      if (peek() && (peek().value === '+' || peek().value === '-')) {
        const sign = peek().value; i++;
        return sign === '+' ? unary() : { op: 'neg', arg: unary() };
      }
      return power();
    };
    function product() {
      let node = unary();
      while (peek() && (peek().value === '*' || peek().value === '/')) {
        const op = peek().value; i++; node = { op, left: node, right: unary() };
      }
      return node;
    }
    const ast = expression();
    if (i !== ts.length) throw new Error('لم أتعرف على الرمز ' + ts[i].value + '.');
    return ast;
  }

  function value(node, x, y) {
    if (node.op === 'num') return node.v;
    if (node.op === 'x') return x;
    if (node.op === 'y') return y;
    if (node.op === 'neg') return -value(node.arg, x, y);
    if (node.op === 'fn') return FUNCTIONS[node.name](value(node.arg, x, y));
    const a = value(node.left, x, y), b = value(node.right, x, y);
    if (node.op === '+') return a + b;
    if (node.op === '-') return a - b;
    if (node.op === '*') return a * b;
    if (node.op === '/') return a / b;
    if (node.op === '^') return Math.pow(a, b);
    return NaN;
  }

  function plot(source, xmin, xmax, ymin, ymax) {
    const sides = String(source).split('=');
    if (sides.length > 2) throw new Error('اكتب علامة مساواة واحدة فقط.');
    const left = parse(sides[0]), right = sides.length === 2 ? parse(sides[1]) : { op: 'num', v: 0 };
    const f = (x, y) => value(left, x, y) - value(right, x, y);
    const W = 460, H = 460, pad = 34, size = W - pad * 2, steps = 90;
    const dx = (xmax - xmin) / steps, dy = (ymax - ymin) / steps;
    const px = x => pad + (x - xmin) / (xmax - xmin) * size;
    const py = y => pad + (ymax - y) / (ymax - ymin) * size;
    const samples = Array.from({ length: steps + 1 }, (_, j) =>
      Array.from({ length: steps + 1 }, (_, i) => f(xmin + i * dx, ymax - j * dy)));
    const paths = [];
    const cross = (a, b, va, vb) => {
      if (!Number.isFinite(va) || !Number.isFinite(vb) || (va < 0) === (vb < 0) || Math.abs(va) > 1e12 || Math.abs(vb) > 1e12) return null;
      const t = Math.max(0, Math.min(1, va / (va - vb)));
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    };
    for (let j = 0; j < steps; j++) for (let i = 0; i < steps; i++) {
      const x = xmin + i * dx, y = ymax - j * dy;
      const p = [{ x, y }, { x: x + dx, y }, { x: x + dx, y: y - dy }, { x, y: y - dy }];
      const v = [samples[j][i], samples[j][i + 1], samples[j + 1][i + 1], samples[j + 1][i]];
      if (v.some(n => !Number.isFinite(n) || Math.abs(n) > 1e12)) continue;
      const q = [cross(p[0], p[1], v[0], v[1]), cross(p[1], p[2], v[1], v[2]), cross(p[2], p[3], v[2], v[3]), cross(p[3], p[0], v[3], v[0])];
      const edges = q.map((n, e) => n ? e : -1).filter(e => e >= 0), center = f(x + dx / 2, y - dy / 2);
      const add = (a, b) => paths.push('M' + px(q[a].x).toFixed(2) + ' ' + py(q[a].y).toFixed(2) + 'L' + px(q[b].x).toFixed(2) + ' ' + py(q[b].y).toFixed(2));
      if (edges.length === 2) add(edges[0], edges[1]);
      else if (edges.length === 4 && Number.isFinite(center)) {
        if ((center < 0) === (v[0] < 0)) { add(0, 1); add(2, 3); }
        else { add(3, 0); add(1, 2); }
      }
    }
    if (!paths.length) throw new Error('لم يظهر منحنى في المجال المختار؛ وسّع المجال أو راجع المعادلة.');
    const grid = [];
    for (let n = 0; n <= 10; n++) {
      const x = pad + size * n / 10, y = pad + size * n / 10;
      grid.push('<line class="graph-grid" x1="' + x.toFixed(1) + '" y1="' + pad + '" x2="' + x.toFixed(1) + '" y2="' + (pad + size) + '"/>');
      grid.push('<line class="graph-grid" x1="' + pad + '" y1="' + y.toFixed(1) + '" x2="' + (pad + size) + '" y2="' + y.toFixed(1) + '"/>');
      if (n % 2 === 0) {
        const tick = v => String(Number(v.toFixed(1))).replace('.', '٫').replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
        grid.push('<text class="graph-tick" x="' + x.toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" direction="ltr" unicode-bidi="isolate">' + tick(xmin + (xmax - xmin) * n / 10) + '</text>');
        grid.push('<text class="graph-tick" x="' + (pad - 5) + '" y="' + (y + 3).toFixed(1) + '" text-anchor="end" direction="ltr" unicode-bidi="isolate">' + tick(ymax - (ymax - ymin) * n / 10) + '</text>');
      }
    }
    if (xmin <= 0 && xmax >= 0) grid.push('<line class="graph-axis" x1="' + px(0).toFixed(1) + '" y1="' + pad + '" x2="' + px(0).toFixed(1) + '" y2="' + (pad + size) + '"/>');
    if (ymin <= 0 && ymax >= 0) grid.push('<line class="graph-axis" x1="' + pad + '" y1="' + py(0).toFixed(1) + '" x2="' + (pad + size) + '" y2="' + py(0).toFixed(1) + '"/>');
    return '<svg class="graph-plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="الرسم البياني للمعادلة ' + esc(source) + '"><title>' + esc(source) + '</title>' +
      '<defs><clipPath id="graphClip"><rect x="' + pad + '" y="' + pad + '" width="' + size + '" height="' + size + '" rx="6"/></clipPath></defs>' +
      grid.join('') + '<path class="graph-curve" clip-path="url(#graphClip)" d="' + paths.join('') + '"/>' +
      '<text x="' + (W - 10) + '" y="' + (pad - 12) + '" text-anchor="end" fill="var(--muted)" font-size="14">x</text>' +
      '<text x="12" y="' + (pad - 12) + '" fill="var(--muted)" font-size="14">y</text></svg>';
  }

  function plotMany(sources, xmin, xmax, ymin, ymax) {
    if (!Array.isArray(sources) || sources.length < 2 || sources.length > 4) throw new Error('اختر من منحنيين إلى أربعة للمقارنة.');
    const svgs = sources.map(source => plot(source, xmin, xmax, ymin, ymax));
    const curves = svgs.map((svg, i) => {
      const match = svg.match(/<path class="graph-curve"[^>]*\/>/);
      if (!match) throw new Error('تعذّر تجهيز أحد منحنيات المقارنة.');
      return match[0].replace('class="graph-curve"', 'class="graph-curve graph-layer-' + i + '"');
    });
    return svgs[0].replace(/<path class="graph-curve"[^>]*\/>/, curves.join(''));
  }

  root.DarbMathPlot = { plot, plotMany };
})(window);
