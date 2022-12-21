import { Generate } from './modules/generate.js'

const [_node, _path, generatePath, templateName, ...fileNames] = process.argv

// console.log(generatePath, templateName, ...fileNames)
// console.log(process.argv)

const gen = new Generate({
  pathConfig: generatePath,
  files: fileNames,
  templateName,
  replaceName: 'FileName',
})
// Read({ templateName, fileNames, nameJson, FileName, lowCase_fileName, pathGenerate })
