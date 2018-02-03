#!/usr/bin/python2
#/**************************************************/
#/* MLH git mornitor                               */
#/*  Authors: Justin Li <juan.y.li@mail.mcgill.ca> */
#/*  date: Sat Feb  3 12:28:51 EST 2018            */
#/**************************************************/

#Os stuff
import os
import sys
import platform
import shlex, subprocess
#Webstuff
import json
import httplib
#Useful packages8
from collections import Counter as Counter

PORT = '3000'
HEADER = {"content-type": "application/json"}

API = {
	"1":"NuanceMix"
		}

TECHNOLOGY = {
	"node_modules" : "NodeJS"
		}

PROGLANG = {
		"java" : "Java",
		"py" : "Python",
		"css" : "CSS",
		"cc" : "C++",
		"cpp": "C++",
		"c" : "C",
		"js": "JavaScript",
		"ts": "TypeScript",
		"html": "HTML",
		"pl": "Perl",
		"sh": "Shell"
		}

url = 'localhost' #change this when the time is right 
post_fields = {"GIT" : "HOOKS"} #json file, where you put all the json data

def POST(url, post_fields):
	conn = httplib.HTTPConnection(url,PORT)
	conn.request('POST', "", json.dumps(post_fields), HEADER)
	response = conn.getresponse().status
	print "POST Request: ", response

try:
    oss= sys.platform
    dist = platform.dist()
    dirPath = os.getcwd()
    files = os.listdir(dirPath)
except OSError:
    print("Os error. Fatal, quitting!")


#if ".git" not in files:
#    print("Not a repo")

#cd: os.chdir("path")

def ext(dirpath):
    """cd  to dirpath, recursively list all file names and append to
    a list. Then make a dictionary out of all the file extensions
    """
    try:
        os.chdir(dirpath)
        files = [name for root, dirs, files in os.walk("./") for name in files if "./.git" not in root ]
    except OSError:
        print("OS error. Fatal, quitting!")
    
    files = [os.path.splitext(os.path.basename(f))[1] for f in files]
    files = filter(None, files)
    files = [f[1:] for f in files]
    files.sort()
    dic = dict(Counter(files))
    return dic


def parse_gitlog(dirpath):
    try:
        os.chdir(dirpath)
    except OSError:
        print("OS error. Fatal, quitting!")
    
    GIT_COMMIT_FIELDS = ['id', 'author_name', 'author_email', 'date', 'message']
    GIT_LOG_FORMAT = ['%H', '%an', '%ae', '%ad', '%s']
    GIT_LOG_FORMAT = '%x1f'.join(GIT_LOG_FORMAT) + '%x1e'
    p = subprocess.Popen('git log --format="%s"' % GIT_LOG_FORMAT, shell=True,  stdout=subprocess.PIPE)
    (log, _) = p.communicate()
    log = log.strip('\n\x1e').split("\x1e")
    log = [row.strip().split("\x1f") for row in log]
    log = [dict(zip(GIT_COMMIT_FIELDS, row)) for row in log]
    return log

extension = ext(dirPath)
log = parse_gitlog(dirPath)

print("File extension dictionary----------------")
print(extension)
print("Processed git log------------------------")
print(log)
POST(url, post_fields)
