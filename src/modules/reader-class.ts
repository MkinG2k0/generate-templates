import fs from 'node:fs/promises'
import node_path from 'path'

interface TReaderParams {
  isRecursive?: boolean
  path?: string
}

type TPath = string

type TDataType = 'file' | 'folder'

interface IStructure<T extends TDataType, Data> {
  name: string
  path: string
  ext: string
  type: T
  data: Data
}

export interface IFile extends IStructure<'file', string> {
  fileName: string
}

export interface IFolder extends IStructure<'folder', TData[]> {}

export type TData = IFile | IFolder

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
    ext: '',
    data: [],
  }
  private iteration: number = 0

  constructor(public path: string, public params?: TReaderParams) {
    this.path = params?.path ? node_path.join(params.path, path) : path
  }

  static async isExists(path: string) {
    return await fs
      .access(path)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async readFile(path: string) {
    return await fs.readFile(path)
  }

  async readDir(path: string) {
    return await fs.readdir(path)
  }

  async isFile(path: string) {
    return (await fs.lstat(path)).isFile()
  }

  async read(): Promise<TData | undefined> {
    const isExist = await Reader.isExists(this.path)

    if (!isExist) {
      console.error(`Not found path "${this.path}"`)
    }
    await this.readData(this.data, this.path)
    return this.data
  }

  private async readData(data, path: string) {
    const isFile = await this.isFile(path)

    if (isFile) {
      const dataFile = await this.readFile(path)
      this.createData(data, path, 'file', dataFile.toString())
    } else {
      this.createData(data, path, 'folder', [])

      await this.mapFolders(data, path)
    }
  }

  private async mapFolders(data: TData | any, path: string) {
    if (!this.params?.isRecursive && this.iteration > 0) {
      return
    }

    this.iteration += 1

    const folders = await this.readDir(path)
    const arrPromise = folders.map(async (name) => {
      const relativePath = node_path.join(path, name)

      const obj = {}
      data.data.push(obj)
      await this.readData(obj, relativePath)
    })
    await Promise.all(arrPromise)
  }

  private createData(obj: TData, path: string, type: TDataType, data: string | TData[]) {
    const { name, ext } = node_path.parse(path)

    obj.type = type
    obj.name = name
    obj.ext = ext.slice(1)
    obj.path = path
    obj.data = data
    if (obj.type === 'file') {
      obj.fileName = name.concat(ext)
    }
  }
}
