const fs = require('fs');
const path = require('path');
const tap = require('tap');
const Gue = require('../src');
const defaultVueTemplate = require('../src/templates/sample-component');
const defaultUnitTemplate = require('../src/templates/sample-unit');

const initCwd = process.cwd();

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

/*
* Since we want to test diffrent config files and config files are 
* recognized automatically from root dir, we need to change cwd
* every time. And since config file gets resolved only once when
* you require the module(here ./src module) we need to clear cache of
* require so when we change the directory, the module ./src/config gets
* evaluated again and it recognizes config file in new cwd. 
*/
function cleanCacheAndChageCwd(dir) {
  delete require.cache[require.resolve('../src/config')];
  delete require.cache[require.resolve('../src')];
  process.chdir(path.resolve(initCwd, dir));
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

tap.test('Should throw when there is -t but componentSource is not object', t => {
  cleanCacheAndChageCwd('./conditions/simple-config');
  const Gue = require('../src');
  const name = 'tenthTest';
  const gue = new Gue(name, null, {template: 'foo'});
  t.plan(1);
  // TODO: check the exact error
  t.throw(() => {
    gue.generate();
  });
});

tap.test('Should throw when template name is not in config', t => {
  cleanCacheAndChageCwd('./conditions/wrong-template');
  const Gue = require('../src');
  const name = 'eleventhTest';
  const gue = new Gue(name, null, {template: 'foo'});
  t.plan(1);
  // TODO: check the exact error
  t.throw(() => {
    gue.generate();
  });
});

tap.test('Should work with multiple templates and choose right one', t => {
  cleanCacheAndChageCwd('./conditions/right-template');
  const Gue = require('../src');
  const name = 'twelvethTest';
  // Note that we are now in: ./conditions/right-template
  const dir = './src/components/twelvethTest.vue';
  const cutomTemplateDir = './right.vue';
  const gue = new Gue(name, null, {template: 'right'});
  gue.run();
  t.plan(1);
  t.equal(getContent(dir), formatComponent(name, getContent(cutomTemplateDir)));
});

tap.test('Should throw when componentSource is object but there is not default template(and -t is not passed of course)', t => {
  cleanCacheAndChageCwd('./conditions/right-template');
  const Gue = require('../src');
  const name = 'foo';
  const gue = new Gue(name, null, {});
  t.plan(1);
  t.throw(() => {
    gue.generate();
  });
});

tap.test('Should recognize default template when there is no -t', t => {
  cleanCacheAndChageCwd('./conditions/default-template');
  const Gue = require('../src');
  const name = 'iBlack';
  // Note that we are now in: ./conditions/default-template
  const dir = './src/components/iBlack.vue';
  const cutomTemplateDir = './black.vue';
  const gue = new Gue(name, null, {});
  gue.run();
  t.plan(1);
  t.equal(getContent(dir), formatComponent(name, getContent(cutomTemplateDir)));
});
