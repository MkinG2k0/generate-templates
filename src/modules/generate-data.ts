import { regExp } from '../constant/reg-exp.js'
import { IConfig, TemplateItem } from '../interface/templates-type.js'
import { Arg, ITemplate } from './arg-class.js'
import { Case } from './case-class.js'
import { Config } from './config-class.js'
import { IFile, TData } from './reader-class.js'

interface IBlockCode {
  name: string
  ext: string
  code: string
}

export class GenerateData {
  private localConfig: TemplateItem = { generate: '', template: '' }
  private template?: ITemplate
  constructor(public config: Config, public arg: Arg) {}

  setLocalConfig(localConfig: TemplateItem, template: ITemplate) {
    this.localConfig = localConfig
    this.template = template
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
        ext: ext.trim(),
        code: codeStr,
      }

      return data
    })

    return codes
  }

  private parseData(data: IFile, nameData: string) {
    const [someCode, ...otherCode] = this.getCode(data.data)

    if (!someCode) return { data: data.data, ext: data.ext }

    const strCode = someCode.code
    // ищем комментарии в коде /**/
    const comments = Array.from(strCode.match(regExp.commentsLine) || [])
    // ищем комментарии в коде ///
    const commentsLine = Array.from(strCode.match(/\/\/\/.*/g) || [])
    // объединяем два вида комментариев /**/ и ///
    const allComments = [...comments, ...commentsLine]
    // переменная для сгенерированных данных
    let newData: string = strCode
    // получение дефолтных блоков кода
    const defaultVariable = this.defaultCodeBlock(nameData)
    // получаем все флаги
    const { template, name, path } = this.template!.flag
    // объединяем их
    const flags = [...template, ...name, ...path]

    flags.forEach((flagName) => {
      otherCode.forEach((code) => {
        if (!code) return
        allComments.forEach((name) => {
          const checkName = name.replaceAll('/', '').replaceAll('*', '').trim()
          const clearCheckName = checkName.slice(
            checkName.indexOf('$') + 1,
            checkName.lastIndexOf('$'),
          )
          const onFlag = flagName === clearCheckName
          const codeName = code.name.trim()
          if (onFlag && checkName === codeName) {
            newData = newData.replaceAll(name, code?.code || '')
          }
        })
      })
    })

    defaultVariable.forEach(({ name, code }) => {
      newData = newData.replaceAll(name, code)
    })
    // заменяем статичные данные
    allComments.forEach((name) => {
      newData = newData.replaceAll(name, '')
    })

    return {
      data: newData,
      ext: someCode.ext,
    }
  }
  // TODO сделать лучше
  private getDefaultComments() {
    return ['$pathToGenerate$', '$name$', '$nameCamel$', '$nameUpCamel$']
  }

  // TODO сделать лучше
  private defaultCodeBlock(name: string) {
    const code: IBlockCode[] = []
    code.push({ code: this.localConfig.generate, name: '$pathToGenerate$', ext: '' })
    code.push({ code: name, name: '$name$', ext: '' })
    code.push({ code: Case.write(name, 'lowerCamel'), name: '$nameCamel$', ext: '' })
    code.push({ code: Case.write(name, 'camel'), name: '$nameUpCamel$', ext: '' })
    return code
  }

  replaceName(writeData: TData, generateName: string) {
    return writeData.name.replace('$name$', generateName)
  }

  private getLocalOrGlobalConfig<T>(
    call: (data: TemplateItem | IConfig) => T | undefined,
  ): T | undefined {
    const currentData = call(this.localConfig)
    const globalData = call(this.config.globalConfig)
    return typeof currentData !== 'undefined' ? currentData : globalData
  }
}
