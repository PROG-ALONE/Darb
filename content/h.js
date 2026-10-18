/* أدوات مختصرة لملفات المحتوى */
window.CONTENT_PARTS = window.CONTENT_PARTS || [];
window.H = {
  Q: (q, o, why) => ({ q, o, c: 0, why }),
  TF: (q, ok, why) => ({ tf: 1, q: 'صح أم خطأ: ' + q, o: ['صح', 'خطأ'], c: ok ? 0 : 1, why }),
  X: (id, sec, text, ans, steps) => ({ id, src: 'extra', sec, text, ans, steps }),
  B: (id, ref, sec, text, ans, steps) => ({ id, src: 'book', ref, sec, text, ans, steps: steps || [] }),
  T: o => Object.assign({ defs: [], laws: [], reasons: [], blanks: [], examples: [], problems: [], quiz: [] }, o),
  L: (f, name, read, vars, when, note) => ({ f, name, read, vars: vars || [], when: when || '', note: note || '' }),
  D: (term, text, think) => ({ term, text, think: think || '' }),
  R: (q, a) => ({ q, a }),
  F: (s, a) => ({ s, a: [].concat(a) }),
  E: (title, page, text, steps, ans) => ({ title, page, text, steps, ans }),
  P: (x) => ({ t: 'p', x }), K: (x) => ({ t: 'key', x }), N: (x) => ({ t: 'note', x }), EQ: (x) => ({ t: 'eq', x }), HD: (x) => ({ t: 'h', x }), LI: (x) => ({ t: 'list', x }), TH: (q, a) => ({ t: 'think', q, a }), TB: (cap, head, rows) => ({ t: 'table', cap, head, rows }),
  /* مادة مشتركة بين الفرعين العلمي والأدبي */
  push: (keys, chapter) => [].concat(keys).forEach(key => window.CONTENT_PARTS.push({ key, chapter }))
};
