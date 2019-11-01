const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const directory = './test';
const files = fs.readdirSync(directory);

for (const file of files) {
  const doNotRemove = [
    'index.js',
    '.nyc_output',
    'cleanup.js',
    'gue.json',
    'templates',
    'conditions'
  ];
  if (doNotRemove.includes(file)) {
    continue;
  }

  rimraf.sync(path.join(directory, file));
}
