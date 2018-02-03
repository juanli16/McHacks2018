#!/usr/bin/python2
#/**************************************************/
#/* MLH git mornitor                               */
#/*  Authors: Justin Li <juan.y.li@mail.mcgill.ca> */
#/*  date: Sat Feb  3 12:28:51 EST 2018            */
#/**************************************************/

import os
import sys
import platform
import git

try:
    oss= sys.platform
    dist = platform.dist()
    dirPath = os.getcwd()
    files = os.listdir(dirPath)
    files.sort()
except OSErro:
    print("Os error. Fatal, quitting!")


if ".git" not in files:
    print("Not a repo")

print(dirPath)
print(oss, dist)
print("Files and subdirectories in %s:\n " %dirPath)
print(files)

#cd: os.chdir("path")

