const fs = require('fs');
const content = fs.readFileSync('.next/static/chunks/2gvu8dyrhibpa.js', 'utf8');
const matches = content.match(/node_modules\/[a-zA-Z0-9_\-\/]+/g) || [];
const unique = [...new Set(matches.map(m => m.split('/')[1]))];
console.log('Libraries in chunk:', unique);
