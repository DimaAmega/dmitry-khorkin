#!/bin/sh
set -e
npm run gulp-assets

npm run local-server &

npm run nodemon -- --watch "./src/" \
        -e "md,css,mustache,js,json,html" \
        --exec "npm run gulp-assets"
