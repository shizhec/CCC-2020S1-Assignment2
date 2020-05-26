# @Author: Yizhou Zhu
# @Email:  yizzhu@student.unimelb.edu.au
# @Filename: daily_increase_lga_level.py
# @Last modified by:   Yizhou Zhu
# @Last modified time: 2020-05-26

import GetOldTweets3 as getter 

import argparse
import json

parser = argparse.ArgumentParser(description='COMP90024 / get tweet via coordinate location')
parser.add_argument('--coordinates', type=str, default="-37.814413,144.93163")
parser.add_argument('--startdate', type=str, default="2020-01-01")
parser.add_argument('--enddate', type=str, default="2020-05-01")
parser.add_argument('--within', type=str, default="3.363945833km")
parser.add_argument('--filename', type=str, default="MELBOURNE.json")
args = parser.parse_args()

# keep the log, and the output file will get checked and labelled by the 
output = open(args.filename, "w+",encoding = "utf-8")

# couch = couchdb.Server('http://90024_12:90024_12@localhost:5984')
# db = couch['twitter_sample']

# tweet is scraped in a round area where the coordinates is the centre and within is the radius
tweetCriteria = getter.manager.TweetCriteria().setNear(args.coordinates).setWithin(args.within).setSince(args.startdate).setUntil(args.enddate)

tweetlist = getter.manager.TweetManager.getTweets(tweetCriteria)

tweet_json_list = []

# filter out the required fields in the tweet and reconstruct with sentiment label.
# The retweeted data are filtered out.
for tweet in tweetlist:
    if not tweet.text.startswith('RT'):
        temp = {}
        temp['_id'] = tweet.date.strftime('%Y-%m-%d')+":"+str(tweet.id)
        temp['permalink'] = tweet.permalink
        temp['username']=tweet.username
        temp["date"] = tweet.date.strftime('%Y-%m-%d %H:%M:%S%z')
        temp['text']= tweet.text
        temp['hashtags'] = tweet.hashtags.split()
        temp['geo'] = [tweet.geo]
        tweet_json_list.append(temp)

tweets = {"docs":tweet_json_list}
json.dump(tweets,output)

output.close()
    
