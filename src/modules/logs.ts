import chalk from 'chalk'

export const error = (...arg: string[]) => console.log(chalk.red(arg))
export const warn = (...arg: string[]) => console.log(chalk.yellow(arg))
export const success = (...arg: string[]) => console.log(chalk.green(arg))
