const { series, parallel, src, dest } = require("gulp");
const del = require("del");
const markdown2html = require("gulp-markdown");
const mustache = require("gulp-mustache");
const prettier = require("gulp-prettier");
const rename = require("gulp-rename");
const Combine = require("stream-combiner2").obj;
const webpack = require("webpack-stream");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const [PATH_TO_DATA, PATH_TO_DIST, MD_DIST, IMAGES_FOLDER, COMMON, MODE] = [
  "../src",
  "../dist",
  "../md-dist",
  "images",
  "common",
  process.env.NODE_ENV ? process.env.NODE_ENV : "development",
];

if (MODE == "development") {
  var data = require("./data/local.json");
}

if (MODE == "production") {
  var data = require("./data/prod.json");
}

// haskell way
const createTask =
  ({ s, d }, ...pipes) =>
  () =>
    Combine(src(s), ...pipes, dest(d));

////////////////////////
//       TASKS
///////////////////////

const renderMarkdown = createTask(
  { s: `${PATH_TO_DATA}/**/*.mustache`, d: MD_DIST },
  mustache(data),
  rename({ extname: ".md" })
);

const markdownToHtml = createTask(
  { s: `${MD_DIST}/**/*.md`, d: PATH_TO_DIST },
  markdown2html(),
  prettier()
);

const js = createTask(
  { s: `${PATH_TO_DATA}/static/js/main.js`, d: PATH_TO_DIST },
  webpack({ mode: MODE }),
  rename({ basename: COMMON })
);

const css = createTask(
  { s: `${PATH_TO_DATA}/static/css/main.css`, d: PATH_TO_DIST },
  cleanCSS({ compatibility: "ie8" }),
  rename({ basename: COMMON })
);

const cssComponents = createTask(
  { s: `${PATH_TO_DATA}/components/**/*.css`, d: `${PATH_TO_DIST}/components` },
  cleanCSS({ compatibility: "ie8" }),
  concat("components.css", { newLine: "" })
);

const jsComponents = createTask(
  { s: `${PATH_TO_DATA}/components/**/*.js`, d: `${PATH_TO_DIST}/components` },
  webpack({ mode: MODE }),
  rename({ basename: "components" })
);

const favicon = createTask(
  { s: `${PATH_TO_DATA}/static/favicon.ico`, d: `${PATH_TO_DIST}` },
);

function images() {
  del.sync(`${PATH_TO_DIST}/${IMAGES_FOLDER}`, { force: true });

  const s = src(`${PATH_TO_DATA}/static/${IMAGES_FOLDER}/**/*`);
  const d = dest(`${PATH_TO_DIST}/${IMAGES_FOLDER}`);
  return s.pipe(d);
}

const getAssets = parallel(
  series(renderMarkdown, markdownToHtml),
  js,
  css,
  cssComponents,
  jsComponents,
  images,
  favicon
);

exports.default = series(getAssets);
