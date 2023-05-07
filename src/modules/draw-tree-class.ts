import chalk from 'chalk'
import { LINE } from '../constant/line.js'
import { IFile, IFolder, Reader, TData } from './reader-class.js'

interface DrawTreeConfig {
  onFolder?: (data: IFolder, pagination: number) => void
  onFile?: (data: IFile, pagination: number, length: number, index: number) => void
}

export class DrawTree implements DrawTreeConfig {
  constructor(data: string | TData, { onFolder, onFile }: DrawTreeConfig) {
    this.onFile = onFile
    this.onFolder = onFolder

    if (typeof data === 'string') {
      const dataReader = new Reader(data, { isRecursive: true })
      dataReader.read().then((data) => {
        this.draw(data)
      })
    } else {
      this.draw(data)
    }
  }

  onFolder: DrawTreeConfig['onFolder'] = () => {}

  onFile: DrawTreeConfig['onFile'] = () => {}

  draw(data?: TData, pagination = 0, length = 0, index = 0) {
    if (!data) return
    if (data.type === 'file') {
      this.onFile?.(data, pagination, length, index)
    } else {
      this.onFolder?.(data, pagination)

      data.data
        .sort((a, b) => (a.type === 'folder' ? -1 : 1))
        .map((value, index, array) => {
          this.draw(value, pagination + 1, array.length, index)
        })
    }
  }
}

export const DrawDefault = (data: TData | string) => {
  const space = '  '
  const len = process.stdout.columns

  new DrawTree(data, {
    onFolder: ({ name }, pagination) => {
      const tab = space.concat(LINE.col).repeat(pagination)
      const dataLine = `──┬─ ${chalk.yellow(name)} `

      const line = tab.concat(dataLine)
      console.log(line)
    },
    onFile: ({ name, fileName, data }, pagination, length, index) => {
      const isLast = length - 1 === index
      const isFirst = index == 0
      const firstChar = isLast ? LINE.topRight.concat(LINE.row) : LINE.colRight.concat(LINE.row)
      const lastChar = isFirst ? LINE.botRight : isLast ? LINE.topLef : LINE.colLeft
      const tab = space
        .concat(LINE.col)
        .repeat(pagination - 1)
        .concat(isLast ? space.concat(LINE.topRight) : space.concat(LINE.colRight))

      const line = tab.concat('─').concat(` `).concat(chalk.cyan(fileName)).concat(' ')
      const dataFile = chalk.gray(
        data
          .replaceAll('\n', ' ')
          .slice(0, len - line.length)
          .concat('...'),
      )

      const arrFileExport = Array.from(data.matchAll(/export \w* \w*/g)).map(([value]) =>
        String(value.split(' ').at(-1)),
      )
      const dataFileExport = arrFileExport.join(', ')
      const arrFileImport = Array.from(data.matchAll(/import \w* \w*/g)).map(([value]) =>
        String(value.split(' ').at(1)),
      )
      const dataFileImport = arrFileImport.join(', ')
      // console.log(Array.from(data.matchAll(/export /g)).map((value) => ({ value: value[0] })))
      // const nextLine = '─'.repeat(process.stdout.columns - line.length - 1).concat(lastChar)
      // .concat(nextLine)
      const result = line
        .concat(arrFileImport.length > 0 ? `import: `.concat(chalk.green(dataFileImport).concat(' ')) : '')
        .concat(arrFileExport.length > 0 ? 'export: '.concat(chalk.grey(dataFileExport)) : '')
        .concat()
      console.log(result)
    },
  })
}
