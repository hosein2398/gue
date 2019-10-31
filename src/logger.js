const box = require('boxen');
const chalk = require('chalk');
class Logger {
  success(name, dir, type) {
    console.log(
      box(
        `${chalk.hex('#45d03c')('✔️')} Created ${chalk.hex('#45d03c')(
          name
        )} ${type} in ${chalk.hex('#45d03c')(dir)}`,
        {
          padding: 1
        }
      )
    );
  }

  duplicate(name, dir, type) {
    console.log(
      box(
        `${chalk.hex('#e6e600')('💡')} You already have ${chalk.hex('#e6e600')(
          name
        )} ${type} in ${chalk.hex('#e6e600')(dir)}`,
        {padding: 1}
      )
    );
  }

  warn(m) {
    console.log(
      box(
        `${chalk.hex('#e6e600')('💡')} ${m}`,
        {padding: 1}
      )
    );
  }

  error(e) {
    console.log(
      box(`⚠️ ${chalk.red('Oops something went wrong')}`, {padding: 1})
    );
    console.log(e);
  }

  fatal(e) {
    console.log(
      box(`⚠️ ${chalk.red(e)}`, {padding: 1})
    );
    throw new Error(e);
  }
}

module.exports = new Logger();
