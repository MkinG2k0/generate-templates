// import fs from 'fs-extra'
import fs from 'node:fs/promises'
import fsx from 'fs-extra'
import * as path from 'path'
import { warn, error, success } from './logs.js'
import { FileData, TemplateItem, Config, Arguments, Init, Global } from '../interface/Generate.js'
import dirTree from 'directory-tree'

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
  globalConfig: Global = {}

  tree: dirTree.DirectoryTree<any> | undefined

  constructor(args: Arguments) {
    this.args = args
    this.parseJson()
  }

  async parseJson() {
    const {pathConfig} = this.args
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

  readTemplate() {
    const templateName = this.args.templateName

    // если нашли указанный templateName в generate.json
    this.globalConfig = {...this.config, ...this.config?.templates?.[templateName]}

    // console.log( this.globalConfig.template)

    if (this.globalConfig.template) {
      this.readTemplateFile(this.globalConfig.template)
    } else {
      error(`Template name "${templateName}" is not found, review your generate.json`)
    }
  }

  async readTemplateFile(currPath) {
    this.tree = dirTree(currPath, {attributes: ['type']})

    if (this.tree) {
      const files = this.args.files
      files.map((value) => this.read(this.tree, value))
    } else {
      error(`Check template file in "${currPath}"`)
    }
  }

  async read(data: dirTree.DirectoryTree<any> | undefined, replaceName: string) {
    for await (const value of data?.children || []) {
      // Записываем файл
      await this.write(value, replaceName)
      // Читаем
      await this.read(value, replaceName)
    }
  }

  async write(treeFile: dirTree.DirectoryTree<any>, replaceName: string) {
    const {type} = treeFile
    const newPath = this.replacePath(treeFile.path, replaceName)

    if (type === 'directory') {
      await fsx.ensureDir(newPath)
    } else {
      const dataFile = await fs.readFile(treeFile.path).then((data) => data.toString())

      const dataRefactor = await this.refactorData(dataFile, replaceName)

      await fsx.outputFile(newPath, dataRefactor)
    }

    success(`Created in ${newPath}`)
  }

  replacePath(pathTempFile: string, replaceName) {
    const genPath = this.globalConfig.generate || ''
    const tempName = this.args.templateName
    const splitPth = pathTempFile.split('\\')
    const findIndexPath = splitPth.findIndex((data) => data === tempName)
    const slicePath = splitPth.slice(findIndexPath + 1).map((value) => this.refactorName(value, replaceName))
    const newPath = path.join(genPath, replaceName, ...slicePath)

    console.log(newPath)
    return newPath
  }

  refactorName(name, replaceName: string) {
    return name.replace(this.globalConfig.replaceName!, replaceName)
  }

  async refactorData(data: string, replaceName) {
    const register = this.globalConfig.register ? 'g' : ''

    const regExpName = new RegExp(this.globalConfig.replaceName || '', `i${register}`)

    const replacedData = data.replace(regExpName, replaceName)
    return replacedData
  }
}

interface DataPath {
  name: string
  isFile: boolean
  dir?: DataPath[]
}

// await fs.readdir(currPath, (err, fileNames) => {
//   // Массив путей до файлов templates/test/*
//   fileNames.map((nameTemplate) => {
//     // Создание пути нового файла на основе имени файла и пути который указан в примере
//     const newFilePath = path.join(currPath, nameTemplate)
//     const pathData = path.parse(newFilePath)
//     pathFiles.push({ ...pathData, fullPath: newFilePath })
//   })
// })
//
// pathFiles.map((dataFile, index) => {
//   // Читаем данные по пути fullPath
//   fs.readFile(dataFile.fullPath, { encoding: 'utf-8' }, async (err, data) => {
//     // Записываем данные
//
//     await this.write({ ...dataFile, data: data.toString() })
//   })
// })
