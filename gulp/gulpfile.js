const { series, parallel, src, dest } = require("gulp");
const del = require("del");
const markdown2html = require("gulp-markdown");
const mustache = require("gulp-mustache");
const prettier = require("gulp-prettier");
const rename = require("gulp-rename");
const Combine = require("stream-combiner2").obj;
const webpack = require("webpack-stream");
const miniCssExtractPlugin = require("mini-css-extract-plugin");

const [PATH_TO_DATA, PATH_TO_DIST, MD_DIST, IMAGES_FOLDER, MODE] = [
  "../src/data",
  "../dist",
  "../md-dist",
  "images",
  process.env.NODE_ENV ? process.env.NODE_ENV : "development",
];

function markdownToHtml(cb) {
  const pipeline = [src(`${MD_DIST}/*.md`), markdown2html(), prettier()];

  Combine(pipeline).pipe(dest(PATH_TO_DIST)).on("end", cb);
}

function renderMarkdown(cb) {
  const pipeline = [
    src(`${PATH_TO_DATA}/*.mustache`),
    mustache(),
    rename((p) => (p.extname = ".md")),
  ];

  Combine(pipeline).pipe(dest(MD_DIST)).on("end", cb);
}

function jscss(cb) {
  const pipeline = [
    src(`${PATH_TO_DATA}/static/js/main.js`),
    webpack({
      mode: MODE,
      plugins: [new miniCssExtractPlugin()],
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
    }),
    rename((p) => (p.basename = "bundle")),
  ];

  Combine(pipeline).pipe(dest(PATH_TO_DIST)).on("end", cb);
}

function images(cb) {
  del.sync(`${PATH_TO_DIST}/${IMAGES_FOLDER}`, { force: true });
  src(`${PATH_TO_DATA}/static/${IMAGES_FOLDER}/**/*`)
    .pipe(dest(`${PATH_TO_DIST}/${IMAGES_FOLDER}`))
    .on("end", cb);
}

const getAssets = parallel(
  series(renderMarkdown, markdownToHtml),
  jscss,
  images
);

exports.default = series(getAssets);
