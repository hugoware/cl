
echo
echo deploying lessons
echo

# echo
echo cleaning...
rm -r .lessons/
mkdir .lessons/

echo rebuilding lessons...
node ./scripts/compile-all-lessons.js

# write an updated version for the file -- this will
# trigger an update on the server
echo $(eval date +%s) > ./dist/version

# rebuild resources
echo
echo copying...
gulp copy-lessons
sleep 4s

# remove junk files
echo cleaning up junk files
find .lessons/ -name ".DS_Store" -delete

echo
echo copying to server...
scp ./lessons/index.yml root@codelabschool.com:/srv/www/lessons/index.yml
rsync -ruv --chmod=ugo=rwX -e ssh .lessons/* root@codelabschool.com:/srv/www/lessons/
sleep 4s

echo
echo finished...
