import { describe, expect } from 'vitest'
import { Arg } from '../modules/arg-class.js'
import { Config } from '../modules/config-class.js'
import { processFailedMock, processMock } from './mock/process.js'

describe('Config class', async () => {
  test('Config success', async () => {
    const arg = new Arg(processMock.argv)
    const path = processMock.cwd()
    const config = new Config(arg.data, path)
    const dataConfig = await config.read()
    expect(dataConfig).matchSnapshot()
  })

  test('Config error path', async () => {
    const arg = new Arg(processFailedMock.argv)
    const path = processMock.cwd()
    const config = new Config(arg.data, path)
    const dataConfig = await config.read()
    expect(dataConfig).matchSnapshot()
  })
})
