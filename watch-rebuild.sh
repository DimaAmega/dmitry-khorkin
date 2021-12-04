#!/bin/sh
set -e
npm run gulp-assets

nodemon --watch "./src/data" \
        -e "md,css,mustache,js,json" \
        --exec "npm run gulp-assets"