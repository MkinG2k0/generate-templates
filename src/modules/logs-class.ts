import chalk from 'chalk'

export const error = (...arg: string[]) => console.log(chalk.red(arg))
export const warn = (...arg: string[]) => console.log(chalk.yellow(arg))
export const success = (...arg: string[]) => console.log(chalk.green(arg))

export class Log {
  debug: boolean = false

  constructor(debug: boolean | undefined) {
    this.debug = Boolean(debug)
  }

  log(...args: any[]) {
    if (this.debug) {
      console.log(args)
    }
  }
}
