# @Author: Yizhou Zhu
# @Email:  yizzhu@student.unimelb.edu.au
# @Filename: daily_increase_lga_level.py
# @Last modified by:   Yizhou Zhu
# @Last modified time: 2020-05-26

import GetOldTweets3 as got
import json

import argparse

# deprecated in this project, searching for text is meaningless in our scneario 

parser = argparse.ArgumentParser(description='COMP90024 / get tweet via coordinate location')
parser.add_argument('--text', type=str, default="coronavirus")
parser.add_argument('--startdate', type=str, default="2020-01-01")
parser.add_argument('--enddate', type=str, default="2020-04-05")
parser.add_argument('--within', type=str, default="50mi")
parser.add_argument('--filename', type=str, default="text_search.json")
parser.add_argument('--max', type=int, default=5)
args = parser.parse_args()

output = open(args.filename, "w+",encoding = "utf-8")

tweetCriteria = got.manager.TweetCriteria()\
                .setQuerySearch(args.text)\
                .setSince(args.startdate)\
                .setUntil(args.enddate)\
                .setMaxTweets(args.max)

tweetlist = got.manager.TweetManager.getTweets(tweetCriteria)


tweet_json_list = []

for tweet in tweetlist:
    temp = {}
    temp['id'] = tweet.id
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