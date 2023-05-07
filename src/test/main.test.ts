import { describe } from 'vitest'
import { Main } from '../modules/main-class.js'
import { processMock } from './mock/process.js'

describe('Arg class', () => {
  test('Read args', async () => {
    const main = new Main(processMock)
    await main.read()
    // console.log(main)
  })
})
