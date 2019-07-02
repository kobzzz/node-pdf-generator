const chalk = require('chalk');
const log = console.log;

const error = (text, ...params) => log(chalk.bold.red(text, ...params));
const info = (text, ...params) => log(chalk.bgBlueBright.black(text, ...params));
const success = (text, ...params) => log(chalk.green(text, ...params));

module.exports = {
  error,
  info,
  success,
};
