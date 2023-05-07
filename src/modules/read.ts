import nodePath from 'path'
import { TemplateItem } from '../interface/templates-type.js'
import { Config } from './config-class.js'
import { log } from './logs-class.js'
import { Reader } from './reader-class.js'

type TMidlware = (data: TemplateItem) => void

export class ReadTemplates {
  private currentTemplate?: TemplateItem
  private data: TemplateItem[] = []

  constructor(public config: Config) {}

  // Существует ли путь до темлейтов который указан в конфиге
  async findTemplate() {
    // Достаем из аргументов название темлейтов ([page,comp])
    if (!this.config.args) return

    const find = this.config.args.typeTemplate.map(async (type) => {
      // Достаем по имени темлейта объект из конфига
      this.currentTemplate = this.config.generateConfig?.templates[type]
      // Если нашли объект то значит что темлейт найден
      if (this.currentTemplate) {
        // Инициализируем темлейт
        return await this.initTemplate(this.currentTemplate)
      } else {
        // Если не нашли темлейт, то бросаем ошибку
        log.error(`Can not find config ${type} pls check template file`)
      }
    })

    return Promise.all(find)
  }

  async initTemplate(config: TemplateItem) {
    // Путь до файлов теплейте
    const pathToTemplate = nodePath.join(this.config.pathRun, config.template)
    // Существует ли файл
    const isExists = await Reader.isExists(pathToTemplate)

    if (isExists) {
      // Если файл найден, то его читаем
      // const generateTemplate = new GenerateTemplate(this.config)
      // await generateTemplate.read(pathToTemplate)
      this.data.push(config)
      return config
    } else {
      // В противном случае бросаем ошибку
      log.error(`Can not find file to "${pathToTemplate}"`)
    }
  }
}
