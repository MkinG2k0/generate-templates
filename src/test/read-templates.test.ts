import { describe, expect } from 'vitest'
import { Arg } from '../modules/arg-class.js'
import { Config } from '../modules/config-class.js'
import { ReadTemplates } from '../modules/read.js'
import { processMock } from './mock/process.js'

describe('ReadTemplates class', async () => {
  const arg = new Arg(processMock.argv)
  const path = processMock.cwd()
  const config = new Config(arg.data, path)
  const dataConfig = await config.read()

  test('ReadTemplates args', async () => {
    const readTemplates = new ReadTemplates(config)

    expect(dataConfig).toBeDefined()

    const dataTemplate = await readTemplates.findTemplate()

    expect(dataTemplate).matchSnapshot()
  })
})
