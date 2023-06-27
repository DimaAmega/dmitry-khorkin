const { series, parallel, src, dest } = require('gulp')
const markdown2html = require('gulp-markdown')
const mustache = require('gulp-mustache')
const prettier = require('gulp-prettier')
const rename = require('gulp-rename')
const Combine = require('stream-combiner2').obj
const webpack = require('webpack-stream')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')

const [PATH_TO_DATA, PATH_TO_DIST, MD_DIST, IMAGES_FOLDER, COMMON, MODE] = [
  '../src',
  '../dist',
  '../md-dist',
  'images',
  'common',
  process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
]

if (MODE == 'development') {
  var data = require('./data/local.json')
}

if (MODE == 'production') {
  var data = require('./data/prod.json')
}

// haskell way
const createTask = ({ taskName = 'anonymous', s, d }, ...pipes) => {
  const cb = () => Combine(src(s), ...pipes, dest(d))
  Object.defineProperty(cb, 'name', { value: taskName })
  return cb
}

////////////////////////
//       TASKS
///////////////////////

const render2Markdown = createTask(
  {
    taskName: 'render2Markdown',
    s: `${PATH_TO_DATA}/**/*.mustache`,
    d: MD_DIST
  },
  mustache(data),
  rename({ extname: '.md' })
)

const markdown2Html = createTask(
  { taskName: 'markdown2Html', s: `${MD_DIST}/**/*.md`, d: PATH_TO_DIST },
  markdown2html(),
  prettier()
)

const js = createTask(
  { taskName: 'js', s: `${PATH_TO_DATA}/static/js/main.js`, d: PATH_TO_DIST },
  webpack({ mode: MODE }),
  rename({ basename: COMMON })
)

const css = createTask(
  {
    taskName: 'css',
    s: `${PATH_TO_DATA}/static/css/main.css`,
    d: PATH_TO_DIST
  },
  cleanCSS({ compatibility: 'ie8' }),
  rename({ basename: COMMON })
)

const cssComponents = createTask(
  {
    taskName: 'cssComponents',
    s: `${PATH_TO_DATA}/components/**/*.css`,
    d: `${PATH_TO_DIST}/components`
  },
  cleanCSS({ compatibility: 'ie8' }),
  concat('components.css', { newLine: '' })
)

const jsComponents = createTask(
  {
    taskName: 'jsComponents',
    s: `${PATH_TO_DATA}/components/**/*.js`,
    d: `${PATH_TO_DIST}/components`
  },
  webpack({ mode: MODE }),
  rename({ basename: 'components' })
)

const favicon = createTask({
  s: `${PATH_TO_DATA}/static/favicon.ico`,
  d: `${PATH_TO_DIST}`
})

const pdfs = createTask({
  s: `${PATH_TO_DATA}/static/*.pdf`,
  d: `${PATH_TO_DIST}`
})

const images = createTask({
  s: `${PATH_TO_DATA}/static/${IMAGES_FOLDER}/**/*`,
  d: `${PATH_TO_DIST}/${IMAGES_FOLDER}`
})

const getAssets = parallel(
  series(render2Markdown, markdown2Html),
  js,
  css,
  cssComponents,
  jsComponents,
  images,
  favicon,
  pdfs
)

exports.default = series(getAssets)
