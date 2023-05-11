import { regExp } from '../constant/reg-exp.js'
import { IConfig, TemplateItem } from '../interface/templates-type.js'
import { Arg } from './arg-class.js'
import { Config } from './config-class.js'
import { IFile, TData } from './reader-class.js'

interface IBlockCode {
  name: string
  ext: string
  code: string
  data?: string
}

export class GenerateData {
  private localConfig: TemplateItem = { generate: '', template: '' }
  constructor(public config: Config, public arg: Arg) {}

  setLocalConfig(localConfig: TemplateItem) {
    this.localConfig = localConfig
  }

  replaceDataFile(data: TData, name: string) {
    if (data.type !== 'file') return { data: '', ext: '' }
    const newData = this.parseData(data, name)
    return newData
  }

  private getCode(data: string) {
    const blocks = Array.from(data.matchAll(/###/g))

    const indexCodes: [number, number][] = []
    blocks.map((value) => {
      const lastElem = indexCodes.at(-1)
      const lastElemEnd = lastElem?.[1]

      if (lastElem && lastElemEnd === -1) {
        lastElem[1] = Number(value.index)
        indexCodes.push([Number(value.index), -1])
      } else {
        indexCodes.push([Number(value.index), -1])
      }
    })

    const blocksStr: string[] = indexCodes.map(([start, end]) => {
      return data.slice(start, end)
    })

    const codes = blocksStr.map((value) => {
      const name =
        value
          .match(/###.*\s/)?.[0]
          .slice(3)
          .trim() || ''

      // data.data = value
      const sliceCode = Array.from(value.matchAll(/```/g))
      const start = (sliceCode[0].index || 0) + 3
      const end = sliceCode[1].index
      const codeStrArr = value.slice(start, end).split('\n')
      const [ext, ...code] = codeStrArr

      const codeStr = code.join('\n')

      const data: IBlockCode = {
        name,
        ext,
        code: codeStr,
      }

      return data
    })

    return codes
  }

  private parseData(data: IFile, name: string) {
    const [someCode, ...otherCode] = this.getCode(data.data)

    if (!someCode) return { data: data.data, ext: data.ext }

    const strCode = someCode.code
    const comments = Array.from(strCode.match(regExp.commentsLine) || [])
    const commentsLine = Array.from(strCode.match(/\/\/\/.*/g) || [])
    const allComments = this.addComments([...comments, ...commentsLine])
    let newData: string = strCode
    const allCode: IBlockCode[] = this.addVariable(otherCode, data, name)

    allCode.map((code) => {
      if (!code) return
      allComments.map((name) => {
        const checkName = name.replaceAll('/', '').replaceAll('*', '').trim()
        // TODO isTrue
        if (checkName === code.name.trim()) {
          newData = newData.replaceAll(name, code?.code || '')
        }
      })
    })

    return {
      data: newData,
      ext: someCode.ext,
    }
  }
  // TODO сделать лучше
  private addComments(allComments: string[]) {
    return [...allComments, '/*${path_to_generate}*/', '/*${name}*/']
  }

  // TODO сделать лучше
  private addVariable(otherCode: IBlockCode[], data: IFile, name: string) {
    const code: IBlockCode[] = [...otherCode]
    code.push({ data: '', code: this.localConfig.generate, name: '${path_to_generate}', ext: '' })
    code.push({ data: '', code: name, name: '${name}', ext: '' })
    // code.push({ data: '', code: data.pathDir, name: '${path_to_folder}', ext: '' })

    return code
  }

  replaceName(writeData: TData, generateName: string) {
    return writeData.name.replace('${name}', generateName)
  }

  private getLocalOrGlobalConfig<T>(
    call: (data: TemplateItem | IConfig) => T | undefined,
  ): T | undefined {
    const currentData = call(this.localConfig)
    const globalData = call(this.config.globalConfig)
    return typeof currentData !== 'undefined' ? currentData : globalData
  }
}
