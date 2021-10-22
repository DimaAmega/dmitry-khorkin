const { series, src, dest } = require("gulp");
const markdown2html = require("gulp-markdown");
const mustache = require("gulp-mustache");
const prettier = require("gulp-prettier");
const rename = require("gulp-rename");
const Combine = require("stream-combiner2").obj;

const [PATH_TO_DATA, PATH_TO_DEST] = ["../data", "../../dist"];

function markdownToHtml(cb) {
  const pipeline = [src(`./md-dist/*.md`), markdown2html(), prettier()];

  Combine(pipeline).pipe(dest(PATH_TO_DEST)).on("end", cb);
}

function renderMarkdown(cb) {
  const pipeline = [
    src(`${PATH_TO_DATA}/*.mustache`),
    mustache(),
    rename((p) => (p.extname = ".md")),
  ];

  Combine(pipeline).pipe(dest("./md-dist")).on("end", cb);
}

const getAssets = series(renderMarkdown, markdownToHtml);

exports.default = series(getAssets);
