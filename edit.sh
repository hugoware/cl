if [ $# -lt 1 ]; then
  
	echo
	echo
  echo == WEB DEVELOPMENT =====
	ls ./lessons/content/ | grep "web_"
	echo
	echo
  echo == CODE =====
	ls ./lessons/content/ | grep "code_"
	echo

else
	echo Editing $1 ...
  echo "{\"folders\":[{ \"path\": \"./lessons/dictionary\" },{ \"path\": \"./lessons/content/$1\" },{ \"path\": \"./lessons/compiler\" }]}" > lessons.sublime-project
	rm lessons.sublime-workspace
	sleep 0.5
	subl lessons.sublime-project	
fi
