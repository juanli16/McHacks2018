#!/usr/bin/python2
#/**************************************************/
#/* MLH git mornitor                               */
#/*  Authors: Justin Li <juan.y.li@mail.mcgill.ca> */
#/*  date: Sat Feb  3 12:28:51 EST 2018            */
#/**************************************************/

import os
import sys
import platform

oss= sys.platform
dist = platform.dist()

dirPath = os.getcwd()

osname = os.name

print(dirPath)
print(oss, dist)
