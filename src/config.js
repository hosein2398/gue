const JoyCon = require('joycon');

const joycon = new JoyCon();

const conf = joycon.loadSync(['gue.json']);

module.exports = conf;
