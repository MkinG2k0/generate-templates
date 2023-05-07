import { IConfig } from '../index.js'
import { Arg, DataArg } from './arg-class.js'
import { log } from './logs-class.js'
import { Parser } from './parser-class.js'
import { Reader } from './reader-class.js'

interface TConfig {}

export class Config implements TConfig {
  pathRun = ''
  generateConfig?: IConfig
  args?: DataArg = undefined

  constructor(process: NodeJS.Process) {
    this.args = new Arg(process.argv).data
    this.pathRun = process.cwd()
  }

  async read() {
    if (!this.args?.pathConfig) {
      log.error('Choose path to config').view(this.args)
      return
    }
    const reader = new Reader(this.args.pathConfig, { path: this.pathRun })
    const data = await reader.read()

    if (data) {
      this.generateConfig = (await Parser.parse(data)) as IConfig
      log.setDebug(log.debug || this.generateConfig.debug)
    }

    return this.generateConfig
  }
}
