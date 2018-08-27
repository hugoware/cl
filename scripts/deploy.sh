SCRIPTS="app browser site"
WORKERS="html pug scss"

echo
echo deploying codelab
echo
echo "Don't forget! If you changed worker files, they won't be used unless you run 'npm run deploy -- --include-workers'"

echo
echo cleaning...
rm -r ./dist
mkdir dist

# write an updated version for the file -- this will
# trigger an update on the server
echo $(eval date +%s) > ./dist/version

# rebuild resources
echo
echo rebuilding...
# npm run compile-lesson

# needs to update workers
if [[ $* == *--include-workers* ]]
then
  gulp compile-worker-scripts
fi

gulp deploy


echo
echo compressing resources...
gulp compress

# special for app
echo
echo compressing scripts \(this part takes a while\)

# compile the commonly changed scripts
for script in $SCRIPTS
do  
  echo compressing $script
  node --max-old-space-size=4096 /usr/local/bin/uglifyjs ./dist/public/$script.js -mc passes=3,unsafe -o ./dist/public/$script.js --timings 
done

# check if compiling the workers too
if [[ $* == *--include-workers* ]]
then
  for script in $WORKERS
  do  
    echo compressing $script
    node --max-old-space-size=4096 /usr/local/bin/uglifyjs ./dist/public/$script.js -mc passes=1,unsafe -o ./cache/workers/$script.js --timings 
  done
fi

# copy the compressed workers
for script in $WORKERS
do
  echo copying $script \(cached\)
  cp ./cache/workers/$script.js ./dist/public/$script.js
done

echo
echo copying to server...
scp package.json root@codelabschool.com:/srv/www/cl/
rsync -ruv --chmod=ugo=rwX -e ssh dist/* root@codelabschool.com:/srv/www/cl/dist/
sleep 4s

echo
echo finished...
