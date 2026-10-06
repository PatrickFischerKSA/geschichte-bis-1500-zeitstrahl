const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
fs.rmSync(dist, {recursive:true, force:true});
fs.mkdirSync(dist, {recursive:true});
for (const name of ['index.html','styles.css','timeline.js','app.js','assets']) {
  fs.cpSync(path.join(root,name), path.join(dist,name), {recursive:true});
}
