import { describe, expect } from 'vitest'
import { Config } from '../modules/config-class.js'
import { ReadTemplates } from '../modules/read.js'
import { processMock } from './mock/process.js'

describe('ReadTemplates class', async () => {
  const config = new Config(processMock)
  const dataConfig = await config.read()
  test('ReadTemplates args', async () => {
    const readTemplates = new ReadTemplates(config)

    expect(dataConfig).toBeDefined()

    const dataTemplate = await readTemplates.findTemplate()

    expect(dataTemplate).matchSnapshot()
  })
})
