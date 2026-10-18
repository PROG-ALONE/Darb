const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'content');
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'h.js' && !f.startsWith('ministerial-') && !f.startsWith('guides'))) {
  global.window = {};
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  require(path.join(dir, 'h.js'));
  try { 
    require(path.join(dir, f)); 
    console.log('OK:', f, 'parts:', global.window.CONTENT_PARTS?.length || 0);
  } catch (e) { 
    console.log('ERROR:', f, ':', e.message); 
  }
}