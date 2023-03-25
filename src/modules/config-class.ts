import { Arg } from './arg-class.js'
import { Reader } from './reader-class.js'

interface TConfig {}

export class Config implements TConfig {
  constructor(args: string[]) {
    const arg = new Arg(args)
    // const log = new Log(Boolean(arg.data.flags?.debug))
    const reader = new Reader('./templates/comp', { isRecursive: true })
    reader.onFinish((data) => {
      console.log(data)
    })
  }
}
