# McHacks 2018

## Project name: MLH-hooks

## Objective:
The purpose of this git tool is to make organizing major hackathon events a breeze for organizers and sponsors, and also to help hackers to get the personalized help that they need easier. 

## Installation: 
Users can either clone this repo
```
git clone https://github.com/juanli16/McHacks2018.git
```

or to simply download the file **git-clone** to a directory
```
wget https://raw.githubusercontent.com/juanli16/McHacks2018/master/git-mlhclone
chmod +x git-mlhclone
```

Next, make sure your computer already has git installed.
Then, in the terminal simply run:
```
git mlclone <github-url>
```

And it will automatically download the file **mlhhooks.py** into your git repository directory/.git/hook/, as well as create a **pre-push** file.
Then, after each push to the remote directory, it will run these two files. 
Disclaimer: Please read through what these files do at least one to avoid unwanted behavior.

## What it does:
These git tool will collect the following information in your local directory in order to track your progress through the hackathon, as well as communicate mesages from organizers to hackers. 

* Programming language used
* API used
* Commit frequncies (from git log)

Then, on a remote server, one can visualize the all the information collected. 





