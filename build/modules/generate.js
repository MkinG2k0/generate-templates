import dirTree from 'directory-tree';
import fsx from 'fs-extra';
import fs from 'node:fs/promises';
import * as path from 'path';
import { error, success } from './logs.js';
export class Generate {
    constructor(args) {
        this.args = {
            pathConfig: './generate.json',
            templateName: '',
            files: [],
        };
        this.config = {
            templates: {},
        };
        this.paths = [];
        this.files = [];
        this.currTemplate = {
            template: '',
            generate: '',
        };
        this.configTemplate = {
            replaceName: '/FileName/gi',
        };
        this.args = args;
        this.parseJson();
    }
    async parseJson() {
        const { pathConfig } = this.args;
        const infoConfig = path.parse(pathConfig);
        if (infoConfig.ext === '.ts') {
        }
        else if (infoConfig.ext === '.json') {
            fsx
                .readJson(pathConfig)
                .then((packageObj) => {
                this.config = packageObj;
                this.readTemplate();
            })
                .catch((err) => {
                console.error(err);
            });
        }
        else {
            return error(`Not found ${pathConfig}`);
        }
    }
    genStructure(fileNames) {
        const genStructure = [];
        fileNames.map((name) => {
            var _a;
            if (name.includes('./')) {
                genStructure.push({ path: name, files: [] });
            }
            else {
                (_a = genStructure.at(-1)) === null || _a === void 0 ? void 0 : _a.files.push(name);
            }
        });
        return genStructure;
    }
    readTemplate() {
        var _a, _b;
        const templateName = this.args.templateName;
        const localConfig = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.templates) === null || _b === void 0 ? void 0 : _b[templateName];
        const globalConfig = { ...this.config, templates: undefined };
        this.configTemplate = { ...globalConfig, ...localConfig };
        if (this.configTemplate.template) {
            this.readTemplateFile(this.configTemplate.template);
        }
        else {
            error(`Template name "${templateName}" is not found, review your generate.json`);
        }
    }
    async readTemplateFile(currPath) {
        this.tree = dirTree(currPath, { attributes: ['type'] });
        if (this.tree) {
            const files = this.args.files;
            const filesStructure = this.genStructure(files);
            if (filesStructure.length > 0) {
                filesStructure.map(({ files, path }) => {
                    files.map((value) => this.read(this.tree, value, path));
                });
            }
            else {
                files.map((value) => this.read(this.tree, value));
            }
        }
        else {
            error(`Check template file in "${currPath}"`);
        }
    }
    async read(data, replaceName, relativePath) {
        for await (const value of (data === null || data === void 0 ? void 0 : data.children) || []) {
            await this.write(value, replaceName, relativePath);
            await this.read(value, replaceName, relativePath);
        }
    }
    async write(treeFile, replaceName, relativePath) {
        const { type } = treeFile;
        const newPath = this.replacePath(treeFile.path, replaceName, relativePath);
        if (type === 'directory') {
            await fsx.ensureDir(newPath);
        }
        else {
            const dataFile = await fs.readFile(treeFile.path).then((data) => data.toString());
            const dataRefactor = await this.refactorData(dataFile, replaceName);
            await fsx.outputFile(newPath, dataRefactor);
        }
        success(`Created in ${newPath}`);
    }
    replacePath(pathTempFile, replaceName, relativePath) {
        var _a, _b;
        const splitPath = (_a = this.configTemplate.generate) === null || _a === void 0 ? void 0 : _a.split('*');
        const startPath = (splitPath === null || splitPath === void 0 ? void 0 : splitPath[0]) || '';
        const endPath = (splitPath === null || splitPath === void 0 ? void 0 : splitPath[1]) || '';
        const genPath = path.join(startPath, relativePath || '/', endPath);
        const lastNameFolder = (_b = this.configTemplate.template) === null || _b === void 0 ? void 0 : _b.split('/').at(-1);
        const splitPth = pathTempFile.split('\\');
        const findIndexPath = splitPth.findIndex((data) => data === lastNameFolder);
        const slicePath = splitPth.slice(findIndexPath + 1).map((value) => this.refactorName(value, replaceName));
        const newPath = path.join(genPath, replaceName, ...slicePath);
        return newPath;
    }
    refactorName(name, replaceName) {
        var _a, _b;
        const parseName = path.parse(name);
        const replaceExtNames = (_a = this.configTemplate.replaceNameExt) === null || _a === void 0 ? void 0 : _a.find(([fileName, ext]) => name === fileName);
        const replaceExt = (_b = this.configTemplate.replaceExt) === null || _b === void 0 ? void 0 : _b.find(([replaceExt, currExt]) => parseName.ext === `.${replaceExt}`);
        let replacedName = parseName.name.replace(this.configTemplate.replaceName, replaceName);
        if (replaceExtNames) {
            replacedName = replacedName.concat(`.${replaceExtNames[1]}`);
        }
        else {
            const currExt = replaceExt ? `.${replaceExt[1]}` : parseName.ext;
            replacedName = replacedName.concat(currExt);
        }
        return replacedName;
    }
    async refactorData(data, replaceName) {
        const configReplaceName = this.configTemplate.replaceName;
        const regExpName = configReplaceName.includes('/') ? configReplaceName : new RegExp(configReplaceName || '', 'ig');
        const replacedData = data.replace(regExpName, replaceName);
        return replacedData;
    }
}
//# sourceMappingURL=generate.js.map