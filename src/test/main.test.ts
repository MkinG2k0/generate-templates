import { describe } from 'vitest'
import { Main } from '../modules/main-class.js'
import { processMock } from './mock/process.js'

describe('Main class', () => {
  test('Main start', async () => {
    const main = new Main(processMock)
    await main.read()
    // console.log(main)
  })
})
