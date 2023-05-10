export interface Arguments {
  pathConfig: string
  replaceFileName?: string
  replaceDataName?: string
  templateName: string
  files: string[]
}

export interface IConfig extends Global {
  templates?: Record<string, TemplateItem>
}

export interface Init {
  pathConfig: string
  templateName: string
  files: string[]
}

export interface TemplateItem extends Global {
  template: string
  generate: string
}

export interface Global {
  replaceFileName?: string // global replace name "FileName"
  replaceDataName?: string // global replace data name "FileName"
  template?: string // path to template
  generate?: string // path to generate
  replaceNameExt?: [string, string][] // заменить расширение по имени файла
  replaceExt?: [string, string][] // заменить расширение
  debug?: boolean
  afterCommand?: string
  isReplaceNameFolder?: boolean
}
