import urllib.request
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import couchdb
import re
from datetime import date
import json
# import pandas as pd

urlpage = 'https://covid-19-au.com/' 
driver = webdriver.Chrome('C:\Program Files\chromedriver_win32\chromedriver')

# get web page
driver.get(urlpage)
# execute script to scroll down the page
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
# sleep for 30s
time.sleep(10)

results = {}

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
                compound = (number.group(0),change.group(0))
            else:
                compound = (number.group(0),"+0")
            number_and_change.append(compound)
    
        except Exception as e:
            print("wrong length of the result")
    
    results[state]['Confirmed'] = number_and_change[0]
    results[state]['Deaths'] = number_and_change[1]
    results[state]['Cured'] = number_and_change[2]
    results[state]['Active'] = number_and_change[3]
    results[state]['Tested'] = daily_increase[-1]

today = date.today()
key_date = today.strftime("%d-%m-%Y")

couch = couchdb.Server('http://admin:password@172.26.130.162:5984/')
db = couch['daily_increase']

doc_id,doc_rev= db.save(results)
doc = db[doc_id]
doc['_id'] = key_date 
db[doc_id] = doc


with open(key_date+".json","w+",encoding= "utf-8") as f:
    results = json.dump(results,f,indent=2)









driver.quit()


# driver.get("https://covid-19-au.com/")

# html = driver.page_source
# soup = BeautifulSoup(html,features="lxml")

# print(soup)
# numbers = soup.find_all("root")
# # print(numbers)