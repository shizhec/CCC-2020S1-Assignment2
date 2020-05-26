# @Author: Yizhou Zhu
# @Email:  yizzhu@student.unimelb.edu.au
# @Filename: daily_increase_lga_level.py
# @Last modified by:   Yizhou Zhu
# @Last modified time: 2020-05-26

# As the scrape the tweets for a username is a real-time job, the scraped data should be upload to the database immediately

import GetOldTweets3 as getter
import json
import couchdb
from label import label_sentiment
import argparse

# use argparse to make the script customizable for different arguments
parser = argparse.ArgumentParser(description='COMP90024 / get tweet via coordinate location,upload the tweets to the couchdb')
parser.add_argument('--address',type = str,default="127.0.0.1")
parser.add_argument('--username',type = str,default= "admin")
parser.add_argument('--password',type = str,default = "password")
parser.add_argument('--database',type = str, default= "username_realdonaldtrump")
parser.add_argument('--Tusername', type=str, default="realDonaldTrump")
parser.add_argument('--startdate', type=str, default="2020-04-15")
parser.add_argument('--enddate', type=str, default="2020-04-29")
parser.add_argument('--filename', type=str, default="realDonaldTrump.json")
args = parser.parse_args()

# keep a log to traceback
output = open(args.filename, "w+",encoding = "utf-8")

PATH = "http://"+args.username+":"+args.password+"@"+args.address+":5984"


# Try to connect to database
couch = couchdb.Server(PATH)
try:
    db = couch[args.database]
except:
    db = couch.create(args.database)

# Use GetOldTweets3 to request the tweets and store them in the list
tweetCriteria = getter.manager.TweetCriteria().setUsername(args.Tusername).setSince(args.startdate).setUntil(args.enddate)
              
tweetlist = getter.manager.TweetManager.getTweets(tweetCriteria)

tweet_json_list = []

# filter out the required fields in the tweet and reconstruct with sentiment label.
# and save each tweet to the database
for tweet in tweetlist:
    temp = {}
    temp['_id'] = tweet.id
    temp['permalink'] = tweet.permalink
    temp['username']=tweet.username
    temp["date"] = tweet.date.strftime('%Y-%m-%d %H:%M:%S%z')
    temp['text']= tweet.text
    temp['hashtags'] = tweet.hashtags.split()
    temp['geo'] = [tweet.geo]
    temp_labeled = label_sentiment(temp) 
    tweet_json_list.append(temp_labeled)
    db.save(temp_labeled)

# keep a log to traceback
tweets = {"docs":tweet_json_list}
json.dump(tweets,output)

output.close()