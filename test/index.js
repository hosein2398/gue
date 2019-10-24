const fs = require('fs');
const tap = require('tap');
const Gue = require('../src');
const defaultVueTemplate = require('../src/templates/sample-component');
const defaultUnitTemplate = require('../src/templates/sample-unit');

function getContent(dir) {
  return fs.readFileSync(dir, {encoding: 'utf8'});
}

function formatComponent(name, comp) {
  const data = comp;
  const rex = /<%NAME%>/g;
  return data.replace(rex, name);
}

function formatTest(name, unitPath, tmp) {
  let data = tmp;
  const rexName = /<%NAME%>/g;
  const rexPath = /<%PATH%>/g;
  data = data.replace(rexName, name);
  return data.replace(rexPath, unitPath);
}

const customVueTemplate = getContent('./templates/myVueTmp.vue');
const customUnitTemplate = getContent('./templates/myUnitTmp.js');

tap.test('Without dir parameter', t => {
  const name = 'firstTest';
  const dir = './src/components/firstTest.vue';
  const gue = new Gue(name, null, {});
  gue.run();
  t.plan(1);
  t.equal(getContent(dir), formatComponent(name, defaultVueTemplate));
});

tap.test('With directory parameter', t => {
  const name = 'secondTest';
  const dir = './somewhere/secondTest.vue';
  const gue = new Gue(name, './somewhere', {});
  gue.run();
  t.plan(1);
  t.equal(getContent(dir), formatComponent(name, defaultVueTemplate));
});

tap.test('With test param and without dir parameter', t => {
  const name = 'thirdTest';
  const dir = './src/components/thirdTest.vue';
  const testDir = './tests/unit/thirdTest.js';
  const gue = new Gue(name, null, {unit: true});
  gue.run();
  t.plan(2);
  t.equal(getContent(dir), formatComponent(name, defaultVueTemplate));
  t.equal(
    getContent(testDir),
    formatTest(name, '../../src/components/thirdTest.vue', defaultUnitTemplate)
  );
});

tap.test('With test param and with dir parameter', t => {
  const name = 'fourthTest';
  const dir = './path-to-nowhere/fourthTest.vue';
  const testDir = './tests/unit/fourthTest.js';
  const gue = new Gue(name, 'path-to-nowhere', {unit: true});
  gue.run();
  t.plan(2);
  t.equal(getContent(dir), formatComponent(name, defaultVueTemplate));
  t.equal(
    getContent(testDir),
    formatTest(name, '../../path-to-nowhere/fourthTest.vue', defaultUnitTemplate)
  );
});

tap.test('Duplicate', t => {
  const name = 'firstTest';
  const dir = './src/components/firstTest.vue';
  const gue = new Gue(name, null, {});
  t.plan(1);
  t.false(gue.checkFileStatus(dir, 'component'));
});

tap.test('Custom component file', t => {
  const name = 'fifthTest';
  const dir = './src/components/fifthTest.vue';
  const gue = new Gue(name, null, {});
  gue.componentSource = './templates/myVueTmp.vue';
  gue.run();
  t.plan(1);
  t.equal(getContent(dir), formatComponent(name, customVueTemplate));
});

tap.test('Custom test file', t => {
  const name = 'seventhTest';
  const testDir = './tests/unit/seventhTest.js';
  const gue = new Gue(name, null, {unit: true});
  gue.unitSource = './templates/myUnitTmp.js';
  gue.run();
  t.plan(1);
  t.equal(getContent(testDir), formatTest(name, '../../src/components/seventhTest.vue', customUnitTemplate));
});

tap.test('Custom root dir for component && custom component file && sub directory', t => {
  const name = 'eighthTest';
  const dir = './custom-root/subdir/eighthTest.vue';
  const gue = new Gue(name, 'subdir', {});
  gue.componentRoot = './custom-root';
  gue.componentSource = './templates/myVueTmp.vue';
  gue.run();
  t.plan(1);
  t.equal(getContent(dir), formatComponent(name, customVueTemplate));
});

tap.test('Custom root dir for test && custom test file', t => {
  const name = 'ninthTest';
  const testDir = './custom-unit-root/ninthTest.js';
  const gue = new Gue(name, null, {unit: true});
  gue.unitRoot = './custom-unit-root';
  gue.unitSource = './templates/myUnitTmp.js';
  gue.run();
  t.plan(1);
  t.equal(getContent(testDir), formatTest(name, '../src/components/ninthTest.vue', customUnitTemplate));
});
