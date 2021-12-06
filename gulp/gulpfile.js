const { series, parallel, src, dest } = require("gulp");
const del = require("del");
const markdown2html = require("gulp-markdown");
const mustache = require("gulp-mustache");
const prettier = require("gulp-prettier");
const rename = require("gulp-rename");
const Combine = require("stream-combiner2").obj;
const webpack = require("webpack-stream");
const cleanCSS = require("gulp-clean-css");
const flatten = require("gulp-flatten");
const concat = require("gulp-concat");

const [PATH_TO_DATA, PATH_TO_DIST, MD_DIST, IMAGES_FOLDER, COMMON, MODE] = [
  "../src",
  "../dist",
  "../md-dist",
  "images",
  "common",
  process.env.NODE_ENV ? process.env.NODE_ENV : "development",
];

function markdownToHtml(cb) {
  const pipeline = [src(`${MD_DIST}/**/*.md`), markdown2html(), prettier()];

  Combine(pipeline).pipe(dest(PATH_TO_DIST)).on("end", cb);
}

function renderMarkdown(cb) {
  const pipeline = [
    src(`${PATH_TO_DATA}/**/*.mustache`),
    mustache(),
    rename((p) => (p.extname = ".md")),
  ];

  Combine(pipeline).pipe(dest(MD_DIST)).on("end", cb);
}

function js(cb) {
  const pipeline = [
    src(`${PATH_TO_DATA}/static/js/main.js`),
    webpack({ mode: MODE }),
    rename((p) => (p.basename = COMMON)),
  ];

  Combine(pipeline).pipe(dest(PATH_TO_DIST)).on("end", cb);
}

function css(cb) {
  const pipeline = [
    src(`${PATH_TO_DATA}/static/css/main.css`),
    cleanCSS({ compatibility: "ie8" }),
    rename((p) => (p.basename = COMMON)),
  ];

  Combine(pipeline).pipe(dest(PATH_TO_DIST)).on("end", cb);
}

function images(cb) {
  del.sync(`${PATH_TO_DIST}/${IMAGES_FOLDER}`, { force: true });
  src(`${PATH_TO_DATA}/static/${IMAGES_FOLDER}/**/*`)
    .pipe(dest(`${PATH_TO_DIST}/${IMAGES_FOLDER}`))
    .on("end", cb);
}

function cssComponents(cb) {
  const pipeline = [
    src(`${PATH_TO_DATA}/components/**/*.css`),
    cleanCSS({ compatibility: "ie8" }),
    concat("components.css", { newLine: "" }),
  ];

  Combine(pipeline)
    .pipe(dest(`${PATH_TO_DIST}/components`))
    .on("end", cb);
}

function jsComponents(cb) {
  const pipeline = [
    src(`${PATH_TO_DATA}/components/*/*.js`),
    webpack({ mode: MODE }),
    rename((p) => (p.basename = "components")),
  ];

  Combine(pipeline)
    .pipe(dest(`${PATH_TO_DIST}/components`))
    .on("end", cb);
}

const getAssets = parallel(
  series(renderMarkdown, markdownToHtml),
  js,
  css,
  cssComponents,
  jsComponents,
  images
);

exports.default = series(getAssets);
