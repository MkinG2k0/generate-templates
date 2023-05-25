import { describe, expect } from 'vitest'
import { Arg } from '../modules/arg-class.js'
import { Config } from '../modules/config-class.js'
import { GenerateTemplate } from '../modules/generate-template-class.js'
import { realTestArgs } from './mock/args.js'
import { processMock } from './mock/process.js'

describe('Template class', async () => {
  const arg = new Arg(realTestArgs)
  const config = new Config(arg.data, processMock.cwd())
  await config.read()
  const template = new GenerateTemplate(config)
  template.setGenerateData(arg)
  test('Template args', async () => {
    const data = await template.write({
      localConfig: {
        template: 'templates/test',
        generate: 'generated/test/',
      },
      template: {
        templateName: 'tempName',
        flag: {
          template: ['flagTemplate'],
          name: ['flagName'],
          path: ['flagPath'],
        },
        names: ['nameGenerate', 'nameGenerate-2'],
        path: './pathTo/',
      },
    })

    expect(data).toBeTruthy()
  })
})
