import fs from 'node:fs/promises'
import nodePath from 'path'
import { TemplateItem } from '../interface/templates-type.js'
import { Config } from '../modules/config-class.js'
import { Arg } from './arg-class.js'
import { GenerateData } from './generate-data.js'
import { log } from './logs-class.js'
import { Reader, TData } from './reader-class.js'

export class GenerateTemplate {
  private countIterate = 0
  private generateData?: GenerateData

  constructor(public config: Config) {}

  setGenerateData(arg: Arg) {
    // Создаем класс для генерации имени и данных на основе глобального конфига
    this.generateData = new GenerateData(this.config, arg)
  }

  async write(template: TemplateItem) {
    // Рекурсивно читаем все файлы и папки, по путю до темлейта
    const reader = new Reader(template.template, { isRecursive: true })
    // Ждем чтения всех файлов
    const generateData = await reader.read()

    // Если файлов нет
    if (!generateData) return

    // Читаем все имена файлов из агрументов
    const writeDataArr = this.config.args?.fileName.map(async (name) => {
      // записываем локальный конфиг для генерации имени и данных
      this.generateData?.setLocalConfig(template)
      // очищаем счетчик итераций
      this.clearCountIterate()
      // Записываем данные на основе имени в аргументах
      const generatePath = nodePath.join(this.config.pathRun, template.generate)
      // записали все данные
      log.success(`${name}: ${generatePath}`)
      return this.writeData(generateData, generatePath, name)
    })

    if (!writeDataArr) return
    await Promise.all(writeDataArr)
    return true
  }

  private async writeData(writeData: TData, generatePath: string, generateName: string) {
    const { type } = writeData
    // увеличиваем счетчик итераций
    this.incCountIterate()
    // генерируем новое имя файла или паки
    const newName = this.generateData!.replaceName(writeData, generateName)

    if (type === 'file') {
      const newPath = nodePath.join(generatePath, newName)

      await this.createFile(writeData, newPath, generateName)
    } else {
      // TODO сделать чтобы эту опцию можно было выбирать в конфиге
      // TODO заменять ли выбраным именем корневую папку генерации
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

  private clearCountIterate() {
    this.countIterate = 0
  }

  private incCountIterate() {
    this.countIterate++
  }

  private async createFolder(path: string) {
    await fs.mkdir(path).catch((reason) => {
      // log.warn(`Error create folder in path "${path}"`).view(reason)
    })
  }

  private async createFile(data: TData, path: string, generateName: string) {
    if (data.type === 'file') {
      const replacedData = this.generateData!.replaceDataFile(data, generateName)

      await fs.writeFile(path, replacedData).catch((reason) => {
        log.error(`Error create file in path ${data.path}`)
        // .view(reason)
      })
    }
  }
}
