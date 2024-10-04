module.exports = {
  inputDir: './icon-font/icons', // (required)
  outputDir: './public/fonts/icon-font', // (required)
  fontTypes: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
  assetTypes: ['scss', 'css', 'html'],
  fontsUrl: '/fonts/icon-font',
  prefix: 'icon',
  name: 'IconFont',
  templates: {
    css: './icon-font/tmpl/css.hbs',
    scss: './icon-font/tmpl/scss.hbs',
    html: './icon-font/tmpl/html.hbs',
  },
  pathOptions: {
    html: './icon-font/demo/index.html',
    css: './icon-font/demo/icons.css',
    json: './icon-font/demo/icons.json',
    scss: './public/fonts/icon-font/icon-font.css',
  },
  formatOptions: { json: { indent: 2 } },
};
