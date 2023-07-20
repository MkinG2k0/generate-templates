module.exports = {
  templates: {
    page: {
      template: 'templates/page',
      generate: 'generated/Pages/',
      replaceNameFolder: false,
    },
    test: {
      template: 'templates/test',
      generate: 'generated/test/',
      afterCommand: 'eslint --fix ./${path_generate}**/*.ts*',
    },
    comp: {
      template: 'templates/comp',
      generate: 'generated/Components/',
    },
  },
  debug: true,
  isReplaceNameFolder: true,
}
