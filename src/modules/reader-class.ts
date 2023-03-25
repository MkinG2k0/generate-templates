import fs from 'node:fs/promises'
import node_path from 'path'

interface TReaderParams {
  isRecursive?: boolean
}

type TPath = string

type TDataType = 'file' | 'folder'

interface IStructure<T extends TDataType, Data> {
  name: string
  path: string
  type: T
  data: Data
}

interface IFile extends IStructure<'file', string> {}

interface IFolder extends IStructure<'folder', TData[]> {}

type TData = IFile | IFolder

type TDataArr = TData | TData[]

type TDataReader = Partial<TData>

type TCall = (data: TData) => void

interface TReader {
  params?: TReaderParams
  data: TData
  path: TPath
  // callBacks: TCall[]
}

export class Reader implements TReader {
  readonly data: TData = {
    name: '',
    type: 'folder',
    path: '',
    data: [],
  }
  private iteration: number = 0
  private callBacks: TCall[] = []

  constructor(public path: string, public params?: TReaderParams) {
    this.init().then(() => {
      this.callFunc()
    })
  }

  onFinish(call: TCall | any) {
    this.callBacks.push(call)
  }

  private callFunc() {
    this.callBacks.map((func) => func(this.data))
  }

  private async init() {
    const isExist = await this.isExists(this.path)

    if (isExist) {
      await this.read(this.data, this.path)
    } else {
      console.error(`Not found path "${this.path}"`)
    }
  }

  private async read(data, path: string) {
    const isFile = await this.isFile(path)

    if (!this.params?.isRecursive && this.iteration > 0) {
      return
    }

    this.iteration += 1

    if (isFile) {
      const dataFile = await this.readFile(path)
      this.createData(data, path, 'file', dataFile.toString())
    } else {
      this.createData(data, path, 'folder', [])

      await this.mapFolders(data, path)
    }
  }

  private async mapFolders(data: TData | any, path: string) {
    const folders = await this.readDir(path)
    const arrPromise = folders.map(async (name) => {
      const relativePath = './'.concat(node_path.join(path, name))

      // data.data[name] = {}
      // await this.read(data.data[name], relativePath)
      const obj = {}
      data.data.push(obj)
      await this.read(obj, relativePath)
    })
    await Promise.all(arrPromise)
  }

  private createData(obj: TData, path: string, type: TDataType, data: string | TData[]) {
    const { name, ext } = node_path.parse(path)

    obj.name = name.concat(ext)
    obj.type = type
    obj.path = path
    obj.data = data
  }

  private async readFile(path: string) {
    return await fs.readFile(path)
  }

  private async readDir(path: string) {
    return await fs.readdir(path)
  }

  private async isFile(path: string) {
    return (await fs.lstat(path)).isFile()
  }

  private async isExists(path: string) {
    let exist: boolean = false

    await fs
      .access(path)
      .then(() => {
        exist = true
      })
      .catch(() => {
        exist = false
      })

    return exist
  }
}
