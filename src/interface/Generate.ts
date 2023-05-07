export interface Arguments {
  pathConfig: string
  replaceName?: string
  templateName: string
  files: string[]
}

export interface IConfig extends Global {
  templates: Record<string, TemplateItem>
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
  replaceName?: string
  register?: boolean
  template?: string
  generate?: string
  replaceNameExt?: [string, string][] // заменить расширение по имени файла
  replaceExt?: [string, string][] // заменить расширение
  debug?: boolean
}

// export interface FileData extends path.ParsedPath {
//   data?: string
//   fullPath: string
// }

// interface DataPath {
//   name: string
//   isFile: boolean
//   dir?: DataPath[]
// }

//
export interface GenStructure {
  path: string
  files: string[]
}
