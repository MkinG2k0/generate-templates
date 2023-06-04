import { describe } from 'vitest'
import { Cli } from '../modules/cli.js'

describe('Cli class', () => {
  const cli = new Cli([{ title: 'вопрос', type: 'string' }])
  test('Read args', () => {
    cli.start()
  })
})
