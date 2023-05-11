import nodePath from 'path'
import { TemplateItem } from '../interface/templates-type.js'
import { ITemplate } from '../modules/arg-class.js'
import { Config } from './config-class.js'
import { log } from './logs-class.js'
import { Reader } from './reader-class.js'

export class ReadTemplates {
  constructor(public config: Config) {}

  // Существует ли путь до темлейтов который указан в конфиге
  async findTemplate() {
    // Достаем из аргументов название темлейтов ([page,comp])
    if (!this.config.args) return

    const find = this.config.args.templates.map(async (template) => {
      if (!template) {
        log.error(`Can not find template pls check console`).view(template)
        return
      }

      const { templateName } = template

      // Достаем по имени темлейта объект из конфига
      const localConfig = this.config.globalConfig?.templates?.[templateName]

      // Если нашли объект то значит что темлейт найден
      if (!localConfig) {
        // Если не нашли темлейт, то бросаем ошибку
        log.error(`Can not find config ${templateName} pls check template file`).view(template)
        return
      }

      // Инициализируем темлейт
      return await this.initTemplate(localConfig, template)
    })

    return Promise.all(find)
  }

  private async initTemplate(localConfig: TemplateItem, template: ITemplate) {
    // Путь до файлов в теплейте
    const pathToTemplate = nodePath.join(this.config.pathRun, localConfig.template)
    // Существует ли файл
    const isExists = await Reader.isExists(pathToTemplate)

    if (isExists) {
      return { localConfig, template }
    } else {
      // В противном случае бросаем ошибку
      log.error(`Can not find file to "${pathToTemplate}"`)
    }
  }
}
