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
import hashlib
import urllib2

PORT = '3000'
HEADER = {"content-type": "application/json"}

# grep 
API = {
    "ciscospark" : ["Cisco Spark"],
    "tensorflow" : ["Tensor Flow", "tensorflow"],
    "nuance" : ["Nuance"],
    "opencv" : ["OpenCV", "opencv2"],
    "numpy" : ["numpy"],
    "genetec" : ["Genetec"]
    }
# grep
TECHNOLOGY = {
    "nodejs" : "NodeJS",  #Look for package.json
    "django" : "Django",
    "ionic" : "Ionic",
    "angular.js" : "AngularJS",
    "ember.js" : "AngularJS",
    "mongodb" : "MongoDB"
    }

# find through files variable
PROGLANG = {
		"java" : "Java",
		#"py" : "Python",
		"css" : "CSS",
		"cc" : "C++",
		"cpp": "C++",
		"c" : "C",
		"js": "JavaScript",
		"ts": "TypeScript",
		"html": "HTML",
		"pl": "Perl",
		"sh": "Shell",
		"swift": "Swift",
                "cgi" : "CGI",
                "gradle" : "Gradle"
		}

IDE = {
		"nbproject"	: "NetBeans IDE",
		"eclipse.core" :  "Eclipse IDE",
		".sln" : "Visual Studio",
		".idea" : "IntelliJ IDEA",
		".xcodeproj" : "Xcode",
		"komodoproject" : "Komodo IDE",
	}

url = 'localhost:3000'
post_fields = {"GIT" : "HOOKS"} #json file, where you put all the json data

def POST(url, post_fields):
	params = json.dumps(post_fields)
        req = urllib2.Request('http://localhost:3000/hooks/push')
	req.add_header('Content-Type', 'application/json')
	response = urllib2.urlopen(req, params)
	print "___  ___ _      _   _   _   _             _        "
        print "|  \/  || |    | | | | | | | |           | |       "
        print "| .  . || |    | |_| | | |_| | ___   ___ | | _____ "
        print "| |\/| || |    |  _  | |  _  |/ _ \ / _ \| |/ / __|"
        print "| |  | || |____| | | | | | | | (_) | (_) |   <\__ \\"
        print "\_|  |_/\_____/\_| |_/ \_| |_/\___/ \___/|_|\_\___/"
        print "---------------------------------------------------"
	print response.read()



try:
    oss= sys.platform
    dist = platform.dist()
    dirPath = os.getcwd()
    files = os.listdir(dirPath)
except OSError:
    print("Os error. Fatal, quitting!")

def hash_id(dirpath):
    """Hash project name with md5
    """
    try:
        os.chdir(dirpath)
    except OSError:
        print("OS error. Fatal, quitting!")
    
    p = subprocess.Popen('basename `git rev-parse --show-toplevel`', shell=True,  stdout=subprocess.PIPE)
    (name, _) = p.communicate()
    ids = hashlib.md5(b'name')
    return  name, ids.hexdigest()


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
    """Using git log command on commandline to 
    parse log file and convert it to dictionary
    """
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
    


def search_api(api, proglang, dirpath):
    """Search each api string in all the files that has the extension in startword, the startword list will keep growing eventually.
    """
    api_dict = {}
    startword = ['c', 'cpp', 'h', 'hpp', 'cc', 'java', 'cs', 'js', 'gradle', 'css', 'html', 'sh', 'jsp', 'pl', 'rb', 'cgi', 'asp', 'swift', 'ts']
    #startword = proglang.keys()
    try:
        files = [(root, name) for root, dirs, files in os.walk(dirpath) for name in files if "./.git" not in root]
        files = [(p,f) for (p,f) in files for s in startword if f.endswith("."+s) ]
    except OSError:
        print("OS error. Fatal, quitting!")
    
    for k in api.keys():
        for (p,f) in files:
            src = p + "/" + f
            with open(src, "r") as f:
                lines = f.read()
                for a in api[k]:
                    if a in lines:
                        api_dict[k] = api[k]

    #Find all the file extensions  
    files = [os.path.splitext(os.path.basename(f))[1] for (p,f) in files]
    files = [f[1:] for f in files]
    files = filter(None, files)
    files.sort()
    dic = dict(Counter(files))
    lan = {}
    for k in dic.keys():
        lan[k] = proglang[k]

    return api_dict, lan

extension = ext(dirPath)
log = parse_gitlog(dirPath)
pro_name, ids = hash_id(dirPath)

api_dict, lang = search_api(API, PROGLANG,  dirPath)
post_fields['os'] = oss
post_fields['distro'] = dist
post_fields["name"] = pro_name
post_fields['id'] = ids
post_fields["commit"] = log
post_fields["ext"] = extension
post_fields["api"] = api_dict
post_fields["language"] = lang
POST(url, post_fields)

