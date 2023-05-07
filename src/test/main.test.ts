import { describe } from 'vitest'
import { Main } from '../modules/main-class.js'
import { processTestMock } from './mock/process.js'

describe('Main class', () => {
  test('Main start', async () => {
    const main = new Main(processTestMock)
    await main.read()
    // console.log(main)
  })
})
