type TFlag = Record<string, string | true | undefined>

interface Flags extends TFlag {
  debug?: string | true
}

export interface DataArg {
  flags: Flags
  pathConfig: string
  fileName: string[]
  paths: string[]
  typeTemplate: string[]
}

interface TArg {
  data: DataArg
}

export class Arg implements TArg {
  data: DataArg = {
    pathConfig: '',
    flags: {},
    typeTemplate: [],
    fileName: [],
    paths: [],
  }
  constructor(private args: string[]) {
    this.split()
  }

  private split() {
    const [_node, _path, pathConfig, ...options] = this.args

    this.data.pathConfig = pathConfig

    let findName = false

    options.map((value, index, array) => {
      if (!value) return

      if (value.includes('--')) {
        const name = value.slice(2)
        this.data.flags[name] = true
      } else if (value.includes('/')) {
        this.data.paths.push(value)
      } else if (value.includes(':')) {
        findName = true
      } else {
        if (!findName) {
          this.data.typeTemplate.push(value)
        } else {
          this.data.fileName.push(value)
        }
      }
    })
  }
}
