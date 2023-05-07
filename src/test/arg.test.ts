import { describe, expect } from 'vitest'
import { Arg } from '../modules/arg-class.js'
import { mockArgs } from './mock/args.js'

describe('Arg class', () => {
  test('Read args', () => {
    const arg = new Arg(mockArgs)

    expect(arg.data).toMatchObject({
      pathConfig: '/config/config.js',
      flags: { 'flag-template': true, 'flag-name': true, 'flag-path': true },
      typeTemplate: ['template-1', 'template-2'],
      fileName: ['name-1', 'name-2', 'name-space'],
      paths: ['./path-to-name-1', './path/to/name/2'],
    })
  })
})
