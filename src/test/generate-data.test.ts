import { describe } from 'vitest'
import { Arg } from '../modules/arg-class.js'
import { Config } from '../modules/config-class.js'
import { GenerateData } from '../modules/generate-data.js'
import { Reader } from '../modules/reader-class.js'
import { processMock } from './mock/process.js'

describe('Gen data class', () => {
  const arg = new Arg(processMock.argv)
  const path = processMock.cwd()
  const config = new Config(arg.data, path)
  const generateData = new GenerateData(config, arg)

  const templateConfig = {
    path: '',
    flag: { name: [], path: [], template: [] },
    names: [],
    templateName: 'testName',
  }
  const localConfig = { generate: '', template: '', isReplaceNameFolder: true, afterCommand: '' }

  test('Gen ', async () => {
    //templates/page/index.md
    const reader = new Reader('/templates/page/index.md', { path })
    const data = await reader.read()
    const generate = new GenerateData(config, arg)
    generate.setLocalConfig(localConfig, templateConfig)
    const newData = generate.replaceDataFile(data!, 'testName')

    console.log('-----------------')
    console.log(newData)
  })
})
