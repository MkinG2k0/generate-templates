import { describe, expect } from 'vitest'
import { Config } from '../modules/config-class.js'
import { processFailedMock, processMock } from './mock/process.js'

describe('Config class', async () => {
  test('Config success', async () => {
    const config = new Config(processMock)
    const dataConfig = await config.read()
    expect(dataConfig).matchSnapshot()
  })

  test('Config error path', async () => {
    const config = new Config(processFailedMock)
    const dataConfig = await config.read()
    expect(dataConfig).toBeUndefined()
  })
})
