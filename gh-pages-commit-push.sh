#!/bin/sh
set -e

if [ $# -eq 0 ]
  then
    echo "The commit message is not specified"
    exit 1
fi

NODE_ENV=production npm run gulp-assets
git checkout gh-pages
# rm all files
ls | grep -v ^dist | xargs rm -rf
# copy dist
cp -r dist/ . && rm -rf dist
# create commit and push
git add . && git commit -m "$1" && git push
# return back
git checkout main && npm i
