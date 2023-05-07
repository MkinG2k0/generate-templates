import chalk from 'chalk'

export const error = (...arg: string[]) => console.log(chalk.red(arg))
export const warn = (...arg: string[]) => console.log(chalk.yellow(arg))
export const CLog = (...arg: string[]) => console.log(chalk.white(arg))
export const success = (...arg: string[]) => console.log(chalk.green(arg))

export class Log {
  debug: boolean = false
  constructor(debug: boolean | undefined) {
    this.debug = Boolean(debug)
  }

  setDebug(value) {
    this.debug = value
  }

  view(...args: any[]) {
    if (this.debug) {
      console.log(...args)
    }
  }

  warn(...args: any[]) {
    if (this.debug) {
      warn(...args)
    }
    return this
  }

  success(...args: any[]) {
    success(...args)
  }

  error(...args: any[]) {
    error(...args)
    return this
  }

  log(...args: any[]) {
    if (this.debug) {
      CLog(...args)
    }
    return this
  }
}

export const log = new Log(false)
