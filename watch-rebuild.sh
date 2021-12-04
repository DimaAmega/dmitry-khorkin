#!/bin/sh
set -e
npm run gulp-assets

nodemon --watch "./src/data" \
        -e "md,css,mustache,js,json,html" \
        --exec "npm run gulp-assets"