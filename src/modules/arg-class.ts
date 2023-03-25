type TFlag = Record<string, string | true | undefined>

interface Flags extends TFlag {
  debug?: string | true
}

interface DataArg {
  flags: Flags
  otherOption: string[]
  paths: string[]
}

interface TArg {
  args: string[]
  data: DataArg
}

export class Arg implements TArg {
  data: DataArg = {
    flags: {},
    otherOption: [],
    paths: [],
  }

  constructor(public args: string[]) {
    this.split()
  }

  private split() {
    const [_node, _path, ...options] = this.args

    const isFlags: [string, string | true][] = []
    const paths: string[] = []
    const otherOption: string[] = []

    options.filter((value, index, array) => {
      if (value.includes('--')) {
        isFlags.push([value, array[index + 1] || true])
      } else if (value.includes('/')) {
        paths.push(value)
      } else {
        otherOption.push(value)
      }
    })

    const arrFlags = isFlags.map(([value, nextValue]) => [value.slice(2), nextValue])
    const flags = Object.fromEntries(arrFlags)

    this.data = {
      flags,
      otherOption,
      paths,
    }
  }
}
