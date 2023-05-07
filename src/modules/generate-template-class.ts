import fs from 'node:fs/promises'
import nodePath from 'path'
import { DATA_NAME, FILE_NAME } from '../constant/const.js'
import { IConfig, TemplateItem } from '../interface/templates-type.js'
import { Config } from '../modules/config-class.js'
import { Case } from './case-class.js'
import { log } from './logs-class.js'
import { Reader, TData } from './reader-class.js'

export class GenerateTemplate {
  private currentTemplate?: TemplateItem
  private countIterate = 0

  constructor(public config: Config) {}

  async write(pathToTemplate: string) {
    // Рекурсивно читаем все файлы и папки, по путю до темлейта
    const reader = new Reader(pathToTemplate, { isRecursive: true })
    // Ждем чтения всех файлов
    const generateData = await reader.read()

    // Если файлы есть
    if (!generateData) return

    // Читаем все имена файлов из агрументов
    const writeDataArr = this.config.args?.fileName.map(async (name) => {
      // очищаем счетчик итераций
      this.clearCountIterate()
      // Записываем данные на основе имени в аргументах
      const generatePath = nodePath.join(this.config.pathRun, pathToTemplate)
      console.log(generatePath)
      // записали все данные
      return this.writeData(generateData, generatePath, name)
    })

    if (!writeDataArr) return
    await Promise.all(writeDataArr)
    return true
  }

  // Чтение всех имен файлов в аргументах
  writeNames(call: (name: string) => Promise<any>) {
    return this.config.args?.fileName.map(call)
  }

  async writeData(writeData: TData, generatePath: string, generateName: string) {
    const { type } = writeData
    // увеличиваем счетчик итераций
    this.incCountIterate()
    // генерируем новое имя файла или паки
    const newName = this.replaceName(writeData, generateName)

    if (type === 'file') {
      const newPath = nodePath.join(generatePath, newName)

      await this.createFile(writeData, newPath, generateName)
    } else {
      // если это первая итерация, то название папки будет соответствовать имени в конфиге
      const newPath = nodePath.join(generatePath, this.countIterate === 1 ? generateName : newName)

      // создаем текущую папку
      await this.createFolder(newPath)
      // проходимся по файлам находящимся внутри папки
      writeData.data.map(async (nextData) => {
        // рекурсивно их читаем
        await this.writeData(nextData, newPath, generateName)
      })
    }
  }

  clearCountIterate() {
    this.countIterate = 0
  }

  incCountIterate() {
    this.countIterate++
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

  async createFolder(path: string) {
    await fs.mkdir(path).catch((reason) => {
      // log.warn(`Error create folder in path "${path}"`).view(reason)
    })
  }

  async createFile(data: TData, path: string, generateName: string) {
    if (data.type === 'file') {
      const replacedData = this.replaceDataFile(data, generateName)

      await fs.writeFile(path, replacedData).catch((reason) => {
        log.error(`Error create file in path ${data.path}`)
        // .view(reason)
      })
    }
  }

  replaceDataFile(data: TData, name: string) {
    if (data.type === 'file') {
      // Переводим имя файла в camelCase для использования в файлах
      const dataName = Case.toCamel(name)
      // ищем какую строку заменить внутри файла если не нашли используем константу
      const replaceDataName = this.getLocalOrGlobalConfig((conf) => conf.replaceDataName) || DATA_NAME
      // заменяем данные внутри файла
      const replacedData = data.data.replaceAll(replaceDataName, dataName)
      return replacedData
    }
    return ''
  }

  getLocalOrGlobalConfig<T>(call: (data: TemplateItem | IConfig) => T | undefined): T | undefined {
    const currentData = call(this.currentTemplate || { templates: {} })
    const globalData = call(this.config.generateConfig || { templates: {} })
    return typeof currentData !== 'undefined' ? currentData : globalData
  }
}
