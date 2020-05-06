import GetOldTweets3 as got
import couchdb

import argparse

parser = argparse.ArgumentParser(description='COMP90024 / get tweet via coordinate location')
parser.add_argument('--text', type=str, default="coronavirus")
parser.add_argument('--startdate', type=str, default="2020-01-01")
parser.add_argument('--enddate', type=str, default="2020-04-05")
parser.add_argument('--within', type=str, default="50mi")
parser.add_argument('--max', type=int, default=5)
args = parser.parse_args()

tweetCriteria = got.manager.TweetCriteria()\
                .setQuerySearch(args.text)\
                .setSince(args.startdate)\
                .setUntil(args.enddate)\
                .setMaxTweets(args.max)

tweetlist = got.manager.TweetManager.getTweets(tweetCriteria)

couch = couchdb.Server('http://90024_12:90024_12@localhost:5984')
db = couch['twitter_sample']

for tweet in tweetlist:
    temp = {}
    temp['id'] = tweet.id
    temp['permalink'] = tweet.permalink
    temp['username']=tweet.username
    temp['text']= tweet.text
    temp['hashtags'] = tweet.hashtags
    temp['geo'] = tweet.geo
    db.save(temp)
