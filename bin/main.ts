#!/usr/bin/env node

import { Config } from '../src/modules/config-class.js'

// const main = new Generate({
//   pathConfig: generatePath,
//   files: fileNames,
//   templateName,
// })

new Config(process.argv)
