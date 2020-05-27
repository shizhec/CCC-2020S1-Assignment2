# @Author: Yizhou Zhu
# @Email:  yizzhu@student.unimelb.edu.au
# @Filename: daily_increase_state_level.py
# @Last modified by:   Yizhou Zhu
# @Last modified time: 2020-05-26


import urllib.request
from selenium import webdriver
import time
import re
from datetime import date
import json
from selenium.webdriver.chrome.options import Options
import couchdb
import os
import argparse


# make the script compatiable to other database and other nodes
parser = argparse.ArgumentParser(description='scrape the state level coronavirus data and upload to db')
parser.add_argument('--address',type = str,default="172.26.130.162")
parser.add_argument('--username',type = str,default= "admin")
parser.add_argument('--password',type = str,default = "password")
parser.add_argument('--database',type = str, default= "daily_increase")
args = parser.parse_args()

PATH = "http://"+args.username+":"+args.password+"@"+args.address+":5984/"

path = os.getcwd()

# use selenium to simulate a javascript enabled browser to get the data
options = Options()
options.headless = True
urlpage = 'https://covid-19-au.com/' 
driver = webdriver.Chrome(chrome_options=options,executable_path =path+'\chromedriver_win32\chromedriver.exe')

# get web page
driver.get(urlpage)
# execute script to scroll down the page
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
# sleep for 10s
time.sleep(10)

results = {}


# decode the required web page ,find the root and extract the number of matched column and rows
for i in range(2,10):
    index = i
    path = '//*[@id="root"]/div/div/div[4]/div[1]/div[2]/div[2]/div['+str(index)+']'
    result = driver.find_elements_by_xpath(path)
    daily_increase = result[0].text.split()
    state = daily_increase[0]
    results[state] = {}
    number_and_change = []
    for i in range(1,len(daily_increase)-1):
        if (re.match('\((.*?)\)',daily_increase[i])):
            continue
        try:
            number = re.search('\d+',daily_increase[i].replace(',',''))
            if (re.match('\((.*?)\)',daily_increase[i+1])):
                change = re.search('(\+|\-)\d+',daily_increase[i+1])
                compound = (int(number.group(0)),int(change.group(0)))
            else:
                compound = (int(number.group(0)),0)
            number_and_change.append(compound)
    
        except Exception as e:
            print("wrong length of the result")
    
    results[state]['Confirmed'] = number_and_change[0]
    results[state]['Deaths'] = number_and_change[1]
    results[state]['Cured'] = number_and_change[2]
    results[state]['Active'] = number_and_change[3]
    number = re.search('\d+',daily_increase[-1].replace(',',''))
    results[state]['Tested'] = int(number.group(0))

# use key date as the id for the daily increase
today = date.today()
key_date = today.strftime("%Y-%m-%d")
results['_id'] = key_date

# upload the result to couchdb

couch = couchdb.Server(PATH)
db = couch[args.database]
db.save(results)

print(results)

# save a copy at local directory to check
with open('new-'+key_date+".json","w+",encoding= "utf-8") as f:
    results = json.dump(results,f,indent=2)

driver.quit()
