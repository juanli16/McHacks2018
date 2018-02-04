#!/bin/sh


#git clone $1 "$(basename "$1")"
git clone "$1"

filename=$(basename ":$1")
file="${filename%.*}"

cd $file

#Downloading mlhhooks.py
wget https://github.com/juanli16/McHacks2018/blob/master/mlhhooks.py
#inject it inside .git/hooks/
mv mlhhooks.py .git/hooks/
dir=".git/hooks"
touch $dir/post-push
echo "#!/bin/sh" > $dir/post-push
echo "python mlhhooks.py" > $dir/post-push
echo "exit 0" > $dir/post-push



