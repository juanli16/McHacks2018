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

try:
    oss= sys.platform
    dist = platform.dist()
    dirPath = os.getcwd()
    files = os.listdir(dirPath)
    files.sort()
except OSErro:
    print("Os error. Fatal, quitting!")


#if ".git" not in files:
#    print("Not a repo")

print(dirPath)
print(oss, dist)
print("Files and subdirectories in %s:\n " %dirPath)
print(files)

POST(url, post_fields)
