@echo off
call next build
cd out
type nul > .nojekyll
cd ..
call gh-pages -d out -t true 