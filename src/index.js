const path = require('path');
const fs = require('fs');

const logger = require('./logger');
const configFile = require('./config');
const cmpTemplate = require('./templates/sample-component');
const unitTemplate = require('./templates/sample-unit');

class Gue {
  constructor(componentName, distDir, options) {
    this.componentName = componentName;
    this.options = options;
    const config = configFile.data;
    this.componentSource = config && config.componentSource ? config.componentSource : '';
    this.componentRoot = config && config.componentRoot ? config.componentRoot : '';
    this.unitSource = config && config.unitSource ? config.unitSource : '';
    this.unitRoot = config && config.unitRoot ? config.unitRoot : './tests/unit/';
    this.distDir = distDir ?
      distDir :
      (this.componentRoot ?
        '' :
        './src/components');
  }

  generate() {
    this.writeComponent();
    this.options.unit && this.writeUnit();
  }

  writeComponent() {
    const dir = this.makeComponentDistDir();
    const data = this.formatComponent(dir);
    // TODO: if there was error in writing this dir should not be created too
    this.checkDirStatus(dir);
    this.checkFileStatus(dir, 'component') &&
      fs.writeFileSync(dir, data) === undefined && // Since this method returns undefined
        logger.success(this.componentName, dir, 'component');
  }

  writeUnit() {
    const dir = this.makeUnitDistDir();
    const data = this.formatUnit(dir);
    this.checkDirStatus(dir);
    this.checkFileStatus(dir, 'test file') &&
      fs.writeFileSync(dir, data) === undefined &&
        logger.success(this.componentName, dir, 'test file');
  }

  formatComponent() {
    const data = this.componentSource ?
      fs.readFileSync(this.componentSource, {encoding: 'utf8'}) :
      cmpTemplate;
    const rex = /<%NAME%>/g;
    return data.replace(rex, this.componentName);
  }

  formatUnit() {
    let data = this.unitSource ?
      fs.readFileSync(this.unitSource, {encoding: 'utf8'}) :
      unitTemplate;
    const rexName = /<%NAME%>/g;
    const rexPath = /<%PATH%>/g;
    // Want first argumet to be directory not a file
    const unitPath = path.relative(this.makeUnitDistDir().split('/').slice(0, -1).join('/'), this.makeComponentDistDir());
    data = data.replace(rexName, this.componentName);
    return data.replace(rexPath, unitPath);
  }

  makeComponentDistDir() {
    return path.join(
      this.componentRoot,
      this.distDir,
      `${this.componentName}.vue`
    );
  }

  makeUnitDistDir() {
    return path.join(this.unitRoot, `${this.componentName}.js`);
  }

  checkDirStatus(direcrories) {
    const spilitedDirs = direcrories.split('/');
    // Since we don't need .vue in our path
    const removeLast = spilitedDirs.slice(0, -1);
    const joinedDirs = removeLast.join('/');
    const exists = fs.existsSync(joinedDirs);
    if (!exists) {
      fs.mkdirSync(joinedDirs, {recursive: true});
    }
  }

  checkFileStatus(dirs, type) {
    if (fs.existsSync(dirs)) {
      logger.duplicate(this.componentName, dirs, type);
      return false;
    }

    return true;
  }

  run() {
    this.generate();
  }
}

module.exports = Gue;
