import { Arg } from './arg-class.js'
import { Config } from './config-class.js'
import { GenerateTemplate } from './generate-template-class.js'
import { ReadTemplates } from './read.js'

export class Main {
  pathRun: string
  arg: Arg
  config: Config

  constructor(mainProcess: NodeJS.Process) {
    this.pathRun = mainProcess.cwd()
    this.arg = new Arg(mainProcess.argv)
    this.config = new Config(this.arg.data, this.pathRun)
  }

  async read() {
    if (this.config) {
      await this.config.read()
      await this.init(this.config)
    }
  }

  private async init(config: Config) {
    const readTemplates = new ReadTemplates(config)
    const template = await readTemplates.findTemplate()

    const generateTemplate = new GenerateTemplate(config)
    generateTemplate.setGenerateData(this.arg)

    if (!template) return

    const dataTemplates = template.map(async (data) => {
      if (!data) return

      return await generateTemplate.write(data)
    })

    const data = await Promise.all(dataTemplates)
    // console.log(data)
  }
}
