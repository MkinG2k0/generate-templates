import { describe } from 'vitest'
import { Main } from '../modules/main-class.js'
import { processTestMock } from './mock/process.js'

describe('Main class', () => {
  test('Main start', async () => {
    console.time('generated in')
    const main = new Main(processTestMock)
    await main.read()
    console.timeEnd('generated in')

    // console.log(main)
  })
})
