import { exec } from 'child_process'
import fs from 'node:fs/promises'
import nodePath from 'path'
import { TemplateItem } from '../interface/templates-type.js'
import { Config } from '../modules/config-class.js'
import { Arg, ITemplate } from './arg-class.js'
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

  async write(data: { localConfig: TemplateItem; template: ITemplate }) {
    const { localConfig, template } = data
    // Рекурсивно читаем все файлы и папки, по путю до темлейта
    const reader = new Reader(localConfig.template, { isRecursive: true })
    // Ждем чтения всех файлов
    const generateData = await reader.read()

    // Если файлов нет
    if (!generateData) return

    // Читаем все имена файлов из аргументов
    const writeDataArr = template.names.map(async (name) => {
      // записываем локальный конфиг для генерации имени и данных
      this.generateData?.setLocalConfig(localConfig)
      // очищаем счетчик итераций
      this.clearCountIterate()
      // Записываем данные на основе имени в аргументах
      // TODO relative path
      // console.log(generateData, name, localConfig)
      // const generatePath = nodePath.join(this.config.pathRun, localConfig.generate)
      const path = localConfig.generate

      const data = await this.writeData(localConfig, generateData, name, path)
      // записали все данные
      // log.success(`${name}: ${generatePath}`)
      //afterCommand
      this.runCommand(localConfig)
      return data
    })

    if (!writeDataArr) return
    await Promise.all(writeDataArr)
    return true
  }

  private runCommand(localConfig: TemplateItem) {
    let command = localConfig.afterCommand || this.config.globalConfig.afterCommand
    command = command?.replace('${path_generate}', localConfig.generate)
    if (command) {
      exec(command)
    }
  }

  private async writeData(
    localConfig: TemplateItem,
    writeData: TData,
    generateName: string,
    path: string = '',
  ) {
    const { type } = writeData
    const { generate } = localConfig
    // увеличиваем счетчик итераций
    this.incCountIterate()
    // генерируем новое имя файла или паки
    const newName = this.generateData!.replaceName(writeData, generateName)

    if (type === 'file') {
      // const newPath = nodePath.join(generatePath, generateName)
      await this.createFile(writeData, generateName, path, newName)
    } else {
      // TODO сделать чтобы эту опцию можно было выбирать в конфиге
      // TODO заменять ли выбраным именем корневую папку генерации
      // берем из конфига заменять ли коревую папку генерации
      let isReplaceNameFolderConfig = Boolean(
        localConfig.isReplaceNameFolder || this.config.globalConfig.isReplaceNameFolder,
      )
      // если это первая итерация и в конфиге указано то-что папку заменяем,
      // то название папки будет соответствовать имени в конфиге
      const isReplaceNameFolder = isReplaceNameFolderConfig && this.countIterate === 1
      const rootFolder = nodePath.parse(writeData.path).name
      const name = isReplaceNameFolder ? generateName : rootFolder
      const newPath = nodePath.join(path, name)

      // TODO рекурсивно создавать если папок нет
      // создаем текущую папку
      await this.createFolder(newPath)
      // проходимся по файлам находящимся внутри папки
      writeData.data.map(async (nextData) => {
        // рекурсивно их читаем
        await this.writeData(localConfig, nextData, generateName, newPath)
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

  private async createFile(data: TData, generateName: string, path: string, newName: string) {
    if (data.type === 'file') {
      const replacedData = this.generateData!.replaceDataFile(data, generateName)
      const newPath = nodePath.join(path, newName.concat('.').concat(replacedData.ext))

      return await fs.writeFile(newPath, replacedData.data).catch((reason) => {
        log.error(`Error create file in path ${data.path}`)
        // .view(reason)
      })
    }
  }
}
