#!/usr/bin/env node
import { Generate } from '../src/modules/generate.js'

const [_node, _path, generatePath, templateName, ...fileNames] = process.argv

const main = new Generate({
  pathConfig: generatePath,
  files: fileNames,
  templateName,
})
