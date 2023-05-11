type TFlag = Record<string, Record<string, string | true | undefined>>

interface Flags {
  template: string[]
  name: string[]
  path: string[]
}
export interface ITemplate {
  templateName: string
  path: string
  flag: Flags
  names: string[]
}

export interface DataArg {
  pathConfig: string
  templates: (ITemplate | undefined)[]
}

interface TArg {
  data: DataArg
}

export class Arg implements TArg {
  data: DataArg = {
    pathConfig: '',
    templates: [],
  }
  constructor(private args: string[]) {
    this.split()
  }

  private split() {
    const [_node, _path, pathConfig, ...options] = this.args

    this.data.pathConfig = pathConfig

    const splitTemplates = options
      .join(' ')
      .split(',')
      .map((value) =>
        value
          .split(' ')
          .map((value) => value.trim())
          .filter((value) => value),
      )

    const data =
      splitTemplates.map((value) => {
        const [template, ...other] = value
        if (!template) return

        const flag: Flags = {
          template: [],
          name: [],
          path: [],
        }

        const names: string[] = []
        let path = ''

        other.map((value) => {
          if (value.includes('--')) {
            const slicedValue = value.slice(2)
            if (names.length === 0) {
              flag.template.push(slicedValue)
            } else if (!path) {
              flag.name.push(slicedValue)
            } else {
              flag.path.push(slicedValue)
            }
          } else if (value.includes('/')) {
            path = value
          } else {
            names.push(value)
          }
        })
        const dataTemplate: ITemplate = { templateName: template, flag, names, path }
        return dataTemplate
      }) || []

    this.data.templates = data
    return data
  }
}
