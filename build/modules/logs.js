import chalk from 'chalk';
export const error = (...arg) => console.log(chalk.red(arg));
export const warn = (...arg) => console.log(chalk.yellow(arg));
export const success = (...arg) => console.log(chalk.green(arg));
//# sourceMappingURL=logs.js.map