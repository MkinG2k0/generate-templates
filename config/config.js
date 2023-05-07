const config = {
  templates: {
    page: {
      template: 'templates/page',
      generate: 'generated/Pages/',
      // replaceExt: [['txt', 'tsx']],
      replaceDataName: /FileName/g,
    },
    comp: {
      template: 'templates/comp',
      generate: 'generated/Components',
    },
  },
  replaceFileName: '{name}',
  replaceDataName: 'fileName',
  // replaceExt: [['txt', 'tsx']],
  replaceNameExt: [['FileName.txt', 'tsx']],
  debug: true,
}

export default config
