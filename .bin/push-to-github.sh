#!/bin/bash
echo "Push to github."
pwd
cp -r ./dist/* ../nthu-courses.github.io/
cd ../nthu-courses.github.io/
git add *
git commit -m "update"
git push
