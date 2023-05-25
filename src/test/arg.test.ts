import { describe } from 'vitest'
import { Arg } from '../modules/arg-class.js'
import { mockArgs } from './mock/args.js'

describe('Arg class', () => {
  const arg = new Arg(mockArgs)
  test('Read args', () => {
    console.log(arg.data.templates[0])
    console.log(arg.data.templates[1])
    // expect(arg.data).toMatchObject({
    //   pathConfig: '/config/config.js',
    //   templates: [
    //     {
    //       templateName: 'tempName',
    //       flag: {
    //         template: ['flagTemplate'],
    //         name: ['flagName'],
    //         path: ['flagPath'],
    //       },
    //       names: ['nameGenerate', 'nameGenerate-2'],
    //       path: './pathTo/',
    //     },
    //     {
    //       templateName: 'tempName2',
    //       flag: {
    //         template: ['flagTemplate'],
    //         name: ['flagName'],
    //         path: ['flagPath'],
    //       },
    //       names: ['nameGenerate', 'nameGenerate-2'],
    //       path: './pathTo/',
    //     },
    //   ],
    // })
  })
})
