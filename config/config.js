const config = {
  templates: {
    page: {
      template: 'templates/page',
      generate: 'generated/Pages/',
      // replaceExt: [['txt', 'tsx']],
      replaceDataName: /FileName/g,
    },
    test: {
      template: 'templates/test',
      generate: 'generated/test/',
    },
    comp: {
      template: 'templates/comp',
      generate: 'generated/Components/',
      replaceDataName: /FileName/g,
    },
  },
  replaceFileName: '${name}',
  replaceDataName: '${name}',
  replaceExt: [['txt', 'tsx']],
  replaceNameExt: [['FileName.txt', 'tsx']],
  debug: true,
}

export default config
