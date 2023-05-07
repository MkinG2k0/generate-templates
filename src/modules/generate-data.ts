import { DATA_NAME, FILE_NAME } from '../constant/const.js'
import { regExp } from '../constant/reg-exp.js'
import { IConfig, TemplateItem } from '../interface/templates-type.js'
import { Arg } from './arg-class.js'
import { Case } from './case-class.js'
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

  replaceName(data: TData, generateName: string) {
    const { ext, type, name } = data
    if (type === 'file') {
      // ищем в локальном или в глобальном конфиге на что заменять расширения
      const isReplaceExt = this.getLocalOrGlobalConfig((conf) => conf.replaceExt)
      // ищем какое имя файла заменить если не нашли используем константу
      const replaceFileName = this.getLocalOrGlobalConfig((conf) => conf.replaceFileName) || FILE_NAME

      const replacedName = name.replace(replaceFileName, generateName)
      // если расширение в конфиге совпадаем с текущим файлом
      const findReplacedExt = isReplaceExt?.find(([replaceable, replace]) => {
        return replaceable === ext
      })
      // если нашли расширение, прибавляем его к названию файла,
      // в противном случае прибавляем расширение прочитанного файла template
      const fileName = findReplacedExt ? `${replacedName}.${findReplacedExt[1]}` : `${replacedName}.${ext}`
      return fileName
    }
    return data.name
  }

  replaceDataFile(data: TData, name: string) {
    if (data.type === 'file') {
      // Переводим имя файла в camelCase для использования в файлах
      const dataName = Case.toCamel(name)
      // ищем какую строку заменить внутри файла если не нашли используем константу
      const replaceDataName = this.getLocalOrGlobalConfig((conf) => conf.replaceDataName) || DATA_NAME
      const replacedData = data.data.replaceAll(replaceDataName, dataName)
      // TODO куча логики по парсингу md файла
      const newData = this.parseData(data)
      // заменяем данные внутри файла
      return replacedData
    }
    return ''
  }

  private getCode(data: string) {
    const blocks = Array.from(data.matchAll(/###/g))

    const indexCodes: [number, number][] = []
    blocks.map((value) => {
      const lastElem = indexCodes.at(-1)
      const lastElemEnd = lastElem?.[1]
      if (lastElem && lastElemEnd === -1) {
        lastElem[1] = Number(value.index)
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

  private parseData(data: IFile) {
    const [someCode, ...otherCode] = this.getCode(data.data)

    const strCode = someCode.code
    const comments = strCode.match(regExp.commentsLine)
    // TODO
    return ''
  }

  private getLocalOrGlobalConfig<T>(call: (data: TemplateItem | IConfig) => T | undefined): T | undefined {
    const currentData = call(this.localConfig)
    const globalData = call(this.config.globalConfig)
    return typeof currentData !== 'undefined' ? currentData : globalData
  }
}
