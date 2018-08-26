for script in $(ls ./dist/public/*.js); 
do
  echo compressing $script
  node --max-old-space-size=4096 /usr/local/bin/uglifyjs $script -mc passes=3,unsafe,keep_fargs=0 -o $script --timings 
done

# echo
# echo deploying codelab

# echo
# echo cleaning...
# rm -r ../dist
# mkdir dist

# echo
# echo rebuilding...
# # npm run compile-lesson
# gulp deploy

# echo
# echo compressing resources...
# gulp compress

# # special for app
# echo
# echo compressing app...
# node --max-old-space-size=4096 /usr/local/bin/uglifyjs ../dist/public/app.js -mc passes=3,unsafe,keep_fargs=0 -o ../dist/public/app.js --timings

# echo
# echo copying to server...
# # scp package.json root@codelabschool.com:/srv/www/codelab/
# # rsync -ruv --chmod=ugo=rwX -e ssh dist/* root@codelabschool.com:/srv/www/cl/dist/
# sleep 4s

# echo
# echo finished...