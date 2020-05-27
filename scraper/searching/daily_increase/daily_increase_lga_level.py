# @Author: Yizhou Zhu
# @Email:  yizzhu@student.unimelb.edu.au
# @Filename: daily_increase_lga_level.py
# @Last modified by:   Yizhou Zhu
# @Last modified time: 2020-05-26

# This file is just a frame work developed for scraping the coronavirus data on www.dhhs.vic.gov.au
# It is not a runnable file and will get modified frequently to handle daily report from the officials

import urllib.request
from selenium import webdriver
import time
import re
from datetime import date
import json
from selenium.webdriver.chrome.options import Options
import couchdb
import os




path = os.getcwd()

# use selenium to simulate a javascript enabled browser to get the data
options = Options()
options.headless = True
urlpage = 'https://www.dhhs.vic.gov.au/coronavirus-update-victoria-friday-1-may'
driver = webdriver.Chrome(chrome_options=options,executable_path =path+'\chromedriver_win32\chromedriver.exe')


# get web page
driver.get(urlpage)
# execute script to scroll down the page
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
# sleep for 10s
time.sleep(10)

results = {}
results["_id"] = "2020-05-01"

# To judge whether the string has a number in it
def hasNumbers(inputString):
    return any(char.isdigit() for char in inputString)



# find the root and extract the number of matched column and rows
# for i in range(1,72):
path = '//*[@id="page-content"]/div/section/div/article/div/div/div/div[2]/div/div/div/div/div/p[26]'
result = driver.find_elements_by_xpath(path)
print(result)
lga_increase = result[0]
print(lga_increase.get_attribute("attribute name"))
    # if not hasNumbers(lga_increase[1]):
    #     lga_name = lga_increase[0]+"_"+lga_increase[1]
    #     try:
    #         number = re.search('\d+',lga_increase[2])
    #     except:
    #         print(lga_increase)
    #     confirmed = int(number.group(0))
    #     if len(lga_increase) == 4:
    #         number = re.search('\d+',lga_increase[3])
    #         active_cases = int(number.group(0))
    #     else:
    #         active_cases = 0
    # else:
    #     lga_name = lga_increase[0]
    #     number = re.search('\d+',lga_increase[1])
    #     confirmed = int(number.group(0))
    #     if len(lga_increase) == 3:
    #         number = re.search('\d+',lga_increase[2])
    #         active_cases = int(number.group(0))
    #     else:
    #         active_cases = 0

    # results[lga_name] = [confirmed,active_cases]

# with open(results["_id"]+".json","w+",encoding="utf-8") as f:
#     json.dump(results,f,indent=2)

driver.quit()

   
