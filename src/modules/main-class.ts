import { Config } from './config-class.js'
import { GenerateTemplate } from './generate-template-class.js'
import { ReadTemplates } from './read.js'

export class Main {
  constructor(public mainProcess: NodeJS.Process) {}

  async read() {
    const config = new Config(this.mainProcess)

    await config.read()
    await this.init(config)
  }

  async init(config: Config) {
    const readTemplates = new ReadTemplates(config)
    const template = await readTemplates.findTemplate()

    // console.log(config.generateConfig)
    const generateTemplate = new GenerateTemplate(config)

    if (!template) return

    const dataTemplates = template.map(async (data) => {
      if (!data) return

      return await generateTemplate.write(data.generate)
    })

    const data = await Promise.all(dataTemplates)
    // console.log(data)
  }
}
