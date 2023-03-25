// import fs from 'fs-extra'
import dirTree from 'directory-tree'
import fsx from 'fs-extra'
import fs from 'node:fs/promises'
import * as path from 'path'
import { Arguments, Config, GenStructure, Global, Init, TemplateItem } from '../interface/Generate.js'
import { error, Log, success } from './logs-class.js'

export class Generate {
  args: Init = {
    pathConfig: './generate.json',
    templateName: '',
    files: [],
  }
  config: Config = {
    templates: {},
  }
  paths: string[] = []
  files: string[] = []
  currTemplate: TemplateItem = {
    template: '',
    generate: '',
  }
  configTemplate: Global = {
    replaceName: 'FileName',
  }
  logs: Log | undefined

  tree: dirTree.DirectoryTree<any> | undefined

  constructor(args: Arguments) {
    this.args = args

    this.parseJson()
  }

  // Парсинг generate.json
  async parseJson() {
    const { pathConfig } = this.args

    const infoConfig = path.parse(pathConfig)

    // TODO ignore js ts file
    if (infoConfig.ext === '.ts') {
      // await new Promise<{ default: Config }>(async (resolve, reject) => {
      //   const data = await import('../../' + pathConfig)
      //   resolve(data)
      // }).then((data) => {
      //   this.config = data.default
      // })
    } else if (infoConfig.ext === '.json') {
      fsx
        .readJson(pathConfig)
        .then((packageObj) => {
          this.config = packageObj
          this.readTemplate()
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      return error(`Not found ${pathConfig}`)
    }
  }

  genStructure(fileNames: string[]) {
    const genStructure: GenStructure[] = []

    fileNames.map((name) => {
      if (name.includes('./')) {
        genStructure.push({ path: name, files: [] })
      } else {
        genStructure.at(-1)?.files.push(name)
      }
    })

    return genStructure
  }

  // Чтение generate.json
  readTemplate() {
    const templateName = this.args.templateName

    // если нашли указанный templateName в generate.json
    const localConfig = this.config?.templates?.[templateName]
    const globalConfig = { ...this.config, templates: undefined }
    this.configTemplate = { ...this.configTemplate, ...globalConfig, ...localConfig }

    this.logs = new Log(this.configTemplate.debug)

    if (this.configTemplate.template) {
      this.readTemplateFile(this.configTemplate.template)
    } else {
      error(`Template name "${templateName}" is not found, review your generate.json`)
    }
  }

  // Чтение файлов из generate
  async readTemplateFile(currPath) {
    this.tree = dirTree(currPath, { attributes: ['type'] })

    if (this.tree) {
      const files = this.args.files
      const filesStructure = this.genStructure(files)

      if (filesStructure.length > 0) {
        filesStructure.map(({ files, path }) => {
          files.map((value) => this.read(this.tree, value, path))
        })
      } else {
        files.map((value) => this.read(this.tree, value))
      }
    } else {
      error(`Check template file in "${currPath}"`)
    }
  }

  // Чтение структуры из dirTree
  async read(data: dirTree.DirectoryTree<any> | undefined, replaceName: string, relativePath?: string) {
    for await (const value of data?.children || []) {
      // Записываем файл
      await this.write(value, replaceName, relativePath)
      // Читаем
      await this.read(value, replaceName, relativePath)
    }
  }

  // Запись файлов из template
  async write(treeFile: dirTree.DirectoryTree<any>, replaceName: string, relativePath?: string) {
    const { type } = treeFile
    const newPath = this.replacePath(treeFile.path, replaceName, relativePath)

    if (type === 'directory') {
      await fsx.ensureDir(newPath)
    } else {
      const dataFile = await fs.readFile(treeFile.path).then((data) => data.toString())

      const dataRefactor = await this.refactorData(dataFile, replaceName)

      await fsx.outputFile(newPath, dataRefactor)
    }

    success(`Created in "${newPath}"`)
  }

  // Генерация пути для сгенерированных файлов
  replacePath(pathTempFile: string, replaceName, relativePath?: string) {
    const splitPath = this.configTemplate.generate?.split('*')
    const startPath = splitPath?.[0] || ''
    const endPath = splitPath?.[1] || ''
    const genPath = path.join(startPath, relativePath || '/', endPath)

    const lastNameFolder = this.configTemplate.template?.split('/').at(-1)
    const splitPth = pathTempFile.split('\\')
    //
    const findIndexPath = splitPth.findIndex((data) => data === lastNameFolder)

    const slicePath = splitPth.slice(findIndexPath + 1).map((value) => this.refactorName(value, replaceName))
    const newPath = path.join(genPath, replaceName, ...slicePath)

    return newPath
  }

  // Манипуляции с заменой символов в имени файла
  refactorName(name, replaceName: string) {
    const parseName = path.parse(name)
    const replaceExtNames = this.configTemplate.replaceNameExt?.find(([fileName, ext]) => name === fileName)
    const replaceExt = this.configTemplate.replaceExt?.find(
      ([replaceExt, currExt]) => parseName.ext === `.${replaceExt}`,
    )

    let replacedName = parseName.name.replace(this.configTemplate.replaceName!, replaceName)

    if (replaceExtNames) {
      replacedName = replacedName.concat(`.${replaceExtNames[1]}`)
    } else {
      const currExt = replaceExt ? `.${replaceExt[1]}` : parseName.ext
      replacedName = replacedName.concat(currExt)
    }
    return replacedName
  }

  // Замена слова FileName внутри файла
  async refactorData(data: string, replaceName) {
    const configReplaceName = this.configTemplate.replaceName!
    // Проверка если в заменяемом имени есть "/" то значит что это RegExp формат если его нет то мы делаем его сами
    const regExpName = configReplaceName.includes('/') ? configReplaceName : new RegExp(configReplaceName || '', 'ig')
    const replacedData = data.replace(regExpName, replaceName)

    return replacedData
  }
}
