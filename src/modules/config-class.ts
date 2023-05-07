import { IConfig } from '../index.js'
import { DataArg } from './arg-class.js'
import { log } from './logs-class.js'
import { Parser } from './parser-class.js'
import { Reader } from './reader-class.js'

interface TConfig {}

export class Config implements TConfig {
  globalConfig: IConfig = {}

  constructor(public args: DataArg, public pathRun: string) {}

  async read() {
    if (!this.args?.pathConfig) {
      log.error('Choose path to config').view(this.args)
      return
    }
    const reader = new Reader(this.args.pathConfig, { path: this.pathRun })
    const data = await reader.read()
    if (data) {
      this.globalConfig = (await Parser.parse(data)) as IConfig
      log.setDebug(log.debug || this.globalConfig.debug)
    }

    return this.globalConfig
  }
}
