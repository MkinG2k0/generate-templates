import { log } from './logs-class.js'
import { TData } from './reader-class.js'

export class Parser {
  constructor() {}

  static async parse(dataFile: TData): Promise<{}> {
    const { ext, data, type } = dataFile

    if (type == 'file') {
      if (ext === 'json') {
        return this.parseJson(data)
      } else if (ext === 'ts') {
        return await this.parseJs(dataFile)
      } else if (ext === 'js') {
        return await this.parseJs(dataFile)
      } else if (ext === 'cjs') {
        return await this.parseJs(dataFile)
      } else {
        log.error(`not fount file extension ${ext}`)
        return {}
      }
    }

    return {}
  }

  static parseJson(data: string) {
    try {
      return JSON.parse(data)
    } catch (e) {
      console.log('err', e)
    }
  }

  static async parseJs(dataFile: TData) {
    const { path } = dataFile
    const filePath = 'file://'.concat(path)

    try {
      return await import(filePath).then((value) => {
        return value.default
      })
    } catch (e) {
      console.log('err', e)
      return {}
    }
  }
}
