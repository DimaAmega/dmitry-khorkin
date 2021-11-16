#!/bin/sh
set -e

if [ $# -eq 0 ]
  then
    echo "The commit message is not specified"
    exit 1
fi

NODE_ENV=production npm run gulp-assets
git checkout gh-pages
ls | grep -v dist | xargs rm -rf
cp dist/* .
rm -rf dist
git add .
git commit -m "$1"
git checkout main
npm i