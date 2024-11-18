@echo off
mkdir C:\temp 2>nul
set GH_PAGES_CACHE=C:\temp
call next build
cd out
type nul > .nojekyll
cd ..
call gh-pages -d out -t true --cacheDir C:\temp 