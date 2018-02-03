#!/usr/bin/python2
#/**************************************************/
#/* MLH git mornitor                               */
#/*  Authors: Justin Li <juan.y.li@mail.mcgill.ca> */
#/*  date: Sat Feb  3 12:28:51 EST 2018            */
#/**************************************************/

import os
import sys
import platform
import json
import httplib

PORT = '3000'
HEADER = {"content-type": "application/json"}

url = 'localhost' #change this when the time is right 
post_fields = {"GIT" : "HOOKS"} #json file, where you put all the json data

def POST(url, post_fields):
	conn = httplib.HTTPConnection(url,PORT)
	conn.request('POST', "", json.dumps(post_fields), HEADER)
	response = conn.getresponse().status
	print "POST Request: ", response
from collections import Counter as Counter

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
    print(type(dic))
    print(dic)



ext(dirPath)

POST(url, post_fields)
