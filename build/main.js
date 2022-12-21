import { Generate } from './modules/generate.js';
const [_node, _path, generatePath, templateName, ...fileNames] = process.argv;
const gen = new Generate({
    pathConfig: generatePath,
    files: fileNames,
    templateName,
    replaceName: 'FileName',
});
//# sourceMappingURL=main.js.map