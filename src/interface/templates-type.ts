export interface IConfig extends Global {
  templates?: Record<string, TemplateItem>
  debug?: boolean
}

export interface TemplateItem extends Global {
  template: string
  generate: string
}

export interface Global {
  afterCommand?: string
  isReplaceNameFolder?: boolean
}
